import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'

class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async create(data: Prisma.GymCreateInput){
		// const gym = {
		// 	id: randomUUID(),
		// 	title: data.title,
		// 	description: data.description,
		// 	phone: data.phone,
		// 	latitude: data.latitude,
		// 	longitude: data.longitude,
		// }

		// this.items.push(gym)
	}

	async findById(id: string) {
		const gym = this.items.find((item) => item.id === id) ?? null

		return gym
	}
}

export default InMemoryGymsRepository