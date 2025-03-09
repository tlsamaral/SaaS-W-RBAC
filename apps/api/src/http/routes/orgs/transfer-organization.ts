import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema, userSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

export async function transferOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.patch(
			'/organizations/:slug/owner',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Transfer organization ownership',
					security: [{ bearerAuth: [] }],
					body: z.object({
						transferToUserId: z.string().uuid(),
					}),
					params: z.object({
						slug: z.string(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params

				const userId = await request.getCurrentUserId()
				const { organization, membership } =
					await request.getUserMemberShip(slug)

				const authUser = userSchema.parse({
					id: userId,
					role: membership.role,
				})

				const authOrganization = organizationSchema.parse(organization)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('transfer_ownership', authOrganization)) {
					throw new UnauthorizedError(
						'You are not allowed to transfer this organization owenership',
					)
				}

				const { transferToUserId } = request.body

				const transferToMembership = await prisma.member.findUnique({
					where: {
						organizationId_userId: {
							organizationId: authOrganization.id,
							userId: transferToUserId,
						},
					},
				})

				if (!transferToMembership) {
					throw new BadRequestError(
						'Target user is not a member of this organization',
					)
				}

				await prisma.$transaction([
					prisma.member.update({
						where: {
							organizationId_userId: {
								organizationId: authOrganization.id,
								userId: transferToUserId,
							},
						},
						data: {
							role: 'ADMIN',
						},
					}),

					prisma.organization.update({
						where: { id: authOrganization.id },
						data: {
							ownerId: transferToUserId,
						},
					}),
				])

				return reply.status(204).send()
			},
		)
}
