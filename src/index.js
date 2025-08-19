"use strict";
/**
 * PayPay Africa TypeScript SDK
 * @author anvimaa
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = exports.VERSION = exports.HttpService = exports.ValidationUtils = exports.RSAAuth = exports.PayPayNetworkError = exports.PayPayAuthenticationError = exports.PayPayValidationError = exports.PayPayError = exports.TransactionStatus = exports.BankCode = exports.PayProductCode = exports.Language = exports.Environment = exports.PayPayClient = void 0;
// Classe principal
var paypay_client_1 = require("./paypay-client");
Object.defineProperty(exports, "PayPayClient", { enumerable: true, get: function () { return paypay_client_1.PayPayClient; } });
var types_1 = require("./types");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return types_1.Environment; } });
Object.defineProperty(exports, "Language", { enumerable: true, get: function () { return types_1.Language; } });
Object.defineProperty(exports, "PayProductCode", { enumerable: true, get: function () { return types_1.PayProductCode; } });
Object.defineProperty(exports, "BankCode", { enumerable: true, get: function () { return types_1.BankCode; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return types_1.TransactionStatus; } });
// Classes de erro
var types_2 = require("./types");
Object.defineProperty(exports, "PayPayError", { enumerable: true, get: function () { return types_2.PayPayError; } });
Object.defineProperty(exports, "PayPayValidationError", { enumerable: true, get: function () { return types_2.PayPayValidationError; } });
Object.defineProperty(exports, "PayPayAuthenticationError", { enumerable: true, get: function () { return types_2.PayPayAuthenticationError; } });
Object.defineProperty(exports, "PayPayNetworkError", { enumerable: true, get: function () { return types_2.PayPayNetworkError; } });
// Utilitários
var rsa_1 = require("./auth/rsa");
Object.defineProperty(exports, "RSAAuth", { enumerable: true, get: function () { return rsa_1.RSAAuth; } });
var validation_1 = require("./auth/validation");
Object.defineProperty(exports, "ValidationUtils", { enumerable: true, get: function () { return validation_1.ValidationUtils; } });
// Serviços
var http_1 = require("./services/http");
Object.defineProperty(exports, "HttpService", { enumerable: true, get: function () { return http_1.HttpService; } });
// Versão da biblioteca
exports.VERSION = '1.0.0';
// Constantes úteis
exports.CONSTANTS = {
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
};
