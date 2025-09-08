import { Request, Response } from 'express'
import { CustomError, LoginUserDTO, RegisterUserDTO } from '../../domain'
import { AuthService } from '../services/auth.service'

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		console.log(error)
		return res.status(500).json({ error: 'Internal server error' })
	}

	registerUser = async (req: Request, res: Response) => {
		const [error, registerUserDTO] = RegisterUserDTO.create(req.body)
		if (error) {
			return res.status(400).json({ error })
		}

		try {
			const user = await this.authService.registerUser(registerUserDTO!)
			res.json(user)
		} catch (error) {
			this.handleError(error, res)
		}
	}

	loginUser = async (req: Request, res: Response) => {
		const [error, loginUserDTO] = LoginUserDTO.create(req.body)
		if (error) {
			return res.status(400).json({ error })
		}

		try {
			const user = await this.authService.loginUser(loginUserDTO!)
			res.json(user)
		} catch (error) {
			this.handleError(error, res)
		}
	}

	validateEmail = (req: Request, res: Response) => {
		const { token } = req.params

		this.authService
			.validateEmail(token)
			.then(() => {
				res.json('Email validated')
			})
			.catch((error: unknown) => {
				this.handleError(error, res)
			})
	}
}
