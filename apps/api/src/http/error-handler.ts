import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_erros/bad-request-error'
import { UnauthorizedError } from './routes/_erros/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.code(400).send({
			errors: error.validation.map((error) => error.params.issue),
			message: 'Validation Error',
		})
	}

	if (error instanceof BadRequestError) {
		return reply.status(400).send({
			message: error.message,
		})
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: error.message,
		})
	}

	console.error(error)

	// send error to some observability plataform

	return reply.status(500).send({
		message: 'Internal server error',
	})
}
