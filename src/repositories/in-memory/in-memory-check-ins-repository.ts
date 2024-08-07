import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = []

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDate = dayjs(date).startOf('date')
		const endOfTheDate = dayjs(date).endOf('date')

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)

			const isOnSameDate = checkInDate.isAfter(startOfTheDate) && checkInDate.isBefore(endOfTheDate)

			return checkIn.user_id === userId && isOnSameDate
		})

		if (!checkInOnSameDate) {
			return null
		}

		return checkInOnSameDate
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		}

		this.items.push(checkIn)

		return checkIn
	}

	async save(data: CheckIn) {
		const checkInIndex = this.items.findIndex(item => item.id === data.id)

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = data
		}

		return data
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items.filter((item) => item.user_id === userId).slice((page - 1) * 20, page * 20)
	}

	async findById(id: string) {
		return this.items.find((item) => item.id === id) ?? null
	}
}

export default InMemoryCheckInsRepository