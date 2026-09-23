import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const courseDescription = 'The art and exercise of sovereignty of your Heart.'

export const metadata: Metadata = {
  title: 'Masculine Heart Quest',
  description: courseDescription,
  openGraph: {
    title: 'Masculine Heart Quest',
    description: courseDescription,
  },
  twitter: {
    card: 'summary',
    title: 'Masculine Heart Quest',
    description: courseDescription,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#090807] text-[#f4eadc]">{children}</body>
    </html>
  )
}
