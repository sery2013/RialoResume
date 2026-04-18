'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import GitHubConnect from '@/components/GitHubConnect'
import ResumeCard from '@/components/ResumeCard'
import ActivityChart from '@/components/ActivityChart'
import ReactiveVisualizer from '@/components/ReactiveVisualizer'
import { fetchGitHubData, simulateReactiveSync } from '@/lib/github-api'
import { Zap, Github, RefreshCw } from 'lucide-react'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showReactiveViz, setShowReactiveViz] = useState(false)
  const [lastTx, setLastTx] = useState<any>(null)

  const handleConnect = async (username: string) => {
    setLoading(true)
    try {
      const data = await fetchGitHubData(username)
      setProfile(data)
    } catch (error) {
      alert('GitHub user not found. Try another username.')
    } finally {
      setLoading(false)
    }
  }

  const handleReactiveSync = async () => {
    setShowReactiveViz(true)
    try {
      const tx = await simulateReactiveSync(profile.github)
      setLastTx(tx)
      // Обновляем данные после "синхронизации"
      const newData = await fetchGitHubData(profile.github)
      newData.lastSync = new Date().toLocaleTimeString('en-US', { hour12: false })
      // Немного рандомизируем для демонстрации
      newData.commits = profile.commits + Math.floor(Math.random() * 5) + 1
      setProfile(newData)
    } finally {
      setShowReactiveViz(false)
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Header />
        
        {!profile ? (
          <GitHubConnect onConnect={handleConnect} loading={loading} />
        ) : (
          <div className="space-y-6">
            {/* Profile Card с кнопкой Reactive Sync */}
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {profile.avatar && (
                    <img 
                      src={profile.avatar} 
                      alt={profile.github}
                      className="w-16 h-16 rounded-sm border border-[var(--border-subtle)]"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-1">
                      <Github size={14} />
                      <span>@{profile.github}</span>
                      {profile.twitter !== 'not_linked' && (
                        <>
                          <span>•</span>
                          <span>@{profile.twitter}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleReactiveSync}
                  disabled={loading}
                  className="btn btn-primary group"
                >
                  <Zap size={16} className="group-hover:scale-110 transition-transform" />
                  Trigger Reactive Sync
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--border-subtle)]">
                <div className="metric">
                  <span className="metric-label">Repositories</span>
                  <span className="metric-value">{profile.repos}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Commits (30d)</span>
                  <span className="metric-value">{profile.commits}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Followers</span>
                  <span className="metric-value">{profile.followers}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Last Sync</span>
                  <span className="metric-value font-mono text-sm">{profile.lastSync}</span>
                </div>
              </div>

              {/* Blockchain Proof */}
              {lastTx && (
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <p className="text-xs text-[var(--text-muted)] mb-2">Last Transaction</p>
                  <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[var(--text-muted)] block">Hash</span>
                      <span className="text-[var(--accent-primary)]">{lastTx.hash.slice(0, 16)}...</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Block</span>
                      <span>{lastTx.block.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Gas</span>
                      <span>{lastTx.gas.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Chart */}
            <ActivityChart data={profile.commitHistory} />

            {/* Info */}
            <div className="text-center text-sm text-[var(--text-muted)] pt-4">
              <p>
                Built for <span className="text-[var(--accent-primary)]">Rialo Shark Tank</span> • 
                Demonstrates native HTTP calls + reactive transactions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reactive Transaction Visualizer */}
      <ReactiveVisualizer 
        isActive={showReactiveViz} 
        onComplete={() => setShowReactiveViz(false)} 
      />
    </main>
  )
}
