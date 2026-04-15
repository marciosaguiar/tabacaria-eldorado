import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'
import { getSettings, saveSettings } from '@/lib/settings'
import { isAdminRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx. 5MB)' }, { status: 400 })
    }

    const logoUrl = await uploadImage(file)
    const settings = await getSettings()
    await saveSettings({ ...settings, logoUrl })

    return NextResponse.json({ logoUrl })
  } catch (err) {
    console.error('Logo upload error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload da logo' }, { status: 500 })
  }
}
