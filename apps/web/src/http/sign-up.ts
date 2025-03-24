import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

export async function signUp({
  email,
  name,
  password,
}: SignUpRequest): Promise<void> {
  await api.post('users', {
    json: { email, name, password },
  })
}
