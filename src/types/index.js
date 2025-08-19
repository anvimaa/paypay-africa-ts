"use strict";
/**
 * Tipos e interfaces para a API do PayPay Africa
 * @author anvimaa
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPayNetworkError = exports.PayPayAuthenticationError = exports.PayPayValidationError = exports.PayPayError = exports.BankCode = exports.PayProductCode = exports.PaymentMethod = exports.TransactionStatus = exports.Language = exports.Environment = void 0;
// Ambiente da API
var Environment;
(function (Environment) {
    Environment["SANDBOX"] = "sandbox";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
// Idiomas suportados
var Language;
(function (Language) {
    Language["PORTUGUESE"] = "pt";
    Language["ENGLISH"] = "en";
})(Language || (exports.Language = Language = {}));
// Status de transação
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "S";
    TransactionStatus["PROCESSING"] = "P";
    TransactionStatus["FAILED"] = "F";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
// Métodos de pagamento
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PAYPAY_APP"] = "PAYPAY_APP";
    PaymentMethod["MULTICAIXA_EXPRESS"] = "MULTICAIXA_EXPRESS";
    PaymentMethod["REFERENCE"] = "REFERENCE";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// Códigos de produto de pagamento
var PayProductCode;
(function (PayProductCode) {
    PayProductCode["MULTICAIXA_EXPRESS"] = "31";
    PayProductCode["REFERENCE"] = "31";
})(PayProductCode || (exports.PayProductCode = PayProductCode = {}));
// Códigos de banco
var BankCode;
(function (BankCode) {
    BankCode["MULTICAIXA"] = "MUL";
    BankCode["REFERENCE"] = "REF";
})(BankCode || (exports.BankCode = BankCode = {}));
// Exceções personalizadas
var PayPayError = /** @class */ (function (_super) {
    __extends(PayPayError, _super);
    function PayPayError(message, code, subCode, subMsg) {
        var _this = _super.call(this, message) || this;
        _this.name = 'PayPayError';
        _this.code = code;
        _this.subCode = subCode;
        _this.subMsg = subMsg;
        return _this;
    }
    return PayPayError;
}(Error));
exports.PayPayError = PayPayError;
var PayPayValidationError = /** @class */ (function (_super) {
    __extends(PayPayValidationError, _super);
    function PayPayValidationError(message) {
        var _this = _super.call(this, message, 'VALIDATION_ERROR') || this;
        _this.name = 'PayPayValidationError';
        return _this;
    }
    return PayPayValidationError;
}(PayPayError));
exports.PayPayValidationError = PayPayValidationError;
var PayPayAuthenticationError = /** @class */ (function (_super) {
    __extends(PayPayAuthenticationError, _super);
    function PayPayAuthenticationError(message) {
        var _this = _super.call(this, message, 'AUTH_ERROR') || this;
        _this.name = 'PayPayAuthenticationError';
        return _this;
    }
    return PayPayAuthenticationError;
}(PayPayError));
exports.PayPayAuthenticationError = PayPayAuthenticationError;
var PayPayNetworkError = /** @class */ (function (_super) {
    __extends(PayPayNetworkError, _super);
    function PayPayNetworkError(message) {
        var _this = _super.call(this, message, 'NETWORK_ERROR') || this;
        _this.name = 'PayPayNetworkError';
        return _this;
    }
    return PayPayNetworkError;
}(PayPayError));
exports.PayPayNetworkError = PayPayNetworkError;
