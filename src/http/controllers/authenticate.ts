import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import InvalidCredentialsError from '@/services/errors/invalid-credentials-error'
import makeAuthenticateService from '@/services/factories/make-authenticate-service'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { email, password } = authenticateBodySchema.parse(req.body)

	try {
		const authenticateService = makeAuthenticateService()

		await authenticateService.handle({ email, password })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return res.status(400).send({ message: error.message })
		}

		return res.status(500).send()
	}

	return res.status(200).send()
}