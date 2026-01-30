import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    // Pega usuário pelo token
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      console.log('Supabase auth error:', error)
      return res.status(401).json({ error: 'Não autorizado' })
    }

    req.user = data.user
    next()
  } catch (err) {
    console.error('Erro no middleware auth:', err)
    return res.status(500).json({ error: 'Erro interno no auth' })
  }
}
