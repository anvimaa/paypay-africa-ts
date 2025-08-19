# Guia de Build e Deploy

## Build Local

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Verificar se a compilação foi bem-sucedida
ls -la dist/
```

## Testes

```bash
# Executar testes (quando implementados)
npm test

# Executar testes com coverage
npm run test:coverage
```

## Publicação no NPM

```bash
# 1. Fazer login no NPM
npm login

# 2. Verificar se o package.json está correto
npm run build

# 3. Publicar
npm publish
```

## Uso em Outros Projetos

```bash
# Instalar a biblioteca
npm install paypay-africa

# Ou com yarn
yarn add paypay-africa
```

## Variáveis de Ambiente Recomendadas

Crie um arquivo `.env` no seu projeto:

```env
PAYPAY_PARTNER_ID=seu_partner_id_aqui
PAYPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"
PAYPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nSUA_CHAVE_PUBLICA_AQUI\n-----END PUBLIC KEY-----"
PAYPAY_PUBLIC_KEY_PAYPAY="-----BEGIN PUBLIC KEY-----\nCHAVE_PUBLICA_DO_PAYPAY_AQUI\n-----END PUBLIC KEY-----"
PAYPAY_ENVIRONMENT=sandbox
```