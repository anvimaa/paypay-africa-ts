"use strict";
/**
 * Exemplo de uso da biblioteca PayPay Africa
 * @author anvimaa
 */
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
exports.exemploFecharPagamento = exports.exemploEstorno = exports.exemploConsultarStatus = exports.exemploReferencia = exports.exemploMulticaixaExpress = exports.exemploPayPayApp = void 0;
var paypay_africa_1 = require("paypay-africa");
var paypay_africa_2 = require("paypay-africa");
// Configuração do cliente
var config = {
    partnerId: '200002914662',
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL/WFpWQK3CIIXZJ\nzJBuKPQVwcOAKKHNUEvWKmgZUKw3jFl2kN9tv7/mtLWv54BKwc4J3CyJf3E30svo\nQdaAn38pigj5bYd67CRo9sd25mDJSeOcYPmluBYeEZ1hbplW6keCWQ/O9S1tzIae\nUs3VFACW5UmY0v8Ki9u/W/RHksLtAgMBAAECgYAR1QjMZlZjY4QYxstpMZRE/DDC\nx4r/X2JzajkO7Ct/lrpJJqhY3I7Se9OYf/15A3n4eRoqWa2rDJFfuvtDwTkSI2Nh\nLlIN91vFd69/ZuJBc4b/5YP0qdCe5oDCcrBFoYHovswz7KaMtHJYBztURdw48SwW\n5PCD5k7LnaOKdnQG0QJBAP72I7zQzdImv7wdKGQ1WpYebGjDGw0ZQdmaF74QNde5\n87LLjwEaB6mRwo4JxxTBBT8kfhfGcPkiPm5xlnHLCesCQQDAnh//H6edRJomgZS4\nMJcElxEmWAVZs3leMubRJI1xws58eg74yG7Ca6jvXePoI/eWEiW5jUat9WJMaZsa\nl5iHAkBkoK0WNqslSFngWvm4Iz6vhS5wYqDomJFe2uyH/Uni7Od8J883NhjUGk1Z\nVg6W6F+zviluJMot6hAN8xLXsrUlAkA5CprPIsCwgjBkVtuD8F/IrDQX9tkex1eZ\n3dkc9oYsulQL6NmmMzUZvmg4+sUTahNYDee+G2hi+9gwaNXV+i7hAkEAm/Wx6d5O\nbX/z/XyH7nDihfcoi2fRSzm7Y8wjjelChW9xwhiM4FsLHJ8TdJfTmJWPKbD/2kXE\nUWItfEfd738o6A==\n-----END PRIVATE KEY-----",
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/1haVkCtwiCF2ScyQbij0FcHD\ngCihzVBL1ipoGVCsN4xZdpDfbb+/5rS1r+eASsHOCdwsiX9xN9LL6EHWgJ9/KYoI\n+W2HeuwkaPbHduZgyUnjnGD5pbgWHhGdYW6ZVupHglkPzvUtbcyGnlLN1RQAluVJ\nmNL/Covbv1v0R5LC7QIDAQAB\n-----END PUBLIC KEY-----",
    payPayPublicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArL1akdPqJVYIGI4vGNiN\ndvoxn7TWYOorLrNOBz3BP2yVSf31L6yPbQIs8hn59iOzbWy8raXAYWjYgM9Lh6h2\n6XutwmEjZHqqoH5pLDYvZALMxEwunDpeTFrikuej0nWxjmpA9m4eicXcJbCMJowL\n47a5Jw61VkF+wbIj5vxEcSN4SSddJ04zEye1iwkWi9myecU39Do1THBN62ZKiGtd\n8jqAqKuDzLtch2mcEjMlgi51RM3IhxtYGY98JE6ICcVu+VDcsAX+OWwOXaWGyv75\n5TQG6V8fnYO+Qd4R13jO+32V+EgizHQirhVayAFQGbTBSPIg85G8gVNU64SxbZ5J\nXQIDAQAB\n-----END PUBLIC KEY-----",
    environment: paypay_africa_2.Environment.SANDBOX,
    timeout: 30000,
};
// Criar instância do cliente
var payPayClient = new paypay_africa_1.PayPayClient(config);
// === EXEMPLO 1: Pagamento com PayPay App ===
function exemploPayPayApp() {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, mobileUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Exemplo: Pagamento com PayPay App ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    request = {
                        payer_ip: '192.168.1.100',
                        sale_product_code: 'PROD001',
                        cashier_type: 'SDK',
                        timeout_express: '30m',
                        trade_info: {
                            out_trade_no: "ORDER_".concat(Date.now()),
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
                    return [4 /*yield*/, payPayClient.createPaymentWithApp(request, paypay_africa_2.Language.PORTUGUESE)];
                case 2:
                    response = _a.sent();
                    console.log('Pagamento criado com sucesso:');
                    console.log('- Número da transação:', response.trade_no);
                    console.log('- Status:', response.status);
                    console.log('- Token:', response.trade_token);
                    console.log('- Link dinâmico:', response.dynamic_link);
                    mobileUrl = "paypayao://trade/pay?action=pay&tradeToken=".concat(response.trade_token);
                    console.log('- URL para mobile:', mobileUrl);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Erro no pagamento:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploPayPayApp = exemploPayPayApp;
// === EXEMPLO 2: Pagamento com MULTICAIXA Express ===
function exemploMulticaixaExpress() {
    return __awaiter(this, void 0, void 0, function () {
        var payMethod, request, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n=== Exemplo: Pagamento com MULTICAIXA Express ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    payMethod = {
                        pay_product_code: paypay_africa_2.PayProductCode.MULTICAIXA_EXPRESS,
                        amount: '500.00',
                        bank_code: paypay_africa_2.BankCode.MULTICAIXA,
                        phone_num: '934342795', // Número de telefone registrado no MulticAIXA
                    };
                    request = {
                        cashier_type: 'SDK',
                        payer_ip: '192.168.1.100',
                        sale_product_code: '050200001',
                        timeout_express: '50m',
                        trade_info: {
                            currency: 'AOA',
                            out_trade_no: "MULTICAIXA_".concat(Date.now()),
                            payee_identity: '200001835716',
                            payee_identity_type: '1',
                            price: '500.00',
                            quantity: '1',
                            subject: 'Pagamento via MULTICAIXA Express',
                            total_amount: '500.00',
                        },
                        pay_method: payMethod,
                    };
                    return [4 /*yield*/, payPayClient.createPaymentWithMulticaixa(request)];
                case 2:
                    response = _a.sent();
                    console.log('Pagamento MULTICAIXA criado:');
                    console.log('- Número da transação:', response.trade_no);
                    console.log('- Status:', response.status);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Erro no pagamento MULTICAIXA:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploMulticaixaExpress = exemploMulticaixaExpress;
// === EXEMPLO 3: Pagamento por Referência ===
function exemploReferencia() {
    return __awaiter(this, void 0, void 0, function () {
        var payMethod, request, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n=== Exemplo: Pagamento por Referência ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    payMethod = {
                        pay_product_code: paypay_africa_2.PayProductCode.REFERENCE,
                        amount: '2000.00',
                        bank_code: paypay_africa_2.BankCode.REFERENCE,
                    };
                    request = {
                        payer_ip: '192.168.1.100',
                        sale_product_code: 'PROD003',
                        cashier_type: 'SDK',
                        trade_info: {
                            out_trade_no: "REF_".concat(Date.now()),
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
                    return [4 /*yield*/, payPayClient.createPaymentWithReference(request)];
                case 2:
                    response = _a.sent();
                    console.log('Pagamento por referência criado:');
                    console.log('- Número da transação:', response.trade_no);
                    console.log('- Status:', response.status);
                    console.log('- Entity ID:', response.entity_id);
                    console.log('- Reference ID:', response.reference_id);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Erro no pagamento por referência:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploReferencia = exemploReferencia;
// === EXEMPLO 4: Consultar Status ===
function exemploConsultarStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n=== Exemplo: Consultar Status ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    request = {
                        out_trade_no: 'ORDER_1234567890', // Número do seu pedido
                    };
                    return [4 /*yield*/, payPayClient.queryPayment(request)];
                case 2:
                    response = _a.sent();
                    console.log('Status da transação:');
                    console.log('- Número do pedido:', response.out_trade_no);
                    console.log('- Número da transação:', response.trade_no);
                    console.log('- Status:', response.status);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Erro ao consultar status:', error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploConsultarStatus = exemploConsultarStatus;
// === EXEMPLO 5: Estorno ===
function exemploEstorno() {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n=== Exemplo: Estorno ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    request = {
                        out_trade_no: "REFUND_".concat(Date.now()),
                        orig_out_trade_no: 'ORDER_1234567890', // Número do pedido original
                        refund_amount: '500.00', // Estorno parcial
                    };
                    return [4 /*yield*/, payPayClient.refundPayment(request)];
                case 2:
                    response = _a.sent();
                    console.log('Estorno processado:');
                    console.log('- Número do estorno:', response.out_trade_no);
                    console.log('- Número da transação:', response.trade_no);
                    console.log('- Status:', response.status);
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Erro no estorno:', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploEstorno = exemploEstorno;
// === EXEMPLO 6: Fechar Pagamento ===
function exemploFecharPagamento() {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n=== Exemplo: Fechar Pagamento ===');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    request = {
                        out_trade_no: 'ORDER_1234567890',
                    };
                    return [4 /*yield*/, payPayClient.closePayment(request)];
                case 2:
                    response = _a.sent();
                    console.log('Pagamento fechado:');
                    console.log('- Número do pedido:', response.out_trade_no);
                    console.log('- Número da transação:', response.trade_no);
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('Erro ao fechar pagamento:', error_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exemploFecharPagamento = exemploFecharPagamento;
// Executar exemplos
function executarExemplos() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Exemplos da Biblioteca PayPay Africa ===\n');
                    // Descomente as linhas abaixo para testar cada exemplo
                    // await exemploPayPayApp();
                    return [4 /*yield*/, exemploMulticaixaExpress()];
                case 1:
                    // Descomente as linhas abaixo para testar cada exemplo
                    // await exemploPayPayApp();
                    _a.sent();
                    // await exemploReferencia();
                    // await exemploConsultarStatus();
                    // await exemploEstorno();
                    // await exemploFecharPagamento();
                    console.log('\n=== Todos os exemplos concluídos ===');
                    return [2 /*return*/];
            }
        });
    });
}
// Executar apenas se este arquivo for executado diretamente
if (require.main === module) {
    executarExemplos().catch(console.error);
}
