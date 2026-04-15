import { NextResponse } from 'next/server'
import { getProducts, saveProducts } from '@/lib/db'
import { isAdminRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()

    if (!body.nome || typeof body.nome !== 'string') {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const products = await getProducts()

    const newProduct = {
      id: crypto.randomUUID(),
      nome: String(body.nome).trim(),
      descricao: String(body.descricao || '').trim(),
      imagem: String(body.imagem || ''),
      precoAtacado:
        body.precoAtacado !== null && body.precoAtacado !== undefined && body.precoAtacado !== ''
          ? Number(body.precoAtacado)
          : null,
      precoVarejo:
        body.precoVarejo !== null && body.precoVarejo !== undefined && body.precoVarejo !== ''
          ? Number(body.precoVarejo)
          : null,
      visivelAtacado: body.visivelAtacado !== false,
      visivelVarejo: body.visivelVarejo !== false,
      categoria: String(body.categoria || ''),
      tipo: (body.tipo === 'combo' ? 'combo' : 'produto') as 'produto' | 'combo',
      ativo: body.ativo === false ? false : true,
    }

    products.push(newProduct)
    await saveProducts(products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
