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
