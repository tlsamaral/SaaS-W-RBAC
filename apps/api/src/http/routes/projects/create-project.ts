import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_erros/bad-request-error'

export async function createProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/organizations/:slug/projects',
			{
				schema: {
					tags: ['Projects'],
					summary: 'Create a new project',
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						description: z.string(),
					}),
					params: z.object({
						slug: z.string(),
					}),
					response: {
						201: z.object({
							projectId: z.string().uuid(),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId()

				const { slug } = request.params

				const { organization, membership } =
					await request.getUserMemberShip(slug)

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('create', 'Project')) {
					throw new BadRequestError(
						'You do not have permission to create a project',
					)
				}

				const { name, description } = request.body

				const project = await prisma.project.create({
					data: {
						name,
						description,
						slug: createSlug(name),
						organizationId: organization.id,
						ownerId: userId,
					},
				})

				return reply.status(201).send({
					projectId: project.id,
				})
			},
		)
}
