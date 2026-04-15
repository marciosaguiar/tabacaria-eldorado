import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  return NextResponse.json(
    { ok: true },
    { headers: { 'Set-Cookie': clearSessionCookie() } },
  )
}
