import { supabase } from '../lib/supabase/supabase.js'

export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não informado' })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    req.user = data.user // 👈 ISSO É CRÍTICO
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Não autorizado' })
  }
}
