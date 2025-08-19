# PayPay Africa TypeScript SDK

[![npm version](https://badge.fury.io/js/paypay-africa.svg)](https://www.npmjs.com/package/paypay-africa)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Biblioteca TypeScript oficial para integração com a API do PayPay Africa - Gateway de pagamento para Angola.

## 🚀 Características

- **✨ TypeScript First**: Tipagem completa para todos os métodos e respostas
- **🔒 Segurança RSA**: Implementação completa da autenticação SHA1withRSA
- **💳 Múltiplos Métodos**: PayPay App, MULTICAIXA Express, Referência Bancária
- **🔄 Gerença Completa**: Criar, consultar, estornar e fechar pagamentos
- **✅ Validação**: Validação automática de parâmetros
- **🌍 Ambientes**: Suporte para sandbox e produção
- **📄 Documentação**: Documentação completa e exemplos práticos

## 📦 Instalação

```bash
npm install paypay-africa
```

ou

```bash
yarn add paypay-africa
```

## ⚙️ Configuração Inicial

### 1. Gerar Chaves RSA

Antes de usar a biblioteca, você precisa gerar as chaves RSA:

```bash
# Gerar chave privada
openssl genrsa -out private_key.pem 1024

# Gerar chave pública
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

### 2. Configurar no Portal PayPay

1. Faça upload da sua chave pública em [portal.paypayafrica.com](https://portal.paypayafrica.com)
2. Baixe a chave pública do PayPay
3. Obtenha seu `partner_id` no portal

### 3. Inicializar o Cliente

```typescript
import { PayPayClient, Environment, PayPayConfig } from 'paypay-africa';

const config: PayPayConfig = {
  partnerId: 'SEU_PARTNER_ID',
  privateKey: `-----BEGIN PRIVATE KEY-----
SUA_CHAVE_PRIVADA_AQUI
-----END PRIVATE KEY-----`,
  publicKey: `-----BEGIN PUBLIC KEY-----
SUA_CHAVE_PUBLICA_AQUI
-----END PUBLIC KEY-----`,
  payPayPublicKey: `-----BEGIN PUBLIC KEY-----
CHAVE_PUBLICA_DO_PAYPAY_AQUI
-----END PUBLIC KEY-----`,
  environment: Environment.SANDBOX, // ou Environment.PRODUCTION
  timeout: 30000, // opcional, padrão 30s
};

const payPayClient = new PayPayClient(config);
```

## 📚 Guia de Uso

### 📱 Pagamento com PayPay App

```typescript
import { Language, InstantTradeRequest } from 'paypay-africa';

const request: InstantTradeRequest = {
  payer_ip: '192.168.1.100',
  sale_product_code: 'PROD001',
  cashier_type: 'SDK',
  timeout_express: '30m', // opcional
  trade_info: {
    out_trade_no: `ORDER_${Date.now()}`,
    subject: 'Compra de produto',
    currency: 'AOA', // opcional, padrão AOA
    price: '1000.00',
    quantity: '1',
    total_amount: '1000.00',
    payee_identity: 'SEU_PARTNER_ID',
    payee_identity_type: '1',
  },
  return_url: 'https://meusite.com/callback', // opcional
};

try {
  const response = await payPayClient.createPaymentWithApp(request, Language.PORTUGUESE);
  
  console.log('Número da transação:', response.trade_no);
  console.log('Status:', response.status);
  console.log('Link para QR Code:', response.dynamic_link);
  
  // Para mobile: usar URL scheme
  const mobileUrl = `paypayao://trade/pay?action=pay&tradeToken=${response.trade_token}`;
  
} catch (error) {
  console.error('Erro:', error.message);
}
```

### 🏦 Pagamento com MULTICAIXA Express

```typescript
import { PayProductCode, BankCode, MulticaixaPayMethod } from 'paypay-africa';

const payMethod: MulticaixaPayMethod = {
  pay_product_code: PayProductCode.MULTICAIXA_EXPRESS,
  amount: '1500.00',
  bank_code: BankCode.MULTICAIXA,
  phone_num: '923456789', // Número registrado no MulticAIXA
};

const request: InstantTradeRequest = {
  payer_ip: '192.168.1.100',
  sale_product_code: 'PROD002',
  cashier_type: 'SDK',
  trade_info: {
    out_trade_no: `MULTICAIXA_${Date.now()}`,
    subject: 'Pagamento via MULTICAIXA Express',
    price: '1500.00',
    quantity: '1',
    total_amount: '1500.00',
    payee_identity: 'SEU_PARTNER_ID',
    payee_identity_type: '1',
  },
  pay_method: payMethod,
};

const response = await payPayClient.createPaymentWithMulticaixa(request);
```

### 🏧 Pagamento por Referência Bancária

```typescript
import { ReferencePayMethod } from 'paypay-africa';

const payMethod: ReferencePayMethod = {
  pay_product_code: PayProductCode.REFERENCE,
  amount: '2000.00',
  bank_code: BankCode.REFERENCE,
};

const request: InstantTradeRequest = {
  // ... outros parâmetros ...
  pay_method: payMethod,
};

const response = await payPayClient.createPaymentWithReference(request);
console.log('Entity ID:', response.entity_id);
console.log('Reference ID:', response.reference_id);
```

### 🔍 Consultar Status do Pagamento

```typescript
const response = await payPayClient.queryPayment({
  out_trade_no: 'ORDER_1234567890'
});

console.log('Status:', response.status); // 'S' = Sucesso, 'P' = Processando, 'F' = Falha
```

### ↩️ Estorno (Total ou Parcial)

```typescript
const response = await payPayClient.refundPayment({
  out_trade_no: `REFUND_${Date.now()}`,
  orig_out_trade_no: 'ORDER_1234567890', // Pedido original
  refund_amount: '500.00', // Valor do estorno
});
```

### ❌ Fechar Pagamento

```typescript
const response = await payPayClient.closePayment({
  out_trade_no: 'ORDER_1234567890'
});
```

## 📄 Interfaces TypeScript

### PayPayConfig

```typescript
interface PayPayConfig {
  partnerId: string;
  privateKey: string;
  publicKey: string;
  payPayPublicKey: string;
  environment: 'sandbox' | 'production';
  timeout?: number;
  baseUrl?: string;
}
```

### InstantTradeRequest

```typescript
interface InstantTradeRequest {
  payer_ip: string;           // IP do comprador
  sale_product_code: string;  // Código do produto
  cashier_type: 'SDK';        // Sempre 'SDK'
  timeout_express?: string;   // Ex: '30m', '2h', '1d'
  trade_info: TradeInfo;
  return_url?: string;        // URL de retorno
  pay_method?: PayMethod;     // Para MULTICAIXA/Referência
}
```

### TradeInfo

```typescript
interface TradeInfo {
  out_trade_no: string;         // Número único do pedido
  subject: string;              // Descrição do produto/serviço
  currency?: string;            // Moeda (padrão: 'AOA')
  price: string;                // Preço unitário
  quantity: string;             // Quantidade
  total_amount: string;         // Valor total
  payee_identity: string;       // Seu partner_id
  payee_identity_type: '1';     // Sempre '1'
}
```

## ⚠️ Tratamento de Erros

```typescript
import { PayPayError, PayPayValidationError, PayPayNetworkError } from 'paypay-africa';

try {
  const response = await payPayClient.createPaymentWithApp(request);
} catch (error) {
  if (error instanceof PayPayValidationError) {
    console.error('Erro de validação:', error.message);
  } else if (error instanceof PayPayNetworkError) {
    console.error('Erro de rede:', error.message);
  } else if (error instanceof PayPayError) {
    console.error('Erro da API:', error.message, 'Código:', error.code);
  } else {
    console.error('Erro desconhecido:', error);
  }
}
```

## 🌍 Ambientes

### Sandbox (Teste)
```typescript
environment: Environment.SANDBOX
// URL: https://sandbox-api.paypayafrica.com
```

### Produção
```typescript
environment: Environment.PRODUCTION
// URL: https://api.paypayafrica.com
```

## 📝 Status de Transação

| Status | Descrição |
|--------|------------|
| `S` | Sucesso - Pagamento concluído |
| `P` | Processando - Aguardando confirmação |
| `F` | Falha - Pagamento não foi concluído |

## 🔗 Links Úteis

- [Portal PayPay Africa](https://portal.paypayafrica.com)
- [Documentação Oficial da API](https://portal.paypayafrica.com/passport/apidoc/guide)
- [Exemplos Completos](./examples/)

## 🛠️ Desenvolvimento

```bash
# Clonar o repositório
git clone https://github.com/your-username/paypay-africa-ts.git

# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar em modo de desenvolvimento
npm run dev

# Executar testes
npm test
```

## 📜 Estrutura do Projeto

```
paypay-africa-ts/
├── src/
│   ├── types/              # Interfaces TypeScript
│   ├── auth/               # Sistema de autenticação RSA
│   ├── services/           # Serviços HTTP
│   ├── paypay-client.ts    # Cliente principal
│   └── index.ts            # Exports principais
├── examples/            # Exemplos de uso
├── dist/                # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 Licença

MIT License - consulte o arquivo [LICENSE](LICENSE) para detalhes.

## 🚀 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico:
- Email: suporte@paypayafrica.com
- Portal: [portal.paypayafrica.com](https://portal.paypayafrica.com)

---

**Desenvolvido por @anvimaa** - Biblioteca não oficial para integração com PayPay Africa