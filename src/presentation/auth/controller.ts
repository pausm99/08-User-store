import { Request, Response } from 'express'

export class AuthController {
	constructor() {}

	registerUser = (req: Request, res: Response) => {
		res.json('register')
	}

    loginUser = (req: Request, res: Response) => {
		res.json('login')
	}

    validateEmail = (req: Request, res: Response) => {
		res.json('validateEmail')
	}
}
