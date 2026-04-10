import { NextRequest, NextResponse } from 'next/server'
import { recordPageView, recordProductView, getAnalytics } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getAnalytics()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.type === 'page' && typeof body.page === 'string') {
      await recordPageView(body.page)
    } else if (body.type === 'product' && body.id && body.name) {
      await recordProductView(body.id, body.name)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
