import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import ResourceNotFoundError from './errors/resource-not-found-error'
import { getDistanceBetweenTwoCoordinates } from './utils/get-distance-between-two-coordinates'
import MaxNumberOfCheckInsError from './errors/max-number-of-check-ins-error'
import MaxDistanceError from './errors/max-distance-error'

type ValidateCheckInServiceRequest = {
	checkInId: string
}

type ValidateCheckInServiceResponse = {
	checkIn: CheckIn
}

export class ValidateCheckInService {
	constructor(private checkinsRepository: CheckInsRepository) {}

	handle = async ({
		checkInId,
	}: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> => {
		const checkIn = await this.checkinsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

        checkIn.validated_at = new Date()

        await this.checkinsRepository.save(checkIn)

		return {
			checkIn
		}

	}
}