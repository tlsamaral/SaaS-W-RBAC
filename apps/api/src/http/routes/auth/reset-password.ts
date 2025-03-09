import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

export async function resetPassword(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/password/reset',
			{
				schema: {
					tags: ['Auth'],
					summary: 'Get Authenticated User Profile',
					body: z.object({
						code: z.string().uuid(),
						password: z.string().min(6),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { code, password } = request.body

				const tokenFromCode = await prisma.token.findUnique({
					where: {
						id: code,
					},
				})

				if (!tokenFromCode) {
					// We don't want people to know if user really exists.
					throw new UnauthorizedError('Invalid auth token')
				}

				const passwordHash = await bcrypt.hash(password, 6)

				await prisma.user.update({
					where: {
						id: tokenFromCode.userId,
					},
					data: {
						passwordHash,
					},
				})

				return reply.status(204).send()
			},
		)
}
