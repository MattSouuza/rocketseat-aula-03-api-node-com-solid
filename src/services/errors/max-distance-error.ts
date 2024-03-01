export default class MaxDistanceError extends Error {
	constructor() {
		super('Too far away to check in.')
	}
}