import express from 'express'
import { upload } from '../middleware/upload.js'
import {
  createProduct,
  deleteProduct,
  listProducts
} from '../controllers/product.js'

const routes = express.Router()

routes.post('/products', upload.single('image'), createProduct)
routes.get('/list-products', listProducts)
routes.delete('/products/:id', deleteProduct)

routes.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' })
})

export default routes
