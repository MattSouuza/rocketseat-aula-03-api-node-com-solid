import { expect, describe, it, beforeEach } from 'vitest'

import { AuthenticateService } from './authenticate'

import InMemoryUsersRepository from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import InvalidCredentialsError from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate service', () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateService(usersRepository) // sut = system under test
	})

	it('should authenticate user', async () => {
		await usersRepository.create({
			name: 'Jimmy McGill',
			email: 'slippingjimmy@yahoo.com',
			password_hash: await hash('elderlaw_', 6)
		})

		const { user } = await sut.handle({
			email: 'slippingjimmy@yahoo.com',
			password: 'elderlaw_'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not authenticate user with wrong email', async () => {
		await expect(() =>
			sut.handle({
				email: 'slippingjimmy@yahoo.com',
				password: 'elderlaw_'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not authenticate user with wrong password', async () => {
		await usersRepository.create({
			name: 'Jimmy McGill',
			email: 'slippingjimmy@yahoo.com',
			password_hash: await hash('elderlaw_', 6)
		})

		await expect(() =>
			sut.handle({
				email: 'slippingjimmy@yahoo.com',
				password: 'fuckhoward'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})