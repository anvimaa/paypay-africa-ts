/**
 * Cliente principal da API PayPay Africa
 * @author MiniMax Agent
 */

import {
  PayPayConfig,
  BaseRequest,
  BaseResponse,
  InstantTradeRequest,
  InstantTradeResponse,
  TradeRefundRequest,
  TradeRefundResponse,
  TradeCloseRequest,
  TradeCloseResponse,
  TradeQueryRequest,
  TradeQueryResponse,
  Language,
  PaymentMethod,
  PayPayError,
  PayPayValidationError,
  Environment,
} from './types';
import { RSAAuth } from './auth/rsa';
import { ValidationUtils } from './auth/validation';
import { HttpService } from './services/http';

export class PayPayClient {
  private config: PayPayConfig;
  private auth: RSAAuth;
  private http: HttpService;

  constructor(config: PayPayConfig) {
    this.validateConfig(config);
    this.config = config;
    this.auth = new RSAAuth(config.privateKey, config.publicKey, config.payPayPublicKey);
    this.http = new HttpService(config);
  }

  /**
   * Valida a configuração inicial
   */
  private validateConfig(config: PayPayConfig): void {
    ValidationUtils.required(config.partnerId, 'partnerId');
    ValidationUtils.required(config.privateKey, 'privateKey');
    ValidationUtils.required(config.publicKey, 'publicKey');
    ValidationUtils.required(config.payPayPublicKey, 'payPayPublicKey');
    ValidationUtils.required(config.environment, 'environment');

    if (!['sandbox', 'production'].includes(config.environment)) {
      throw new PayPayValidationError('Ambiente deve ser "sandbox" ou "production"');
    }

    if (!RSAAuth.validateRSAKey(config.privateKey)) {
      throw new PayPayValidationError('Chave privada RSA inválida');
    }

    if (!RSAAuth.validateRSAKey(config.publicKey)) {
      throw new PayPayValidationError('Chave pública RSA inválida');
    }

    if (!RSAAuth.validateRSAKey(config.payPayPublicKey)) {
      throw new PayPayValidationError('Chave pública do PayPay inválida');
    }
  }

  /**
   * Constrói a requisição base com parâmetros obrigatórios
   */
  private buildBaseRequest(
    service: string,
    bizContent: any,
    language: Language = Language.PORTUGUESE
  ): BaseRequest {
    const requestNo = RSAAuth.generateRequestNo();
    const timestamp = RSAAuth.generateTimestamp();
    
    // Criptografar biz_content
    const bizContentString = JSON.stringify(bizContent);
    const encryptedBizContent = this.auth.encryptContent(bizContentString);
    
    // Construir parâmetros base (sem assinatura)
    const baseParams = {
      request_no: requestNo,
      service,
      version: '1.0',
      partner_id: this.config.partnerId,
      charset: 'UTF-8',
      sign_type: 'RSA',
      timestamp,
      format: 'JSON',
      language,
      biz_content: encodeURIComponent(encryptedBizContent),
    };

    // Gerar assinatura
    const signature = this.auth.generateSignature(baseParams);

    return {
      ...baseParams,
      sign: signature,
    };
  }

  /**
   * Processa a resposta da API e valida a assinatura
   */
  private async processResponse<T>(
    response: BaseResponse & { biz_content: T }
  ): Promise<T> {
    // Verificar se a resposta foi bem-sucedida
    if (response.code !== 'S0001') {
      throw new PayPayError(
        response.msg || 'Erro na API',
        response.code,
        response.sub_code,
        response.sub_msg
      );
    }

    // Validar assinatura da resposta (opcional, mas recomendado)
    try {
      const isValidSignature = this.auth.verifySignature(response, response.sign);
      if (!isValidSignature) {
        console.warn('[PayPay] Aviso: Assinatura da resposta inválida');
      }
    } catch (error) {
      console.warn('[PayPay] Aviso: Não foi possível validar a assinatura da resposta:', error);
    }

    return response.biz_content;
  }

