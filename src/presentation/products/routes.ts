import { Router } from 'express'
import { AuthMiddleWare } from '../middlewares/auth.middleware'
import { ProductController } from './controller'
import { ProductService } from '../services'

export class ProductRoutes {
	static get routes(): Router {
		const router = Router()
		const productService = new ProductService()
		const productController = new ProductController(productService)

		router.get('/', productController.getProducts)
		router.post('/', [AuthMiddleWare.validateJWT], productController.createProduct)

		return router
	}
}
