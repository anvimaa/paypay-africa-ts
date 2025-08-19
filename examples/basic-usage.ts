/**
 * Exemplo de uso da biblioteca PayPay Africa
 * @author MiniMax Agent
 */

import {
  PayPayClient,
  Environment,
  Language,
  PayProductCode,
  BankCode,
  PayPayConfig,
  InstantTradeRequest,
  TradeRefundRequest,
  MulticaixaPayMethod,
  ReferencePayMethod
} from '../src';

// Configuração do cliente
const config: PayPayConfig = {
  partnerId: '200001835716',
  privateKey: `-----BEGIN PRIVATE KEY-----
// Sua chave privada RSA aqui
-----END PRIVATE KEY-----`,
  publicKey: `-----BEGIN PUBLIC KEY-----
// Sua chave pública RSA aqui
-----END PUBLIC KEY-----`,
  payPayPublicKey: `-----BEGIN PUBLIC KEY-----
// Chave pública do PayPay aqui
-----END PUBLIC KEY-----`,
  environment: Environment.SANDBOX,
  timeout: 30000,
};

// Criar instância do cliente
const payPayClient = new PayPayClient(config);

// === EXEMPLO 1: Pagamento com PayPay App ===
async function exemploPayPayApp() {
  console.log('=== Exemplo: Pagamento com PayPay App ===');
  
  try {
    const request: InstantTradeRequest = {
      payer_ip: '192.168.1.100',
      sale_product_code: 'PROD001',
      cashier_type: 'SDK',
      timeout_express: '30m',
      trade_info: {
        out_trade_no: `ORDER_${Date.now()}`,
        subject: 'Compra de produto teste',
        currency: 'AOA',
        price: '1000.00',
        quantity: '1',
        total_amount: '1000.00',
        payee_identity: '200001835716',
        payee_identity_type: '1',
      },
      return_url: 'https://meusite.com/callback',
    };

    const response = await payPayClient.createPaymentWithApp(request, Language.PORTUGUESE);
    
    console.log('Pagamento criado com sucesso:');
    console.log('- Número da transação:', response.trade_no);
    console.log('- Status:', response.status);
    console.log('- Token:', response.trade_token);
    console.log('- Link dinâmico:', response.dynamic_link);
    
    // Para web: gerar QR code com o dynamic_link
    // Para mobile: usar o trade_token com o URL scheme
    const mobileUrl = `paypayao://trade/pay?action=pay&tradeToken=${response.trade_token}`;
    console.log('- URL para mobile:', mobileUrl);
    
  } catch (error) {
    console.error('Erro no pagamento:', error);
  }
}

// === EXEMPLO 2: Pagamento com MULTICAIXA Express ===
async function exemploMulticaixaExpress() {
  console.log('\n=== Exemplo: Pagamento com MULTICAIXA Express ===');
  
  try {
    const payMethod: MulticaixaPayMethod = {
      pay_product_code: PayProductCode.MULTICAIXA_EXPRESS,
      amount: '1500.00',
      bank_code: BankCode.MULTICAIXA,
      phone_num: '923456789', // Número de telefone registrado no MulticAIXA
    };

    const request: InstantTradeRequest = {
      payer_ip: '192.168.1.100',
      sale_product_code: 'PROD002',
      cashier_type: 'SDK',
      trade_info: {
        out_trade_no: `MULTICAIXA_${Date.now()}`,
        subject: 'Pagamento via MULTICAIXA Express',
        currency: 'AOA',
        price: '1500.00',
        quantity: '1',
        total_amount: '1500.00',
        payee_identity: '200001835716',
        payee_identity_type: '1',
      },
      pay_method: payMethod,
    };

    const response = await payPayClient.createPaymentWithMulticaixa(request);
    
    console.log('Pagamento MULTICAIXA criado:');
    console.log('- Número da transação:', response.trade_no);
    console.log('- Status:', response.status);
    
  } catch (error) {
    console.error('Erro no pagamento MULTICAIXA:', error);
  }
}

