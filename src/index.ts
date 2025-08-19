/**
 * PayPay Africa TypeScript SDK
 * @author MiniMax Agent
 * @version 1.0.0
 */

// Classe principal
export { PayPayClient } from './paypay-client';

export {
  Environment,
  Language,
  PayProductCode,
  BankCode,
  TransactionStatus
} from './types';

// Tipos e interfaces
export type {
  PayPayConfig,
  PaymentMethod,
  BaseRequest,
  BaseResponse,
  TradeInfo,
  MulticaixaPayMethod,
  ReferencePayMethod,
  PayMethod,
  InstantTradeRequest,
  InstantTradeResponse,
  TradeRefundRequest,
  TradeRefundResponse,
  TradeCloseRequest,
  TradeCloseResponse,
  TradeQueryRequest,
  TradeQueryResponse,
} from './types';

// Classes de erro
export {
  PayPayError,
  PayPayValidationError,
  PayPayAuthenticationError,
  PayPayNetworkError,
} from './types';

// Utilitários
export { RSAAuth } from './auth/rsa';
export { ValidationUtils } from './auth/validation';

// Serviços
export { HttpService } from './services/http';

// Versão da biblioteca
export const VERSION = '1.0.0';

// Constantes úteis
export const CONSTANTS = {
  VERSION: '1.0',
  CHARSET: 'UTF-8',
  SIGN_TYPE: 'RSA',
  FORMAT: 'JSON',
  CASHIER_TYPE: 'SDK',
  PAYEE_IDENTITY_TYPE: '1',
  DEFAULT_CURRENCY: 'AOA',
  SUCCESS_CODE: 'S0001',
  TIMEOUT_DEFAULT: '2H',
  URLS: {
    SANDBOX: 'https://gateway.paypayafrica.com/recv.do',
    PRODUCTION: 'https://gateway.paypayafrica.com/recv.do',
  },
} as const;