/**
 * Exemplo avançado: Webhook handler para notificações do PayPay
 * @author MiniMax Agent
 */

import express from 'express';
import { PayPayClient, Environment, PayPayConfig, RSAAuth } from '../src';

// Configuração
const config: PayPayConfig = {
  partnerId: process.env.PAYPAY_PARTNER_ID!,
  privateKey: process.env.PAYPAY_PRIVATE_KEY!,
  publicKey: process.env.PAYPAY_PUBLIC_KEY!,
  payPayPublicKey: process.env.PAYPAY_PUBLIC_KEY_PAYPAY!,
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.PRODUCTION 
    : Environment.SANDBOX,
};

const payPayClient = new PayPayClient(config);
const app = express();

app.use(express.json());

// Endpoint para receber notificações do PayPay
app.post('/webhook/paypay', async (req, res) => {
  try {
    console.log('Notificação recebida:', req.body);
    
    // Validar assinatura da notificação (recomendado)
    const auth = new RSAAuth(
      config.privateKey, 
      config.publicKey, 
      config.payPayPublicKey
    );
    
    const isValidSignature = auth.verifySignature(req.body, req.body.sign);
    
    if (!isValidSignature) {
      console.error('Assinatura inválida na notificação');
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Processar notificação baseada no status
    const { out_trade_no, trade_no, status } = req.body.biz_content;
    
    switch (status) {
      case 'S': // Sucesso
        await processarPagamentoSucesso(out_trade_no, trade_no);
        break;
        
      case 'F': // Falha
        await processarPagamentoFalha(out_trade_no, trade_no);
        break;
        
      case 'P': // Processando
        await processarPagamentoProcessando(out_trade_no, trade_no);
        break;
        
      default:
        console.warn('Status desconhecido:', status);
    }
    
    // Responder com sucesso
    res.json({ success: true });
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Funções para processar diferentes status
async function processarPagamentoSucesso(outTradeNo: string, tradeNo: string) {
  console.log(`Pagamento concluído com sucesso: ${outTradeNo} -> ${tradeNo}`);
  
  // Atualizar banco de dados
  // Enviar confirmação por email
  // Liberar produto/serviço
  
  // Confirmar o status consultando a API (opcional)
  try {
    const response = await payPayClient.queryPayment({ out_trade_no: outTradeNo });
    console.log('Status confirmado via API:', response.status);
  } catch (error) {
    console.error('Erro ao confirmar status:', error);
  }
}

async function processarPagamentoFalha(outTradeNo: string, tradeNo: string) {
  console.log(`Pagamento falhou: ${outTradeNo} -> ${tradeNo}`);
  
  // Atualizar banco de dados
  // Notificar o cliente sobre a falha
  // Reverter reservas de estoque
}

async function processarPagamentoProcessando(outTradeNo: string, tradeNo: string) {
  console.log(`Pagamento em processamento: ${outTradeNo} -> ${tradeNo}`);
  
  // Atualizar status no banco de dados
  // Aguardar nova notificação
}

// Endpoint para verificar status manualmente
app.get('/payment/:outTradeNo/status', async (req, res) => {
  try {
    const { outTradeNo } = req.params;
    
    const response = await payPayClient.queryPayment({
      out_trade_no: outTradeNo
    });
    
    res.json({
      out_trade_no: response.out_trade_no,
      trade_no: response.trade_no,
      status: response.status,
      status_description: getStatusDescription(response.status)
    });
    
  } catch (error) {
    console.error('Erro ao consultar status:', error);
    res.status(500).json({ error: 'Erro ao consultar status' });
  }
});

function getStatusDescription(status: string): string {
  switch (status) {
    case 'S': return 'Pagamento concluído com sucesso';
    case 'P': return 'Pagamento em processamento';
    case 'F': return 'Pagamento falhou';
    default: return 'Status desconhecido';
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor webhook rodando na porta ${PORT}`);
  console.log(`Endpoint webhook: http://localhost:${PORT}/webhook/paypay`);
});

export default app;