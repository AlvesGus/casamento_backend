function extractShopeeIds(url) {
  const match = url.match(/-i\.(\d+)\.(\d+)/)

  if (!match) return null

  return {
    shopId: match[1],
    itemId: match[2]
  }
}

export default async function handler(req, res) {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL obrigatória' })
    }

    // 1️⃣ extrair ids
    const ids = extractShopeeIds(url)

    if (!ids) {
      return res.status(400).json({ error: 'Link inválido' })
    }

    // 2️⃣ gerar shortLink
    const shortLinkResponse = await fetch(
      'https://open-api.affiliate.shopee.com.br/graphql',
      {
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
                  originUrl: "${url}",
                  subIds: ["s1"]
                }
              ) {
                shortLink
              }
            }
          `
        })
      }
    )

    const shortLinkData = await shortLinkResponse.json()

    const shortLink = shortLinkData?.data?.generateShortLink?.shortLink

    // 3️⃣ buscar imagem do produto
    const productResponse = await fetch(
      'https://open-api.affiliate.shopee.com.br/product/get',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.SHOPEE_AUTH
        },
        body: JSON.stringify({
          shop_id: ids.shopId,
          item_id: ids.itemId
        })
      }
    )

    const productData = await productResponse.json()

    const product = productData.item

    const name = product.name
    const imageUrl = product.images[0]

    // preço vem em centavos normalmente
    const price = product.price / 100000

    return res.status(200).json({
      name,
      price,
      imageUrl,
      shortLink
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno' })
  }
}
