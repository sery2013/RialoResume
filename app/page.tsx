// app/page.tsx — FINAL VERSION with dynamic imports
'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'

// Динамические импорты с обработкой ошибок (чтобы сборка не падала)
const GitHubResume = dynamic(
  () => import('@/components/GitHubResume').catch(() => () => (
    <div className="card p-6 text-center text-[var(--text-muted)]">
      Loading Resume module...
    </div>
  )),
  { ssr: false, loading: () => <div className="card h-96 animate-pulse" /> }
)

const RialoEcosystemTracker = dynamic(
  () => import('@/components/RialoEcosystemTracker').catch(() => () => (
    <div className="card p-6 text-center text-[var(--text-muted)]">
      Loading Tracker module...
    </div>
  )),
  { ssr: false, loading: () => <div className="card h-96 animate-pulse" /> }
)

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Общий Хедер */}
        <Header />
        
        {/* 2. Заголовок страницы */}
        <div className="text-center mb-8 mt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Your Identity <span className="text-[var(--accent-primary)]">×</span> Rialo Ecosystem
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm">
            Real-time GitHub analytics on the left. Live Rialo repository & contributor tracking on the right.
          </p>
        </div>

        {/* 3. Сетка 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <GitHubResume />
          </Suspense>
          
          {/* ПРАВАЯ КОЛОНКА */}
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <RialoEcosystemTracker />
          </Suspense>
          
        </div>
      </div>
    </main>
  )
}
