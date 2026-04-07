'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminProductFAB from '@/components/AdminProductFAB'
import { Product } from '@/types'

function fmt(v: number | null) {
  if (v === null || v === undefined) return null
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ProductCard({ product, channel }: { product: Product; channel: 'varejo' | 'atacado' }) {
  const price = channel === 'varejo' ? product.precoVarejo : product.precoAtacado
  return (
    <div className="product-card group relative rounded-sm overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-border)', transition: 'border-color 0.3s, box-shadow 0.3s' }}>
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-hover)' }}>
        {product.imagem ? (
          <Image src={product.imagem} alt={product.nome} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            style={{ objectFit: 'cover' }} className="transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.categoria && (
          <span className="absolute top-2 left-2 text-[9px] font-inter font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase"
            style={{ backgroundColor: 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.3)' }}>
            {product.categoria}
          </span>
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 50%)' }} />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-playfair text-base sm:text-lg line-clamp-1 leading-snug" style={{ color: 'var(--text-primary)' }}>
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="text-xs mt-1 line-clamp-2 font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {product.descricao}
          </p>
        )}
        {fmt(price) && (
          <p className="font-inter font-bold text-xl sm:text-2xl mt-auto pt-3 tracking-tight" style={{ color: 'var(--gold)' }}>
            {fmt(price)}
          </p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)' }} />
    </div>
  )
}

interface Props {
  initialProducts: Product[]
  categorias: string[]
  channel: 'varejo' | 'atacado'
}

export default function CatalogGrid({ initialProducts, categorias, channel }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filterCat, setFilterCat] = useState('todas')

  const visible = products.filter(p => {
    const chanOk = channel === 'varejo' ? p.visivelVarejo : p.visivelAtacado
    const catOk  = filterCat === 'todas' || p.categoria === filterCat
    return chanOk && catOk
  })

  const usedCats = categorias.filter(c =>
    products.some(p => p.categoria === c && (channel === 'varejo' ? p.visivelVarejo : p.visivelAtacado))
  )
  const cats = usedCats.length > 0 ? ['todas', ...usedCats] : []

  return (
    <>
      {/* Filter tabs */}
      {cats.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-inter font-medium capitalize transition-all"
                style={{
                  backgroundColor: filterCat === c ? 'var(--gold)' : 'var(--bg-card)',
                  color: filterCat === c ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${filterCat === c ? 'var(--gold)' : 'var(--bg-border)'}`,
                }}>
                {c === 'todas' ? 'Todas' : c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 border rounded-full flex items-center justify-center mb-4" style={{ borderColor: 'rgba(var(--gold-rgb),0.2)' }}>
              <svg className="w-6 h-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>Nenhum produto disponível no momento.</p>
            <p className="font-inter text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Em breve novos produtos serão adicionados.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-inter mb-5 tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {visible.length} {visible.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
              {filterCat !== 'todas' ? ` em ${filterCat}` : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {visible.map(p => <ProductCard key={p.id} product={p} channel={channel} />)}
            </div>
          </>
        )}
      </div>

      <AdminProductFAB
        channel={channel}
        categorias={categorias}
        onAdded={p => setProducts(prev => [...prev, p])}
      />
    </>
  )
}
