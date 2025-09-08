import { Request, Response, NextFunction } from 'express'
import { JWTAdapter } from '../../config'
import { UserModel } from '../../data'
import { UserEntity } from '../../domain'

export class AuthMiddleWare {
	static async validateJWT(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('authorization')
		if (!authorization) return res.status(401).json({ error: 'No token provided' })
		if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer Token' })

		const token = authorization.split(' ').at(1) || ''

		try {
			const payload = await JWTAdapter.validateToken<{ id: string }>(token)
			if (!payload) return res.status(401).json({ error: 'Invalid token' })

			const user = await UserModel.findById(payload.id)
			if (!user) return res.status(401).json({ error: 'Invalid token - user' })

            //TODO: validate if user is active

			req.body.user = UserEntity.fromObject(user)

			next()
		} catch (error) {
			console.log(error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
}
