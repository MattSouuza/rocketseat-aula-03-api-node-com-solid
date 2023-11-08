import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import InMemoryGymsRepository from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in service', () => {

	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInService(checkInsRepository, gymsRepository) // sut = system under test

		vi.useFakeTimers()
	})
    
	afterEach(() => {
		vi.useRealTimers()
	})

	it('should check in', async () => {
		const { checkIn } = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2020, 0, 1, 0, 30, 0))

		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0
		})

		await expect(() =>
			sut.handle({
				userId: 'user-01',
				gymId: 'gym-01',
				userLatitude: 0,
				userLongitude: 0
			})
		).rejects.toBeInstanceOf(Error)
	})

	it('should check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2020, 0, 1, 0, 30, 0))
        
		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0
		})
        
		vi.setSystemTime(new Date(2019, 11, 31, 21, 30, 0))

		const { checkIn } = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0
		})

		console.log(checkIn.created_at)        

		expect(checkIn.id).toEqual(expect.any(String))
	})
})