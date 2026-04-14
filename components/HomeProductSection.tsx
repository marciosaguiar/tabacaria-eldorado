'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Product } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────
type Channel = 'todos' | 'varejo' | 'atacado'

interface Props {
  initialProducts: Product[]
  categorias?: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(v: number | null) {
  if (v === null || v === undefined) return null
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const EMPTY: Omit<Product, 'id'> = {
  nome: '',
  descricao: '',
  imagem: '',
  precoAtacado: null,
  precoVarejo: null,
  visivelAtacado: true,
  visivelVarejo: true,
  categoria: '',
  ativo: true,
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-sm border shadow-xl font-inter text-sm max-w-sm
      ${ok ? 'border-gold/30 text-gold' : 'border-red-500/30 text-red-400'}`}
      style={{ backgroundColor: 'var(--bg-card)' }}>
      <span>{ok ? '✓' : '⚠'}</span>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

// ─── Product Card (homepage style) ───────────────────────────────────────────
function HomeCard({
  product,
  channel,
  isAdmin,
  onEdit,
  onDelete,
}: {
  product: Product
  channel: Channel
  isAdmin: boolean
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  const showAtacado = channel === 'todos' || channel === 'atacado'
  const showVarejo  = channel === 'todos' || channel === 'varejo'

  return (
    <div
      className="product-card group relative overflow-hidden flex flex-col"
      style={{ borderRadius: '16px' }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(248,236,210,0.6)' }}>
        {product.imagem ? (
          <Image
            src={product.imagem}
            alt={product.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            style={{
              objectFit: 'cover',
              filter: product.ativo === false ? 'grayscale(100%) brightness(0.55)' : undefined,
            }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Indisponível overlay (customers view) */}
        {product.ativo === false && !isAdmin && (
          <div className="absolute inset-0 flex items-end justify-center pb-3"
            style={{ background: 'linear-gradient(to top, rgba(253,246,236,0.85) 0%, transparent 60%)' }}>
            <span className="font-inter text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(168,108,32,0.15)', color: 'var(--text-3)', border: '1px solid rgba(200,137,26,0.2)' }}>
              Indisponível
            </span>
          </div>
        )}

        {/* Admin: "inactive" pill */}
        {product.ativo === false && isAdmin && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}>
            <span className="font-inter text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(220,38,38,0.7)', color: '#fff', border: '1px solid rgba(220,38,38,0.4)' }}>
              Em falta
            </span>
          </div>
        )}

        {/* Channel badges */}
        {channel === 'todos' && (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.visivelVarejo && (
              <span className="text-[9px] font-inter font-semibold tracking-wider px-1.5 py-0.5 rounded-full uppercase"
                style={{ backgroundColor: 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.3)' }}>
                Varejo
              </span>
            )}
            {product.visivelAtacado && (
              <span className="text-[9px] font-inter font-semibold tracking-wider px-1.5 py-0.5 rounded-full uppercase"
                style={{ backgroundColor: 'rgba(var(--gold-rgb),0.08)', color: 'var(--gold-light)', border: '1px solid rgba(var(--gold-rgb),0.2)' }}>
                Atacado
              </span>
            )}
          </div>
        )}

        {/* Admin buttons — always visible (not hover-only) */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1.5 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(product) }}
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'rgba(var(--gold-rgb),0.92)' }}
              title="Editar"
            >
              <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product) }}
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'rgba(220,38,38,0.85)' }}
              title="Excluir"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(253,246,236,0.9) 0%, transparent 50%)' }} />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-playfair font-bold line-clamp-1 leading-snug" style={{
          fontSize: '14px', color: 'var(--text)', letterSpacing: '-0.01em',
        }}>
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="text-xs mt-1 line-clamp-2 font-inter leading-relaxed" style={{ color: 'var(--text-3)' }}>
            {product.descricao}
          </p>
        )}

        {/* Prices */}
        <div className="mt-auto pt-3 flex flex-col gap-1">
          {/* Single channel view — big price */}
          {channel !== 'todos' && (
            <>
              {channel === 'varejo' && fmt(product.precoVarejo) && (
                <div className="flex items-baseline gap-1">
                  <span className="font-inter font-bold text-xl sm:text-2xl tracking-tight" style={{ color: 'var(--gold)' }}>
                    {fmt(product.precoVarejo)}
                  </span>
                </div>
              )}
              {channel === 'atacado' && fmt(product.precoAtacado) && (
                <div className="flex items-baseline gap-1">
                  <span className="font-inter font-bold text-xl sm:text-2xl tracking-tight" style={{ color: 'var(--gold)' }}>
                    {fmt(product.precoAtacado)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* "Todos" view — show both prices with labels */}
          {channel === 'todos' && (
            <div className="flex flex-col gap-0.5">
              {showVarejo && fmt(product.precoVarejo) && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-inter uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>Varejo</span>
                  <span className="font-inter font-bold text-base sm:text-lg" style={{ color: 'var(--gold)' }}>
                    {fmt(product.precoVarejo)}
                  </span>
                </div>
              )}
              {showAtacado && fmt(product.precoAtacado) && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-inter uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Atacado</span>
                  <span className="font-inter font-semibold text-sm sm:text-base" style={{ color: 'var(--gold-light)' }}>
                    {fmt(product.precoAtacado)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gold accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, #F0A030, #FFD060, #F0A030, transparent)' }} />
    </div>
  )
}

// ─── Product Modal (Add / Edit) ───────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onSaved,
  categorias = [],
}: {
  product: Partial<Product> | null
  onClose: () => void
  onSaved: (p: Product) => void
  categorias?: string[]
}) {
  const isEdit = !!product?.id
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    nome:           product?.nome           ?? '',
    descricao:      product?.descricao      ?? '',
    imagem:         product?.imagem         ?? '',
    precoAtacado:   product?.precoAtacado   ?? null,
    precoVarejo:    product?.precoVarejo    ?? null,
    visivelAtacado: product?.visivelAtacado ?? true,
    visivelVarejo:  product?.visivelVarejo  ?? true,
    categoria:      product?.categoria      ?? '',
    ativo:          product?.ativo          ?? true,
  })
  const [precoAtacadoStr, setPrecoAtacadoStr] = useState(
    product?.precoAtacado != null ? String(product.precoAtacado).replace('.', ',') : ''
  )
  const [precoVarejoStr, setPrecoVarejoStr] = useState(
    product?.precoVarejo != null ? String(product.precoVarejo).replace('.', ',') : ''
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(product?.imagem || '')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const parsePrice = (s: string) => {
    const clean = s.replace(/[^\d,]/g, '').replace(',', '.')
    const n = parseFloat(clean)
    return isNaN(n) ? null : n
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) {
        setForm(f => ({ ...f, imagem: data.path }))
        setPreview(data.path)
      }
    } catch { setError('Erro ao fazer upload da imagem') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        precoAtacado: parsePrice(precoAtacadoStr),
        precoVarejo:  parsePrice(precoVarejoStr),
      }
      const url    = isEdit ? `/api/products/${product!.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { setError('Erro ao salvar produto'); return }
      const saved = await res.json()
      onSaved(saved)
    } catch { setError('Erro de conexão') }
    finally { setSaving(false) }
  }

  // close on backdrop click
  const backdrop = useRef<HTMLDivElement>(null)
  const handleBd = (e: React.MouseEvent) => { if (e.target === backdrop.current) onClose() }

  return (
    <div ref={backdrop} onClick={handleBd}
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
        style={{ background: 'var(--glass-strong)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.95)', boxShadow: 'var(--glass-shadow-lg)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
          <h2 className="font-playfair text-lg" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Image upload */}
          <div>
            <label className="block text-xs font-inter font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Foto do Produto
            </label>
            <div className="flex gap-3 items-start">
              {/* Preview */}
              <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer border"
                style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)' }}
                onClick={() => fileRef.current?.click()}>
                {preview ? (
                  <Image src={preview} alt="" fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <svg className="w-7 h-7 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#F0A030' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[9px] font-inter" style={{ color: 'var(--text-muted)' }}>clique</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)' }} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full py-2 px-3 rounded-sm border text-xs font-inter transition-colors"
                  style={{ borderColor: 'rgba(var(--gold-rgb),0.3)', color: 'var(--gold)', backgroundColor: 'rgba(var(--gold-rgb),0.05)' }}>
                  {uploading ? 'Enviando…' : 'Selecionar imagem'}
                </button>
                <p className="text-[10px] mt-1 font-inter" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP — máx. 10MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-xs font-inter font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Nome do Produto *
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Ex: Charuto Cohiba Siglo VI"
              className="w-full px-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
              style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-inter font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Detalhes do produto, origem, sabor…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-sm text-sm font-inter outline-none border resize-none"
              style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Categoria */}
          {categorias.length > 0 && (
            <div>
              <label className="block text-xs font-inter font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Categoria
              </label>
              <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }}>
                <option value="">Sem categoria</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Preços */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-inter font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Preço Varejo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-inter" style={{ color: 'var(--text-muted)' }}>R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={precoVarejoStr}
                  onChange={e => setPrecoVarejoStr(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-8 pr-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                  style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-inter font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Preço Atacado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-inter" style={{ color: 'var(--text-muted)' }}>R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={precoAtacadoStr}
                  onChange={e => setPrecoAtacadoStr(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-8 pr-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                  style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Canal de exibição */}
          <div>
            <label className="block text-xs font-inter font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Exibir em
            </label>
            <div className="flex gap-3">
              {/* Varejo toggle */}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, visivelVarejo: !f.visivelVarejo }))}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm border text-xs font-inter font-medium transition-all"
                style={{
                  borderColor: form.visivelVarejo ? 'var(--gold)' : 'rgba(var(--gold-rgb),0.2)',
                  backgroundColor: form.visivelVarejo ? 'rgba(var(--gold-rgb),0.1)' : 'transparent',
                  color: form.visivelVarejo ? 'var(--gold)' : 'var(--text-muted)',
                }}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors`}
                  style={{ borderColor: form.visivelVarejo ? 'var(--gold)' : 'var(--bg-border)', backgroundColor: form.visivelVarejo ? 'var(--gold)' : 'transparent' }}>
                  {form.visivelVarejo && <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                Catálogo Varejo
              </button>

              {/* Atacado toggle */}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, visivelAtacado: !f.visivelAtacado }))}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm border text-xs font-inter font-medium transition-all"
                style={{
                  borderColor: form.visivelAtacado ? 'var(--gold-light)' : 'rgba(var(--gold-rgb),0.2)',
                  backgroundColor: form.visivelAtacado ? 'rgba(var(--gold-rgb),0.07)' : 'transparent',
                  color: form.visivelAtacado ? 'var(--gold-light)' : 'var(--text-muted)',
                }}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors`}
                  style={{ borderColor: form.visivelAtacado ? 'var(--gold-light)' : 'var(--bg-border)', backgroundColor: form.visivelAtacado ? 'var(--gold-light)' : 'transparent' }}>
                  {form.visivelAtacado && <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                Catálogo Atacado
              </button>
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="flex items-center justify-between py-3 px-4 rounded-sm border"
            style={{ borderColor: form.ativo === false ? 'rgba(220,38,38,0.3)' : 'rgba(var(--gold-rgb),0.15)', backgroundColor: form.ativo === false ? 'rgba(220,38,38,0.05)' : 'transparent' }}>
            <div>
              <p className="font-inter text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {form.ativo === false ? '⚠ Produto em falta' : '✓ Produto disponível'}
              </p>
              <p className="font-inter text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {form.ativo === false ? 'Aparece apagado no catálogo (indisponível)' : 'Visível normalmente no catálogo'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, ativo: !f.ativo }))}
              className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4"
              style={{ backgroundColor: form.ativo === false ? '#dc2626' : 'var(--gold)' }}
            >
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.ativo === false ? 'translateX(0.125rem)' : 'translateX(1.375rem)' }} />
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-inter text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-sm border text-sm font-inter font-medium transition-colors"
              style={{ borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-sm text-sm font-inter font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--gold)', color: '#000' }}>
              {saving ? 'Salvando…' : isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel, deleting }: { name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl p-7 text-center" style={{ background: 'var(--glass-strong)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.95)', boxShadow: 'var(--glass-shadow-lg)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}>
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-playfair text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Excluir produto?</h3>
        <p className="text-sm font-inter mb-6" style={{ color: 'var(--text-secondary)' }}>
          "<strong>{name}</strong>" será removido permanentemente.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-sm border text-sm font-inter transition-colors"
            style={{ borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-secondary)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-sm text-sm font-inter font-semibold transition-colors"
            style={{ backgroundColor: '#dc2626', color: '#fff' }}>
            {deleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeProductSection({ initialProducts, categorias = [] }: Props) {
  const [products, setProducts]     = useState<Product[]>(initialProducts)
  const [channel, setChannel]       = useState<Channel>('todos')
  const [isAdmin, setIsAdmin]       = useState(false)
  const [modal, setModal]           = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing]       = useState<Product | null>(null)
  const [deleting, setDeleting]     = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null)
  const [lastSync, setLastSync]     = useState<Date>(new Date())

  // Check admin
  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('eldorado_admin_token'))
  }, [])

  // Auto-refresh every 30s for cross-device sync
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
          setLastSync(new Date())
        }
      } catch { /* silent */ }
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  // Filter
  const visible = products.filter(p => {
    if (channel === 'varejo')  return p.visivelVarejo
    if (channel === 'atacado') return p.visivelAtacado
    return true
  })

  const handleSaved = (saved: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === saved.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next }
      return [...prev, saved]
    })
    setModal(null)
    setEditing(null)
    showToast(editing ? 'Produto atualizado!' : 'Produto cadastrado!')
  }

  const handleDelete = async () => {
    if (!deleting) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== deleting.id))
        showToast('Produto excluído!')
      } else { showToast('Erro ao excluir.', false) }
    } catch { showToast('Erro de conexão.', false) }
    finally { setIsDeleting(false); setDeleting(null) }
  }

  const manualRefresh = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) { setProducts(await res.json()); setLastSync(new Date()); showToast('Catálogo atualizado!') }
    } catch { showToast('Erro ao atualizar.', false) }
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Section header — Apple Music "Listen Now" style */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="font-inter mb-2" style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: 'var(--gold)',
          }}>
            Seleção Premium
          </p>
          <h2 className="font-playfair" style={{
            fontSize: 'clamp(26px, 5vw, 38px)',
            fontWeight: 900, color: 'var(--text)',
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Nossos <span className="gold-text">Produtos</span>
          </h2>
        </div>

        {/* Refresh */}
        <button onClick={manualRefresh}
          className="flex items-center gap-1.5 font-inter transition-opacity hover:opacity-100"
          style={{ fontSize: '11px', color: 'var(--text-3)', opacity: 0.8 }}
          title="Atualizar catálogo">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </button>
      </div>

      {/* Filter tabs — glass pill style */}
      <div className="flex gap-1.5 mb-7 p-1.5 w-fit" style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(16px)',
        borderRadius: '50px',
        border: '1px solid rgba(200,137,26,0.16)',
        boxShadow: '0 2px 12px rgba(168,108,32,0.08)',
      }}>
        {(['todos', 'varejo', 'atacado'] as Channel[]).map(c => (
          <button key={c} onClick={() => setChannel(c)}
            className="font-inter font-semibold transition-all duration-300"
            style={{
              padding: '8px 18px',
              borderRadius: '50px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: channel === c
                ? 'linear-gradient(135deg, #A06810, #C8891A, #E8A832)'
                : 'transparent',
              color: channel === c ? '#FFF8EC' : 'var(--text-2)',
              boxShadow: channel === c ? '0 2px 12px rgba(200,137,26,0.38)' : 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
            {c === 'todos' ? 'Todos' : c === 'varejo' ? 'Varejo' : 'Atacado'}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="font-inter mb-5" style={{ fontSize: '11px', color: 'var(--text-3)' }}>
        {visible.length} {visible.length === 1 ? 'produto' : 'produtos'}
        {channel !== 'todos' ? ` no catálogo ${channel}` : ' no total'}
      </p>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 border rounded-full flex items-center justify-center mb-4" style={{ borderColor: 'rgba(200,137,26,0.2)', backgroundColor: 'rgba(255,255,255,0.6)' }}>
            <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isAdmin ? 'Nenhum produto cadastrado. Clique em + para adicionar.' : 'Nenhum produto disponível no momento.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {visible.map(p => (
            <HomeCard
              key={p.id}
              product={p}
              channel={channel}
              isAdmin={isAdmin}
              onEdit={prod => { setEditing(prod); setModal('edit') }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Admin FAB */}
      {isAdmin && (
        <button
          onClick={() => { setEditing(null); setModal('add') }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #C07820, #F0A030)', boxShadow: '0 0 28px rgba(240,160,48,0.55)' }}
          title="Adicionar produto"
        >
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Admin label on FAB */}
      {isAdmin && (
        <div className="fixed bottom-6 right-24 z-[100] flex items-center">
          <span className="font-inter text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)', color: 'var(--text-3)', border: '1px solid rgba(200,137,26,0.18)' }}>
            Modo Admin
          </span>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <ProductModal
          product={modal === 'edit' ? editing : null}
          onClose={() => { setModal(null); setEditing(null) }}
          onSaved={handleSaved}
          categorias={categorias}
        />
      )}
      {deleting && (
        <DeleteModal
          name={deleting.nome}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          deleting={isDeleting}
        />
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </section>
  )
}
