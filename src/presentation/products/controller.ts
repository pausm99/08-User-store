import { Request, Response } from 'express'
import { CustomError, PaginationDTO } from '../../domain'
import { CreateProductDTO } from '../../domain/dtos/products/create-product.dto'
import { ProductService } from '../services'

export class ProductController {
	constructor(private readonly productService: ProductService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		console.log(error)
		return res.status(500).json({ error: 'Internal server error' })
	}

	createProduct = (req: Request, res: Response) => {
		const [error, createProductDTO] = CreateProductDTO.create({ ...req.body, user: req.body.user.id })
		if (error) {
			return res.status(400).json({ error })
		}

		this.productService
			.createProduct(createProductDTO!)
			.then((newProduct: any) => {
				res.status(201).json(newProduct)
			})
			.catch((error: any) => {
				this.handleError(error, res)
			})
	}

	getProducts = (req: Request, res: Response) => {
		const { page = 1, limit = 10 } = req.query

		const [error, paginationDTO] = PaginationDTO.create(+page, +limit)
		if (error) {
			return res.status(400).json({ error })
		}

		this.productService
			.getProducts(paginationDTO!)
			.then(products => res.json(products))
			.catch(error => this.handleError(error, res))
	}
}
