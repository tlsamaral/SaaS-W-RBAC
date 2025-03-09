import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'

export async function getMembership(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/organizations/:slug/membership',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Get organization membership on organization',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							membership: z.object({
								id: z.string().uuid(),
								role: roleSchema,
								organizationId: z.string().uuid(),
							}),
						}),
					},
				},
			},
			async (request) => {
				const { slug } = request.params

				const { membership } = await request.getUserMemberShip(slug)

				return {
					membership: {
						role: membership.role,
						id: membership.id,
						organizationId: membership.organizationId,
					},
				}
			},
		)
}
