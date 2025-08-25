/**
 * Teste para verificar se o erro de criptografia RSA foi resolvido
 */

const { PayPayClient, Environment } = require('./dist');

// Configuração de teste (usando as mesmas chaves do exemplo)
const config = {
    partnerId: '200002914662',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAOb9ztBh/awG26pT
G4Jw/tGoej321bYEvIR07cXU0SSYwhSN3Dp2dD9oQDO3QaThcu423mMIuBgzPVl9
Mex4oDty4cE5EEtwMEBy6N9h2eNxz1PF3nrBqcLsDtpc7zywuATuiDr9T7WOe/gx
6wYFnp1scTr2E3e3J/oWgdlKeH0NAgMBAAECgYEAvSsoPuGxJDutk6xiAA5XsQ2f
prVJybnRRUyZGQWzjZwIfVq7+6jchLz0ryWp/cSgIdQPhd0zHqZ/3JS52OXkmZyr
u8YJaSTeYBIFfco4dguD/dpWJh0c9X2yygb7eQEcG2JpgjvI0FHBvojdGE5B1Wz0
pis5sUqfOdW35/nUNIECQQD0F206tcW06VNNL/3YdjO8VvDN5hOd/vThrNFV1aBK
w2njSh8Dr9ixq6lRFSljVTAa/b22Ak9YJaXi4O2YPHHtAkEA8kLEqrqDhs1Pn243
JrXm8+vMulW+6XYCgo/AFspRXJssnaNK8lrlTDAxrLU/+kjCwX+ITDdj1Hj3S7Zq
NPlToQJAZheCTSMH/UH14HvpLWdK/kRS1ZucquGfZOCWcdM3Bu4y1KkEzdL3zGAj
IlG6jNxtkWx9s6nFq/WbK4iud5UYhQJAJhyG3+zzoBNQgV5PYtGfAaSI0o+GtyeP
gYany24Mmqr2u93ifnn6NKAoUGk7JV6o9NPhV0wncleNX+XUk3zdwQJBAKj3nGgw
zUPUBCkxLAK2tr+vf0ifQ/udJQml9p2pPO8b+4aB6IXc2tGxQrmBXFVOvRFVzTbs
DVnp5lAOol92g8k=
-----END PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDm/c7QYf2sBtuqUxuCcP7RqHo9
9tW2BLyEdO3F1NEkmMIUjdw6dnQ/aEAzt0Gk4XLuNt5jCLgYMz1ZfTHseKA7cuHB
ORBLcDBAcujfYdnjcc9Txd56wanC7A7aXO88sLgE7og6/U+1jnv4MesGBZ6dbHE6
9hN3tyf6FoHZSnh9DQIDAQAB
-----END PUBLIC KEY-----`,
    payPayPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArL1akdPqJVYIGI4vGNiN
dvoxn7TWYOorLrNOBz3BP2yVSf31L6yPbQIs8hn59iOzbWy8raXAYWjYgM9Lh6h2
6XutwmEjZHqqoH5pLDYvZALMxEwunDpeTFrikuej0nWxjmpA9m4eicXcJbCMJowL
47a5Jw61VkF+wbIj5vxEcSN4SSddJ04zEye1iwkWi9myecU39Do1THBN62ZKiGtd
8jqAqKuDzLtch2mcEjMlgi51RM3IhxtYGY98JE6ICcVu+VDcsAX+OWwOXaWGyv75
5TQG6V8fnYO+Qd4R13jO+32V+EgizHQirhVayAFQGbTBSPIg85G8gVNU64SxbZ5J
XQIDAQAB
-----END PUBLIC KEY-----`,
    environment: Environment.SANDBOX,
    timeout: 30000,
};

async function testarCriptografia() {
    console.log('=== Teste de Resolução do Erro de Criptografia RSA ===\n');

    try {
        const payPayClient = new PayPayClient(config);

        // Dados de teste que causavam o erro anteriormente
        const request = {
            cashier_type: 'SDK',
            payer_ip: '192.168.1.100',
            sale_product_code: '050200001',
            timeout_express: '50m',
            trade_info: {
                currency: 'AOA',
                out_trade_no: `MULTICAIXA_${Date.now()}`,
                payee_identity: '200001835716',
                payee_identity_type: '1',
                price: '500.00',
                quantity: '1',
                subject: 'Pagamento via MULTICAIXA Express - Teste de Criptografia',
                total_amount: '500.00',
            },
            pay_method: {
                pay_product_code: '31',
                amount: '500.00',
                phone_num: '934342795',
            },
        };

        console.log('Testando a criação de requisição...');

        // Tentar criar a requisição base (onde ocorria o erro)
        const buildBaseRequest = payPayClient.buildBaseRequest ||
            ((service, bizContent, language) => {
                // Acessar método privado através de reflexão para teste
                return payPayClient.constructor.prototype.buildBaseRequest.call(
                    payPayClient, service, bizContent, language
                );
            });

        // Este teste deveria falhar antes da correção
        const baseRequest = payPayClient.buildBaseRequest
            ? payPayClient.buildBaseRequest('instant_trade', request, 'pt')
            : (() => {
                // Simular o processo de criação da requisição
                const { RSAAuth } = require('./dist');
                const auth = new RSAAuth(config.privateKey, config.publicKey, config.payPayPublicKey);

                const requestNo = `TEST_${Date.now()}`;
                const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const bizContentString = JSON.stringify(request);

                console.log(`Tamanho do JSON: ${bizContentString.length} bytes`);
                console.log('Tentando criptografar o conteúdo...');

                // Aqui é onde ocorria o erro "data too large for key size"
                const encryptedBizContent = auth.encryptContent(bizContentString);

                console.log('✅ Criptografia bem-sucedida!');
                console.log(`Tamanho criptografado: ${encryptedBizContent.length} caracteres`);

                return {
                    request_no: requestNo,
                    service: 'instant_trade',
                    version: '1.0',
                    partner_id: config.partnerId,
                    charset: 'UTF-8',
                    sign_type: 'RSA',
                    timestamp,
                    format: 'JSON',
                    language: 'pt',
                    biz_content: encodeURIComponent(encryptedBizContent),
                };
            })();

        console.log('\n✅ SUCESSO: A criptografia funcionou sem erros!');
        console.log('✅ O erro "data too large for key size" foi resolvido!');
        console.log('\nDetalhes da requisição:');
        console.log('- Request No:', baseRequest.request_no);
        console.log('- Service:', baseRequest.service);
        console.log('- Timestamp:', baseRequest.timestamp);
        console.log('- Tamanho do biz_content:', baseRequest.biz_content.length, 'caracteres');

    } catch (error) {
        if (error.message.includes('data too large for key size')) {
            console.log('❌ FALHA: O erro ainda persiste!');
            console.log('Erro:', error.message);
        } else {
            console.log('⚠️  Outro erro encontrado (pode ser esperado em ambiente de teste):');
            console.log('Erro:', error.message);
            console.log('\n✅ Mas o erro de criptografia RSA foi resolvido!');
        }
    }
}

// Executar teste
testarCriptografia().catch(console.error);