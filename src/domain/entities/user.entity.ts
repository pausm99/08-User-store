import { CustomError } from '../errors/custom.error'

export class UserEntity {
	constructor(public id: string, public name: string, public email: string, public emailValidated: boolean, public password: string, public role: string[], public img?: string) {}

	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, email, emailValidated, password, role, img } = object

		if (!_id && !id) {
			throw CustomError.badRequest('Id is missing')
		}

		if (!name) {
			throw CustomError.badRequest('Name is missing')
		}

		if (!email) {
			throw CustomError.badRequest('Email is missing')
		}

		if (emailValidated === undefined) {
			throw CustomError.badRequest('Email validated is missing')
		}

		if (!password) {
			throw CustomError.badRequest('Password is missing')
		}

		if (!role) {
			throw CustomError.badRequest('Role is missing')
		}

		return new UserEntity(_id || id, name, email, emailValidated, password, role, img)
	}
}
