import express from 'express'
import { upload } from '../middleware/upload.js'
import {
  createProduct,
  listProducts,
  deleteProduct,
  selectProduct,
  unselectProduct,
  createFromShopee
} from '../controllers/product.js'
import handler from '../../api/shopee.js'

const routes = express.Router()
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

routes.post('/products', upload.single('image'), createProduct)
routes.get('/list-products', listProducts)
routes.delete('/products/:id', deleteProduct)
routes.patch('/products/:id/select', selectProduct)
routes.patch('/products/:id/unselect', unselectProduct)
routes.post('/products/from-shopee', createFromShopee)

routes.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' })
})

export default routes
