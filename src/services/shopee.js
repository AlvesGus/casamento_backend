import crypto from 'crypto'

const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.com.br/graphql'
const APP_ID = process.env.SHOPEE_APP_ID
const SECRET = process.env.SHOPEE_SECRET

function generateAuthorization(payload) {
  const timestamp = Math.floor(Date.now() / 1000)

  const baseString = APP_ID + timestamp + JSON.stringify(payload) + SECRET

  const signature = crypto.createHash('sha256').update(baseString).digest('hex')

  return {
    authorization: `SHA256 Credential=${APP_ID}, Signature=${signature}, Timestamp=${timestamp}`,
    timestamp
  }
}

export async function generateShopeeShortLink(originalUrl) {
  const payload = {
    query: `
      mutation GenerateShortLink($url: String!) {
        generateShortLink(url: $url) {
          shortLink
        }
      }
    `,
    variables: {
      url: originalUrl
    }
  }

  const { authorization } = generateAuthorization(payload)

  const response = await fetch(SHOPEE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(errorText)
    throw new Error('Erro ao gerar shortLink Shopee')
  }

  const data = await response.json()

  return data.data.generateShortLink.shortLink
}
