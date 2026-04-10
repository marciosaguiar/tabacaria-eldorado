'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
}

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [ios, setIos] = useState(false)
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isInStandaloneMode()) return
    if (sessionStorage.getItem('eldorado_install_dismissed')) return

    const onIOS = isIOS()
    setIos(onIOS)

    if (onIOS) {
      // Show iOS instructions after short delay
      const t = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(t)
    }

    // Android/Chrome: wait for browser event
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setPrompt(null)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('eldorado_install_dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop for iOS modal */}
      {ios && (
        <div
          onClick={handleDismiss}
          style={{
            position: 'fixed', inset: 0, zIndex: 199,
            background: 'rgba(0,0,0,0.4)',
          }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          bottom: ios ? '0' : '80px',
          left: ios ? '0' : '12px',
          right: ios ? '0' : '12px',
          zIndex: 200,
          background: 'linear-gradient(160deg, #0A0A0A 0%, #3B1A08 100%)',
          border: '0.5px solid rgba(201,150,42,0.4)',
          borderRadius: ios ? '20px 20px 0 0' : '16px',
          padding: ios ? '20px 20px 36px' : '14px 16px',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: ios ? '16px' : '0' }}>
          {/* Icon */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            overflow: 'hidden', flexShrink: 0, background: '#1a1108',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Adicionar à tela inicial
            </p>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: 'rgba(201,150,42,0.8)', margin: '2px 0 0' }}>
              Acesse o catálogo sem internet
            </p>
          </div>

          <button
            onClick={handleDismiss}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: '50%', width: '28px', height: '28px',
              color: 'rgba(255,255,255,0.5)', fontSize: '16px',
              cursor: 'pointer', flexShrink: 0, lineHeight: '28px',
            }}
          >
            ×
          </button>
        </div>

        {/* iOS instructions */}
        {ios ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                icon: '①',
                text: 'Toque no botão',
                sub: 'Ícone de compartilhar (□↑) na barra inferior do Safari',
              },
              {
                icon: '②',
                text: 'Toque em "Adicionar à Tela de Início"',
                sub: 'Role para baixo no menu de compartilhamento',
              },
              {
                icon: '③',
                text: 'Toque em "Adicionar"',
                sub: 'O app aparece na tela inicial como um aplicativo nativo',
              },
            ].map(step => (
              <div key={step.icon} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '18px', fontWeight: 700,
                  color: 'rgba(201,150,42,0.9)',
                  flexShrink: 0, lineHeight: 1.2,
                }}>
                  {step.icon}
                </span>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {step.text}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Arrow pointing down to Safari bar */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '24px', color: 'rgba(201,150,42,0.7)' }}>↓</span>
            </div>
          </div>
        ) : (
          /* Android: install button */
          <div style={{ display: 'flex', gap: '8px', marginTop: '0' }}>
            <button
              onClick={handleDismiss}
              style={{
                flex: 1, background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '8px', color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '13px', padding: '8px', cursor: 'pointer',
              }}
            >
              Agora não
            </button>
            <button
              onClick={handleInstall}
              style={{
                flex: 2,
                background: 'linear-gradient(135deg, #C9962A 0%, #FFD966 100%)',
                border: 'none', borderRadius: '8px',
                color: '#3B1A08', fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '13px', fontWeight: 700,
                padding: '8px 16px', cursor: 'pointer',
              }}
            >
              Instalar agora
            </button>
          </div>
        )}
      </div>
    </>
  )
}
