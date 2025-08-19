"use strict";
/**
 * Cliente principal da API PayPay Africa
 * @author MiniMax Agent
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPayClient = void 0;
var types_1 = require("./types");
var rsa_1 = require("./auth/rsa");
var validation_1 = require("./auth/validation");
var http_1 = require("./services/http");
var PayPayClient = /** @class */ (function () {
    function PayPayClient(config) {
        this.validateConfig(config);
        this.config = config;
        this.auth = new rsa_1.RSAAuth(config.privateKey, config.publicKey, config.payPayPublicKey);
        this.http = new http_1.HttpService(config);
    }
    /**
     * Valida a configuração inicial
     */
    PayPayClient.prototype.validateConfig = function (config) {
        validation_1.ValidationUtils.required(config.partnerId, 'partnerId');
        validation_1.ValidationUtils.required(config.privateKey, 'privateKey');
        validation_1.ValidationUtils.required(config.publicKey, 'publicKey');
        validation_1.ValidationUtils.required(config.payPayPublicKey, 'payPayPublicKey');
        validation_1.ValidationUtils.required(config.environment, 'environment');
        if (!['sandbox', 'production'].includes(config.environment)) {
            throw new types_1.PayPayValidationError('Ambiente deve ser "sandbox" ou "production"');
        }
        if (!rsa_1.RSAAuth.validateRSAKey(config.privateKey)) {
            throw new types_1.PayPayValidationError('Chave privada RSA inválida');
        }
        if (!rsa_1.RSAAuth.validateRSAKey(config.publicKey)) {
            throw new types_1.PayPayValidationError('Chave pública RSA inválida');
        }
        if (!rsa_1.RSAAuth.validateRSAKey(config.payPayPublicKey)) {
            throw new types_1.PayPayValidationError('Chave pública do PayPay inválida');
        }
    };
    /**
     * Constrói a requisição base com parâmetros obrigatórios
     */
    PayPayClient.prototype.buildBaseRequest = function (service, bizContent, language) {
        if (language === void 0) { language = types_1.Language.PORTUGUESE; }
        var requestNo = rsa_1.RSAAuth.generateRequestNo();
        var timestamp = rsa_1.RSAAuth.generateTimestamp();
        // Criptografar biz_content
        var bizContentString = JSON.stringify(bizContent);
        var encryptedBizContent = this.auth.encryptContent(bizContentString);
        // Construir parâmetros base (sem assinatura)
        var baseParams = {
            request_no: requestNo,
            service: service,
            version: '1.0',
            partner_id: this.config.partnerId,
            charset: 'UTF-8',
            sign_type: 'RSA',
            timestamp: timestamp,
            format: 'JSON',
            language: language,
            biz_content: encodeURIComponent(encryptedBizContent),
        };
        // Gerar assinatura
        var signature = this.auth.generateSignature(baseParams);
        return __assign(__assign({}, baseParams), { sign: signature });
    };
    /**
     * Processa a resposta da API e valida a assinatura
     */
    PayPayClient.prototype.processResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidSignature;
            return __generator(this, function (_a) {
                // Verificar se a resposta foi bem-sucedida
                if (response.code !== 'S0001') {
                    throw new types_1.PayPayError(response.msg || 'Erro na API', response.code, response.sub_code, response.sub_msg);
                }
                // Validar assinatura da resposta (opcional, mas recomendado)
                try {
                    isValidSignature = this.auth.verifySignature(response, response.sign);
                    if (!isValidSignature) {
                        console.warn('[PayPay] Aviso: Assinatura da resposta inválida');
                    }
                }
                catch (error) {
                    console.warn('[PayPay] Aviso: Não foi possível validar a assinatura da resposta:', error);
                }
                return [2 /*return*/, response.biz_content];
            });
        });
    };
    /**
     * Criar pagamento com PayPay App
     */
    PayPayClient.prototype.createPaymentWithApp = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateInstantTradeRequest(request);
                        baseRequest = this.buildBaseRequest('instant_trade', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    /**
     * Criar pagamento com MULTICAIXA Express
     */
    PayPayClient.prototype.createPaymentWithMulticaixa = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateInstantTradeRequest(request);
                        if (!request.pay_method) {
                            throw new types_1.PayPayValidationError('pay_method é obrigatório para MULTICAIXA Express');
                        }
                        validation_1.ValidationUtils.payMethod(request.pay_method, 'pay_method');
                        baseRequest = this.buildBaseRequest('instant_trade', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    /**
     * Criar pagamento com Referência
     */
    PayPayClient.prototype.createPaymentWithReference = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateInstantTradeRequest(request);
                        if (!request.pay_method) {
                            throw new types_1.PayPayValidationError('pay_method é obrigatório para pagamento por referência');
                        }
                        validation_1.ValidationUtils.payMethod(request.pay_method, 'pay_method');
                        baseRequest = this.buildBaseRequest('instant_trade', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    /**
     * Estornar pagamento
     */
    PayPayClient.prototype.refundPayment = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateTradeRefundRequest(request);
                        baseRequest = this.buildBaseRequest('trade_refund', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    /**
     * Fechar pagamento
     */
    PayPayClient.prototype.closePayment = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateTradeCloseRequest(request);
                        baseRequest = this.buildBaseRequest('trade_close', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    /**
     * Consultar status do pagamento
     */
    PayPayClient.prototype.queryPayment = function (request_1) {
        return __awaiter(this, arguments, void 0, function (request, language) {
            var baseRequest, response;
            if (language === void 0) { language = types_1.Language.PORTUGUESE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateTradeQueryRequest(request);
                        baseRequest = this.buildBaseRequest('trade_query', request, language);
                        return [4 /*yield*/, this.http.apiCall(baseRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.processResponse(response)];
                }
            });
        });
    };
    // === Métodos de Validação ===
    PayPayClient.prototype.validateInstantTradeRequest = function (request) {
        validation_1.ValidationUtils.required(request.payer_ip, 'payer_ip');
        validation_1.ValidationUtils.ip(request.payer_ip, 'payer_ip');
        validation_1.ValidationUtils.required(request.sale_product_code, 'sale_product_code');
        validation_1.ValidationUtils.validateLength(request.sale_product_code, 1, 9, 'sale_product_code');
        validation_1.ValidationUtils.required(request.cashier_type, 'cashier_type');
        if (request.cashier_type !== 'SDK') {
            throw new types_1.PayPayValidationError('cashier_type deve ser "SDK"');
        }
        if (request.timeout_express) {
            validation_1.ValidationUtils.timeout(request.timeout_express, 'timeout_express');
        }
        validation_1.ValidationUtils.required(request.trade_info, 'trade_info');
        this.validateTradeInfo(request.trade_info);
        if (request.return_url) {
            validation_1.ValidationUtils.url(request.return_url, 'return_url');
            validation_1.ValidationUtils.validateLength(request.return_url, 1, 1024, 'return_url');
        }
    };
    PayPayClient.prototype.validateTradeInfo = function (tradeInfo) {
        validation_1.ValidationUtils.required(tradeInfo.out_trade_no, 'trade_info.out_trade_no');
        validation_1.ValidationUtils.validateLength(tradeInfo.out_trade_no, 6, 32, 'trade_info.out_trade_no');
        validation_1.ValidationUtils.alphanumericUnderscore(tradeInfo.out_trade_no, 'trade_info.out_trade_no');
        validation_1.ValidationUtils.required(tradeInfo.subject, 'trade_info.subject');
        validation_1.ValidationUtils.validateLength(tradeInfo.subject, 1, 256, 'trade_info.subject');
        if (tradeInfo.currency) {
            validation_1.ValidationUtils.currency(tradeInfo.currency, 'trade_info.currency');
        }
        validation_1.ValidationUtils.required(tradeInfo.price, 'trade_info.price');
        validation_1.ValidationUtils.amount(tradeInfo.price, 'trade_info.price');
        validation_1.ValidationUtils.required(tradeInfo.quantity, 'trade_info.quantity');
        validation_1.ValidationUtils.validateLength(tradeInfo.quantity, 1, 5, 'trade_info.quantity');
        validation_1.ValidationUtils.required(tradeInfo.total_amount, 'trade_info.total_amount');
        validation_1.ValidationUtils.amount(tradeInfo.total_amount, 'trade_info.total_amount');
        validation_1.ValidationUtils.required(tradeInfo.payee_identity, 'trade_info.payee_identity');
        validation_1.ValidationUtils.validateLength(tradeInfo.payee_identity, 1, 32, 'trade_info.payee_identity');
        validation_1.ValidationUtils.required(tradeInfo.payee_identity_type, 'trade_info.payee_identity_type');
        if (tradeInfo.payee_identity_type !== '1') {
            throw new types_1.PayPayValidationError('trade_info.payee_identity_type deve ser "1"');
        }
    };
    PayPayClient.prototype.validateTradeRefundRequest = function (request) {
        validation_1.ValidationUtils.required(request.out_trade_no, 'out_trade_no');
        validation_1.ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
        validation_1.ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
        validation_1.ValidationUtils.required(request.orig_out_trade_no, 'orig_out_trade_no');
        validation_1.ValidationUtils.validateLength(request.orig_out_trade_no, 1, 32, 'orig_out_trade_no');
        validation_1.ValidationUtils.required(request.refund_amount, 'refund_amount');
        validation_1.ValidationUtils.amount(request.refund_amount, 'refund_amount');
    };
    PayPayClient.prototype.validateTradeCloseRequest = function (request) {
        validation_1.ValidationUtils.required(request.out_trade_no, 'out_trade_no');
        validation_1.ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
        validation_1.ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
    };
    PayPayClient.prototype.validateTradeQueryRequest = function (request) {
        validation_1.ValidationUtils.required(request.out_trade_no, 'out_trade_no');
        validation_1.ValidationUtils.validateLength(request.out_trade_no, 6, 32, 'out_trade_no');
        validation_1.ValidationUtils.alphanumericUnderscore(request.out_trade_no, 'out_trade_no');
    };
    return PayPayClient;
}());
exports.PayPayClient = PayPayClient;
