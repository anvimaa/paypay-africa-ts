/**
 * Serviço HTTP para comunicação com a API PayPay
 * @author anvimaa
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BaseRequest, BaseResponse, PayPayConfig, PayPayNetworkError, Environment } from '../types';

export class HttpService {
  private client: AxiosInstance;
  private config: PayPayConfig;

  constructor(config: PayPayConfig) {
    this.config = config;

    const baseURL = config.baseUrl || this.getDefaultBaseUrl(config.environment);

    this.client = axios.create({
      baseURL,
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
  private getDefaultBaseUrl(environment: string): string {
    switch (environment) {
      case 'sandbox':
        return 'https://gateway.paypayafrica.com';
      case 'production':
        return 'https://gateway.paypayafrica.com';
      default:
        throw new PayPayNetworkError(`Ambiente inválido: ${environment}`);
    }
  }

  /**
   * Configura interceptors para logging e tratamento de erros
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[PayPay] Enviando requisição: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[PayPay] Erro na requisição:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[PayPay] Resposta recebida: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('[PayPay] Erro na resposta:', error);

        if (error.response) {
          throw new PayPayNetworkError(
            `Erro HTTP ${error.response.status}: ${error.response.statusText}`
          );
        } else if (error.request) {
          throw new PayPayNetworkError('Erro de rede: Não foi possível conectar à API');
        } else {
          throw new PayPayNetworkError(`Erro desconhecido: ${error.message}`);
        }
      }
    );
  }

  /**
   * Envia requisição POST para a API
   */
  async post<T = any>(endpoint: string, data: BaseRequest): Promise<BaseResponse & { biz_content: T }> {
    try {
      const response: AxiosResponse<BaseResponse & { biz_content: T }> = await this.client.post(
        endpoint,
        data
      );

      return response.data;
    } catch (error) {
      if (error instanceof PayPayNetworkError) {
        throw error;
      }
      throw new PayPayNetworkError(`Erro na comunicação: ${error}`);
    }
  }

  /**
   * Método genérico para todas as chamadas da API PayPay
   */
  async apiCall<T = any>(data: BaseRequest): Promise<BaseResponse & { biz_content: T }> {
    return this.post<T>('/recv.do', data);
  }
}

// get ip of machine
export async function getPayerIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json() as { ip: string };
    return data.ip;
  } catch (error) {
    console.warn('Failed to get external IP, using localhost:', error);
    return '127.0.0.1';
  }
}
