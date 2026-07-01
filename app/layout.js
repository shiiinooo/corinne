import { Cormorant_Garamond, Nunito } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata = {
  title: 'Merci Corinne',
  description: 'Un message de gratitude pour Corinne',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  )
}
