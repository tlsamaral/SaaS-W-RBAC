import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function updateOrganization({
  org,
  domain,
  name,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<void> {
  await api.put(`organizations/${org}`, {
    json: { domain, name, shouldAttachUsersByDomain },
  })
}
