import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function getInvites(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/organizations/:slug/invites',
			{
				schema: {
					tags: ['Invites'],
					summary: 'Get all organization invites',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							invites: z.array(
								z.object({
									id: z.string().uuid(),
									email: z.string().email(),
									role: roleSchema,
									createdAt: z.date(),
									author: z
										.object({
											id: z.string().uuid(),
											name: z.string().nullable(),
										})
										.nullable(),
								}),
							),
						}),
					},
				},
			},
			async (request) => {
				const userId = await request.getCurrentUserId()

				const { slug } = request.params

				const { organization, membership } =
					await request.getUserMemberShip(slug)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('get', 'Invite')) {
					throw new BadRequestError('You do not have permission to get invites')
				}

				const invites = await prisma.invite.findMany({
					where: {
						organizationId: organization.id,
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
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				})

				return {
					invites,
				}
			},
		)
}
