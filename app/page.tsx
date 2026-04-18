'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import GitHubConnect from '@/components/GitHubConnect'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleConnect = async (username: string) => {
    setLoading(true)
    // Простая эмуляция для деплоя
    setTimeout(() => {
      setProfile({
        name: username,
        github: username,
        twitter: 'demo',
        avatar: `https://avatars.githubusercontent.com/${username}`,
        repos: Math.floor(Math.random() * 50) + 10,
        followers: Math.floor(Math.random() * 200) + 20,
        commits: Math.floor(Math.random() * 100) + 30,
        lastSync: new Date().toLocaleTimeString(),
        privacy: false,
        reactive: true,
        commitHistory: [
          { day: 'Mon', commits: 5 },
          { day: 'Tue', commits: 12 },
          { day: 'Wed', commits: 8 },
          { day: 'Thu', commits: 15 },
          { day: 'Fri', commits: 3 },
          { day: 'Sat', commits: 0 },
          { day: 'Sun', commits: 7 }
        ]
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-4xl mx-auto">
        <Header />
        {!profile ? (
          <GitHubConnect onConnect={handleConnect} loading={loading} />
        ) : (
          <div className="card p-6 border border-[#2a2a2a] rounded-sm bg-[#0a0a0a]">
            <div className="flex items-center gap-4 mb-6">
              {profile.avatar && (
                <img src={profile.avatar} alt={profile.github} className="w-16 h-16 rounded-sm" />
              )}
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-gray-400">@{profile.github}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Repos</p>
                <p className="text-lg font-mono">{profile.repos}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Commits</p>
                <p className="text-lg font-mono">{profile.commits}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Followers</p>
                <p className="text-lg font-mono">{profile.followers}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
