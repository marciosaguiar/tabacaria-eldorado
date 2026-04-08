'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('eldorado_admin_token')
    if (token === 'authenticated') {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    setTimeout(() => {
      if (username === 'admin' && password === 'eldorado2024') {
        localStorage.setItem('eldorado_admin_token', 'authenticated')
        router.replace('/admin')
      } else {
        setError('Usuário ou senha incorretos.')
        setIsLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04),transparent_70%)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative h-20 w-52">
            <Image
              src="/images/logo.png"
              alt="Tabacaria Eldorado"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-gold/20 rounded-sm p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-8">
            <h1 className="font-playfair font-bold text-2xl text-white tracking-wide">
              Painel <span className="text-gold">Administrativo</span>
            </h1>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-inter flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-light text-dark font-inter font-semibold py-3 px-6 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 tracking-wide text-sm shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs font-inter mt-6">
          Tabacaria <span className="text-gold/50">Eldorado</span> © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
