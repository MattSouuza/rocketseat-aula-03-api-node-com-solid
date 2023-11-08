import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import ResourceNotFoundError from './errors/resource-not-found-error'

type CheckInServiceRequest = {
    userId: string
    gymId: string
	userLatitude: number
	userLongitude: number
}

type CheckInServiceResponse = {
    checkIn: CheckIn
}

export class CheckInService {
	constructor(
		private checkinsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	) { }

	async handle({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}



		const checkInOnSameDate = await this.checkinsRepository.findByUserIdOnDate(userId, new Date())

		if (checkInOnSameDate) {
			throw new Error()
		}
		
		const checkIn = await this.checkinsRepository.create({
			user_id: userId,
			gym_id: gymId
		})

		return { 
			checkIn
		}

	}
}