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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [orders, setOrders] = useState<StoredOrder[]>([])

  // Hidratação do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eldorado-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    try {
      const storedOrders = localStorage.getItem('eldorado-orders')
      if (storedOrders) setOrders(JSON.parse(storedOrders))
    } catch {}
  }, [])

  // Persiste carrinho
  useEffect(() => {
    try { localStorage.setItem('eldorado-cart', JSON.stringify(items)) } catch {}
  }, [items])

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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = useCallback((channel: 'varejo' | 'atacado') => {
    return items.reduce((sum, i) => {
      const price = channel === 'varejo' ? i.product.precoVarejo : i.product.precoAtacado
      return sum + (price ?? 0) * i.quantity
    }, 0)
  }, [items])

  const saveOrder = useCallback((order: StoredOrder) => {
    setOrders(prev => {
      const next = [order, ...prev].slice(0, 5)
      try { localStorage.setItem('eldorado-orders', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const buildAndSendOrder = useCallback((whatsapp: string, channel: 'varejo' | 'atacado') => {
    if (!whatsapp || items.length === 0) return
    const num = whatsapp.replace(/\D/g, '')
    const total = totalPrice(channel)

    const linhas = items.map(i => {
      const price = channel === 'varejo' ? i.product.precoVarejo : i.product.precoAtacado
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

    // Salva no histórico
    saveOrder({
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: [...items],
      total,
      channel,
    })

    clearCart()
    setIsDrawerOpen(false)
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [items, totalPrice, saveOrder, clearCart])

  const reorderItems = useCallback((order: StoredOrder) => {
    order.items.forEach(i => {
      setItems(prev => {
        const existing = prev.find(x => x.product.id === i.product.id)
        if (existing) {
          return prev.map(x => x.product.id === i.product.id ? { ...x, quantity: x.quantity + i.quantity } : x)
        }
        return [...prev, { ...i }]
      })
    })
    setIsDrawerOpen(true)
  }, [])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
      isDrawerOpen, openDrawer: () => setIsDrawerOpen(true), closeDrawer: () => setIsDrawerOpen(false),
      buildAndSendOrder, orders, reorderItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}
