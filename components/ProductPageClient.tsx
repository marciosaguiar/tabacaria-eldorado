'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartProvider, useCart } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { Product } from '@/types'

function fmt(v: number | null) {
  if (v === null) return null
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ─── Add to cart button (precisa estar dentro do CartProvider) ────────────────

function AddToCartButton({ product, channel }: { product: Product; channel: 'varejo' | 'atacado' }) {
  const { addItem, openDrawer } = useCart()
  const [added, setAdded] = useState(false)

  const price = channel === 'varejo' ? product.precoVarejo : product.precoAtacado

  const handleClick = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setTimeout(() => openDrawer(), 300)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        width: '100%',
        padding: '18px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #A06810 0%, #C8891A 50%, #E8A832 100%)',
        color: '#fff',
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        boxShadow: '0 4px 20px rgba(200,137,26,0.4)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      disabled={price === null}
    >
      {added ? (
        <>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Adicionado ao carrinho
        </>
      ) : price === null ? (
        'Preco indisponivel'
      ) : (
        <>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Adicionar ao carrinho
        </>
      )}
    </button>
  )
}

// ─── Inner content (within CartProvider) ─────────────────────────────────────

function ProductContent({
  product,
  channel,
  whatsapp,
}: {
  product: Product
  channel: 'varejo' | 'atacado'
  whatsapp: string
}) {
  const price  = channel === 'varejo' ? product.precoVarejo  : product.precoAtacado
  const otherP = channel === 'varejo' ? product.precoAtacado : product.precoVarejo
  const channelLabel = channel === 'varejo' ? 'Varejo' : 'Atacado'
  const otherLabel   = channel === 'varejo' ? 'Atacado' : 'Varejo'
  const otherPath    = channel === 'varejo' ? 'atacado' : 'varejo'

  return (
    <div style={{ minHeight: '100svh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 16px', height: '52px',
        backgroundColor: 'rgba(253,246,236,0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid rgba(200,137,26,0.1)',
      }}>
        <Link
          href={`/${channel}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--gold-deep)', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600,
            fontFamily: 'var(--font-inter, sans-serif)',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Catálogo {channelLabel}
        </Link>

        <span style={{ flex: 1 }} />

        <span style={{
          fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-inter, sans-serif)',
        }}>
          {channelLabel}
        </span>
      </header>

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '0 0 80px' }}>

        {/* Imagem */}
        {product.imagem && (
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '75%', // 4:3
            backgroundColor: 'rgba(248,236,210,0.6)',
            overflow: 'hidden',
          }}>
            <Image
              src={product.imagem}
              alt={product.nome}
              fill
              sizes="(max-width: 560px) 100vw, 560px"
              style={{ objectFit: 'contain', padding: '20px' }}
              priority
            />
          </div>
        )}

        {/* Info */}
        <div style={{ padding: '24px 20px' }}>

          {/* Categoria */}
          {product.categoria && (
            <p style={{
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              color: 'var(--gold-deep)', marginBottom: '8px',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}>
              {product.categoria}
            </p>
          )}

          {/* Nome */}
          <h1 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 900,
            color: 'var(--text)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}>
            {product.nome}
          </h1>

          {/* Descricao */}
          {product.descricao && (
            <p style={{
              fontSize: '15px', color: 'var(--text-2)',
              lineHeight: 1.65,
              fontFamily: 'var(--font-inter, sans-serif)',
              marginBottom: '20px',
            }}>
              {product.descricao}
            </p>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(200,137,26,0.1)', marginBottom: '20px' }} />

          {/* Preco */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '12px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--text-3)', marginBottom: '4px',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}>
              Preco {channelLabel}
            </p>
            {price !== null ? (
              <p style={{
                fontSize: '28px', fontWeight: 800,
                color: 'var(--gold-deep)',
                fontFamily: 'var(--font-inter, sans-serif)',
                letterSpacing: '-0.02em',
              }}>
                {fmt(price)}
              </p>
            ) : (
              <p style={{ fontSize: '16px', color: 'var(--text-3)', fontFamily: 'var(--font-inter, sans-serif)' }}>
                Preco indisponivel
              </p>
            )}

            {/* Outro canal */}
            {otherP !== null && (
              <Link
                href={`/${otherPath}/produto/${product.id}`}
                style={{
                  display: 'inline-block', marginTop: '8px',
                  fontSize: '13px', color: 'var(--text-3)',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  textDecoration: 'none',
                }}
              >
                Ver preco {otherLabel}: {fmt(otherP)} ›
              </Link>
            )}
          </div>

          {/* Botao carrinho */}
          {product.ativo !== false && (
            <AddToCartButton product={product} channel={channel} />
          )}

          {product.ativo === false && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(200,137,26,0.06)',
              border: '1px solid rgba(200,137,26,0.15)',
              textAlign: 'center',
              fontSize: '14px', color: 'var(--text-3)',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}>
              Produto indisponivel no momento
            </div>
          )}
        </div>
      </main>

      {/* CartDrawer */}
      <CartDrawer whatsapp={whatsapp} channel={channel} />
    </div>
  )
}

// ─── Export (wraps com CartProvider) ─────────────────────────────────────────

export default function ProductPageClient({
  product,
  channel,
  whatsapp,
}: {
  product: Product
  channel: 'varejo' | 'atacado'
  whatsapp: string
}) {
  return (
    <CartProvider channel={channel}>
      <ProductContent product={product} channel={channel} whatsapp={whatsapp} />
    </CartProvider>
  )
}
