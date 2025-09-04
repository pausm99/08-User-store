import { regularExps } from '../../../config'

export class LoginUserDTO {
	private constructor(public readonly email: string, public readonly password: string) {}

	static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
		const { email, password } = object

		if (!email) {
			return ['Missing email']
		}

		if (!regularExps.email.test(email)) {
			return ['Invalid email format']
		}

		if (!password) {
			return ['Missing password']
		}

		if (password.length < 6) {
			return ['Password must be at least 6 characters long']
		}

		return [undefined, new LoginUserDTO(email, password)]
	}
}
