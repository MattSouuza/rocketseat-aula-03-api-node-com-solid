import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'

type FetchUserCheckInsHistoryServiceRequest = {
	userId: string,
	page?: number,
}

type FetchUserCheckInsHistoryServiceResponse = {
	checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
	constructor(private checkinsRepository: CheckInsRepository) { }

	handle = async ({
		userId,
		page = 1
	}: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> => {
		const checkIns = await this.checkinsRepository.findManyByUserId(userId, page)

		return {
			checkIns
		}

	}
}