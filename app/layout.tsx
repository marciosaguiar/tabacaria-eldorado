import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
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
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Tabacaria Eldorado',
    description: 'Catálogo de produtos premium',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-dark text-white font-inter">
        {children}
      </body>
    </html>
  )
}
