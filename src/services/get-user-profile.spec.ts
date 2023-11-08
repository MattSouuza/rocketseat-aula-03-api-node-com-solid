import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import InMemoryUsersRepository from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'
import ResourceNotFoundError from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile service', () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileService(usersRepository) // sut = system under test
	})

	it('should get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'Jimmy McGill',
			email: 'slippingjimmy@yahoo.com',
			password_hash: await hash('elderlaw_', 6)
		})

		const { user } = await sut.handle({userId: createdUser.id})

		expect(user.name).toEqual('Jimmy McGill')
	})

	it('should not get user profile with wrong id', async () => {
		await expect(() =>
			sut.handle({
				userId: 'not-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})