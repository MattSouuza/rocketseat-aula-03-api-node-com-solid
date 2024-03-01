import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymService } from './create-gym'
import InMemoryGymsRepository from '@/repositories/in-memory/in-memory-gyms-repository'

let sut: CreateGymService

describe('Register service', () => {

	beforeEach(() => {
		sut = new CreateGymService(new InMemoryGymsRepository()) // system under test
	})

	it('should create a gym', async () => {
		const { gym } = await sut.handle({
			title: 'FitSmart',
			description: 'Awesome gym!',
			phone: '11 49849846',
			latitude: 0,
			longitude: 0
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})