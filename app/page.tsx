// app/page.tsx — MINIMAL FALLBACK VERSION
import Header from '@/components/Header'

// Динамический импорт с обработкой ошибок, чтобы сборка не падала, если файла нет
const GitHubResume = dynamic(() => import('@/components/GitHubResume').catch(() => () => <div className="card p-6">Loading Resume...</div>), { ssr: false })
const RialoEcosystemTracker = dynamic(() => import('@/components/RialoEcosystemTracker').catch(() => () => <div className="card p-6">Loading Tracker...</div>), { ssr: false })
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="text-center mb-8 mt-6">
          <h1 className="text-2xl font-bold mb-2">LiveFolio <span className="text-[var(--accent-primary)]">2.0</span></h1>
          <p className="text-sm text-gray-500">GitHub Profile + Rialo Ecosystem</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
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
