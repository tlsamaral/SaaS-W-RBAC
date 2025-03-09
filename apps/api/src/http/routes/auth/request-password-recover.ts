import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function requestPasswordRecover(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/password/recover',
			{
				schema: {
					tags: ['Auth'],
					summary: 'Get Authenticated User Profile',
					body: z.object({
						email: z.string().email(),
					}),
					response: {
						201: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { email } = request.body

				const userFromEmail = await prisma.user.findUnique({
					where: {
						email,
					},
				})

				if (!userFromEmail) {
					// We don't want people to know if user really exists.
					return reply.status(201).send()
				}

				const { id } = await prisma.token.create({
					data: {
						type: 'PASSWORD_RECOVER',
						userId: userFromEmail.id,
					},
				})

				// Send e-mail with password recover link
				console.log('Recover password token: ', id)
				return reply.status(201).send()
			},
		)
}
