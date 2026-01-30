import { supabase } from '../lib/supabase/supabase.js'

export async function ensureAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' })
  }

  const token = authHeader.replace('Bearer ', '')

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  req.user = data.user
  await ensureUserExists(data.user)
  next()
}

async function ensureUserExists(supabaseUser) {
  const user = await prisma.user.findUnique({
    where: { id: supabaseUser.id }
  })

  if (!user) {
    await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email
      }
    })
  }
}
