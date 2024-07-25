import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

type FetchNearByGymsServiceParams = {
    userLatitude: number
    userLongitude: number
}

type FetchNearByGymsServiceResponse = {
    gyms: Gym[]
}

export class FetchNearByGymsService {
    constructor(private gymsRepository: GymsRepository) { }

    async handle({
        userLatitude,
        userLongitude
    }: FetchNearByGymsServiceParams): Promise<FetchNearByGymsServiceResponse> {
        const gyms = await this.gymsRepository.findManyNearBy({ latitude: userLatitude, longitude: userLongitude })

        return {
            gyms
        }
    }
}