import { regularExps } from "../../../config"

export class RegisterUserDTO {
    private constructor(public readonly name: string, public readonly email: string, public readonly password: string) {}

    static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
        const { name, email, password } = object

        if (!name) {
            return ['Missing name']
        }

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

        return [undefined, new RegisterUserDTO(name, email, password)]
    }
}
