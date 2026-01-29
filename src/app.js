import express from 'express'
import cors from 'cors'
import routes from './routes/router.js'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://seu-front-em-producao.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

app.use(express.json())
app.use('/api', routes)

export default app
