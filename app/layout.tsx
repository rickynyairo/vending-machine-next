import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { use } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vending Machine',
  description: 'A Vending Machine app created using Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
