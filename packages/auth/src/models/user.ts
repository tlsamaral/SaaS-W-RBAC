import { z } from 'zod'
import { roleSchema, type Role } from '../roles'

export const userSchema = z.object({
	role: roleSchema,
})
export type User = z.infer<typeof userSchema>
