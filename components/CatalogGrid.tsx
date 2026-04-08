'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdminProductFAB from '@/components/AdminProductFAB'
import CartDrawer from '@/components/CartDrawer'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/hooks/useFavorites'
import { Product } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(v: number | null) {
  if (v === null || v === undefined) return null
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const WaIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ product, channel, whatsapp, related, onClose, onSelectProduct }: {
  product: Product
  channel: 'varejo' | 'atacado'
  whatsapp: string
  related: Product[]
  onClose: () => void
  onSelectProduct: (p: Product) => void
}) {
  const { addItem, openDrawer } = useCart()
  const price = channel === 'varejo' ? product.precoVarejo : product.precoAtacado
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleAddAndOrder = () => {
    addItem(product)
    onClose()
    openDrawer()
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {product.tipo === 'combo' && (
              <span className="text-[9px] font-inter font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(var(--gold-rgb),0.25)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.4)' }}>
                ✦ COMBO
              </span>
            )}
            {product.categoria && (
              <span className="text-[10px] font-inter tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {product.categoria}
              </span>
            )}
          </div>
          <h2 className="font-playfair text-lg sm:text-xl mt-1 leading-tight text-white truncate">{product.nome}</h2>
        </div>
        <button onClick={onClose}
          className="ml-3 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative mx-4 rounded-xl overflow-hidden" style={{ minHeight: 0 }}
        onClick={e => e.stopPropagation()}>
        {product.imagem ? (
          <Image src={product.imagem} alt={product.nome} fill style={{ objectFit: 'contain' }} sizes="100vw" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 pt-3 pb-4" onClick={e => e.stopPropagation()}>
        {product.descricao && (
          <p className="font-inter text-sm mb-3 leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {product.descricao}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 mb-3">
          {fmt(price) ? (
            <p className="font-playfair font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: 'var(--gold)' }}>
              {fmt(price)}
            </p>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-inter font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: added ? 'rgba(var(--gold-rgb),0.2)' : 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.4)' }}>
              {added ? '✓ Adicionado' : '+ Carrinho'}
            </button>
            {whatsapp && (
              <button onClick={handleAddAndOrder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-inter font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#25D366', color: '#fff' }}>
                <WaIcon />
                Pedir
              </button>
            )}
          </div>
        </div>

        {/* Produtos relacionados */}
        {related.length > 0 && (
          <div>
            <p className="font-inter text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Veja também
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {related.map(r => (
                <button key={r.id} onClick={() => onSelectProduct(r)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {r.imagem && (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={r.imagem} alt={r.nome} fill style={{ objectFit: 'cover' }} sizes="32px" />
                    </div>
                  )}
                  <span className="font-inter text-xs max-w-[90px] text-left line-clamp-2 leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {r.nome}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cart FAB ─────────────────────────────────────────────────────────────────
function CartFAB() {
  const { totalItems, openDrawer } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button onClick={openDrawer}
      className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(var(--gold-rgb),0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      title="Carrinho de compras">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--gold)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-inter text-[10px] font-bold"
          style={{ backgroundColor: 'var(--gold)', color: '#000' }}>
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
interface CardProps {
  product: Product
  channel: 'varejo' | 'atacado'
  isFav: boolean
  onToggleFav: () => void
  onImageClick: () => void
}

function ProductCard({ product, channel, isFav, onToggleFav, onImageClick }: CardProps) {
  const { addItem } = useCart()
  const price = channel === 'varejo' ? product.precoVarejo : product.precoAtacado
  const isCombo = product.tipo === 'combo'
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <div className="product-card group relative rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${isCombo ? 'rgba(var(--gold-rgb),0.35)' : 'var(--bg-border)'}`,
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.2s',
        boxShadow: isCombo ? '0 0 16px rgba(var(--gold-rgb),0.08)' : 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = isCombo ? '0 0 16px rgba(var(--gold-rgb),0.08)' : 'none' }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden cursor-zoom-in"
        style={{ backgroundColor: 'var(--bg-hover)' }}
        onClick={onImageClick}>
        {product.imagem ? (
          <Image src={product.imagem} alt={product.nome} fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 opacity-15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges topo */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isCombo && (
            <span className="text-[9px] font-inter font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(var(--gold-rgb),0.9)', color: '#000' }}>
              ✦ COMBO
            </span>
          )}
          {product.categoria && !isCombo && (
            <span className="text-[9px] font-inter font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'rgba(var(--gold-rgb),0.9)', border: '1px solid rgba(var(--gold-rgb),0.3)', backdropFilter: 'blur(4px)' }}>
              {product.categoria}
            </span>
          )}
        </div>

        {/* Botão favorito */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav() }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
          <svg className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
            style={{ color: isFav ? '#ef4444' : 'rgba(255,255,255,0.7)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-playfair text-base sm:text-lg font-semibold line-clamp-1 leading-snug" style={{ color: 'var(--text-primary)' }}>
          {product.nome}
        </h3>
        {product.categoria && isCombo && (
          <span className="text-[9px] font-inter tracking-widest uppercase mt-0.5" style={{ color: 'var(--gold)', opacity: 0.7 }}>
            {product.categoria}
          </span>
        )}
        {product.descricao && (
          <p className="text-xs mt-1.5 line-clamp-2 font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {product.descricao}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-3 gap-2">
          {fmt(price) ? (
            <p className="font-inter font-bold text-xl sm:text-2xl tracking-tight" style={{ color: 'var(--gold)' }}>
              {fmt(price)}
            </p>
          ) : <span />}
          <button onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-inter font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              backgroundColor: justAdded ? 'rgba(var(--gold-rgb),0.2)' : 'rgba(var(--gold-rgb),0.12)',
              color: 'var(--gold)',
              border: '1px solid rgba(var(--gold-rgb),0.35)',
            }}>
            {justAdded ? (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="hidden sm:inline">Ok!</span></>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="hidden sm:inline">Adicionar</span></>
            )}
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)' }} />
    </div>
  )
}

// ─── Inner grid (usa useCart, useFavorites) ──────────────────────────────────
interface InnerProps {
  products: Product[]
  allProducts: Product[]
  categorias: string[]
  channel: 'varejo' | 'atacado'
  whatsapp: string
  onAdded: (p: Product) => void
}

function InnerGrid({ products, allProducts, categorias, channel, whatsapp, onAdded }: InnerProps) {
  const [filterCat, setFilterCat] = useState('todas')
  const [lightbox, setLightbox] = useState<Product | null>(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const { isFavorite, toggle, count: favCount } = useFavorites()

  const chanOk = (p: Product) => channel === 'varejo' ? p.visivelVarejo : p.visivelAtacado

  const visible = products.filter(p => {
    if (!chanOk(p)) return false
    if (filterCat === 'favoritos') return isFavorite(p.id)
    if (filterCat === 'todas') return true
    return p.categoria === filterCat
  })

  const combos = visible.filter(p => p.tipo === 'combo')
  const regular = visible.filter(p => p.tipo !== 'combo')

  const usedCats = categorias.filter(c =>
    products.some(p => p.categoria === c && chanOk(p))
  )
  const cats = ['todas', ...(favCount > 0 ? ['favoritos'] : []), ...usedCats]

  const getRelated = (p: Product) =>
    allProducts.filter(r => r.id !== p.id && r.categoria === p.categoria && chanOk(r)).slice(0, 5)

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          product={lightbox}
          channel={channel}
          whatsapp={whatsapp}
          related={getRelated(lightbox)}
          onClose={closeLightbox}
          onSelectProduct={setLightbox}
        />
      )}

      <CartDrawer whatsapp={whatsapp} channel={channel} />

      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-inter transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-muted)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar à página inicial
        </Link>
      </div>

      {/* Filter tabs */}
      {cats.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => {
              const isActive = filterCat === c
              const label = c === 'todas' ? 'Todas' : c === 'favoritos' ? `❤ Favoritos (${favCount})` : c
              return (
                <button key={c} onClick={() => setFilterCat(c)}
                  className="px-3 py-1.5 rounded-full text-xs font-inter font-medium capitalize transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--gold)' : 'var(--bg-card)',
                    color: isActive ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--bg-border)'}`,
                  }}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-10">

        {/* Seção de Combos */}
        {combos.length > 0 && filterCat !== 'favoritos' && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.4), transparent)' }} />
              <h2 className="font-playfair text-lg tracking-wide" style={{ color: 'var(--gold)' }}>✦ Combos & Kits</h2>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--gold-rgb),0.4))' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combos.map(p => (
                <ProductCard key={p.id} product={p} channel={channel}
                  isFav={isFavorite(p.id)} onToggleFav={() => toggle(p.id)}
                  onImageClick={() => setLightbox(p)} />
              ))}
            </div>
          </section>
        )}

        {/* Grid principal */}
        {regular.length === 0 && combos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 border rounded-full flex items-center justify-center mb-4" style={{ borderColor: 'rgba(var(--gold-rgb),0.2)' }}>
              <svg className="w-6 h-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>
              {filterCat === 'favoritos' ? 'Nenhum favorito ainda.' : 'Nenhum produto disponível no momento.'}
            </p>
            <p className="font-inter text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {filterCat === 'favoritos' ? 'Toque no ♡ nos produtos para salvar.' : 'Em breve novos produtos serão adicionados.'}
            </p>
          </div>
        ) : regular.length > 0 && (
          <section>
            {combos.length > 0 && filterCat === 'todas' && (
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.2), transparent)' }} />
                <h2 className="font-playfair text-base tracking-wide" style={{ color: 'var(--text-secondary)' }}>Produtos</h2>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--gold-rgb),0.2))' }} />
              </div>
            )}
            <p className="text-xs font-inter mb-5 tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {regular.length} {regular.length === 1 ? 'produto' : 'produtos'}
              {filterCat !== 'todas' && filterCat !== 'favoritos' ? ` em ${filterCat}` : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {regular.map(p => (
                <ProductCard key={p.id} product={p} channel={channel}
                  isFav={isFavorite(p.id)} onToggleFav={() => toggle(p.id)}
                  onImageClick={() => setLightbox(p)} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FABs */}
      <CartFAB />
      <AdminProductFAB channel={channel} categorias={categorias} onAdded={onAdded} />
    </>
  )
}

// ─── Public export (com CartProvider) ─────────────────────────────────────────
interface Props {
  initialProducts: Product[]
  categorias: string[]
  channel: 'varejo' | 'atacado'
  whatsapp?: string
}

export default function CatalogGrid({ initialProducts, categorias, channel, whatsapp = '' }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  return (
    <CartProvider>
      <InnerGrid
        products={products}
        allProducts={products}
        categorias={categorias}
        channel={channel}
        whatsapp={whatsapp}
        onAdded={p => setProducts(prev => [...prev, p])}
      />
    </CartProvider>
  )
}
