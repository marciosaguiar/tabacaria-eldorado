import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'
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

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx. 10MB)' }, { status: 400 })
    }

    const imagePath = await uploadImage(file)
    return NextResponse.json({ path: imagePath })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
