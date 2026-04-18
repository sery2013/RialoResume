'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ResumeCard from '@/components/ResumeCard'
import ConnectWallet from '@/components/ConnectWallet'
import { fetchProfile, simulateReactiveUpdate } from '@/lib/rialo-mock'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wallet) loadProfile()
  }, [wallet])

  const loadProfile = async () => {
    if (!wallet) return
    setLoading(true)
    try {
      const data = await fetchProfile(wallet)
      setProfile(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (!wallet) return
    setLoading(true)
    await simulateReactiveUpdate(wallet)
    await loadProfile()
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        {/* Hero Section (only when no wallet) */}
        {!wallet && !loading && (
          <div className="text-center py-16 mb-8 animate-float">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-sm bg-[var(--accent-glow)] border border-[var(--border-accent)]">
              <Sparkles size={14} className="text-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--accent-primary)]">Powered by Rialo Native HTTP</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your resume, <span className="text-gradient">auto-updating</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">
              Connect your wallet to activate reactive sync with GitHub, Twitter & LinkedIn via Rialo's native web calls.
            </p>
            <div className="flex justify-center">
              <ConnectWallet onConnect={setWallet} />
            </div>
          </div>
        )}
        
        {/* Wallet Display */}
        {wallet && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse-glow" />
              <span className="text-sm font-mono text-[var(--neutral)]">{wallet.slice(0, 10)}...{wallet.slice(-8)}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !profile && (
          <div className="card flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-secondary)]">Fetching on-chain profile...</p>
            <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">via Rialo RPC • sub-second finality</p>
          </div>
        )}

        {/* Profile Card */}
        {profile && !loading && (
          <div className="space-y-6">
            <ResumeCard data={profile} onSync={handleSync} />
            
            {/* Info Footer */}
            <div className="text-center text-sm text-[var(--text-muted)] pt-4">
              <p>
                Built for <span className="text-[var(--accent-primary)]">Rialo Shark Tank</span> • 
                <a href="https://rialo.io" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1">
                  Learn more <ArrowRight size={12} />
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
