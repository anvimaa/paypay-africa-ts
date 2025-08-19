"use strict";
/**
 * Serviço HTTP para comunicação com a API PayPay
 * @author MiniMax Agent
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
exports.HttpService = void 0;
var axios_1 = require("axios");
var types_1 = require("../types");
var HttpService = /** @class */ (function () {
    function HttpService(config) {
        this.config = config;
        var baseURL = config.baseUrl || this.getDefaultBaseUrl(config.environment);
        this.client = axios_1.default.create({
            baseURL: baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    /**
     * Obtém a URL base padrão baseada no ambiente
     */
    HttpService.prototype.getDefaultBaseUrl = function (environment) {
        switch (environment) {
            case 'sandbox':
                return 'https://sandbox-api.paypayafrica.com';
            case 'production':
                return 'https://api.paypayafrica.com';
            default:
                throw new types_1.PayPayNetworkError("Ambiente inv\u00E1lido: ".concat(environment));
        }
    };
    /**
     * Configura interceptors para logging e tratamento de erros
     */
    HttpService.prototype.setupInterceptors = function () {
        // Request interceptor
        this.client.interceptors.request.use(function (config) {
            var _a;
            console.log("[PayPay] Enviando requisi\u00E7\u00E3o: ".concat((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase(), " ").concat(config.url));
            return config;
        }, function (error) {
            console.error('[PayPay] Erro na requisição:', error);
            return Promise.reject(error);
        });
        // Response interceptor
        this.client.interceptors.response.use(function (response) {
            console.log("[PayPay] Resposta recebida: ".concat(response.status));
            return response;
        }, function (error) {
            console.error('[PayPay] Erro na resposta:', error);
            if (error.response) {
                throw new types_1.PayPayNetworkError("Erro HTTP ".concat(error.response.status, ": ").concat(error.response.statusText));
            }
            else if (error.request) {
                throw new types_1.PayPayNetworkError('Erro de rede: Não foi possível conectar à API');
            }
            else {
                throw new types_1.PayPayNetworkError("Erro desconhecido: ".concat(error.message));
            }
        });
    };
    /**
     * Envia requisição POST para a API
     */
    HttpService.prototype.post = function (endpoint, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.post(endpoint, data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof types_1.PayPayNetworkError) {
                            throw error_1;
                        }
                        throw new types_1.PayPayNetworkError("Erro na comunica\u00E7\u00E3o: ".concat(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Método genérico para todas as chamadas da API PayPay
     */
    HttpService.prototype.apiCall = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.post('/gateway.do', data)];
            });
        });
    };
    return HttpService;
}());
exports.HttpService = HttpService;
