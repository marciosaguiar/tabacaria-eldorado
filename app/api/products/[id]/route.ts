import { NextResponse } from 'next/server'
import { getProducts, saveProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const products = await getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const updated = {
      ...products[index],
      nome: body.nome !== undefined ? String(body.nome).trim() : products[index].nome,
      descricao: body.descricao !== undefined ? String(body.descricao).trim() : products[index].descricao,
      imagem: body.imagem !== undefined ? String(body.imagem) : products[index].imagem,
      precoAtacado:
        body.precoAtacado !== null && body.precoAtacado !== undefined && body.precoAtacado !== ''
          ? Number(body.precoAtacado)
          : null,
      precoVarejo:
        body.precoVarejo !== null && body.precoVarejo !== undefined && body.precoVarejo !== ''
          ? Number(body.precoVarejo)
          : null,
      visivelAtacado: body.visivelAtacado !== undefined ? Boolean(body.visivelAtacado) : products[index].visivelAtacado,
      visivelVarejo: body.visivelVarejo !== undefined ? Boolean(body.visivelVarejo) : products[index].visivelVarejo,
      categoria: body.categoria !== undefined ? String(body.categoria) : (products[index].categoria || ''),
      tipo: body.tipo !== undefined ? (body.tipo === 'combo' ? 'combo' : 'produto') : (products[index].tipo || 'produto'),
      ativo: body.ativo !== undefined ? Boolean(body.ativo) : (products[index].ativo !== false),
    }

    products[index] = updated
    await saveProducts(products)

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const products = await getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    products.splice(index, 1)
    await saveProducts(products)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
