import express from 'express'
import { upload } from '../middleware/upload.js'
import {
  createProduct,
  listProducts,
  deleteProduct,
  selectProduct,
  unselectProduct,
  myPresents
} from '../controllers/product.js'
import { auth } from '../middleware/auth.js'

const routes = express.Router()

routes.post('/products', upload.single('image'), createProduct)
routes.get('/list-products', listProducts)
routes.delete('/products/:id', deleteProduct)
routes.patch('/products/:id/select', auth, selectProduct)
routes.patch('/products/:id/unselect', auth, unselectProduct)
routes.get('/my-presents', auth, myPresents)

routes.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' })
})

export default routes
