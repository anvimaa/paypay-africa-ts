/**
 * Exemplo: Integração com e-commerce
 * @author anvimaa
 */

import {
  PayPayClient,
  Environment,
  Language,
  PayPayConfig,
  InstantTradeRequest,
  PayProductCode,
  BankCode,
  TransactionStatus,
  MulticaixaPayMethod,
  ReferencePayMethod
} from '../src';

// Simulando um banco de dados simples
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: 'paypay_app' | 'multicaixa' | 'reference';
  payPayTradeNo?: string;
  createdAt: Date;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ip: string;
}

class ECommercePaymentService {
  private payPayClient: PayPayClient;
  private orders: Map<string, Order> = new Map();
  private customers: Map<string, Customer> = new Map();

  constructor(config: PayPayConfig) {
    this.payPayClient = new PayPayClient(config);
  }

  /**
   * Criar pedido e iniciar pagamento
   */
  async createOrderAndPayment(
    customerId: string,
    items: OrderItem[],
    paymentMethod: 'paypay_app' | 'multicaixa' | 'reference',
    customerPhone?: string // Necessário para MULTICAIXA
  ): Promise<{
    orderId: string;
    paymentData: any;
  }> {
    const customer = this.customers.get(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    // Calcular total
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Criar pedido
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order: Order = {
      id: orderId,
      customerId,
      items,
      totalAmount,
      status: 'pending',
      paymentMethod,
      createdAt: new Date(),
    };

    this.orders.set(orderId, order);

    // Preparar dados para pagamento
    const tradeInfo = {
      out_trade_no: orderId,
      subject: this.generateOrderSubject(items),
      currency: 'AOA',
      price: totalAmount.toFixed(2),
      quantity: '1',
      total_amount: totalAmount.toFixed(2),
      payee_identity: 'SEU_PARTNER_ID', // Substitua pelo seu partner_id
      payee_identity_type: '1',
    };

    const baseRequest: InstantTradeRequest = {
      payer_ip: customer.ip,
      sale_product_code: 'ECOMMERCE',
      cashier_type: 'SDK',
      timeout_express: '40m',
      trade_info: tradeInfo,
      return_url: `https://meusite.com/payment/callback/${orderId}`,
    };

    try {
      let paymentResponse;

      switch (paymentMethod) {
        case 'paypay_app':
          paymentResponse = await this.payPayClient.createPaymentWithApp(
            baseRequest,
            Language.PORTUGUESE
          );
          break;

        case 'multicaixa':
          if (!customerPhone) {
            throw new Error('Número de telefone obrigatório para MULTICAIXA Express');
          }

          const multicaixaPayMethod: MulticaixaPayMethod = {
            pay_product_code: PayProductCode.MULTICAIXA_EXPRESS,
            amount: totalAmount.toFixed(2),
            bank_code: BankCode.MULTICAIXA,
            phone_num: customerPhone,
          };

          paymentResponse = await this.payPayClient.createPaymentWithMulticaixa({
            ...baseRequest,
            pay_method: multicaixaPayMethod,
          });
          break;

        case 'reference':
          const referencePayMethod: ReferencePayMethod = {
            pay_product_code: PayProductCode.REFERENCE,
            amount: totalAmount.toFixed(2),
            bank_code: BankCode.REFERENCE,
          };

          paymentResponse = await this.payPayClient.createPaymentWithReference({
            ...baseRequest,
            pay_method: referencePayMethod,
          });
          break;

        default:
          throw new Error(`Método de pagamento não suportado: ${paymentMethod}`);
      }

      // Atualizar pedido com dados do pagamento
      order.payPayTradeNo = paymentResponse.trade_no;
      this.orders.set(orderId, order);

      return {
        orderId,
        paymentData: paymentResponse,
      };

    } catch (error) {
      // Marcar pedido como falhou
      order.status = 'failed';
      this.orders.set(orderId, order);
      throw error;
    }
  }

  /**
   * Verificar status do pagamento
   */
  async checkPaymentStatus(orderId: string): Promise<{
    orderId: string;
    orderStatus: string;
    paymentStatus: TransactionStatus;
    lastUpdated: Date;
  }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    try {
      const response = await this.payPayClient.queryPayment({
        out_trade_no: orderId
      });

      // Atualizar status do pedido baseado no status do pagamento
      switch (response.status) {
        case TransactionStatus.SUCCESS:
          order.status = 'paid';
          break;
        case TransactionStatus.FAILED:
          order.status = 'failed';
          break;
        case TransactionStatus.PROCESSING:
          order.status = 'pending';
          break;
      }

      this.orders.set(orderId, order);

      return {
        orderId,
        orderStatus: order.status,
        paymentStatus: response.status,
        lastUpdated: new Date(),
      };

    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }

  /**
   * Processar estorno
   */
  async processRefund(
    orderId: string,
    refundAmount?: number
  ): Promise<{ success: boolean; refundTradeNo: string }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.status !== 'paid') {
      throw new Error('Apenas pedidos pagos podem ser estornados');
    }

    const refundValue = refundAmount || order.totalAmount;
    if (refundValue > order.totalAmount) {
      throw new Error('Valor do estorno não pode ser maior que o valor do pedido');
    }

    try {
      const refundTradeNo = `REFUND_${orderId}_${Date.now()}`;

      const response = await this.payPayClient.refundPayment({
        out_trade_no: refundTradeNo,
        orig_out_trade_no: orderId,
        refund_amount: refundValue.toFixed(2),
      });

      return {
        success: response.status === TransactionStatus.SUCCESS,
        refundTradeNo: response.trade_no,
      };

    } catch (error) {
      console.error('Erro ao processar estorno:', error);
      throw error;
    }
  }

  /**
   * Cancelar pedido (fechar pagamento)
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.status !== 'pending') {
      throw new Error('Apenas pedidos pendentes podem ser cancelados');
    }

    try {
      await this.payPayClient.closePayment({
        out_trade_no: orderId
      });

      order.status = 'cancelled';
      this.orders.set(orderId, order);

      return true;
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }

  /**
   * Métodos auxiliares
   */
  addCustomer(customer: Customer): void {
    this.customers.set(customer.id, customer);
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  private generateOrderSubject(items: OrderItem[]): string {
    if (items.length === 1) {
      return items[0].name;
    }
    return `Pedido com ${items.length} itens`;
  }
}

// Exemplo de uso
async function exemploECommerce() {
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

  const ecommerce = new ECommercePaymentService(config);

  // Adicionar cliente
  ecommerce.addCustomer({
    id: 'CUSTOMER_001',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '934342795',
    ip: '192.168.1.100',
  });

  try {
    // Criar pedido e pagamento
    const { orderId, paymentData } = await ecommerce.createOrderAndPayment(
      'CUSTOMER_001',
      [
        {
          productId: 'PROD_001',
          name: 'Smartphone Samsung',
          price: 250,
          quantity: 1,
        },
        {
          productId: 'PROD_002',
          name: 'Capa protetora',
          price: 150,
          quantity: 1,
        },
      ],
      'multicaixa',
      '934342795' // Telefone do cliente para MULTICAIXA Express
    );

    console.log('Pedido criado:', orderId);
    console.log('Dados do pagamento:', paymentData);

    // Verificar status após alguns segundos
    setTimeout(async () => {
      const status = await ecommerce.checkPaymentStatus(orderId);
      console.log('Status do pedido:', status);
    }, 5000);

  } catch (error) {
    console.error('Erro no e-commerce:', error);
  }
}

exemploECommerce()
  .then(() => console.log('Exemplo de e-commerce concluído'))

export { ECommercePaymentService, exemploECommerce };