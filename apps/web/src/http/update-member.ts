import type { Role } from '@saas/auth'
import { api } from './api-client'

interface UpdateMemberRequest {
  org: string
  memberId: string
  role: Role
}

type UpdateMemberResponse = never

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest) {
  await api
    .put(`organizations/${org}/members/${memberId}`, {
      json: { role },
    })
    .json<UpdateMemberResponse>()
}