  /**
   * Criar pagamento com PayPay App
   */
  async createPaymentWithApp(
    request: InstantTradeRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<InstantTradeResponse> {
    this.validateInstantTradeRequest(request);

    const baseRequest = this.buildBaseRequest('instant_trade', request, language);
    const response = await this.http.apiCall<InstantTradeResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  /**
   * Criar pagamento com MULTICAIXA Express
   */
  async createPaymentWithMulticaixa(
    request: InstantTradeRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<InstantTradeResponse> {
    this.validateInstantTradeRequest(request);
    
    if (!request.pay_method) {
      throw new PayPayValidationError('pay_method é obrigatório para MULTICAIXA Express');
    }

    ValidationUtils.payMethod(request.pay_method, 'pay_method');

    const baseRequest = this.buildBaseRequest('instant_trade', request, language);
    const response = await this.http.apiCall<InstantTradeResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  /**
   * Criar pagamento com Referência
   */
  async createPaymentWithReference(
    request: InstantTradeRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<InstantTradeResponse> {
    this.validateInstantTradeRequest(request);
    
    if (!request.pay_method) {
      throw new PayPayValidationError('pay_method é obrigatório para pagamento por referência');
    }

    ValidationUtils.payMethod(request.pay_method, 'pay_method');

    const baseRequest = this.buildBaseRequest('instant_trade', request, language);
    const response = await this.http.apiCall<InstantTradeResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  /**
   * Estornar pagamento
   */
  async refundPayment(
    request: TradeRefundRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<TradeRefundResponse> {
    this.validateTradeRefundRequest(request);

    const baseRequest = this.buildBaseRequest('trade_refund', request, language);
    const response = await this.http.apiCall<TradeRefundResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  /**
   * Fechar pagamento
   */
  async closePayment(
    request: TradeCloseRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<TradeCloseResponse> {
    this.validateTradeCloseRequest(request);

    const baseRequest = this.buildBaseRequest('trade_close', request, language);
    const response = await this.http.apiCall<TradeCloseResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  /**
   * Consultar status do pagamento
   */
  async queryPayment(
    request: TradeQueryRequest,
    language: Language = Language.PORTUGUESE
  ): Promise<TradeQueryResponse> {
    this.validateTradeQueryRequest(request);

    const baseRequest = this.buildBaseRequest('trade_query', request, language);
    const response = await this.http.apiCall<TradeQueryResponse>(baseRequest);
    
    return this.processResponse(response);
  }

  // === Métodos de Validação ===

  private validateInstantTradeRequest(request: InstantTradeRequest): void {
    ValidationUtils.required(request.payer_ip, 'payer_ip');
    ValidationUtils.ip(request.payer_ip, 'payer_ip');
    
    ValidationUtils.required(request.sale_product_code, 'sale_product_code');
    ValidationUtils.validateLength(request.sale_product_code, 1, 9, 'sale_product_code');
    
    ValidationUtils.required(request.cashier_type, 'cashier_type');
    if (request.cashier_type !== 'SDK') {
      throw new PayPayValidationError('cashier_type deve ser "SDK"');
    }

    if (request.timeout_express) {
      ValidationUtils.timeout(request.timeout_express, 'timeout_express');
    }

    ValidationUtils.required(request.trade_info, 'trade_info');
    this.validateTradeInfo(request.trade_info);

    if (request.return_url) {
      ValidationUtils.url(request.return_url, 'return_url');
      ValidationUtils.validateLength(request.return_url, 1, 1024, 'return_url');
    }
  }

  private validateTradeInfo(tradeInfo: any): void {
    ValidationUtils.required(tradeInfo.out_trade_no, 'trade_info.out_trade_no');
    ValidationUtils.validateLength(tradeInfo.out_trade_no, 6, 32, 'trade_info.out_trade_no');
    ValidationUtils.alphanumericUnderscore(tradeInfo.out_trade_no, 'trade_info.out_trade_no');
    
    ValidationUtils.required(tradeInfo.subject, 'trade_info.subject');
    ValidationUtils.validateLength(tradeInfo.subject, 1, 256, 'trade_info.subject');
    
    if (tradeInfo.currency) {
      ValidationUtils.currency(tradeInfo.currency, 'trade_info.currency');
    }
    
    ValidationUtils.required(tradeInfo.price, 'trade_info.price');
    ValidationUtils.amount(tradeInfo.price, 'trade_info.price');
    
    ValidationUtils.required(tradeInfo.quantity, 'trade_info.quantity');
    ValidationUtils.validateLength(tradeInfo.quantity, 1, 5, 'trade_info.quantity');
    
    ValidationUtils.required(tradeInfo.total_amount, 'trade_info.total_amount');
    ValidationUtils.amount(tradeInfo.total_amount, 'trade_info.total_amount');
    
    ValidationUtils.required(tradeInfo.payee_identity, 'trade_info.payee_identity');
    ValidationUtils.validateLength(tradeInfo.payee_identity, 1, 32, 'trade_info.payee_identity');
    
    ValidationUtils.required(tradeInfo.payee_identity_type, 'trade_info.payee_identity_type');
    if (tradeInfo.payee_identity_type !== '1') {
      throw new PayPayValidationError('trade_info.payee_identity_type deve ser "1"');
    }
  }

  private validateTradeRefundRequest(request: TradeRefundRequest): void {
    ValidationUtils.required(request.out_trade_no, 'out_trade_no');
    ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
    ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
    
    ValidationUtils.required(request.orig_out_trade_no, 'orig_out_trade_no');
    ValidationUtils.validateLength(request.orig_out_trade_no, 1, 32, 'orig_out_trade_no');
    
    ValidationUtils.required(request.refund_amount, 'refund_amount');
    ValidationUtils.amount(request.refund_amount, 'refund_amount');
  }

  private validateTradeCloseRequest(request: TradeCloseRequest): void {
    ValidationUtils.required(request.out_trade_no, 'out_trade_no');
    ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
    ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
  }

  private validateTradeQueryRequest(request: TradeQueryRequest): void {
    ValidationUtils.required(request.out_trade_no, 'out_trade_no');
    ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
    ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
  }
}