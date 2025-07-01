import { api } from './api-client'

interface CreateProjectRequest {
  name: string
  description: string | null
  org: string
}

export async function createProject({
  description,
  name,
  org,
}: CreateProjectRequest): Promise<void> {
  await api.post(`organizations/${org}/projects`, {
    json: { description, name },
  })
}
