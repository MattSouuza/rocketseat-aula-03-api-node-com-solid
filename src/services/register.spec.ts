import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'

import InMemoryUsersRepository from '@/repositories/in-memory/in-memory-users-repository'
import UserAlreadyExistsError from './errors/user-already-exists-error'

let sut: RegisterService

describe('Register service', () => {

	beforeEach(() => {
		sut = new RegisterService(new InMemoryUsersRepository()) // system under test
	})

	it('should register user', async () => {
		const { user } = await sut.handle({
			name: 'John',
			email: 'john@email.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const { user } = await sut.handle({
			name: 'John',
			email: 'john@email.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register user with same email twice', async () => {
		const email = 'john@email.com'

		await sut.handle({
			name: 'John',
			email,
			password: '123456'
		})

		await expect(() => 
			sut.handle({
				name: 'John',
				email,
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})