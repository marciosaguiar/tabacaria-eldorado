'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Don't show if user already dismissed
    if (sessionStorage.getItem('eldorado_install_dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setPrompt(null)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('eldorado_install_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '12px',
        right: '12px',
        zIndex: 200,
        background: 'linear-gradient(160deg, #0A0A0A 0%, #3B1A08 100%)',
        border: '0.5px solid rgba(201,150,42,0.4)',
        borderRadius: '16px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        overflow: 'hidden',
        flexShrink: 0,
        background: '#1a1108',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="Eldorado" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>
          Adicionar à tela inicial
        </p>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: 'rgba(201,150,42,0.7)', margin: '2px 0 0' }}>
          Acesse o catálogo sem internet
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '12px',
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          Agora não
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: 'linear-gradient(135deg, #C9962A 0%, #FFD966 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#3B1A08',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '12px',
            fontWeight: 700,
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          Instalar
        </button>
      </div>
    </div>
  )
}
