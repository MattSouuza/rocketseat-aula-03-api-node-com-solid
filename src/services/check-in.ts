import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import ResourceNotFoundError from './errors/resource-not-found-error'
import { getDistanceBetweenTwoCoordinates } from './utils/get-distance-between-two-coordinates'
import MaxNumberOfCheckInsError from './errors/max-number-of-check-ins-error'
import MaxDistanceError from './errors/max-distance-error'

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
	private checkinsRepository: CheckInsRepository
	private gymsRepository: GymsRepository

	constructor(
		checkinsRepository: CheckInsRepository,
		gymsRepository: GymsRepository
	) {
		this.checkinsRepository = checkinsRepository
		this.gymsRepository = gymsRepository
	}

	handle = async ({
		userId,
		gymId,
		userLatitude,
		userLongitude
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> => {
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		const distance = getDistanceBetweenTwoCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
		)

		const MAX_DISTANCE_IN_KILOMETERS = 0.1

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError()
		}

		const checkInOnSameDate = await this.checkinsRepository.findByUserIdOnDate(userId, new Date())

		if (checkInOnSameDate) {
			throw new MaxNumberOfCheckInsError()
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