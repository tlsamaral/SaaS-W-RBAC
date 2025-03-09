import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema, userSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			'/organizations/:slug',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Update organization details',
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						shouldAttachUsersByDomain: z.boolean().optional(),
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

				const { name, domain, shouldAttachUsersByDomain } = request.body

				const authUser = userSchema.parse({
					id: userId,
					role: membership.role,
				})

				const authOrganization = organizationSchema.parse(organization)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('update', authOrganization)) {
					throw new UnauthorizedError(
						'You are not allowed to update this organization',
					)
				}

				if (domain) {
					const organizationByDomain = await prisma.organization.findFirst({
						where: {
							domain,
							id: {
								not: organization.id,
							},
						},
					})

					if (organizationByDomain) {
						throw new BadRequestError(
							'Organization with same domain already exists',
						)
					}
				}

				await prisma.organization.update({
					where: {
						id: organization.id,
					},
					data: {
						name,
						domain,
						shouldAttachUsersByDomain,
					},
				})

				return reply.status(204).send()
			},
		)
}
