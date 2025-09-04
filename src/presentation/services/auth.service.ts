import { BcryptAdapter, JWTAdapter } from '../../config'
import { UserModel } from '../../data'
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from '../../domain'

export class AuthService {
	constructor() {}

	public async registerUser(registerUserDTO: RegisterUserDTO) {
		const userExists = await UserModel.findOne({ email: registerUserDTO.email })
		if (userExists) {
			throw CustomError.badRequest('Email already exists')
		}

		try {
			const user = new UserModel(registerUserDTO)

			user.password = BcryptAdapter.hash(registerUserDTO.password)
			await user.save()

			//JWT to authenticate user

			//send email to validate email

			const { password, ...userEntity } = UserEntity.fromObject(user)

			return { user: userEntity, token: 'ABC' }
		} catch (error) {
			throw CustomError.internalServer(`${error}`)
		}
	}

	public async loginUser(loginUserDTO: LoginUserDTO) {
		const userExists = await UserModel.findOne({ email: loginUserDTO.email })
		if (!userExists) {
			throw CustomError.badRequest('User does not exist')
		}

		const equalPassword = BcryptAdapter.compare(loginUserDTO.password, userExists.password)
		if (!equalPassword) {
			throw CustomError.badRequest('Invalid password')
		}

		const { password, ...user } = UserEntity.fromObject(userExists)

		const token = await JWTAdapter.generateToken({ id: userExists.id, email: userExists.email })
		if (!token) {
			throw CustomError.internalServer('Error generating token')
		}

		return { user: { ...user }, token }
	}
}
