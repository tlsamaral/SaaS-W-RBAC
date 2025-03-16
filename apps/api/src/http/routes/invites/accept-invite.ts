import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/invites/:inviteId/accept',
			{
				schema: {
					tags: ['Invites'],
					summary: 'Accept an invite',
					params: z.object({
						inviteId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId()
				const { inviteId } = request.params

				const invite = await prisma.invite.findUnique({
					where: {
						id: inviteId,
					},
				})

				if (!invite) {
					throw new BadRequestError('Invite not found or expired')
				}

				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
				})

				if (!user) {
					throw new BadRequestError('User not found')
				}

				if (user.email !== invite.email) {
					throw new BadRequestError('User email does not match invite email')
				}

				await prisma.$transaction([
					prisma.member.create({
						data: {
							userId,
							organizationId: invite.organizationId,
							role: invite.role,
						},
					}),

					prisma.invite.delete({
						where: {
							id: inviteId,
						},
					}),
				])

				return reply.status(204).send()
			},
		)
}
