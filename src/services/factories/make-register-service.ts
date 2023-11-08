import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register'

export default function makeRegisterService() {
	const usersRepository = new PrismaUsersRepository()
	const registerService = new RegisterService(usersRepository)

	return registerService
}