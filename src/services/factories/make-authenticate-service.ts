import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

export default function makeAuthenticateService() {
	const usersRepository = new PrismaUsersRepository()
	const authenticateService = new AuthenticateService(usersRepository)

	return authenticateService
}