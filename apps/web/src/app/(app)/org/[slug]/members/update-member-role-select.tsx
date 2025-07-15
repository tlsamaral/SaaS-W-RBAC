'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Role } from '@saas/auth'
import type { ComponentProps } from 'react'
import { updateMemberAction } from './actions'

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
  async function updateMemberRole(role: Role) {
    await updateMemberAction(memberId, role)
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="w-32 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}
