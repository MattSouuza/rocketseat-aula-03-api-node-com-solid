import { Gym, Prisma } from '@prisma/client'
import { FindManyNearByParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenTwoCoordinates } from '@/services/utils/get-distance-between-two-coordinates'

class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString())
		}

		this.items.push(gym)

		return gym
	}

	async search(query: string, page: number) {
		return this.items.filter((item) => item.title.includes(query)).slice((page - 1) * 20, page * 20)
	}

	async findById(id: string) {
		const gym = this.items.find((item) => item.id === id) ?? null

		return gym
	}

	async findManyNearBy(params: FindManyNearByParams) {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenTwoCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{ latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
			)

			return distance < 10
		})
	}
}

export default InMemoryGymsRepository