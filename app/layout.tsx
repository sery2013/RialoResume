import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LiveFolio | Reactive Resume on Rialo',
  description: 'Auto-updating on-chain portfolio powered by Rialo native HTTP calls & reactive transactions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
