import jwt from 'jsonwebtoken'
import { envs } from './envs'

const JWT_SEED = envs.JWT_SEED

export class JWTAdapter {
	static generateToken(payload: any, duration: string = '2h') {
		return new Promise(resolve => {
			jwt.sign(payload, JWT_SEED, { expiresIn: duration as any }, (error, token) => {
				if (error) {
					return resolve(null)
				}
				resolve(token)
			})
		})
	}

	static validateToken(token: string) {
		return new Promise(resolve => {
			jwt.verify(token, JWT_SEED, (error, decoded) => {
				if (error) {
					return resolve(null)
				}
				resolve(decoded)
			})
		})
	}
}
