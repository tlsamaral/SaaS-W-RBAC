import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function deleteProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			'/organizations/:slug/projects/:projectId',
			{
				schema: {
					tags: ['Projects'],
					summary: 'Delete a project',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						projectId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId()

				const { slug, projectId } = request.params

				const { organization, membership } =
					await request.getUserMemberShip(slug)

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

				if (cannot('delete', authProject)) {
					throw new BadRequestError(
						'You do not have permission to delete a project',
					)
				}

				await prisma.project.delete({
					where: {
						id: projectId,
					},
				})

				return reply.status(204).send()
			},
		)
}
