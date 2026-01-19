import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bitter } from 'next/font/google'
import './globals.css'
import LenisProvider from './components/LenisProvider'
import { MobiusProvider } from './context/MobiusContext'
import MobiusBackground from './components/MobiusBackground'

const geist = Geist({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bitter'
})

export const metadata: Metadata = {
  title: 'hello! | Janakar Patel જનકાર પટેલ',
  description: 'Data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={bitter.variable}>
      <head>
        <link rel="icon" href="/Frame 2.svg" type="image/svg+xml" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sorts+Mill+Goudy:ital@0;1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={geist.className}>
        <MobiusProvider>
          <MobiusBackground />
          <LenisProvider>
            {children}
          </LenisProvider>
        </MobiusProvider>
      </body>
    </html>
  )
}