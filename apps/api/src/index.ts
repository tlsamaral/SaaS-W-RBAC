import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER', id: '1' })

const project = projectSchema.parse({
	__typename: 'Project',
	id: '1',
	ownerId: '2',
})

console.log(ability.can('update', project))
console.log(ability.can('delete', 'Project'))
