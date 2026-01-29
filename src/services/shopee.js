import { generateShopeeShortLink } from './shopeeAffiliate.js'

export async function getShopeeProductData(url) {
  // Validação básica
  if (!url.includes('shopee')) {
    throw new Error('Link não parece Shopee válido')
  }

  const shortLink = await generateShopeeShortLink(url)

  // Obs: a API Affiliate não retorna nome/imagem/preço
  // Você pode expandir isso depois (via scraping ou outro endpoint)
  return {
    name: 'Produto Shopee', // você pode permitir override manual
    imageUrl: '', // adicionar se quiser scrape
    price: 0, // adicionar lógica de preço se necessário
    shortLink
  }
}
