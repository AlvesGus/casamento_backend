import crypto from 'crypto'
import fetch from 'node-fetch'

const API_URL = 'https://open-api.affiliate.shopee.com.br/graphql'

export async function generateShopeeShortLink(originUrl, userId) {
  const appId = process.env.SHOPEE_APP_ID
  const secret = process.env.SHOPEE_SECRET
  const userId = 'gus&grazi'

  const timestamp = Math.floor(Date.now() / 1000).toString()

  const payload = JSON.stringify({
    query: `
      mutation {
        generateShortLink(
          input: {
            originUrl: "${originUrl}"
            subAffiliateId: "${userId}"
          }
        ) {
          shortLink
        }
      }
    `
  })

  const signature = crypto
    .createHash('sha256')
    .update(appId + timestamp + payload + secret)
    .digest('hex')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `SHA256 Credential=${appId}, Signature=${signature}, Timestamp=${timestamp}`
    },
    body: payload
  })

  const json = await response.json()

  if (!json?.data?.generateShortLink?.shortLink) {
    console.error(json)
    throw new Error('Erro ao gerar shortLink Shopee')
  }

  return json.data.generateShortLink.shortLink
}
