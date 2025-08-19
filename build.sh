#!/bin/bash

# Script para build e teste da biblioteca PayPay Africa

echo "=== Iniciando build da biblioteca PayPay Africa ==="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Erro: npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Instalar dependências
echo "\n=== Instalando dependências ==="
npm install

if [ $? -ne 0 ]; then
    echo "Erro: Falha ao instalar dependências"
    exit 1
fi

# Compilar TypeScript
echo "\n=== Compilando TypeScript ==="
npm run build

if [ $? -ne 0 ]; then
    echo "Erro: Falha na compilação TypeScript"
    exit 1
fi

# Verificar se os arquivos foram gerados
echo "\n=== Verificando arquivos gerados ==="
if [ -d "dist" ]; then
    echo "✅ Diretório dist/ criado com sucesso"
    echo "Arquivos gerados:"
    ls -la dist/
else
    echo "❌ Diretório dist/ não foi criado"
    exit 1
fi

# Verificar se o arquivo principal existe
if [ -f "dist/index.js" ]; then
    echo "✅ Arquivo principal index.js gerado"
else
    echo "❌ Arquivo principal index.js não encontrado"
    exit 1
fi

# Verificar se os tipos foram gerados
if [ -f "dist/index.d.ts" ]; then
    echo "✅ Arquivos de tipo TypeScript gerados"
else
    echo "❌ Arquivos de tipo TypeScript não encontrados"
    exit 1
fi

echo "\n=== Build concluído com sucesso! ==="
echo "\nPróximos passos:"
echo "1. Testar a biblioteca: npm test (quando os testes estiverem implementados)"
echo "2. Publicar no npm: npm publish"
echo "3. Usar em outros projetos: npm install paypay-africa"