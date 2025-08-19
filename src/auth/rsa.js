"use strict";
/**
 * Sistema de autenticação RSA para PayPay Africa
 * @author anvimaa
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSAAuth = void 0;
var crypto = require("crypto");
var types_1 = require("../types");
var RSAAuth = /** @class */ (function () {
    function RSAAuth(privateKey, publicKey, payPayPublicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.payPayPublicKey = payPayPublicKey;
    }
    /**
     * Criptografa o conteúdo usando a chave privada RSA
     * @param content - Conteúdo a ser criptografado
     * @returns Conteúdo criptografado em base64
     */
    RSAAuth.prototype.encryptContent = function (content) {
        try {
            var buffer = Buffer.from(content, 'utf8');
            var encrypted = crypto.privateEncrypt({
                key: this.privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            }, buffer);
            return encrypted.toString('base64');
        }
        catch (error) {
            throw new types_1.PayPayAuthenticationError("Erro ao criptografar conte\u00FAdo: ".concat(error));
        }
    };
    /**
     * Gera assinatura SHA1withRSA para os parâmetros
     * @param params - Parâmetros da requisição (exceto sign e sign_type)
     * @returns Assinatura em base64
     */
    RSAAuth.prototype.generateSignature = function (params) {
        try {
            // Ordenar parâmetros em ASCII (exceto sign e sign_type)
            var filteredParams = Object.keys(params)
                .filter(function (key) { return key !== 'sign' && key !== 'sign_type'; })
                .sort()
                .reduce(function (result, key) {
                    result[key] = params[key];
                    return result;
                }, {});
            // Concatenar como pares chave-valor
            var queryString = Object.entries(filteredParams)
                .map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return "".concat(key, "=").concat(value);
                })
                .join('&');
            // Gerar assinatura SHA1withRSA
            var sign = crypto.createSign('SHA1');
            sign.update(queryString, 'utf8');
            var signature = sign.sign(this.privateKey, 'base64');
            return signature;
        }
        catch (error) {
            throw new types_1.PayPayAuthenticationError("Erro ao gerar assinatura: ".concat(error));
        }
    };
    /**
     * Valida a assinatura da resposta usando a chave pública do PayPay
     * @param params - Parâmetros da resposta
     * @param signature - Assinatura a ser validada
     * @returns true se a assinatura for válida
     */
    RSAAuth.prototype.verifySignature = function (params, signature) {
        try {
            // Filtrar e ordenar parâmetros (exceto sign e sign_type)
            var filteredParams = Object.keys(params)
                .filter(function (key) { return key !== 'sign' && key !== 'sign_type'; })
                .sort()
                .reduce(function (result, key) {
                    result[key] = params[key];
                    return result;
                }, {});
            // Concatenar como pares chave-valor
            var queryString = Object.entries(filteredParams)
                .map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return "".concat(key, "=").concat(value);
                })
                .join('&');
            // Verificar assinatura
            var verify = crypto.createVerify('SHA1');
            verify.update(queryString, 'utf8');
            return verify.verify(this.payPayPublicKey, signature, 'base64');
        }
        catch (error) {
            throw new types_1.PayPayAuthenticationError("Erro ao verificar assinatura: ".concat(error));
        }
    };
    /**
     * Aplica URL encoding nos valores do objeto JSON
     * @param obj - Objeto a ser codificado
     * @returns Objeto com valores codificados
     */
    RSAAuth.urlEncodeValues = function (obj) {
        var encoded = {};
        for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value === 'string') {
                encoded[key] = encodeURIComponent(value);
            }
            else if (typeof value === 'object' && value !== null) {
                encoded[key] = this.urlEncodeValues(value);
            }
            else {
                encoded[key] = value;
            }
        }
        return encoded;
    };
    /**
     * Gera timestamp no formato exigido pela API (yyyy-MM-dd HH:mm:ss)
     * @param date - Data (opcional, padrão: agora)
     * @returns Timestamp formatado
     */
    RSAAuth.generateTimestamp = function (date) {
        var now = date || new Date();
        // PayPay usa GMT+1, então ajustamos
        var gmtPlus1 = new Date(now.getTime() + (1 * 60 * 60 * 1000));
        var year = gmtPlus1.getFullYear();
        var month = String(gmtPlus1.getMonth() + 1).padStart(2, '0');
        var day = String(gmtPlus1.getDate()).padStart(2, '0');
        var hours = String(gmtPlus1.getHours()).padStart(2, '0');
        var minutes = String(gmtPlus1.getMinutes()).padStart(2, '0');
        var seconds = String(gmtPlus1.getSeconds()).padStart(2, '0');
        return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
    };
    /**
     * Gera um request_no único (alfanumérico, 6-32 caracteres)
     * @returns Request number único
     */
    RSAAuth.generateRequestNo = function () {
        var timestamp = Date.now().toString();
        var random = Math.random().toString(36).substring(2, 8);
        return "".concat(timestamp, "_").concat(random).substring(0, 32);
    };
    /**
     * Valida o formato da chave RSA
     * @param key - Chave RSA
     * @returns true se a chave for válida
     */
    RSAAuth.validateRSAKey = function (key) {
        try {
            // Verifica se é uma chave privada ou pública válida
            var isPrivateKey = key.includes('BEGIN PRIVATE KEY') || key.includes('BEGIN RSA PRIVATE KEY');
            var isPublicKey = key.includes('BEGIN PUBLIC KEY') || key.includes('BEGIN RSA PUBLIC KEY');
            if (!isPrivateKey && !isPublicKey) {
                return false;
            }
            // Tenta criar um objeto de chave para validação
            if (isPrivateKey) {
                crypto.createPrivateKey(key);
            }
            else {
                crypto.createPublicKey(key);
            }
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    return RSAAuth;
}());
exports.RSAAuth = RSAAuth;
