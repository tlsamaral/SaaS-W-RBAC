import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function getInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/invites/:inviteId',
		{
			schema: {
				tags: ['Invites'],
				summary: 'Get an invite',
				params: z.object({
					inviteId: z.string().uuid(),
				}),
				response: {
					200: z.object({
						invite: z.object({
							id: z.string().uuid(),
							email: z.string().email(),
							role: roleSchema,
							createdAt: z.date(),
							author: z
								.object({
									id: z.string().uuid(),
									name: z.string().nullable(),
									avatarUrl: z.string().nullable(),
								})
								.nullable(),
							organization: z.object({
								name: z.string(),
							}),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { inviteId } = request.params

			const invite = await prisma.invite.findUnique({
				where: {
					id: inviteId,
				},
				select: {
					id: true,
					email: true,
					role: true,
					createdAt: true,
					author: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
					organization: {
						select: {
							name: true,
						},
					},
				},
			})

			if (!invite) {
				throw new BadRequestError('Invite not found')
			}

			return reply.status(200).send({
				invite,
			})
		},
	)
}
