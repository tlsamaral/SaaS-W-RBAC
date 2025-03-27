import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string | null
    avatarUrl: string | null
    slug: string
  }[]
}

export async function getOrganizations() {
  const result = await api.get('organizations').json<GetOrganizationsResponse>()

  return result
}
