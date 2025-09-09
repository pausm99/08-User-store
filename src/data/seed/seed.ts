import { envs } from '../../config'
import { CategoryModel, ProductModel, UserModel, MongoDatabase } from '../mongo'
import { seedData } from './data'
;(async () => {
	if (process.env.NODE_ENV === 'production') return

	await MongoDatabase.connect({
		mongoUrl: envs.MONGO_URL,
		dbName: envs.MONGO_DB_NAME,
	})

	await main()

	await MongoDatabase.disconnect()
})()

const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x)

async function main() {
	await Promise.all([UserModel.deleteMany({}), CategoryModel.deleteMany({}), ProductModel.deleteMany({})])

	const users = await UserModel.insertMany(seedData.users)
	const categories = await CategoryModel.insertMany(
		seedData.categories.map(category => {
			return {
				...category,
				user: users[0]._id,
			}
		})
	)
	await ProductModel.insertMany(
		seedData.products.map(product => {
			return {
				...product,
				user: users[randomBetween0AndX(seedData.users.length - 1)]._id,
				category: categories[randomBetween0AndX(seedData.categories.length - 1)]._id,
			}
		})
	)

	console.log('Database seeded')
}
