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
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {product.tipo === 'combo' && (
              <span className="text-[9px] font-inter font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(201,150,42,0.25)', color: 'var(--el-gold-light)', border: '1px solid rgba(201,150,42,0.4)' }}>
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
          <h2 className="font-playfair font-bold text-lg sm:text-xl mt-1 leading-tight text-white truncate">
            {product.nome}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div
        className="flex-1 relative mx-4 rounded-xl overflow-hidden"
        style={{ minHeight: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {product.imagem ? (
          <Image src={product.imagem} alt={product.nome} fill style={{ objectFit: 'contain' }} sizes="100vw" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: 'var(--el-gold-solid)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 pt-3 pb-5" onClick={e => e.stopPropagation()}>
        {product.descricao && (
          <p className="font-inter text-sm mb-3 leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {product.descricao}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 mb-3">
          {fmt(price) ? (
            <p className="font-playfair font-bold text-2xl sm:text-3xl tracking-tight el-gold-text">
              {fmt(price)}
            </p>
          ) : <span />}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-inter font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: added ? 'rgba(201,150,42,0.2)' : 'rgba(201,150,42,0.15)',
                color: 'var(--el-gold-light)',
                border: '1px solid rgba(201,150,42,0.4)',
              }}
            >
              {added ? '✓ Adicionado' : '+ Carrinho'}
            </button>
            {whatsapp && (
              <button
                onClick={handleAddAndOrder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-inter font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#25D366', color: '#fff' }}
              >
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
            <div className="flex gap-2 overflow-x-auto pb-1">
              {related.map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelectProduct(r)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
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
    <button
      onClick={openDrawer}
      className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: 'var(--el-gradient-dark)',
        border: '1px solid var(--el-gold-border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
      title="Carrinho de compras"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
        style={{ color: 'var(--el-gold-light)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-inter text-[10px] font-bold"
          style={{ background: 'var(--el-gradient-gold)', color: '#3B1A08' }}
        >
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--el-bg-surface)',
        border: 'var(--el-border-card)',
        borderRadius: 'var(--el-radius-md)',
        boxShadow: 'var(--el-shadow-card)',
        overflow: 'hidden',
      }}
    >
      <div className="el-skeleton" style={{ width: '100%', aspectRatio: '1/1' }} />
      <div style={{ padding: '10px 12px 14px' }}>
        <div className="el-skeleton" style={{ height: '16px', marginBottom: '8px', width: '72%', borderRadius: '4px' }} />
        <div className="el-skeleton" style={{ height: '10px', marginBottom: '4px', width: '100%', borderRadius: '4px' }} />
        <div className="el-skeleton" style={{ height: '10px', marginBottom: '14px', width: '55%', borderRadius: '4px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="el-skeleton" style={{ height: '20px', width: '42%', borderRadius: '4px' }} />
          <div className="el-skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
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
    <div
      style={{
        backgroundColor: 'var(--el-bg-surface)',
        border: 'var(--el-border-card)',
        borderRadius: 'var(--el-radius-md)',
        boxShadow: 'var(--el-shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--el-shadow-card)'
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#F5EFE0',
          cursor: 'zoom-in',
          borderRadius: '14px 14px 0 0',
        }}
        onClick={onImageClick}
      >
        {product.imagem ? (
          <Image
            src={product.imagem}
            alt={product.nome}
            fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            style={{
              objectFit: 'cover',
              filter: product.ativo === false ? 'grayscale(100%) brightness(0.5)' : undefined,
              transition: 'transform 0.4s ease',
            }}
            className="group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Tobacco book icon */}
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: 'var(--el-gold-solid)', opacity: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}

        {/* Indisponível overlay */}
        {product.ativo === false && (
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#bbb',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Indisponível
            </span>
          </div>
        )}

        {/* Category / Combo badge */}
        {(product.categoria || isCombo) && (
          <span
            className="absolute top-2 left-2"
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'rgba(255,255,255,0.92)',
              color: 'var(--el-gold-solid)',
              border: '0.5px solid var(--el-gold-border)',
              borderRadius: '6px',
              padding: '3px 7px',
              lineHeight: 1.4,
            }}
          >
            {isCombo ? '✦ COMBO' : product.categoria}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav() }}
          className="absolute top-2 right-2"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg width="14" height="14" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
            style={{ color: isFav ? '#ef4444' : 'rgba(0,0,0,0.45)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          className="line-clamp-1"
          style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--el-text-primary)',
            lineHeight: 1.3,
            marginBottom: '4px',
          }}
        >
          {product.nome}
        </h3>

        {product.descricao && (
          <p
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '11px',
              color: 'var(--el-text-hint)',
              lineHeight: 1.4,
              marginBottom: '8px',
            }}
          >
            {product.descricao}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '6px',
          }}
        >
          {fmt(price) ? (
            <p
              className="el-gold-text"
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '17px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {fmt(price)}
            </p>
          ) : <span />}

          <button
            onClick={handleAdd}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: justAdded ? 'rgba(201,150,42,0.15)' : 'var(--el-gradient-gold)',
              color: justAdded ? 'var(--el-gold-solid)' : '#3B1A08',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: justAdded ? '14px' : '22px',
              fontWeight: 400,
              lineHeight: 1,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'filter 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.07)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.07)' }}
            title={justAdded ? 'Adicionado!' : 'Adicionar ao carrinho'}
          >
            {justAdded ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inner grid ───────────────────────────────────────────────────────────────
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
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const { isFavorite, toggle, count: favCount } = useFavorites()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    setIsAdmin(!!localStorage.getItem('eldorado_admin_token'))
    return () => clearTimeout(t)
  }, [])

  const chanOk = (p: Product) => channel === 'varejo' ? p.visivelVarejo : p.visivelAtacado

  const visible = products.filter(p => {
    if (!chanOk(p)) return false
    if (filterCat === 'favoritos') return isFavorite(p.id)
    if (filterCat === 'todas') return true
    return p.categoria === filterCat
  })

  const combos   = visible.filter(p => p.tipo === 'combo')
  const regular  = visible.filter(p => p.tipo !== 'combo')

  const usedCats = categorias.filter(c => products.some(p => p.categoria === c && chanOk(p)))
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

      {/* Back link — admin only */}
      {isAdmin && (
        <div style={{ padding: '12px 16px 0' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '12px',
              color: 'var(--el-text-hint)',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Início
          </Link>
        </div>
      )}

      {/* Category chips */}
      {cats.length > 1 && (
        <div className="el-chips-scroll" style={{ padding: '14px 16px 4px' }}>
          {cats.map(c => {
            const isActive = filterCat === c
            const label = c === 'todas' ? 'Todas' : c === 'favoritos' ? `❤ Favoritos (${favCount})` : c
            return (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                style={{
                  background: isActive ? 'var(--el-gradient-gold)' : '#F0EAE0',
                  border: isActive ? 'none' : '0.5px solid var(--el-gold-border)',
                  borderRadius: '20px',
                  padding: '0 16px',
                  height: '36px',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#3B1A08' : 'var(--el-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  lineHeight: '36px',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '0 16px 32px' }}>

        {/* Skeleton loading */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px',
              paddingTop: '16px',
            }}
          >
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && (
          <>
            {/* Combos section */}
            {combos.length > 0 && filterCat !== 'favoritos' && (
              <section style={{ paddingTop: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--el-gold-border), transparent)' }} />
                  <h2
                    style={{
                      fontFamily: 'var(--font-playfair, serif)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--el-gold-solid)',
                      lineHeight: 1.3,
                    }}
                  >
                    ✦ Combos & Kits
                  </h2>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--el-gold-border))' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
                  {combos.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      channel={channel}
                      isFav={isFavorite(p.id)}
                      onToggleFav={() => toggle(p.id)}
                      onImageClick={() => setLightbox(p)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {regular.length === 0 && combos.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#F0EAE0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: 'var(--el-gold-solid)', opacity: 0.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair, serif)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--el-text-secondary)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {filterCat === 'favoritos' ? 'Nenhum favorito ainda' : 'Nenhum produto nesta categoria'}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    color: 'var(--el-text-hint)',
                    lineHeight: 1.5,
                  }}
                >
                  {filterCat === 'favoritos'
                    ? 'Toque no ♡ nos produtos para salvar.'
                    : 'Em breve novos produtos serão adicionados.'}
                </p>
              </div>
            )}

            {/* Main grid */}
            {regular.length > 0 && (
              <section style={{ paddingTop: combos.length > 0 ? '0' : '16px' }}>
                {combos.length > 0 && filterCat === 'todas' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--el-gold-border), transparent)' }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-playfair, serif)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--el-text-secondary)',
                        lineHeight: 1.3,
                      }}
                    >
                      Produtos
                    </span>
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--el-gold-border))' }} />
                  </div>
                )}

                {/* Count */}
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '12px',
                    color: 'var(--el-text-hint)',
                    lineHeight: 1.4,
                    marginBottom: '12px',
                  }}
                >
                  {regular.length} {regular.length === 1 ? 'produto' : 'produtos'}
                  {filterCat !== 'todas' && filterCat !== 'favoritos' ? ` em ${filterCat}` : ''}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
                  {regular.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      channel={channel}
                      isFav={isFavorite(p.id)}
                      onToggleFav={() => toggle(p.id)}
                      onImageClick={() => setLightbox(p)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* FABs */}
      <CartFAB />
      <AdminProductFAB channel={channel} categorias={categorias} onAdded={onAdded} />
    </>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────
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
