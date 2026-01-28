import express from 'express'
import cors from 'cors'
import routes from './routes/router.js'
import 'dotenv/config.js'
const app = express()

app.use(express.json())
app.use('/api', routes)
const PORT = 3333

app.listen(PORT, () => {
  console.log('Server is running...')
  console.log('Server is open in PORT:' + PORT)
})
