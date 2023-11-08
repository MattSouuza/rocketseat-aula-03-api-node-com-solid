export default class ResourceNotFoundError extends Error {
	constructor() {
		super('Resource not found!')
	}
}