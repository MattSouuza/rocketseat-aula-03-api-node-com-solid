import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import UserAlreadyExistsError from './errors/user-already-exists-error'
import { User } from '@prisma/client'

type RegisterParams = {
    name: string
    email: string
    password: string
}

type RegisterServiceResponse = {
	user: User
}

export class RegisterService {
	constructor(private usersRepository: UsersRepository) { }
    
	async handle({ name, email, password }: RegisterParams): Promise<RegisterServiceResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const passwordHash = await hash(password, 6)

		const user = await this.usersRepository.create({ name, email, password_hash: passwordHash })

		return {
			user
		}
	}
}