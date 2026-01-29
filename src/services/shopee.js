import { extractShopeeIds } from '../utils/shopee'

export async function getShopeeProductData(url) {
  const ids = extractShopeeIds(url)
  if (!ids) throw new Error('Link Shopee inválido')

  // 🔹 gerar shortLink
  const shortLink = await generateShopeeShortLink(url)

  // 🔹 buscar dados do produto
  const product = await fetchShopeeProduct(ids.shopId, ids.itemId)

  return {
    name: product.name,
    imageUrl: product.image,
    price: product.price,
    shortLink
  }
}
