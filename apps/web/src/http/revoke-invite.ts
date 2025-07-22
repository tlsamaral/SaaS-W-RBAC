import { api } from './api-client'

interface RevokeInviteRequest {
  org: string
  inviteId: string
}

type RevokeInviteResponse = never

export async function revokeInvite({ org, inviteId }: RevokeInviteRequest) {
  await api
    .delete(`organizations/${org}/invites/${inviteId}`)
    .json<RevokeInviteResponse>()
}
