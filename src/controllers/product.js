import crypto from 'crypto'
import { supabase } from '../lib/supabase/supabase.js'
import { prisma } from '../lib/prisma/prisma.js'
import { generateShopeeShortLink } from '../services/shopee.js'

export async function createProduct(req, res) {
  try {
    const { name, suggestion_price, link_shopee, category_product } = req.body
    const file = req.file

    if (!name || !suggestion_price || !link_shopee || !category_product) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando' })
    }

    if (!file) {
      return res.status(400).json({ error: 'Imagem obrigatória' })
    }

    // 🔹 gerar shortLink afiliado
    const shortLink = await generateShopeeShortLink(link_shopee)

    // 🔹 upload imagem
    const fileName = `img/${crypto.randomUUID()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('img')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype
      })

    if (uploadError) {
      return res.status(500).json({ error: 'Erro ao enviar imagem' })
    }

    const image_url = supabase.storage.from('img').getPublicUrl(fileName)
      .data.publicUrl

    // 🔹 salvar produto
    const product = await prisma.product.create({
      data: {
        name,
        suggestion_price: Number(suggestion_price),
        image_url,
        link_shopee: shortLink,
        category_product
      }
    })

    return res.status(201).json(product)
  } catch (error) {
    console.error('createProduct error:', error)
    return res.status(500).json({ error: 'Erro ao criar produto' })
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

export async function selectProduct(req, res) {
  try {
    const userId = req.user.id
    const { id } = req.params

    const product = await prisma.product.findUnique({ where: { id } })

    if (!product || !product.is_active) {
      return res.status(400).json({ error: 'Indisponível' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId }
    })

    const updated = await prisma.product.update({
      where: { id },
      data: {
        is_active: false,
        selected_by: { connect: { id: userId } },
        selected_at: new Date()
      }
    })

    res.json(updated)
  } catch (err) {
    console.error('SELECT PRODUCT ERROR:', err)
    res.status(500).json({ error: 'Erro interno', details: err.message })
  }
}

export async function myPresents(req, res) {
  try {
    const userId = req.user.id

    const products = await prisma.product.findMany({
      where: {
        selected_by_id: userId
      },
      orderBy: {
        selected_at: 'desc'
      }
    })

    return res.json({ data: products })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao buscar presentes' })
  }
}

export async function unselectProduct(req, res) {
  try {
    const userId = req.user.id
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    // 🔒 só quem selecionou pode remover
    if (product.selected_by_id !== userId) {
      return res.status(403).json({ error: 'Ação não permitida' })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        is_active: true,
        selected_by: {
          disconnect: true // remove a relação
        },
        selected_at: null
      }
    })

    return res.json(updated)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao remover seleção' })
  }
}
