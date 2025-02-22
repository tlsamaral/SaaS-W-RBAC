import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/users',
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body

			const userWithSameEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (userWithSameEmail) {
				return reply.status(400).send({
					message: 'User with same email already exists',
				})
			}

			const passwordHash = await bcrypt.hash(password, 6)

			const user = await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
				},
			})

			return reply.status(201).send()
		},
	)
}
