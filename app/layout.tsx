import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'mobile-shop-calculator',
  description: 'daily expense and profit calculator for a mobile shop',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
