import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ValidateCheckInService } from './validate-check-in'
import ResourceNotFoundError from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Check-in service', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInService(checkInsRepository) // sut = system under test

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

		const { checkIn } = await sut.handle({
            checkInId: createdCheckIn.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate an inexistent check-in', async () => {
        expect(() => 
            sut.handle({
                checkInId: 'ineistent-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

    it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const { checkIn } = await sut.handle({
            checkInId: createdCheckIn.id
        })
    })
})