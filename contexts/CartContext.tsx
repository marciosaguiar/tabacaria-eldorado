'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Product, CartItem } from '@/types'

interface StoredOrder {
  id: string
  timestamp: number
  items: CartItem[]
  total: number
  channel: 'varejo' | 'atacado'
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: (channel: 'varejo' | 'atacado') => number
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  buildAndSendOrder: (whatsapp: string, channel: 'varejo' | 'atacado') => void
  orders: StoredOrder[]
  reorderItems: (order: StoredOrder) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface CartProviderProps {
  children: ReactNode
  /** Canal do catálogo — isola o carrinho e histórico por canal */
  channel: 'varejo' | 'atacado'
}

export function CartProvider({ children, channel }: CartProviderProps) {
  // Chaves únicas por canal: evita cruzamento de itens/preços entre catálogos
  const cartKey   = `eldorado-cart-${channel}`
  const ordersKey = `eldorado-orders-${channel}`

  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [orders, setOrders] = useState<StoredOrder[]>([])

  // Hidratação do localStorage (por canal)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(cartKey)
      if (stored) setItems(JSON.parse(stored))
      else setItems([]) // garante estado limpo ao trocar canal
    } catch { setItems([]) }
    try {
      const storedOrders = localStorage.getItem(ordersKey)
      if (storedOrders) setOrders(JSON.parse(storedOrders))
      else setOrders([])
    } catch { setOrders([]) }
  }, [cartKey, ordersKey])

  // Persiste carrinho por canal
  useEffect(() => {
    try { localStorage.setItem(cartKey, JSON.stringify(items)) } catch {}
  }, [items, cartKey])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.product.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== id))
    } else {
      setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const openDrawer  = useCallback(() => setIsDrawerOpen(true),  [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = useCallback((ch: 'varejo' | 'atacado') => {
    return items.reduce((sum, i) => {
      const price = ch === 'varejo' ? i.product.precoVarejo : i.product.precoAtacado
      return sum + (price ?? 0) * i.quantity
    }, 0)
  }, [items])

  const saveOrder = useCallback((order: StoredOrder) => {
    setOrders(prev => {
      const next = [order, ...prev].slice(0, 5)
      try { localStorage.setItem(ordersKey, JSON.stringify(next)) } catch {}
      return next
    })
  }, [ordersKey])

  const buildAndSendOrder = useCallback((whatsapp: string, ch: 'varejo' | 'atacado') => {
    if (!whatsapp || items.length === 0) return
    const num = whatsapp.replace(/\D/g, '')
    const total = totalPrice(ch)

    const linhas = items.map(i => {
      const price = ch === 'varejo' ? i.product.precoVarejo : i.product.precoAtacado
      const subtotal = (price ?? 0) * i.quantity
      const priceStr = price ? ` — ${fmt(price)} cada` : ''
      const subtotalStr = i.quantity > 1 ? ` → ${fmt(subtotal)}` : ''
      return `• *${i.product.nome}* x${i.quantity}${priceStr}${subtotalStr}`
    }).join('\n')

    const msg = [
      'Olá! Gostaria de fazer um pedido na *Tabacaria Eldorado*:',
      '',
      '*Produtos:*',
      linhas,
      '',
      `*Total: ${fmt(total)}*`,
      '',
      'Poderia confirmar disponibilidade?',
    ].join('\n')

    saveOrder({
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: [...items],
      total,
      channel: ch,
    })

    clearCart()
    setIsDrawerOpen(false)
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [items, totalPrice, saveOrder, clearCart])

  // Fix BP1: reorderItems sem setItems em loop — processa tudo de uma vez
  const reorderItems = useCallback((order: StoredOrder) => {
    setItems(prev => {
      const next = [...prev]
      for (const i of order.items) {
        const idx = next.findIndex(x => x.product.id === i.product.id)
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + i.quantity }
        } else {
          next.push({ ...i })
        }
      }
      return next
    })
    setIsDrawerOpen(true)
  }, [])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
      isDrawerOpen, openDrawer, closeDrawer,
      buildAndSendOrder, orders, reorderItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}
