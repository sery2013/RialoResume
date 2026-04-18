'use client'
import { useState } from 'react'
import ReactiveAnimation from '@/components/ReactiveAnimation'
import GitHubHeatmap from '@/components/GitHubHeatmap'
import AchievementBadge from '@/components/AchievementBadge'
import AnimatedCounter from '@/components/AnimatedCounter'
import { fetchGitHubProfile, fetchUserCommits, calculateCommitActivity, generateAchievements } from '@/lib/github-api'
import { Github, Zap, Loader2 } from 'lucide-react'

export default function GitHubResume() {
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
      setProfile({ ...profileData, lastSync: new Date().toLocaleTimeString('en-US', { hour12: false }) })
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
    <>
      <div className="space-y-6">
        {!profile ? (
          <div className="card text-center space-y-6 py-12">
            <div className="w-16 h-16 mx-auto rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
              <Github className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Reactive Resume</h3>
              <p className="text-sm text-[var(--text-muted)]">On-chain GitHub profile with auto-sync</p>
            </div>
            <div className="space-y-3 max-w-sm mx-auto">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="github-username"
                className="field w-full text-center font-mono"
                disabled={loading}
              />
              <button 
                onClick={handleConnect}
                disabled={loading || !username.trim()}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...</> : 'Connect'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-sm border-2 border-[var(--accent-primary)]" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{profile.name || profile.login}</h2>
                  <p className="text-sm text-[var(--text-muted)]">@{profile.login}</p>
                </div>
                <button onClick={handleReactiveSync} className="btn btn-primary text-sm">
                  <Zap className="w-4 h-4 mr-1" /> Sync
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="metric text-center p-3 bg-[var(--bg-elevated)] rounded-sm">
                  <span className="metric-label text-xs">Repos</span>
                  <span className="metric-value text-xl"><AnimatedCounter value={profile.public_repos} duration={1000} /></span>
                </div>
                <div className="metric text-center p-3 bg-[var(--bg-elevated)] rounded-sm">
                  <span className="metric-label text-xs">Followers</span>
                  <span className="metric-value text-xl"><AnimatedCounter value={profile.followers} duration={1000} /></span>
                </div>
                <div className="metric text-center p-3 bg-[var(--bg-elevated)] rounded-sm">
                  <span className="metric-label text-xs">Commits</span>
                  <span className="metric-value text-xl"><AnimatedCounter value={commits.length} duration={1000} /></span>
                </div>
                <div className="metric text-center p-3 bg-[var(--bg-elevated)] rounded-sm">
                  <span className="metric-label text-xs">Following</span>
                  <span className="metric-value text-xl"><AnimatedCounter value={profile.following} duration={1000} /></span>
                </div>
              </div>
            </div>
            <GitHubHeatmap activity={activity} />
            {achievements.length > 0 && <AchievementBadge badges={achievements} />}
          </>
        )}
      </div>
      <ReactiveAnimation isActive={showReactive} onComplete={handleReactiveComplete} />
    </>
  )
}
