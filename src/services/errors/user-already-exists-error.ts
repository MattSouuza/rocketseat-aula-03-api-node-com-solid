export default class UserAlreadyExistsError extends Error {
	constructor() {
		super('A user with the same email already exists!')
	}
}