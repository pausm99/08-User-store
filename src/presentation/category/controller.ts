import { Request, Response } from 'express'
import { CreateCategoryDTO, CustomError } from '../../domain'
import { CategoryService } from '../services'

export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		console.log(error)
		return res.status(500).json({ error: 'Internal server error' })
	}

	createCategory = (req: Request, res: Response) => {
		const [error, createCategoryDTO] = CreateCategoryDTO.create(req.body)
		if (error) {
			return res.status(400).json({ error })
		}

		this.categoryService.createCategory(createCategoryDTO!, req.body.user)
			.then(newCategory => res.status(201).json(newCategory))
			.catch(error => this.handleError(error, res))
	}

	getCategories = async (req: Request, res: Response) => {
		res.json('Get Categories')
	}
}
