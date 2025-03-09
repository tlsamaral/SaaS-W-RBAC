import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_erros/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_erros/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { projectSchema } from '@saas/auth'

export async function updateProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			'/organizations/:orgSlug/projects/:projectId',
			{
				schema: {
					tags: ['Projects'],
					summary: 'Update a project',
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
						projectId: z.string().uuid(),
					}),
					body: z.object({
						name: z.string(),
						description: z.string(),
					}),
					response: {
						200: z.object({
							project: z.object({
								id: z.string().uuid(),
								description: z.string(),
								name: z.string(),
								slug: z.string(),
								avatarUrl: z.string().url().nullable(),
								organizationId: z.string().uuid(),
								ownerId: z.string().uuid(),
								owner: z.object({
									id: z.string().uuid(),
									name: z.string().nullable(),
									avatarUrl: z.string().url().nullable(),
								}),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId()

				const { orgSlug, projectId } = request.params

				const { organization, membership } =
					await request.getUserMemberShip(orgSlug)

				const project = await prisma.project.findUnique({
					where: {
						id: projectId,
						organizationId: organization.id,
					},
				})

				if (!project) {
					throw new BadRequestError('Project not found')
				}

				const authProject = projectSchema.parse(project)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('update', authProject)) {
					throw new BadRequestError(
						'You do not have permission to update this project',
					)
				}

				const { name, description } = request.body

				await prisma.project.update({
					where: {
						id: projectId,
					},
					data: {
						name,
						description,
					},
				})

				return reply.status(204).send()
			},
		)
}
