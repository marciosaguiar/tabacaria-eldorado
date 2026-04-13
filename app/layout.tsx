import type { Metadata, Viewport } from 'next'
import InstallBanner from '@/components/InstallBanner'
import { Newsreader, Inter } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tabacaria Eldorado — Produtos Premium',
  description: 'Catálogo de produtos premium da Tabacaria Eldorado. Charutos, cachimbos e acessórios selecionados para os mais exigentes apreciadores.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-32.png',  sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Tabacaria Eldorado',
    description: 'Catálogo de produtos premium',
    type: 'website',
    images: [{ url: '/icon-512.png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${inter.variable}`}
    >
      <head>
        {/* Service Worker registration for offline support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});})}`,
          }}
        />
      </head>
      <body className="min-h-screen font-inter" style={{ backgroundColor: '#200f0a', color: '#fedbd2' }}>
        {children}
        <InstallBanner />
      </body>
    </html>
  )
}
