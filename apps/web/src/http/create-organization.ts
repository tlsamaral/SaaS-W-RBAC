import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function createOrganization({
  domain,
  name,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<void> {
  await api.post('organizations', {
    json: { domain, name, shouldAttachUsersByDomain },
  })
}
