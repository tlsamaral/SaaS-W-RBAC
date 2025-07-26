import { acceptInvite } from '@/http/accept-invite'
import { signInWithGithub } from '@/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth Code not found' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({ code })

  const cookie = await cookies()

  cookie.set('token', token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    httpOnly: true,
  })

  const inviteId = cookie.get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
      cookie.delete('inviteId')
    } catch {}
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
