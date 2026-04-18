// app/page.tsx — ИСПРАВЛЕННАЯ ВЕРСИЯ
'use client'
import { useState } from 'react'
import Header from '@/components/Header'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')

  const handleConnect = async () => {
    if (!username.trim()) return
    
    setLoading(true)
    
    // Эмуляция запроса к GitHub API
    setTimeout(() => {
      setProfile({
        name: username,
        github: username,
        avatar: `https://avatars.githubusercontent.com/${username}`,
        repos: Math.floor(Math.random() * 50) + 10,
        commits: Math.floor(Math.random() * 150) + 50,
        followers: Math.floor(Math.random() * 200) + 20,
        lastSync: new Date().toLocaleTimeString('en-US', { hour12: false }),
        privacy: false,
        reactive: true
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        {!profile ? (
          <div className="card max-w-md mx-auto text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect GitHub</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Enter your GitHub username to load profile
              </p>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="your-github-username"
                className="field w-full text-center font-mono"
                disabled={loading}
              />
              
              <button 
                onClick={handleConnect}
                disabled={loading || !username.trim()}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <p>Try: torvalds, gaearon, or sery2013</p>
            </div>
          </div>
        ) : (
          <div className="card space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img 
                src={profile.avatar} 
                alt={profile.github} 
                className="w-16 h-16 rounded-sm border border-[var(--border-subtle)]"
              />
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
            <div className="text-xs text-[var(--text-muted)] text-center pt-4 border-t border-[var(--border-subtle)] space-y-1">
              <p>Last sync: {profile.lastSync}</p>
              <p className="text-[var(--accent-primary)]">Powered by Rialo Native HTTP</p>
            </div>

            {/* Reset Button */}
            <button 
              onClick={() => {
                setProfile(null)
                setUsername('')
              }}
              className="btn btn-outline w-full text-xs"
            >
              Disconnect & Try Another
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
