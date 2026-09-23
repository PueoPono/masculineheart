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
const shareImage = {
  url: '/images/mhq-share-as-within.jpg',
  width: 1200,
  height: 630,
  alt: 'A man journaling over a mythic landscape with the words as within, so without.',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://masculineheart.vercel.app'),
  title: 'Masculine Heart Quest',
  description: courseDescription,
  openGraph: {
    title: 'Masculine Heart Quest',
    description: courseDescription,
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masculine Heart Quest',
    description: courseDescription,
    images: [shareImage],
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
