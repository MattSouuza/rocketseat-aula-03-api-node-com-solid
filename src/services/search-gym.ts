import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

type SearchGymsServiceParams = {
    query: string
    page?: number
}

type SearchGymsServiceResponse = {
    gyms: Gym[]
}

export class SearchGymsService {
    constructor(private gymsRepository: GymsRepository) { }

    async handle({
        query,
        page = 1
    }: SearchGymsServiceParams): Promise<SearchGymsServiceResponse> {
        const gyms = await this.gymsRepository.search(query, page)

        return { 
            gyms
        }
    }
}