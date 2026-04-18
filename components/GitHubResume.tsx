'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import ReactiveAnimation from '@/components/ReactiveAnimation'
import GitHubHeatmap from '@/components/GitHubHeatmap'
import AchievementBadge from '@/components/AchievementBadge'
import AnimatedCounter from '@/components/AnimatedCounter'
import { fetchGitHubProfile, fetchUserCommits, calculateCommitActivity, generateAchievements } from '@/lib/github-api'
import { Github, Zap, Loader2 } from 'lucide-react'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [showReactive, setShowReactive] = useState(false)
  const [commits, setCommits] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])

  const handleConnect = async () => {
    if (!username.trim()) return
    
    setLoading(true)
    setShowReactive(true)
  }

  const handleReactiveComplete = async () => {
    setShowReactive(false)
    
    try {
      const profileData = await fetchGitHubProfile(username)
      const commitsData = await fetchUserCommits(username)
      
      setCommits(commitsData)
      setActivity(calculateCommitActivity(commitsData))
      setAchievements(generateAchievements(profileData, commitsData))
      
      setProfile({
        ...profileData,
        lastSync: new Date().toLocaleTimeString('en-US', { hour12: false })
      })
    } catch (error) {
      alert('User not found. Try: torvalds, gaearon, or sery2013')
    } finally {
      setLoading(false)
    }
  }

  const handleReactiveSync = () => {
    setShowReactive(true)
    setTimeout(() => {
      setProfile({ ...profile, lastSync: new Date().toLocaleTimeString('en-US', { hour12: false }) })
    }, 5000)
  }

  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        {!profile ? (
          <div className="card max-w-lg mx-auto text-center space-y-6 py-12">
            <div className="w-16 h-16 mx-auto rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
              <Github className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Connect GitHub Profile</h3>
              <p className="text-[var(--text-muted)]">
                Experience reactive on-chain data sync with real-time GitHub analytics
              </p>
            </div>
            
            <div className="space-y-3 max-w-sm mx-auto">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="github-username"
                className="field w-full text-center font-mono text-lg"
                disabled={loading}
              />
              
              <button 
                onClick={handleConnect}
                disabled={loading || !username.trim()}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Connecting...</>
                ) : (
                  <><Zap className="w-5 h-5 mr-2" /> Connect & Sync</>
                )}
              </button>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <p className="mb-2">Try these profiles:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {['torvalds', 'gaearon', 'sindresorhus'].map(u => (
                  <button 
                    key={u}
                    onClick={() => setUsername(u)}
                    className="px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm hover:border-[var(--accent-primary)] transition-colors"
                  >
                    @{u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.login}
                  className="w-20 h-20 rounded-sm border-2 border-[var(--accent-primary)]"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{profile.name || profile.login}</h2>
                  <p className="text-[var(--text-muted)]">@{profile.login}</p>
                  {profile.twitter_username && (
                    <p className="text-sm text-[var(--accent-primary)]">@{profile.twitter_username}</p>
                  )}
                </div>
                <button 
                  onClick={handleReactiveSync}
                  className="btn btn-primary"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Trigger Reactive Sync
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-[var(--border-subtle)]">
                <div className="metric text-center">
                  <span className="metric-label">Repositories</span>
                  <span className="metric-value text-2xl">
                    <AnimatedCounter value={profile.public_repos} />
                  </span>
                </div>
                <div className="metric text-center">
                  <span className="metric-label">Followers</span>
                  <span className="metric-value text-2xl">
                    <AnimatedCounter value={profile.followers} />
                  </span>
                </div>
                <div className="metric text-center">
                  <span className="metric-label">Following</span>
                  <span className="metric-value text-2xl">
                    <AnimatedCounter value={profile.following} />
                  </span>
                </div>
                <div className="metric text-center">
                  <span className="metric-label">Total Commits</span>
                  <span className="metric-value text-2xl">
                    <AnimatedCounter value={commits.length} />
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-[var(--text-muted)] text-center font-mono">
                Last sync: {profile.lastSync} • Powered by Rialo Native HTTP
              </div>
            </div>

            {/* Heatmap */}
            <GitHubHeatmap activity={activity} />

            {/* Achievements */}
            <AchievementBadge badges={achievements} />

            {/* Reset */}
            <div className="text-center">
              <button 
                onClick={() => {
                  setProfile(null)
                  setUsername('')
                  setCommits([])
                  setActivity([])
                  setAchievements([])
                }}
                className="btn btn-outline"
              >
                Disconnect & Try Another Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <ReactiveAnimation isActive={showReactive} onComplete={handleReactiveComplete} />
    </main>
  )
}
