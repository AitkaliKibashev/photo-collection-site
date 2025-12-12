import type { Metadata } from 'next'
import { Geist_Mono, Oswald } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/providers/AuthProvider'

const oswaldSans = Oswald({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Nurgaliuly Aitkali's Photo Collection",
  description:
    'Photography portfolio of Nurgaliuly Aitkali, photographer and frontend developer based in Astana. A collection of portraits, landscapes, street photography, and more.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswaldSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
