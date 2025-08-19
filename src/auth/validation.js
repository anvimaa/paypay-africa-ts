"use strict";
/**
 * Utilitários para validação de parâmetros
 * @author anvimaa
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
var types_1 = require("../types");
var ValidationUtils = /** @class */ (function () {
    function ValidationUtils() {
    }
    /**
     * Valida se um valor é obrigatório e não está vazio
     */
    ValidationUtils.required = function (value, fieldName) {
        if (value === undefined || value === null || value === '') {
            throw new types_1.PayPayValidationError("Campo obrigat\u00F3rio: ".concat(fieldName));
        }
    };
    /**
     * Valida o comprimento de uma string
     */
    ValidationUtils.validateLength = function (value, min, max, fieldName) {
        if (value.length < min || value.length > max) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ter entre ").concat(min, " e ").concat(max, " caracteres"));
        }
    };
    /**
     * Valida se é um número válido com até 2 casas decimais
     */
    ValidationUtils.amount = function (value, fieldName) {
        var regex = /^\d+(\.\d{1,2})?$/;
        if (!regex.test(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ser um valor num\u00E9rico v\u00E1lido com at\u00E9 2 casas decimais"));
        }
        var numValue = parseFloat(value);
        if (numValue < 0.01 || numValue > 999999999999.99) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve estar entre 0.01 e 999999999999.99"));
        }
    };
    /**
     * Valida formato de IP
     */
    ValidationUtils.ip = function (value, fieldName) {
        var ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ser um IP v\u00E1lido"));
        }
    };
    /**
     * Valida formato de telefone angolano (9 dígitos)
     */
    ValidationUtils.phoneNumber = function (value, fieldName) {
        var phoneRegex = /^\d{9}$/;
        if (!phoneRegex.test(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ter 9 d\u00EDgitos num\u00E9ricos"));
        }
    };
    /**
     * Valida formato de moeda (3 caracteres)
     */
    ValidationUtils.currency = function (value, fieldName) {
        if (value.length !== 3) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ter exatamente 3 caracteres"));
        }
    };
    /**
     * Valida se o idioma é suportado
     */
    ValidationUtils.language = function (value, fieldName) {
        if (!Object.values(types_1.Language).includes(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ser 'pt' ou 'en'"));
        }
    };
    /**
     * Valida formato de timeout (40m ~ 7d)
     */
    ValidationUtils.timeout = function (value, fieldName) {
        var timeoutRegex = /^\d+[mhd]$/i;
        if (!timeoutRegex.test(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve estar no formato: n\u00FAmero + unidade (m/h/d)"));
        }
        var unit = value.slice(-1).toLowerCase();
        var num = parseInt(value.slice(0, -1));
        // Validar limites
        if (unit === 'm' && num < 40) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, ": m\u00EDnimo 40 minutos"));
        }
        if (unit === 'd' && num > 7) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, ": m\u00E1ximo 7 dias"));
        }
    };
    /**
     * Valida URL
     */
    ValidationUtils.url = function (value, fieldName) {
        try {
            new URL(value);
        }
        catch (_a) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve ser uma URL v\u00E1lida"));
        }
    };
    /**
     * Valida método de pagamento
     */
    ValidationUtils.payMethod = function (payMethod, fieldName) {
        this.required(payMethod.pay_product_code, "".concat(fieldName, ".pay_product_code"));
        this.required(payMethod.amount, "".concat(fieldName, ".amount"));
        this.amount(payMethod.amount, "".concat(fieldName, ".amount"));
        if (payMethod.pay_product_code === types_1.PayProductCode.MULTICAIXA_EXPRESS) {
            var multicaixa = payMethod;
            this.required(multicaixa.phone_num, "".concat(fieldName, ".phone_num"));
            this.phoneNumber(multicaixa.phone_num, "".concat(fieldName, ".phone_num"));
            if (multicaixa.bank_code && multicaixa.bank_code !== types_1.BankCode.MULTICAIXA) {
                throw new types_1.PayPayValidationError("".concat(fieldName, ".bank_code deve ser 'MUL' para MULTICAIXA Express"));
            }
        }
        if (payMethod.pay_product_code === types_1.PayProductCode.REFERENCE) {
            var reference = payMethod;
            if (reference.bank_code && reference.bank_code !== types_1.BankCode.REFERENCE) {
                throw new types_1.PayPayValidationError("".concat(fieldName, ".bank_code deve ser 'REF' para pagamento por refer\u00EAncia"));
            }
        }
    };
    /**
     * Valida formato alfanumérico com sublinhado
     */
    ValidationUtils.alphanumericUnderscore = function (value, fieldName) {
        var regex = /^[a-zA-Z0-9_]+$/;
        if (!regex.test(value)) {
            throw new types_1.PayPayValidationError("Campo ".concat(fieldName, " deve conter apenas caracteres alfanum\u00E9ricos e sublinhado"));
        }
    };
    return ValidationUtils;
}());
exports.ValidationUtils = ValidationUtils;
