'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ResumeCard from '@/components/ResumeCard'
import ConnectWallet from '@/components/ConnectWallet'
import { fetchProfile, simulateReactiveUpdate } from '@/lib/rialo-mock'

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
    <main className="p-6 max-w-4xl mx-auto">
      <Header />
      
      <div className="flex justify-end mb-6">
        {!wallet ? (
          <ConnectWallet onConnect={setWallet} />
        ) : (
          <span className="text-sm text-gray-400 font-mono bg-gray-900 px-3 py-2 rounded-sm border border-gray-700">
            {wallet}
          </span>
        )}
      </div>

      {loading && !profile && (
        <div className="text-center py-12 text-gray-500 animate-pulse">
          Fetching on-chain profile via Rialo RPC...
        </div>
      )}

      {profile && !loading && (
        <ResumeCard data={profile} onSync={handleSync} />
      )}

      {!wallet && !loading && (
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-sm">
          <p className="text-gray-400">Connect wallet to load your reactive resume</p>
        </div>
      )}
    </main>
  )
}
