/**
 * Utilitários para validação de parâmetros
 * @author anvimaa
 */

import { PayPayValidationError, Language, PayMethod, PayProductCode, BankCode } from '../types';

export class ValidationUtils {
  /**
   * Valida se um valor é obrigatório e não está vazio
   */
  static required(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new PayPayValidationError(`Campo obrigatório: ${fieldName}`);
    }
  }

  /**
   * Valida o comprimento de uma string
   */
  static validateLength(value: string, min: number, max: number, fieldName: string): void {
    if (value.length < min || value.length > max) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve ter entre ${min} e ${max} caracteres`
      );
    }
  }

  /**
   * Valida se é um número válido com até 2 casas decimais
   */
  static amount(value: string, fieldName: string): void {
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(value)) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve ser um valor numérico válido com até 2 casas decimais`
      );
    }

    const numValue = parseFloat(value);
    if (numValue < 0.01 || numValue > 999999999999.99) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve estar entre 0.01 e 999999999999.99`
      );
    }
  }

  /**
   * Valida formato de IP
   */
  static ip(value: string, fieldName: string): void {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(value)) {
      throw new PayPayValidationError(`Campo ${fieldName} deve ser um IP válido`);
    }
  }

  /**
   * Valida formato de telefone angolano (9 dígitos)
   */
  static phoneNumber(value: string, fieldName: string): void {
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(value)) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve ter 9 dígitos numéricos`
      );
    }
  }

  /**
   * Valida formato de moeda (3 caracteres)
   */
  static currency(value: string, fieldName: string): void {
    if (value.length !== 3) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve ter exatamente 3 caracteres`
      );
    }
  }

  /**
   * Valida se o idioma é suportado
   */
  static language(value: string, fieldName: string): void {
    if (!Object.values(Language).includes(value as Language)) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve ser 'pt' ou 'en'`
      );
    }
  }

  /**
   * Valida formato de timeout (40m ~ 7d)
   */
  static timeout(value: string, fieldName: string): void {
    const timeoutRegex = /^\d+[mhd]$/i;
    if (!timeoutRegex.test(value)) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve estar no formato: número + unidade (m/h/d)`
      );
    }

    const unit = value.slice(-1).toLowerCase();
    const num = parseInt(value.slice(0, -1));

    // Validar limites
    if (unit === 'm' && num < 40) {
      throw new PayPayValidationError(
        `Campo ${fieldName}: mínimo 40 minutos`
      );
    }
    if (unit === 'd' && num > 7) {
      throw new PayPayValidationError(
        `Campo ${fieldName}: máximo 7 dias`
      );
    }
  }

  /**
   * Valida URL
   */
  static url(value: string, fieldName: string): void {
    try {
      new URL(value);
    } catch {
      throw new PayPayValidationError(`Campo ${fieldName} deve ser uma URL válida`);
    }
  }

  /**
   * Valida método de pagamento
   */
  static payMethod(payMethod: PayMethod, fieldName: string): void {
    this.required(payMethod.pay_product_code, `${fieldName}.pay_product_code`);
    this.required(payMethod.amount, `${fieldName}.amount`);
    this.amount(payMethod.amount, `${fieldName}.amount`);

    if (payMethod.pay_product_code === PayProductCode.MULTICAIXA_EXPRESS) {
      const multicaixa = payMethod as any;
      this.required(multicaixa.phone_num, `${fieldName}.phone_num`);
      this.phoneNumber(multicaixa.phone_num, `${fieldName}.phone_num`);

      if (multicaixa.bank_code && multicaixa.bank_code !== BankCode.MULTICAIXA) {
        throw new PayPayValidationError(
          `${fieldName}.bank_code deve ser 'MUL' para MULTICAIXA Express`
        );
      }
    }

    if (payMethod.pay_product_code === PayProductCode.REFERENCE) {
      const reference = payMethod as any;
      if (reference.bank_code && reference.bank_code !== BankCode.REFERENCE) {
        throw new PayPayValidationError(
          `${fieldName}.bank_code deve ser 'REF' para pagamento por referência`
        );
      }
    }
  }

  /**
   * Valida formato alfanumérico com sublinhado
   */
  static alphanumericUnderscore(value: string, fieldName: string): void {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(value)) {
      throw new PayPayValidationError(
        `Campo ${fieldName} deve conter apenas caracteres alfanuméricos e sublinhado`
      );
    }
  }
}