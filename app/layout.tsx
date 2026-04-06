import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
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
      className={`${playfair.variable} ${inter.variable}`}
      data-theme="dark"
    >
      <head>
        {/* Script anti-flash: lê tema salvo antes do primeiro render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('eldorado-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen font-inter">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
