import { getProfile } from '@/http/get-profile'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export async function isAuthenticated() {
  const appCookies = await cookies()

  return appCookies.has('token')
}

export async function auth() {
  const appCookies = await cookies()
  const token = appCookies.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  redirect('/api/auth/sign-out')
}
