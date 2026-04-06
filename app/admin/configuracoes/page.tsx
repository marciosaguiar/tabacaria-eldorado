'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { CompanySettings } from '@/types'

const EMPTY: CompanySettings = {
  nome: '', slogan: '', endereco: '', telefone: '',
  whatsapp: '', email: '', instagram: '', facebook: '', logoUrl: '',
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-lg font-inter text-sm animate-slide-up border ${
      type === 'success'
        ? 'border-gold/40 text-white'
        : 'border-red-500/40 text-white'
    }`}
    style={{ backgroundColor: type === 'success' ? 'var(--bg-card)' : 'var(--bg-card)', color: type === 'success' ? 'var(--gold)' : '#ef4444' }}>
      {type === 'success' ? (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; hint?: string
}) {
  return (
    <div>
      <label className="block font-inter text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-sm border font-inter text-sm outline-none focus:ring-1 focus:ring-gold/40 transition-all"
        style={{
          backgroundColor: 'var(--bg-hover)',
          borderColor: 'var(--bg-border)',
          color: 'var(--text-primary)',
        }}
      />
      {hint && <p className="mt-1 font-inter text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  )
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [form, setForm] = useState<CompanySettings>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('eldorado_admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { setForm(data); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [router])

  const set = (field: keyof CompanySettings) => (value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  async function handleSave() {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setToast({ message: 'Configurações salvas com sucesso!', type: 'success' })
    } catch {
      setToast({ message: 'Erro ao salvar configurações', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/settings/logo', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.logoUrl) {
        setForm(f => ({ ...f, logoUrl: data.logoUrl }))
        setToast({ message: 'Logo atualizada!', type: 'success' })
      } else {
        throw new Error(data.error || 'Erro ao enviar')
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Erro ao enviar logo', type: 'error' })
    } finally {
      setIsUploadingLogo(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'rgba(var(--gold-rgb),0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 font-inter text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Admin
            </Link>
            <span style={{ color: 'var(--bg-border)' }}>|</span>
            <h1 className="font-playfair text-lg" style={{ color: 'var(--text-primary)' }}>Configurações</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-sm border font-inter text-sm transition-all duration-300 disabled:opacity-50"
            style={{ borderColor: 'rgba(var(--gold-rgb),0.5)', color: 'var(--gold)', backgroundColor: 'rgba(var(--gold-rgb),0.06)' }}
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border border-gold/40 border-t-gold rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isSaving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── Logo ── */}
        <section>
          <h2 className="font-playfair text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Logo da Empresa</h2>
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.4), transparent)' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Preview */}
            <div
              className="relative w-32 h-32 rounded-sm border flex-shrink-0 overflow-hidden"
              style={{ borderColor: 'rgba(var(--gold-rgb),0.2)', backgroundColor: 'var(--bg-card)' }}
            >
              {form.logoUrl ? (
                <Image
                  src={form.logoUrl}
                  alt="Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized={form.logoUrl.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: 'var(--bg-border)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <p className="font-inter text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                A logo é exibida no cabeçalho e na página principal do site.
              </p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm border font-inter text-sm transition-all duration-300 disabled:opacity-50"
                style={{ borderColor: 'rgba(var(--gold-rgb),0.3)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}
              >
                {isUploadingLogo ? (
                  <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                {isUploadingLogo ? 'Enviando…' : 'Trocar logo'}
              </button>
              <p className="mt-2 font-inter text-xs" style={{ color: 'var(--text-muted)' }}>
                PNG, JPG ou WEBP · máx. 5 MB
              </p>
            </div>

          </div>
        </section>

        {/* ── Identidade ── */}
        <section>
          <h2 className="font-playfair text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Identidade da Empresa</h2>
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.4), transparent)' }} />
          <div className="grid grid-cols-1 gap-5">
            <Field label="Nome da empresa" value={form.nome} onChange={set('nome')} placeholder="Tabacaria Eldorado" />
            <Field label="Slogan / descrição curta" value={form.slogan} onChange={set('slogan')} placeholder="Produtos premium para os mais exigentes apreciadores" />
          </div>
        </section>

        {/* ── Contato ── */}
        <section>
          <h2 className="font-playfair text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Contato</h2>
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.4), transparent)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="WhatsApp" value={form.whatsapp} onChange={set('whatsapp')} placeholder="55 11 99999-9999" hint="Com código do país, ex: 55 11 99999-0000" />
            <Field label="Telefone" value={form.telefone} onChange={set('telefone')} placeholder="(11) 99999-9999" />
            <Field label="E-mail" value={form.email} onChange={set('email')} type="email" placeholder="contato@tabacaria.com.br" />
            <Field label="Endereço" value={form.endereco} onChange={set('endereco')} placeholder="Rua das Flores, 123 — São Paulo, SP" />
          </div>
        </section>

        {/* ── Redes sociais ── */}
        <section>
          <h2 className="font-playfair text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Redes Sociais</h2>
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(var(--gold-rgb),0.4), transparent)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Instagram" value={form.instagram} onChange={set('instagram')} placeholder="@tabacaria.eldorado" hint="Somente o @ ou o nome de usuário" />
            <Field label="Facebook" value={form.facebook} onChange={set('facebook')} placeholder="tabacaria.eldorado" hint="Somente o nome da página" />
          </div>
        </section>

        {/* Botão salvar (mobile) */}
        <div className="pb-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-sm border font-inter text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
            style={{ borderColor: 'rgba(var(--gold-rgb),0.5)', color: 'var(--gold)', backgroundColor: 'rgba(var(--gold-rgb),0.06)' }}
          >
            {isSaving ? 'Salvando…' : 'Salvar configurações'}
          </button>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
