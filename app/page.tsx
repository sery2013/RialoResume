// app/page.tsx — ULTRA-SAFE VERSION for web-only workflow
'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'

// Максимально защищённые динамические импорты
const GitHubResume = dynamic(
  async () => {
    try {
      const mod = await import('@/components/GitHubResume')
      return mod.default || (() => null)
    } catch (e) {
      console.error('GitHubResume load error:', e)
      return () => (
        <div className="card p-6 border border-red-500/30">
          <p className="text-red-400 text-sm">⚠️ Resume module unavailable</p>
        </div>
      )
    }
  },
  { ssr: false, loading: () => <div className="card h-96 animate-pulse bg-[var(--bg-elevated)]" /> }
)

const RialoEcosystemTracker = dynamic(
  async () => {
    try {
      const mod = await import('@/components/RialoEcosystemTracker')
      return mod.default || (() => null)
    } catch (e) {
      console.error('RialoEcosystemTracker load error:', e)
      return () => (
        <div className="card p-6 border border-red-500/30">
          <p className="text-red-400 text-sm">⚠️ Tracker module unavailable</p>
        </div>
      )
    }
  },
  { ssr: false, loading: () => <div className="card h-96 animate-pulse bg-[var(--bg-elevated)]" /> }
)

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="text-center mb-8 mt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Your Identity <span className="text-[var(--accent-primary)]">×</span> Rialo Ecosystem
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm">
            Real-time GitHub analytics on the left. Live Rialo repository tracking on the right.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <GitHubResume />
          </Suspense>
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <RialoEcosystemTracker />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