// === EXEMPLO 3: Pagamento por Referência ===
async function exemploReferencia() {
  console.log('\n=== Exemplo: Pagamento por Referência ===');
  
  try {
    const payMethod: ReferencePayMethod = {
      pay_product_code: PayProductCode.REFERENCE,
      amount: '2000.00',
      bank_code: BankCode.REFERENCE,
    };

    const request: InstantTradeRequest = {
      payer_ip: '192.168.1.100',
      sale_product_code: 'PROD003',
      cashier_type: 'SDK',
      trade_info: {
        out_trade_no: `REF_${Date.now()}`,
        subject: 'Pagamento por referência bancária',
        currency: 'AOA',
        price: '2000.00',
        quantity: '1',
        total_amount: '2000.00',
        payee_identity: '200001835716',
        payee_identity_type: '1',
      },
      pay_method: payMethod,
    };

    const response = await payPayClient.createPaymentWithReference(request);
    
    console.log('Pagamento por referência criado:');
    console.log('- Número da transação:', response.trade_no);
    console.log('- Status:', response.status);
    console.log('- Entity ID:', response.entity_id);
    console.log('- Reference ID:', response.reference_id);
    
  } catch (error) {
    console.error('Erro no pagamento por referência:', error);
  }
}

// === EXEMPLO 4: Consultar Status ===
async function exemploConsultarStatus() {
  console.log('\n=== Exemplo: Consultar Status ===');
  
  try {
    const request = {
      out_trade_no: 'ORDER_1234567890', // Número do seu pedido
    };

    const response = await payPayClient.queryPayment(request);
    
    console.log('Status da transação:');
    console.log('- Número do pedido:', response.out_trade_no);
    console.log('- Número da transação:', response.trade_no);
    console.log('- Status:', response.status);
    
  } catch (error) {
    console.error('Erro ao consultar status:', error);
  }
}

// === EXEMPLO 5: Estorno ===
async function exemploEstorno() {
  console.log('\n=== Exemplo: Estorno ===');
  
  try {
    const request: TradeRefundRequest = {
      out_trade_no: `REFUND_${Date.now()}`,
      orig_out_trade_no: 'ORDER_1234567890', // Número do pedido original
      refund_amount: '500.00', // Estorno parcial
    };

    const response = await payPayClient.refundPayment(request);
    
    console.log('Estorno processado:');
    console.log('- Número do estorno:', response.out_trade_no);
    console.log('- Número da transação:', response.trade_no);
    console.log('- Status:', response.status);
    
  } catch (error) {
    console.error('Erro no estorno:', error);
  }
}

// === EXEMPLO 6: Fechar Pagamento ===
async function exemploFecharPagamento() {
  console.log('\n=== Exemplo: Fechar Pagamento ===');
  
  try {
    const request = {
      out_trade_no: 'ORDER_1234567890',
    };

    const response = await payPayClient.closePayment(request);
    
    console.log('Pagamento fechado:');
    console.log('- Número do pedido:', response.out_trade_no);
    console.log('- Número da transação:', response.trade_no);
    
  } catch (error) {
    console.error('Erro ao fechar pagamento:', error);
  }
}

// Executar exemplos
async function executarExemplos() {
  console.log('=== Exemplos da Biblioteca PayPay Africa ===\n');
  
  // Descomente as linhas abaixo para testar cada exemplo
  // await exemploPayPayApp();
  // await exemploMulticaixaExpress();
  // await exemploReferencia();
  // await exemploConsultarStatus();
  // await exemploEstorno();
  // await exemploFecharPagamento();
  
  console.log('\n=== Todos os exemplos concluídos ===');
}

// Executar apenas se este arquivo for executado diretamente
if (require.main === module) {
  executarExemplos().catch(console.error);
}

export {
  exemploPayPayApp,
  exemploMulticaixaExpress,
  exemploReferencia,
  exemploConsultarStatus,
  exemploEstorno,
  exemploFecharPagamento,
};