import { CheckIn, Prisma } from '@prisma/client'

export type CheckInsRepository = {
    findById(id: string): Promise<CheckIn | null>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(data: CheckIn): Promise<CheckIn>
}