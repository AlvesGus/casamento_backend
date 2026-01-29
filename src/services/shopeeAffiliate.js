import crypto from 'crypto'

const API_URL = 'https://open-api.affiliate.shopee.com.br/graphql'

const PARTNER_ID = process.env.SHOPEE_APP_ID
const PARTNER_KEY = process.env.SHOPEE_SECRET

if (!PARTNER_ID || !PARTNER_KEY) {
  throw new Error('Shopee Affiliate credenciais não configuradas')
}

// Gera assinatura obrigatória da Shopee
function generateAuthHeader(payload, timestamp) {
  // payload precisa estar na mesma forma que será enviado
  const base = PARTNER_ID + timestamp + JSON.stringify(payload) + PARTNER_KEY

  const signature = crypto.createHash('sha256').update(base).digest('hex')

  return `SHA256 Credential=${PARTNER_ID}, Signature=${signature}, Timestamp=${timestamp}`
}

export async function generateShopeeShortLink(originUrl) {
  const timestamp = Math.floor(Date.now() / 1000)

  const payload = {
    query: `
      mutation {
        generateShortLink(input:{originUrl:"${originUrl}", subIds:["affiliate"]}) {
          shortLink
        }
      }
    `
  }

  const auth = generateAuthHeader(payload, timestamp)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok || !data.data?.generateShortLink?.shortLink) {
    console.error('Shopee Affiliate falhou:', data)
    throw new Error('Erro ao gerar shortLink Shopee')
  }

  return data.data.generateShortLink.shortLink
}
