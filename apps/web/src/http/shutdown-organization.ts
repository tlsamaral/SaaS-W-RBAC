import { api } from './api-client'

interface ShutdownOrganizationRequest {
  org: string
}

type ShutdownOrganizationResponse = never

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`).json<ShutdownOrganizationResponse>()
}
