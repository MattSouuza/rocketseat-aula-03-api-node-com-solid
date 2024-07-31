export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in is late, it can only be validated within 20 minutes of its creation')
    }
}