import express from 'express'
import cors from 'cors'
import routes from './routes/router.js'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://cha-de-panelas-frontend.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use(express.json())
app.use('/api', routes)

export default app
