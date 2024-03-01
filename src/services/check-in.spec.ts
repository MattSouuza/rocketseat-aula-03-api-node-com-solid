import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import InMemoryGymsRepository from '@/repositories/in-memory/in-memory-gyms-repository'
import MaxDistanceError from './errors/max-distance-error'
import MaxNumberOfCheckInsError from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in service', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInService(checkInsRepository, gymsRepository) // sut = system under test

		await gymsRepository.create({
			id: 'gym-01',
			title: 'FitSmart',
			description: 'Awesome gym!',
			phone: '11 49849846',
			latitude: -27.2094810,
			longitude: -49.6401018
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should check in', async () => {
		const { checkIn } = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -27.2094810,
			userLongitude: -49.6401018
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2020, 0, 1, 0, 30, 0))

		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -27.2094810,
			userLongitude: -49.6401018
		})

		await expect(() =>
			sut.handle({
				userId: 'user-01',
				gymId: 'gym-01',
				userLatitude: -27.2094810,
				userLongitude: -49.6401018
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2020, 0, 1, 0, 30, 0))

		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -27.2094810,
			userLongitude: -49.6401018
		})

		vi.setSystemTime(new Date(2019, 11, 31, 21, 30, 0))

		const { checkIn } = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -27.2094810,
			userLongitude: -49.6401018
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able check in on distant gym', async () => {
		await gymsRepository.create({
			id: 'gym-02',
			title: 'FitSmart 2',
			description: 'Awesome gym 2!',
			phone: '11 49849846',
			latitude: -27.0404655,
			longitude: -49.4653008
		})

		await expect(() =>
			sut.handle({
				userId: 'user-01',
				gymId: 'gym-02',
				userLatitude: -27.2094810,
				userLongitude: -49.6401018
			})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})