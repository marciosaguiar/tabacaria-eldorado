'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, CompanySettings } from '@/types'

// ─── Icons ───────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const GearIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        borderRadius: '100px',
        backgroundColor: 'rgba(140, 90, 10, 0.96)',
        color: '#fff',
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 24px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)',
        animation: 'toastIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ color: '#FFD060', flexShrink: 0 }}><CheckIcon /></span>
      {message}
    </div>
  )
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

function BottomSheet({
  product,
  onCopy,
  onClose,
}: {
  product: Product
  onCopy: (url: string, msg: string) => void
  onClose: () => void
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const hasVarejo  = product.visivelVarejo  && product.precoVarejo  !== null
  const hasAtacado = product.visivelAtacado && product.precoAtacado !== null

  const fmt = (v: number | null) =>
    v === null ? null : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(28,17,8,0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.18s ease',
        }}
      />
      {/* Sheet */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 1001,
          backgroundColor: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '0 0 max(24px, env(safe-area-inset-bottom)) 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          animation: 'sheetUp 0.26s cubic-bezier(0.34,1.56,0.64,1)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(160,104,16,0.25)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 20px 16px',
          borderBottom: '1px solid rgba(200,137,26,0.1)',
        }}>
          {/* Thumb */}
          {product.imagem && (
            <div style={{
              position: 'relative', width: '56px', height: '56px',
              borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
              backgroundColor: 'rgba(248,236,210,0.8)',
              border: '1px solid rgba(200,137,26,0.15)',
            }}>
              <Image src={product.imagem} alt={product.nome} fill sizes="56px" style={{ objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: '16px', fontWeight: 700,
              color: 'var(--text)', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {product.nome}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {hasVarejo && (
                <span style={{ fontSize: '12px', color: 'var(--gold-deep)', fontFamily: 'var(--font-inter, sans-serif)', fontWeight: 500 }}>
                  Varejo {fmt(product.precoVarejo)}
                </span>
              )}
              {hasAtacado && (
                <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-inter, sans-serif)', fontWeight: 500 }}>
                  Atacado {fmt(product.precoAtacado)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'rgba(200,137,26,0.08)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hasVarejo && (
            <button
              onClick={() => { onCopy(`${baseUrl}/varejo/produto/${product.id}`, 'Link varejo copiado'); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 18px',
                borderRadius: '14px',
                backgroundColor: 'var(--gold)',
                color: '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '15px', fontWeight: 700,
                letterSpacing: '-0.01em',
                textAlign: 'left',
              }}
            >
              <CopyIcon />
              <span style={{ flex: 1 }}>Copiar link Varejo</span>
            </button>
          )}
          {hasAtacado && (
            <button
              onClick={() => { onCopy(`${baseUrl}/atacado/produto/${product.id}`, 'Link atacado copiado'); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 18px',
                borderRadius: '14px',
                backgroundColor: 'var(--text)',
                color: 'var(--gold-light)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '15px', fontWeight: 700,
                letterSpacing: '-0.01em',
                textAlign: 'left',
              }}
            >
              <CopyIcon />
              <span style={{ flex: 1 }}>Copiar link Atacado</span>
            </button>
          )}
          <Link
            href={`/varejo/produto/${product.id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px 18px',
              borderRadius: '14px',
              backgroundColor: 'rgba(200,137,26,0.08)',
              color: 'var(--gold-deep)',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '15px', fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            <ExternalIcon />
            <span style={{ flex: 1 }}>Ver produto</span>
          </Link>
        </div>
      </div>
    </>
  )
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const fmt = (v: number | null) =>
    v === null ? null : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <button
      onClick={() => onSelect(product)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        border: '1px solid rgba(0,0,0,0.07)',
        cursor: 'pointer', width: '100%', textAlign: 'left',
        transition: 'background-color 0.15s',
      }}
    >
      {product.imagem ? (
        <div style={{
          position: 'relative', width: '44px', height: '44px',
          borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
          backgroundColor: 'rgba(248,236,210,0.8)',
        }}>
          <Image src={product.imagem} alt={product.nome} fill sizes="44px" style={{ objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{
          width: '44px', height: '44px', borderRadius: '8px', flexShrink: 0,
          backgroundColor: 'rgba(200,137,26,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>
          🚬
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize: '14px', fontWeight: 600,
          color: 'var(--text)', lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.nome}
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
          {product.precoVarejo !== null && (
            <span style={{ fontSize: '12px', color: 'var(--gold-deep)', fontFamily: 'var(--font-inter, sans-serif)', fontWeight: 500 }}>
              V {fmt(product.precoVarejo)}
            </span>
          )}
          {product.precoAtacado !== null && (
            <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-inter, sans-serif)' }}>
              A {fmt(product.precoAtacado)}
            </span>
          )}
        </div>
      </div>
      <span style={{ color: 'var(--text-4)', flexShrink: 0, fontSize: '12px' }}>
        <CopyIcon />
      </span>
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  settings: CompanySettings
  products: Product[]
}

export default function CockpitClient({ settings, products }: Props) {
  const [toast, setToast] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sheet, setSheet] = useState<Product | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const copyToClipboard = useCallback(async (url: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback para browsers antigos
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const getBaseUrl = () =>
    typeof window !== 'undefined' ? window.location.origin : 'https://tabacaria-eldorado.vercel.app'

  const active = products.filter(p => p.ativo !== false)

  const filtered = query.trim().length > 0
    ? active.filter(p => {
        const q = query.toLowerCase()
        return (
          p.nome.toLowerCase().includes(q) ||
          (p.categoria || '').toLowerCase().includes(q) ||
          (p.descricao || '').toLowerCase().includes(q)
        )
      }).slice(0, 8)
    : []

  return (
    <div style={{
      minHeight: '100svh',
      backgroundColor: '#fff',
      fontFamily: 'var(--font-inter, sans-serif)',
    }}>
      {/* CSS animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.92); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .cockpit-copy-btn:active { transform: scale(0.97); }
        .product-row-btn:active { opacity: 0.75; }
      `}</style>

      {toast && <Toast message={toast} />}

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', height: '56px',
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {settings.logoUrl && (
            <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
              <Image
                src={settings.logoUrl}
                alt={settings.nome}
                fill sizes="28px"
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(200,137,26,0.3))' }}
                priority
              />
            </div>
          )}
          <span style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '17px', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            {settings.nome || 'Tabacaria Eldorado'}
          </span>
        </div>
        <Link
          href="/admin"
          title="Painel administrativo"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: 'rgba(200,137,26,0.08)',
            color: 'var(--gold)',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
          }}
        >
          <GearIcon />
        </Link>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* ── SEÇÃO 1: COPIAR LINK DE CATÁLOGO ───────────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--text-3)', marginBottom: '12px',
          }}>
            Copiar link de catálogo
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
          }}>
            {/* Varejo */}
            <button
              className="cockpit-copy-btn"
              onClick={() => copyToClipboard(`${getBaseUrl()}/varejo`, 'Link varejo copiado')}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 16px',
                borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #A06810 0%, #C8891A 50%, #E8A832 100%)',
                color: '#fff',
                boxShadow: '0 3px 14px rgba(200,137,26,0.32)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '15px', fontWeight: 700,
                  fontFamily: 'var(--font-inter, sans-serif)',
                  lineHeight: 1.2, marginBottom: '2px',
                }}>
                  Copiar link Varejo
                </p>
                <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: 400 }}>
                  Para consumidor final
                </p>
              </div>
              <span style={{ opacity: 0.8, flexShrink: 0, marginLeft: '10px' }}>
                <CopyIcon />
              </span>
            </button>

            {/* Atacado */}
            <button
              className="cockpit-copy-btn"
              onClick={() => copyToClipboard(`${getBaseUrl()}/atacado`, 'Link atacado copiado')}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 16px',
                borderRadius: '14px', border: '1.5px solid rgba(200,137,26,0.2)', cursor: 'pointer',
                background: '#1C1108',
                color: 'var(--gold-light)',
                boxShadow: '0 3px 14px rgba(0,0,0,0.15)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '15px', fontWeight: 700,
                  fontFamily: 'var(--font-inter, sans-serif)',
                  lineHeight: 1.2, marginBottom: '2px',
                }}>
                  Copiar link Atacado
                </p>
                <p style={{ fontSize: '12px', opacity: 0.55, fontWeight: 400, color: '#fff' }}>
                  Para revendedor
                </p>
              </div>
              <span style={{ opacity: 0.65, flexShrink: 0, marginLeft: '10px' }}>
                <CopyIcon />
              </span>
            </button>
          </div>
        </section>

        {/* ── SEÇÃO 2: BUSCAR PRODUTO ─────────────────────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--text-3)', marginBottom: '12px',
          }}>
            Buscar produto para enviar
          </p>

          {/* Campo de busca */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0 14px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#f5f5f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            boxShadow: 'none',
            marginBottom: '10px',
          }}>
            <span style={{ color: 'var(--text-4)', flexShrink: 0 }}><SearchIcon /></span>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar produto para enviar..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '15px', color: 'var(--text)',
                fontFamily: 'var(--font-inter, sans-serif)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: 'var(--text-4)', padding: '0', flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <CloseIcon />
              </button>
            )}
          </div>

          {/* Lista filtrada */}
          {query.trim() && filtered.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.map(p => (
                <ProductRow key={p.id} product={p} onSelect={setSheet} />
              ))}
            </div>
          )}

          {query.trim() && filtered.length === 0 && (
            <p style={{
              textAlign: 'center', fontSize: '14px',
              color: 'var(--text-3)', padding: '20px 0',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}>
              Nenhum produto encontrado para &quot;{query}&quot;
            </p>
          )}

          {!query.trim() && (
            <p style={{
              textAlign: 'center', fontSize: '13px',
              color: 'var(--text-4)', padding: '16px 0',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}>
              Digite o nome ou categoria do produto
            </p>
          )}
        </section>

        {/* ── SEÇÃO 3: ACESSOS RÁPIDOS ────────────────────────────── */}
        <section>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--text-3)', marginBottom: '12px',
          }}>
            Acessos rápidos
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            borderRadius: '14px', overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.07)',
            backgroundColor: '#fafafa',
          }}>
            <Link href="/admin" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px',
              textDecoration: 'none',
              color: 'var(--text)',
              borderBottom: '0.5px solid rgba(200,137,26,0.1)',
              fontSize: '14px', fontWeight: 500,
            }}>
              <span>Painel admin</span>
              <span style={{ color: 'var(--text-4)', fontSize: '18px' }}>›</span>
            </Link>
            <Link href="/varejo" target="_blank" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px',
              textDecoration: 'none',
              color: 'var(--text)',
              borderBottom: '0.5px solid rgba(200,137,26,0.1)',
              fontSize: '14px', fontWeight: 500,
            }}>
              <span>Ver catálogo Varejo</span>
              <span style={{ color: 'var(--text-4)', fontSize: '18px' }}>›</span>
            </Link>
            <Link href="/atacado" target="_blank" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '14px', fontWeight: 500,
            }}>
              <span>Ver catálogo Atacado</span>
              <span style={{ color: 'var(--text-4)', fontSize: '18px' }}>›</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Sheet */}
      {sheet && (
        <BottomSheet
          product={sheet}
          onCopy={copyToClipboard}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}
