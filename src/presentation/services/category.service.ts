import { CategoryModel } from '../../data'
import { CreateCategoryDTO, CustomError, UserEntity } from '../../domain'

export class CategoryService {
	constructor() {}

	async createCategory(createCategoryDTO: CreateCategoryDTO, user: UserEntity) {
		const categoryExists = await CategoryModel.findOne({ name: createCategoryDTO.name })
		if (categoryExists) {
			throw CustomError.badRequest('Category already exists')
		}

		try {
			const category = new CategoryModel({
				...createCategoryDTO,
				user: user.id,
			})
			await category.save()

			return {
                id: category.id,
                name: category.name,
                available: category.available,
            }
		} catch (error) {
			throw CustomError.internalServer(`${error}`)
		}
	}
}
