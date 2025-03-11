import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_erros/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_erros/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { roleSchema } from '@saas/auth'

export async function getMembers(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/organizations/:slug/members',
			{
				schema: {
					tags: ['Members'],
					summary: 'Get all organization members',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							members: z.array(
								z.object({
									name: z.string().nullable(),
									avatarUrl: z.string().url().nullable(),
									email: z.string(),
									id: z.string(),
									role: roleSchema,
								}),
							),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params
				const userId = await request.getCurrentUserId()
				const { organization, membership } =
					await request.getUserMemberShip(slug)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('get', 'User')) {
					throw new UnauthorizedError(
						`You're not allowed to see organization members.`,
					)
				}

				const members = await prisma.member.findMany({
					select: {
						id: true,
						role: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
					where: {
						organizationId: organization.id,
					},
					orderBy: {
						role: 'asc',
					},
				})

				const membersWithRoles = members.map(
					({ id, role, user: { id: userId, ...user } }) => {
						return {
							id,
							role,
							...user,
						}
					},
				)

				return reply.send({ members: membersWithRoles })
			},
		)
}
