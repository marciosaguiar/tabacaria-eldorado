'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

interface Props {
  whatsapp: string
  channel: 'varejo' | 'atacado'
}

export default function CartDrawer({ whatsapp, channel }: Props) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isDrawerOpen, closeDrawer, buildAndSendOrder, orders, reorderItems, clearCart } = useCart()
  const [tab, setTab] = useState<'cart' | 'history'>('cart')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isDrawerOpen) {
      setVisible(true)
      setTab('cart')
    } else {
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [isDrawerOpen])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isDrawerOpen])

  if (!visible) return null

  const total = totalPrice(channel)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300]"
        style={{
          backgroundColor: 'rgba(28,17,8,0.35)',
          backdropFilter: 'blur(8px)',
          opacity: isDrawerOpen ? 1 : 0,
          transition: 'opacity 350ms ease',
        }}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[310] flex flex-col rounded-t-2xl"
        style={{
          background: 'var(--glass-strong)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 -8px 40px rgba(168,108,32,0.16), 0 -1px 0 rgba(200,137,26,0.12)',
          maxHeight: '85dvh',
          transform: isDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--bg-border)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
          <div className="flex gap-1">
            <button onClick={() => setTab('cart')}
              className="px-4 py-1.5 rounded-full text-xs font-inter font-medium transition-all"
              style={{
                backgroundColor: tab === 'cart' ? 'var(--gold)' : 'transparent',
                color: tab === 'cart' ? '#000' : 'var(--text-secondary)',
              }}>
              🛒 Carrinho {totalItems > 0 && `(${totalItems})`}
            </button>
            <button onClick={() => setTab('history')}
              className="px-4 py-1.5 rounded-full text-xs font-inter font-medium transition-all"
              style={{
                backgroundColor: tab === 'history' ? 'var(--gold)' : 'transparent',
                color: tab === 'history' ? '#000' : 'var(--text-secondary)',
              }}>
              📋 Histórico {orders.length > 0 && `(${orders.length})`}
            </button>
          </div>
          <button onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10"
            style={{ color: 'var(--text-secondary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'cart' ? (
            items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-4"
                  style={{ borderColor: 'rgba(var(--gold-rgb),0.2)' }}>
                  <svg className="w-7 h-7 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="font-inter text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Carrinho vazio</p>
                <p className="font-inter text-xs" style={{ color: 'var(--text-muted)' }}>Adicione produtos clicando no botão + nos cards</p>
                {orders.length > 0 && (
                  <button onClick={() => setTab('history')}
                    className="mt-4 text-xs font-inter underline"
                    style={{ color: 'var(--gold)' }}>
                    Ver pedidos anteriores
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map(item => {
                  const price = channel === 'varejo' ? item.product.precoVarejo : item.product.precoAtacado
                  const subtotal = (price ?? 0) * item.quantity
                  return (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(200,137,26,0.12)', backdropFilter: 'blur(8px)' }}>
                      {/* Imagem */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: 'rgba(248,236,210,0.8)' }}>
                        {item.product.imagem ? (
                          <Image src={item.product.imagem} alt={item.product.nome} fill style={{ objectFit: 'cover' }} sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-sm leading-snug line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                          {item.product.nome}
                        </p>
                        {item.product.tipo === 'combo' && (
                          <span className="text-[9px] font-inter font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)' }}>
                            COMBO
                          </span>
                        )}
                        {price ? (
                          <p className="font-inter text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {fmt(price)} un. {item.quantity > 1 && <span style={{ color: 'var(--gold)' }}>= {fmt(subtotal)}</span>}
                          </p>
                        ) : null}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-lg leading-none font-medium"
                          style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: 'var(--text)', border: '1px solid rgba(200,137,26,0.18)' }}>
                          −
                        </button>
                        <span className="w-6 text-center font-inter text-sm font-semibold" style={{ color: 'var(--text)' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-lg leading-none font-medium"
                          style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: 'var(--text)', border: '1px solid rgba(200,137,26,0.18)' }}>
                          +
                        </button>
                        <button onClick={() => removeItem(item.product.id)}
                          className="w-7 h-7 ml-1 rounded-full flex items-center justify-center transition-colors"
                          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
                <button onClick={clearCart}
                  className="w-full text-xs font-inter transition-opacity hover:opacity-70 pt-1"
                  style={{ color: 'var(--text-muted)' }}>
                  Limpar carrinho
                </button>
              </div>
            )
          ) : (
            /* Histórico */
            orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>Nenhum pedido registrado ainda.</p>
                <p className="font-inter text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Seus pedidos enviados por WhatsApp aparecerão aqui.</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-4 rounded-xl space-y-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(200,137,26,0.12)', backdropFilter: 'blur(8px)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                        {fmt(order.total)}
                      </span>
                      <span className="font-inter text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(order.timestamp)}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {order.items.map(i => (
                        <p key={i.product.id} className="font-inter text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {i.product.nome} ×{i.quantity}
                        </p>
                      ))}
                    </div>
                    <button onClick={() => { reorderItems(order); setTab('cart') }}
                      className="w-full py-2 rounded-lg text-xs font-inter font-medium transition-all"
                      style={{ backgroundColor: 'rgba(var(--gold-rgb),0.1)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.25)' }}>
                      ↺ Refazer pedido
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer — só no tab cart e com itens */}
        {tab === 'cart' && items.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
              <span className="font-playfair text-xl font-bold" style={{ color: 'var(--gold)' }}>
                {fmt(total)}
              </span>
            </div>
            <button
              onClick={() => buildAndSendOrder(whatsapp, channel)}
              disabled={!whatsapp}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-inter font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
              style={{ backgroundColor: '#25D366', color: '#fff', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Finalizar pedido via WhatsApp
            </button>
            {!whatsapp && (
              <p className="text-center text-xs mt-2 font-inter" style={{ color: 'var(--text-muted)' }}>
                Configure o WhatsApp nas configurações da empresa
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
