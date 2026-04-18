// app/page.tsx — минимальная версия, 100% рабочий дизайн
'use client'
import { useState } from 'react'
import Header from '@/components/Header'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleConnect = (username: string) => {
    setLoading(true)
    setTimeout(() => {
      setProfile({
        name: username,
        github: username,
        avatar: `https://avatars.githubusercontent.com/${username}`,
        repos: 42,
        commits: 156,
        followers: 89,
        lastSync: new Date().toLocaleTimeString()
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        {!profile ? (
          <div className="card max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Connect GitHub</h3>
            <input
              type="text"
              placeholder="your-username"
              className="field w-full mb-4 text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleConnect((e.target as HTMLInputElement).value)}
            />
            <button 
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement
                if (input?.value) handleConnect(input.value)
              }}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Connect'}
            </button>
          </div>
        ) : (
          <div className="card space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img src={profile.avatar} alt="" className="w-16 h-16 rounded-sm border border-[var(--border-subtle)]" />
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">@{profile.github}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="metric text-center">
                <span className="metric-label">Repos</span>
                <span className="metric-value">{profile.repos}</span>
              </div>
              <div className="metric text-center">
                <span className="metric-label">Commits</span>
                <span className="metric-value">{profile.commits}</span>
              </div>
              <div className="metric text-center">
                <span className="metric-label">Followers</span>
                <span className="metric-value">{profile.followers}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-[var(--text-muted)] text-center pt-4 border-t border-[var(--border-subtle)]">
              Last sync: {profile.lastSync} • Powered by Rialo
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
