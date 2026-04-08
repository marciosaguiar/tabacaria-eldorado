'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { CompanySettings } from '@/types'

const DEFAULT: CompanySettings = {
  nome: '', slogan: '', footerPhrase: '', endereco: '', telefone: '',
  whatsapp: '', email: '', instagram: '', facebook: '', logoUrl: '',
  mapsUrl: '', categorias: [], catalogOrdem: 'cadastro', mostrarPrecoSemValor: true,
  bannerAtivo: false, bannerTexto: '', bannerCor: '#C9A84C',
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-lg font-inter text-sm border ${ok ? 'border-gold/40' : 'border-red-500/40'}`}
      style={{ backgroundColor: 'var(--bg-card)', color: ok ? 'var(--gold)' : '#ef4444' }}>
      {ok
        ? <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      }
      {msg}
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; hint?: string
}) {
  return (
    <div>
      <label className="block font-inter text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-sm border font-inter text-sm outline-none focus:ring-1 focus:ring-gold/40 transition-all"
        style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }} />
      {hint && <p className="mt-1 font-inter text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border p-5 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
      <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'rgba(var(--gold-rgb),0.1)' }}>
        <span style={{ color: 'var(--gold)' }}>{icon}</span>
        <h3 className="font-playfair font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ConfiguracoesPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [newCat, setNewCat] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('eldorado_admin_token')) { router.replace('/admin/login'); return }
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings({ ...DEFAULT, ...data })
      setPreview(data.logoUrl || '/images/logo.png')
      setLoading(false)
    })
  }, [router])

  const set = (key: keyof CompanySettings, value: unknown) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/settings/logo', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.logoUrl) { set('logoUrl', data.logoUrl); setPreview(data.logoUrl); setToast({ msg: 'Logo atualizado!', ok: true }) }
      else setToast({ msg: 'Erro ao atualizar logo', ok: false })
    } catch { setToast({ msg: 'Erro no upload', ok: false }) }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      if (res.ok) setToast({ msg: 'Configurações salvas!', ok: true })
      else setToast({ msg: 'Erro ao salvar', ok: false })
    } catch { setToast({ msg: 'Erro de conexão', ok: false }) }
    finally { setSaving(false) }
  }

  const addCat = () => {
    const c = newCat.trim()
    if (!c || settings.categorias.includes(c)) return
    set('categorias', [...settings.categorias, c])
    setNewCat('')
  }

  const removeCat = (c: string) => set('categorias', settings.categorias.filter(x => x !== c))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark" style={{ color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="font-playfair font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Configurações
            </h1>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-sm text-sm font-inter font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />Salvando…</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Salvar</>
            }
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Section title="Logo da Empresa" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }>
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0 border cursor-pointer"
              style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'rgba(var(--gold-rgb),0.25)' }}
              onClick={() => fileRef.current?.click()}>
              {preview && <Image src={preview} alt="Logo" fill style={{ objectFit: 'contain', padding: '8px' }} />}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)' }} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <button onClick={() => fileRef.current?.click()} type="button"
                className="px-4 py-2 rounded-sm border text-sm font-inter transition-colors"
                style={{ borderColor: 'rgba(var(--gold-rgb),0.3)', color: 'var(--gold)', backgroundColor: 'rgba(var(--gold-rgb),0.05)' }}>
                {uploading ? 'Enviando…' : 'Trocar logo'}
              </button>
              <p className="text-xs mt-1.5 font-inter" style={{ color: 'var(--text-muted)' }}>
                JPG, PNG ou WebP. Recomendado: fundo transparente (PNG)
              </p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>
        </Section>

        {/* ── Cabeçalho ─────────────────────────────────────── */}
        <Section title="Cabeçalho & Identidade" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7l7-4 7 4v12a2 2 0 01-2 2z" />
          </svg>
        }>
          <Field label="Nome da Empresa" value={settings.nome} onChange={v => set('nome', v)} placeholder="Tabacaria Eldorado" hint="Exibido no cabeçalho e rodapé" />
          <Field label="Slogan" value={settings.slogan} onChange={v => set('slogan', v)} placeholder="Produtos premium para os mais exigentes" hint="Aparece abaixo do nome na página inicial" />
          <div>
            <label className="block font-inter text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>Frase de Impacto (Rodapé)</label>
            <textarea value={settings.footerPhrase} onChange={e => set('footerPhrase', e.target.value)}
              placeholder="Qualidade que se sente, elegância que se vive…" rows={2}
              className="w-full px-4 py-2.5 rounded-sm border font-inter text-sm outline-none focus:ring-1 focus:ring-gold/40 transition-all resize-none"
              style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }} />
            <p className="mt-1 font-inter text-xs" style={{ color: 'var(--text-muted)' }}>Frase exibida no rodapé em itálico</p>
          </div>
        </Section>

        {/* ── Contato ───────────────────────────────────────── */}
        <Section title="Contato" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="WhatsApp" value={settings.whatsapp} onChange={v => set('whatsapp', v)} placeholder="5511999999999" hint="Com código do país (55) e DDD" />
            <Field label="Telefone" value={settings.telefone} onChange={v => set('telefone', v)} placeholder="(11) 3333-3333" />
            <Field label="E-mail" value={settings.email} onChange={v => set('email', v)} placeholder="contato@tabacaria.com" type="email" />
            <Field label="Endereço (texto)" value={settings.endereco} onChange={v => set('endereco', v)} placeholder="Rua das Flores, 123 — Cidade/UF" />
          </div>
          <Field
            label="Link do Google Maps"
            value={settings.mapsUrl}
            onChange={v => set('mapsUrl', v)}
            placeholder="https://maps.app.goo.gl/..."
            hint="Cole aqui o link compartilhado do Google Maps da sua localização"
          />
        </Section>

        {/* ── Redes Sociais ─────────────────────────────────── */}
        <Section title="Redes Sociais" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        }>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Instagram" value={settings.instagram} onChange={v => set('instagram', v)} placeholder="@tabacaria.eldorado" hint="Sem https://" />
            <Field label="Facebook" value={settings.facebook} onChange={v => set('facebook', v)} placeholder="tabacaria.eldorado" hint="Sem https://" />
          </div>
        </Section>

        {/* ── Catálogo ──────────────────────────────────────── */}
        <Section title="Configurações do Catálogo" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        }>
          {/* Ordem */}
          <div>
            <label className="block font-inter text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Ordenação dos Produtos</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { val: 'cadastro', label: 'Cadastro' },
                { val: 'nome', label: 'Nome A–Z' },
                { val: 'preco-asc', label: 'Menor preço' },
                { val: 'preco-desc', label: 'Maior preço' },
              ] as const).map(opt => (
                <button key={opt.val} type="button" onClick={() => set('catalogOrdem', opt.val)}
                  className="py-2 px-3 rounded-sm border text-xs font-inter transition-all"
                  style={{
                    borderColor: settings.catalogOrdem === opt.val ? 'var(--gold)' : 'var(--bg-border)',
                    backgroundColor: settings.catalogOrdem === opt.val ? 'rgba(var(--gold-rgb),0.12)' : 'transparent',
                    color: settings.catalogOrdem === opt.val ? 'var(--gold)' : 'var(--text-secondary)',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exibir sem preço */}
          <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'rgba(var(--gold-rgb),0.1)' }}>
            <div>
              <p className="font-inter text-sm" style={{ color: 'var(--text-primary)' }}>Exibir produtos sem preço</p>
              <p className="font-inter text-xs" style={{ color: 'var(--text-muted)' }}>Produtos sem preço cadastrado ficam visíveis</p>
            </div>
            <button type="button" onClick={() => set('mostrarPrecoSemValor', !settings.mostrarPrecoSemValor)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: settings.mostrarPrecoSemValor ? 'var(--gold)' : 'var(--bg-border)' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: settings.mostrarPrecoSemValor ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }} />
            </button>
          </div>

          {/* Categorias */}
          <div className="border-t pt-4" style={{ borderColor: 'rgba(var(--gold-rgb),0.1)' }}>
            <label className="block font-inter text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--text-secondary)' }}>
              Categorias de Produtos
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.categorias.map(c => (
                <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter"
                  style={{ backgroundColor: 'rgba(var(--gold-rgb),0.1)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.25)' }}>
                  {c}
                  <button onClick={() => removeCat(c)} className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {settings.categorias.length === 0 && (
                <p className="text-xs font-inter" style={{ color: 'var(--text-muted)' }}>Nenhuma categoria. Adicione abaixo.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input value={newCat} onChange={e => setNewCat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCat())}
                placeholder="Nova categoria…" className="flex-1 px-3 py-2 rounded-sm border text-sm font-inter outline-none"
                style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }} />
              <button onClick={addCat} type="button"
                className="px-4 py-2 rounded-sm text-sm font-inter font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.3)' }}>
                + Adicionar
              </button>
            </div>
          </div>
        </Section>

        {/* ── Banner Promocional ─────────────────────────── */}
        <Section title="Banner Promocional" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        }>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-inter text-sm" style={{ color: 'var(--text-primary)' }}>Exibir banner nos catálogos</p>
              <p className="font-inter text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Aparece no topo das páginas Varejo e Atacado</p>
            </div>
            <button type="button" onClick={() => set('bannerAtivo', !settings.bannerAtivo)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: settings.bannerAtivo ? 'var(--gold)' : 'var(--bg-border)' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: settings.bannerAtivo ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }} />
            </button>
          </div>
          <Field label="Texto do banner" value={settings.bannerTexto} onChange={v => set('bannerTexto', v)}
            placeholder="🔥 Promoção especial! 20% de desconto em charutos selecionados" />
          <div>
            <label className="block font-inter text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Cor do banner
            </label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.bannerCor} onChange={e => set('bannerCor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0.5"
                style={{ backgroundColor: 'transparent' }} />
              <span className="font-inter text-sm" style={{ color: 'var(--text-secondary)' }}>{settings.bannerCor}</span>
              {settings.bannerTexto && (
                <div className="flex-1 py-1.5 px-3 rounded text-xs font-inter font-semibold text-center"
                  style={{ backgroundColor: settings.bannerCor, color: '#000' }}>
                  Pré-visualização
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Save bottom */}
        <div className="flex justify-end pt-2 pb-8">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-sm text-sm font-inter font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--gold)', color: '#000', boxShadow: '0 0 20px rgba(var(--gold-rgb),0.25)' }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />Salvando…</>
              : 'Salvar todas as configurações'
            }
          </button>
        </div>

      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  )
}
