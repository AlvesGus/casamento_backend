import { supabase } from '../lib/supabase/supabase.js'
import { prisma } from '../lib/prisma/prisma.js'
import crypto from 'crypto'

export async function createProduct(req, res) {
  try {
    const { name, suggestion_price, link_shopee, category_product } = req.body

    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'Imagem obrigatória' })
    }

    const fileName = `img/${crypto.randomUUID()}.jpg`

    const { error } = await supabase.storage
      .from('img')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      })

    if (error) {
      return res
        .status(500)
        .json({ error: 'Erro ao enviar imagem', details: error.message })
    }

    const image_url = supabase.storage.from('img').getPublicUrl(fileName)
      .data.publicUrl

    const product = await prisma.product.create({
      data: {
        name,
        suggestion_price: Number(suggestion_price),
        image_url,
        link_shopee,
        category_product
      }
    })

    return res.status(201).json(product)
  } catch (error) {
    console.log(error)
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params

  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    const bucketName = 'img'

    const parts = product.image_url.split(`/public/${bucketName}/`)
    const filePath = parts[1]

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath])

      if (storageError) {
        console.error('Erro ao deletar no Supabase:', storageError)
      }
    }

    await prisma.product.delete({
      where: { id }
    })

    return res
      .status(200)
      .json({ message: 'Produto e imagem excluídos com sucesso' })
  } catch (error) {
    console.error('Erro na função deleteProduct:', error)
    return res.status(500).json({ error: 'Erro interno ao excluir produto' })
  }
}

export async function listProducts(req, res) {
  const { category, max_price, order } = req.query

  const validCategories = [
    'Cozinha',
    'Sala',
    'Ferramentas',
    'Banheiro',
    'Outros'
  ]

  if (category && validCategories.includes(category)) {
    where.category_product = category
  }

  try {
    const where = {
      is_active: true
    }

    // filtro por categoria
    if (category) {
      where.category_product = category
    }

    // filtro por preço máximo
    if (max_price) {
      where.suggestion_price = {
        lte: Number(max_price)
      }
    }

    // ordenação
    const orderBy =
      order === 'asc' || order === 'desc'
        ? { suggestion_price: order }
        : { created_at: 'desc' } // padrão

    const products = await prisma.product.findMany({
      where,
      orderBy
    })

    return res.status(200).json({ data: products })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}
