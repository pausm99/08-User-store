import { Router } from 'express'
import { CategoryController } from './controller'
import { AuthMiddleWare } from '../middlewares/auth.middleware'

export class CategoryRoutes {
	static get routes(): Router {
		const router = Router()

		const controller = new CategoryController()

		router.get('/', controller.getCategories)
		router.post('/', [AuthMiddleWare.validateJWT], controller.createCategory)

		return router
	}
}
