/**
 * Sistema de autenticação RSA para PayPay Africa
 * @author anvimaa
 */

import * as crypto from 'crypto';
import { PayPayAuthenticationError } from '../types';

export class RSAAuth {
  private privateKey: string;
  private publicKey: string;
  private payPayPublicKey: string;

  constructor(privateKey: string, publicKey: string, payPayPublicKey: string) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.payPayPublicKey = payPayPublicKey;
  }

  /**
   * Criptografa o conteúdo usando a chave privada RSA
   * @param content - Conteúdo a ser criptografado
   * @returns Conteúdo criptografado em base64
   */
  encryptContent(content: string): string {
    try {
      const buffer = Buffer.from(content, 'utf8');
      const encrypted = crypto.privateEncrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer
      );
      return encrypted.toString('base64');
    } catch (error) {
      throw new PayPayAuthenticationError(`Erro ao criptografar conteúdo: ${error}`);
    }
  }

  /**
   * Gera assinatura SHA1withRSA para os parâmetros
   * @param params - Parâmetros da requisição (exceto sign e sign_type)
   * @returns Assinatura em base64
   */
  generateSignature(params: Record<string, any>): string {
    try {
      // Ordenar parâmetros em ASCII (exceto sign e sign_type)
      const filteredParams = Object.keys(params)
        .filter(key => key !== 'sign' && key !== 'sign_type')
        .sort()
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {} as Record<string, any>);

      // Concatenar como pares chave-valor
      const queryString = Object.entries(filteredParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      // Gerar assinatura SHA1withRSA
      const sign = crypto.createSign('SHA1');
      sign.update(queryString, 'utf8');
      const signature = sign.sign(this.privateKey, 'base64');

      return signature;
    } catch (error) {
      throw new PayPayAuthenticationError(`Erro ao gerar assinatura: ${error}`);
    }
  }

  /**
   * Valida a assinatura da resposta usando a chave pública do PayPay
   * @param params - Parâmetros da resposta
   * @param signature - Assinatura a ser validada
   * @returns true se a assinatura for válida
   */
  verifySignature(params: Record<string, any>, signature: string): boolean {
    try {
      // Filtrar e ordenar parâmetros (exceto sign e sign_type)
      const filteredParams = Object.keys(params)
        .filter(key => key !== 'sign' && key !== 'sign_type')
        .sort()
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {} as Record<string, any>);

      // Concatenar como pares chave-valor
      const queryString = Object.entries(filteredParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      // Verificar assinatura
      const verify = crypto.createVerify('SHA1');
      verify.update(queryString, 'utf8');

      return verify.verify(this.payPayPublicKey, signature, 'base64');
    } catch (error) {
      throw new PayPayAuthenticationError(`Erro ao verificar assinatura: ${error}`);
    }
  }

  /**
   * Aplica URL encoding nos valores do objeto JSON
   * @param obj - Objeto a ser codificado
   * @returns Objeto com valores codificados
   */
  static urlEncodeValues(obj: Record<string, any>): Record<string, any> {
    const encoded: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        encoded[key] = encodeURIComponent(value);
      } else if (typeof value === 'object' && value !== null) {
        encoded[key] = this.urlEncodeValues(value);
      } else {
        encoded[key] = value;
      }
    }

    return encoded;
  }

  /**
   * Gera timestamp no formato exigido pela API (yyyy-MM-dd HH:mm:ss)
   * @param date - Data (opcional, padrão: agora)
   * @returns Timestamp formatado
   */
  static generateTimestamp(date?: Date): string {
    const now = date || new Date();

    // PayPay usa GMT+1, então ajustamos
    const gmtPlus1 = new Date(now.getTime() + (1 * 60 * 60 * 1000));

    const year = gmtPlus1.getFullYear();
    const month = String(gmtPlus1.getMonth() + 1).padStart(2, '0');
    const day = String(gmtPlus1.getDate()).padStart(2, '0');
    const hours = String(gmtPlus1.getHours()).padStart(2, '0');
    const minutes = String(gmtPlus1.getMinutes()).padStart(2, '0');
    const seconds = String(gmtPlus1.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Gera um request_no único (alfanumérico, 6-32 caracteres)
   * @returns Request number único
   */
  static generateRequestNo(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}`.substring(0, 32);
  }

  /**
   * Valida o formato da chave RSA
   * @param key - Chave RSA
   * @returns true se a chave for válida
   */
  static validateRSAKey(key: string): boolean {
    try {
      // Verifica se é uma chave privada ou pública válida
      const isPrivateKey = key.includes('BEGIN PRIVATE KEY') || key.includes('BEGIN RSA PRIVATE KEY');
      const isPublicKey = key.includes('BEGIN PUBLIC KEY') || key.includes('BEGIN RSA PUBLIC KEY');

      if (!isPrivateKey && !isPublicKey) {
        return false;
      }

      // Tenta criar um objeto de chave para validação
      if (isPrivateKey) {
        crypto.createPrivateKey(key);
      } else {
        crypto.createPublicKey(key);
      }

      return true;
    } catch {
      return false;
    }
  }
}