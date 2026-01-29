export function auth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  const [, userId] = authHeader.split(' ')

  if (!userId) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  // 🔹 injeta user no request
  req.user = {
    id: userId
  }

  next()
}
