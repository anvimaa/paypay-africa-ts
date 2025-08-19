/**
 * Tipos e interfaces para a API do PayPay Africa
 * @author anvimaa
 */

// Configurações da API
export interface PayPayConfig {
  partnerId: string;
  privateKey: string;
  publicKey: string;
  payPayPublicKey: string;
  environment: 'sandbox' | 'production';
  timeout?: number;
  baseUrl?: string;
}

// Ambiente da API
export enum Environment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

// Idiomas suportados
export enum Language {
  PORTUGUESE = 'pt',
  ENGLISH = 'en'
}

// Status de transação
export enum TransactionStatus {
  SUCCESS = 'S',
  PROCESSING = 'P',
  FAILED = 'F'
}

// Métodos de pagamento
export enum PaymentMethod {
  PAYPAY_APP = 'PAYPAY_APP',
  MULTICAIXA_EXPRESS = 'MULTICAIXA_EXPRESS',
  REFERENCE = 'REFERENCE'
}

// Códigos de produto de pagamento
export enum PayProductCode {
  MULTICAIXA_EXPRESS = '31',
  REFERENCE = '31'
}

// Códigos de banco
export enum BankCode {
  MULTICAIXA = 'MUL',
  REFERENCE = 'REF'
}

// Parâmetros base da requisição
export interface BaseRequest {
  request_no: string;
  service: string;
  version: string;
  partner_id: string;
  charset: string;
  sign: string;
  sign_type: string;
  timestamp: string;
  format: string;
  language: Language;
  biz_content: string;
}

// Resposta base da API
export interface BaseResponse {
  code: string;
  msg: string;
  sub_code: string;
  sub_msg: string;
  sign: string;
  sign_type: string;
  charset: string;
  biz_content: any;
}

// Informações de produto/serviço
export interface TradeInfo {
  out_trade_no: string;
  subject: string;
  currency?: string;
  price: string;
  quantity: string;
  total_amount: string;
  payee_identity: string;
  payee_identity_type: string;
}

// Método de pagamento para MULTICAIXA Express
export interface MulticaixaPayMethod {
  pay_product_code: PayProductCode.MULTICAIXA_EXPRESS;
  amount: string;
  bank_code?: BankCode.MULTICAIXA;
  phone_num: string;
}

// Método de pagamento para Referência
export interface ReferencePayMethod {
  pay_product_code: PayProductCode.REFERENCE;
  amount: string;
  bank_code?: BankCode.REFERENCE;
}

// União de métodos de pagamento
export type PayMethod = MulticaixaPayMethod | ReferencePayMethod;

// === INSTANT TRADE (Criar Pagamento) ===

export interface InstantTradeRequest {
  payer_ip: string;
  sale_product_code: string;
  cashier_type: string;
  timeout_express?: string;
  trade_info: TradeInfo;
  return_url?: string;
  pay_method?: PayMethod;
}

export interface InstantTradeResponse {
  out_trade_no: string;
  trade_no: string;
  status: TransactionStatus;
  trade_token?: string;
  dynamic_link?: string;
  entity_id?: string;
  reference_id?: string;
}

// === TRADE REFUND (Estorno) ===

export interface TradeRefundRequest {
  out_trade_no: string;
  orig_out_trade_no: string;
  refund_amount: string;
}

export interface TradeRefundResponse {
  out_trade_no: string;
  trade_no: string;
  status: TransactionStatus;
}

// === TRADE CLOSE (Fechar Pagamento) ===

export interface TradeCloseRequest {
  out_trade_no: string;
}

export interface TradeCloseResponse {
  out_trade_no: string;
  trade_no: string;
}

// === TRADE QUERY (Consultar Status) ===

export interface TradeQueryRequest {
  out_trade_no: string;
}

export interface TradeQueryResponse {
  out_trade_no: string;
  trade_no: string;
  status: TransactionStatus;
  trade_info?: TradeInfo;
  create_time?: string;
  pay_time?: string;
  close_time?: string;
}

// Exceções personalizadas
export class PayPayError extends Error {
  public code: string;
  public subCode?: string;
  public subMsg?: string;

  constructor(message: string, code: string, subCode?: string, subMsg?: string) {
    super(message);
    this.name = 'PayPayError';
    this.code = code;
    this.subCode = subCode;
    this.subMsg = subMsg;
  }
}

export class PayPayValidationError extends PayPayError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'PayPayValidationError';
  }
}

export class PayPayAuthenticationError extends PayPayError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
    this.name = 'PayPayAuthenticationError';
  }
}

export class PayPayNetworkError extends PayPayError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'PayPayNetworkError';
  }
}