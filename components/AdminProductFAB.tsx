'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Product } from '@/types'

interface Props {
  channel: 'varejo' | 'atacado'
  categorias: string[]
  onAdded: (p: Product) => void
}

function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-24 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-sm border shadow-xl font-inter text-sm max-w-sm
      ${ok ? 'border-gold/30 text-gold' : 'border-red-500/30 text-red-400'}`}
      style={{ backgroundColor: 'var(--bg-card)' }}>
      <span>{ok ? '✓' : '⚠'}</span><span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

export default function AdminProductFAB({ channel, categorias, onAdded }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    nome: '', descricao: '', imagem: '',
    precoVarejo: '', precoAtacado: '',
    visivelVarejo: channel === 'varejo',
    visivelAtacado: channel === 'atacado',
    categoria: categorias[0] || '',
  })

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('eldorado_admin_token'))
  }, [])

  if (!isAdmin) return null

  const parsePrice = (s: string) => {
    const n = parseFloat(s.replace(/[^\d,]/g, '').replace(',', '.'))
    return isNaN(n) ? null : n
  }

  const handleBd = (e: React.MouseEvent) => { if (e.target === backdrop.current) setOpen(false) }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) { setForm(f => ({ ...f, imagem: data.path })); setPreview(data.path) }
    } catch { setToast({ msg: 'Erro no upload', ok: false }) }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) { setToast({ msg: 'Nome obrigatório', ok: false }); return }
    setSaving(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          precoVarejo: parsePrice(form.precoVarejo),
          precoAtacado: parsePrice(form.precoAtacado),
        }),
      })
      if (res.ok) {
        const saved = await res.json()
        onAdded(saved)
        setOpen(false)
        setForm({ nome: '', descricao: '', imagem: '', precoVarejo: '', precoAtacado: '', visivelVarejo: channel === 'varejo', visivelAtacado: channel === 'atacado', categoria: categorias[0] || '' })
        setPreview('')
        setToast({ msg: 'Produto cadastrado!', ok: true })
      } else { setToast({ msg: 'Erro ao salvar', ok: false }) }
    } catch { setToast({ msg: 'Erro de conexão', ok: false }) }
    finally { setSaving(false) }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'var(--gold)', boxShadow: '0 0 24px rgba(var(--gold-rgb),0.5)' }}
        title="Adicionar produto"
      >
        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <div className="fixed bottom-6 right-24 z-[100]">
        <span className="font-inter text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid rgba(var(--gold-rgb),0.15)' }}>
          Modo Admin
        </span>
      </div>

      {/* Modal */}
      {open && (
        <div ref={backdrop} onClick={handleBd}
          className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-sm shadow-2xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(var(--gold-rgb),0.2)' }}>

            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
              <h2 className="font-playfair font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Novo Produto — <span className="capitalize" style={{ color: 'var(--gold)' }}>{channel}</span>
              </h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ color: 'var(--text-secondary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image */}
              <div className="flex gap-3 items-start">
                <div className="relative w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer border"
                  style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)' }}
                  onClick={() => fileRef.current?.click()}>
                  {preview
                    ? <Image src={preview} alt="" fill style={{ objectFit: 'cover' }} />
                    : <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-7 h-7 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                  }
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
                    {uploading ? 'Enviando…' : 'Foto do produto'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-xs font-inter font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nome *</label>
                <input type="text" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  placeholder="Nome do produto" className="w-full px-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                  style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }} />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-inter font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  placeholder="Detalhes do produto…" rows={2} className="w-full px-3 py-2.5 rounded-sm text-sm font-inter outline-none border resize-none"
                  style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }} />
              </div>

              {/* Categoria */}
              {categorias.length > 0 && (
                <div>
                  <label className="block text-xs font-inter font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Categoria</label>
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
                  <label className="block text-xs font-inter font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Preço Varejo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-inter" style={{ color: 'var(--text-muted)' }}>R$</span>
                    <input type="text" inputMode="decimal" value={form.precoVarejo} onChange={e => setForm(f => ({ ...f, precoVarejo: e.target.value }))}
                      placeholder="0,00" className="w-full pl-8 pr-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                      style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-inter font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Preço Atacado</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-inter" style={{ color: 'var(--text-muted)' }}>R$</span>
                    <input type="text" inputMode="decimal" value={form.precoAtacado} onChange={e => setForm(f => ({ ...f, precoAtacado: e.target.value }))}
                      placeholder="0,00" className="w-full pl-8 pr-3 py-2.5 rounded-sm text-sm font-inter outline-none border"
                      style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Canal */}
              <div>
                <label className="block text-xs font-inter font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Exibir em</label>
                <div className="flex gap-3">
                  {(['varejo', 'atacado'] as const).map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, [`visivel${c.charAt(0).toUpperCase() + c.slice(1)}`]: !f[`visivel${c.charAt(0).toUpperCase() + c.slice(1)}` as keyof typeof f] }))}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-sm border text-xs font-inter font-medium transition-all capitalize"
                      style={{
                        borderColor: form[`visivel${c.charAt(0).toUpperCase() + c.slice(1)}` as keyof typeof form] ? 'var(--gold)' : 'rgba(var(--gold-rgb),0.2)',
                        backgroundColor: form[`visivel${c.charAt(0).toUpperCase() + c.slice(1)}` as keyof typeof form] ? 'rgba(var(--gold-rgb),0.1)' : 'transparent',
                        color: form[`visivel${c.charAt(0).toUpperCase() + c.slice(1)}` as keyof typeof form] ? 'var(--gold)' : 'var(--text-muted)',
                      }}>
                      {form[`visivel${c.charAt(0).toUpperCase() + c.slice(1)}` as keyof typeof form]
                        ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        : <span className="w-3.5 h-3.5 rounded border" style={{ borderColor: 'var(--bg-border)' }} />
                      }
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-sm border text-sm font-inter transition-colors"
                  style={{ borderColor: 'rgba(var(--gold-rgb),0.2)', color: 'var(--text-secondary)' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-sm text-sm font-inter font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--gold)', color: '#000' }}>
                  {saving ? 'Salvando…' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </>
  )
}
