import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  email: string
  password: string
}

export async function createOrganization({
  email,
  name,
  password,
}: CreateOrganizationRequest): Promise<void> {
  await api.post('users', {
    json: { email, name, password },
  })
}
