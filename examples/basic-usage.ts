/**
 * Exemplo de uso da biblioteca PayPay Africa
 * @author MiniMax Agent
 */

import {
  PayPayClient,
} from '../src';

import {
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
  partnerId: '200002914662',
  privateKey: `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL/WFpWQK3CIIXZJ
zJBuKPQVwcOAKKHNUEvWKmgZUKw3jFl2kN9tv7/mtLWv54BKwc4J3CyJf3E30svo
QdaAn38pigj5bYd67CRo9sd25mDJSeOcYPmluBYeEZ1hbplW6keCWQ/O9S1tzIae
Us3VFACW5UmY0v8Ki9u/W/RHksLtAgMBAAECgYAR1QjMZlZjY4QYxstpMZRE/DDC
x4r/X2JzajkO7Ct/lrpJJqhY3I7Se9OYf/15A3n4eRoqWa2rDJFfuvtDwTkSI2Nh
LlIN91vFd69/ZuJBc4b/5YP0qdCe5oDCcrBFoYHovswz7KaMtHJYBztURdw48SwW
5PCD5k7LnaOKdnQG0QJBAP72I7zQzdImv7wdKGQ1WpYebGjDGw0ZQdmaF74QNde5
87LLjwEaB6mRwo4JxxTBBT8kfhfGcPkiPm5xlnHLCesCQQDAnh//H6edRJomgZS4
MJcElxEmWAVZs3leMubRJI1xws58eg74yG7Ca6jvXePoI/eWEiW5jUat9WJMaZsa
l5iHAkBkoK0WNqslSFngWvm4Iz6vhS5wYqDomJFe2uyH/Uni7Od8J883NhjUGk1Z
Vg6W6F+zviluJMot6hAN8xLXsrUlAkA5CprPIsCwgjBkVtuD8F/IrDQX9tkex1eZ
3dkc9oYsulQL6NmmMzUZvmg4+sUTahNYDee+G2hi+9gwaNXV+i7hAkEAm/Wx6d5O
bX/z/XyH7nDihfcoi2fRSzm7Y8wjjelChW9xwhiM4FsLHJ8TdJfTmJWPKbD/2kXE
UWItfEfd738o6A==
-----END PRIVATE KEY-----`,
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/1haVkCtwiCF2ScyQbij0FcHD
gCihzVBL1ipoGVCsN4xZdpDfbb+/5rS1r+eASsHOCdwsiX9xN9LL6EHWgJ9/KYoI
+W2HeuwkaPbHduZgyUnjnGD5pbgWHhGdYW6ZVupHglkPzvUtbcyGnlLN1RQAluVJ
mNL/Covbv1v0R5LC7QIDAQAB
-----END PUBLIC KEY-----`,
  payPayPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArL1akdPqJVYIGI4vGNiN
dvoxn7TWYOorLrNOBz3BP2yVSf31L6yPbQIs8hn59iOzbWy8raXAYWjYgM9Lh6h2
6XutwmEjZHqqoH5pLDYvZALMxEwunDpeTFrikuej0nWxjmpA9m4eicXcJbCMJowL
47a5Jw61VkF+wbIj5vxEcSN4SSddJ04zEye1iwkWi9myecU39Do1THBN62ZKiGtd
8jqAqKuDzLtch2mcEjMlgi51RM3IhxtYGY98JE6ICcVu+VDcsAX+OWwOXaWGyv75
5TQG6V8fnYO+Qd4R13jO+32V+EgizHQirhVayAFQGbTBSPIg85G8gVNU64SxbZ5J
XQIDAQAB
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
      amount: '500.00',
      bank_code: BankCode.MULTICAIXA,
      phone_num: '934342795', // Número de telefone registrado no MulticAIXA
    };

    const request: InstantTradeRequest = {
      cashier_type: 'SDK',
      payer_ip: '192.168.1.100',
      sale_product_code: '050200001',
      timeout_express: '50m',
      trade_info: {
        currency: 'AOA',
        out_trade_no: `MULTICAIXA_${Date.now()}`,
        payee_identity: '200001835716',
        payee_identity_type: '1',
        price: '500.00',
        quantity: '1',
        subject: 'Pagamento via MULTICAIXA Express',
        total_amount: '500.00',
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
  await exemploMulticaixaExpress();
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