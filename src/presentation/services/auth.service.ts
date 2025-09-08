import { BcryptAdapter, envs, JWTAdapter } from '../../config'
import { UserModel } from '../../data'
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from '../../domain'
import { EmailService } from './email.service'

export class AuthService {
	constructor(private readonly emailService: EmailService) {}

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

			await this.sendEmailValidationLink(user.email)

			const token = await JWTAdapter.generateToken({ id: user.id })
			if (!token) {
				throw CustomError.internalServer('Error generating token')
			}

			const { password, ...userEntity } = UserEntity.fromObject(user)

			return { user: userEntity, token }
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

		const token = await JWTAdapter.generateToken({ id: userExists.id })
		if (!token) {
			throw CustomError.internalServer('Error generating token')
		}

		return { user: { ...user }, token }
	}

	private sendEmailValidationLink = async (email: string) => {
		const token = await JWTAdapter.generateToken({ email })
		if (!token) throw CustomError.internalServer('Error generating token')

		const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`

		const html = `
			<h1>Validate your email</h1>
			<p>Click on the link to validate your email: <a href="${link}">Validate your email ${email}</a></p>
		`

		const options = {
			to: email,
			subject: 'Validate your email',
			htmlBody: html,
		}

		const isSent = await this.emailService.sendEmail(options)
		if (!isSent) throw CustomError.internalServer('Error sending email')

		return true
	}

	public async validateEmail(token: string) {
		const payload = await JWTAdapter.validateToken(token)
		if (!payload) throw CustomError.unauthorized('Invalid token')

		const { email } = payload as { email: string }
		if (!email) throw CustomError.internalServer('Email not in token')

		const user = await UserModel.findOne({ email })
		if (!user) throw CustomError.internalServer('Email not exists')

		user.emailValidated = true
		await user.save()

		return true
	}
}
