import { extractShopeeIds } from '../utils/shopee.js'

const SHOPEE_GRAPHQL = 'https://open-api.affiliate.shopee.com.br/graphql'

const SHOPEE_PRODUCT_API =
  'https://open-api.affiliate.shopee.com.br/product/get'

export async function getShopeeProductData(url) {
  // 1️⃣ valida URL
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida')
  }

  // 2️⃣ extrai IDs
  const ids = extractShopeeIds(url)
  if (!ids) {
    throw new Error('Link Shopee inválido')
  }

  // 3️⃣ valida token
  if (!process.env.SHOPEE_AUTH) {
    throw new Error('SHOPEE_AUTH não configurado')
  }

  // 4️⃣ gera shortLink
  const shortLink = await generateShopeeShortLink(url)

  // 5️⃣ busca dados do produto
  const product = await fetchShopeeProduct(ids.shopId, ids.itemId)

  return {
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    shortLink
  }
}

async function generateShopeeShortLink(originUrl) {
  const response = await fetch(SHOPEE_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.SHOPEE_AUTH
    },
    body: JSON.stringify({
      query: `
        mutation {
          generateShortLink(
            input: {
              originUrl: "${originUrl}",
              subIds: ["wishlist"]
            }
          ) {
            shortLink
          }
        }
      `
    })
  })

  const data = await response.json()

  const shortLink = data?.data?.generateShortLink?.shortLink

  if (!shortLink) {
    throw new Error('Erro ao gerar shortLink Shopee')
  }

  return shortLink
}

async function fetchShopeeProduct(shopId, itemId) {
  const response = await fetch(SHOPEE_PRODUCT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.SHOPEE_AUTH
    },
    body: JSON.stringify({
      shop_id: shopId,
      item_id: itemId
    })
  })

  const data = await response.json()
  const item = data?.item

  if (!item) {
    throw new Error('Produto não encontrado na Shopee')
  }

  return {
    name: item.name,
    imageUrl: item.images?.[0],
    price: item.price / 100000
  }
}
