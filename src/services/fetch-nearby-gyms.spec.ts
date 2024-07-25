import InMemoryGymsRepository from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearByGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsService

describe('Search Gyms service', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearByGymsService(gymsRepository) // sut = system under test
    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: 'Awesome gym!',
            phone: '11 49849846',
            latitude: -27.2094810,
            longitude: -49.6401018
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: 'Awesome gym!',
            phone: '11 49849846',
            latitude: -27.0610928,
            longitude: -49.6401091
        })

        const { gyms } = await sut.handle({
            userLatitude: -27.2094810,
            userLongitude: -49.6401018
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({
                title: 'Near Gym',
            }),
        ])
    })
})