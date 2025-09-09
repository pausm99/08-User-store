import { ProductModel } from '../../data'
import { CreateProductDTO, CustomError, PaginationDTO } from '../../domain'

export class ProductService {
	constructor() {}

	async createProduct(createProductDTO: CreateProductDTO) {
		const productExists = await ProductModel.findOne({ name: createProductDTO.name })
		if (productExists) {
			throw CustomError.badRequest('Product already exists')
		}

		try {
			const product = new ProductModel(createProductDTO)
			await product.save()

			return product
		} catch (error) {
			throw CustomError.internalServer(`${error}`)
		}
	}

	async getProducts(paginationDTO: PaginationDTO) {
		const { page, limit } = paginationDTO
		const skip = (page - 1) * limit

		try {
			const [total, products] = await Promise.all([ProductModel.countDocuments(), ProductModel.find().lean().skip(skip).limit(limit).populate('user').populate('category') as Promise<any[]>])

			return {
				page,
				limit,
				total,
				next: `/api/products?page=${page + 1}&limit=${limit}`,
				prev: page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
				products: products,
			}
		} catch (error) {
			throw CustomError.internalServer('Internal server error')
		}
	}
}
