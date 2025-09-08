export class CreateCategoryDTO {
	private constructor(public readonly name: string, private readonly available: boolean) {}

	static create(object: { [key: string]: any }): [string?, CreateCategoryDTO?] {
		const { name, available = false } = object
		let availableBoolean = available

		if (!name) {
			return ['Missing name']
		}

		if (typeof available !== 'boolean') {
			availableBoolean = available === 'true' ? true : false
		} else {
			return ['Available must be a boolean']
		}

		return [undefined, new CreateCategoryDTO(name, availableBoolean)]
	}
}
