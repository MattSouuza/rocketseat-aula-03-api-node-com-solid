import InMemoryGymsRepository from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsService } from './search-gym'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms service', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsService(gymsRepository) // sut = system under test
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Academia 01',
            description: 'Awesome gym!',
            phone: '11 49849846',
            latitude: -27.2094810,
            longitude: -49.6401018
        })
        await gymsRepository.create({
            title: 'Academia 02',
            description: 'Awesome gym!',
            phone: '11 49849846',
            latitude: -27.2094810,
            longitude: -49.6401018
        })

        const { gyms } = await sut.handle({ query: 'Academia 01' })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({
                title: 'Academia 01',
            }),
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: 'Awesome gym!',
                phone: '11 49849846',
                latitude: -27.2094810,
                longitude: -49.6401018
            })
        }

        const { gyms } = await sut.handle({ query: 'Javascript', page: 2 })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21' }),
            expect.objectContaining({ title: 'Javascript Gym 22' }),
        ])
    })
})