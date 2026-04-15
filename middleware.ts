import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, verifySessionToken } from './lib/auth-edge'

export const config = {
  matcher: ['/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Login page é pública — não redireciona
  if (pathname === '/admin/login') return NextResponse.next()

  const cookieHeader = request.headers.get('cookie') ?? ''
  const re = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  const match = cookieHeader.match(re)
  const token = match ? decodeURIComponent(match[1]) : null

  const valid = token ? await verifySessionToken(token) : false

  if (!valid) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
