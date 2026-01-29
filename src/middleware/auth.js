import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  req.user = data.user
  next()
}
