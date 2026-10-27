import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Bitter, Crimson_Text, Inter, Noto_Music, Rasa, Sorts_Mill_Goudy } from 'next/font/google'
import './globals.css'
import LenisProvider from './components/LenisProvider'
import { MobiusProvider } from './context/MobiusContext'
import MobiusBackground from './components/MobiusBackground'

const haskoy = localFont({
  src: './fonts/Haskoy-variable.woff2',
  variable: '--font-haskoy',
  display: 'swap',
  weight: '100 900',
})

const rasa = Rasa({
  subsets: ['gujarati', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rasa',
})

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bitter',
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const sortsMillGoudy = Sorts_Mill_Goudy({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-goudy',
})

/** footer monkey's ♪ ♫ only; the "music" subset's unicode-range means it downloads only when a note is shown */
const notoMusic = Noto_Music({
  subsets: ['music'],
  weight: '400',
  variable: '--font-notes',
  preload: false,
})

export const metadata: Metadata = {
  title: 'hello! | Janakar',
  description: 'Portfolio of Janakar Patel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${haskoy.variable} ${rasa.variable} ${bitter.variable} ${crimsonText.variable} ${inter.variable} ${sortsMillGoudy.variable} ${notoMusic.variable}`}
    >
      <head>
        <link rel="icon" href="/Frame 2.svg" type="image/svg+xml" />
      </head>
      <body className={haskoy.className}>
        <MobiusProvider>
          <MobiusBackground />
          <LenisProvider>
            {children}
          </LenisProvider>
          <div className="top-frost" aria-hidden />
        </MobiusProvider>
      </body>
    </html>
  )
}
