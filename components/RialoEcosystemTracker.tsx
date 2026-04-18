'use client'
import { useState, useEffect } from 'react'
import { Github, ExternalLink, Users, GitBranch, Star, ArrowUpRight, BookOpen, MessageCircle } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface Repo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  html_url: string
}

interface Contributor {
  login: string
  avatar_url: string
  contributions: number
}

export default function RialoEcosystemTracker() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Реальные API GitHub (организация Rialo)
        const reposRes = await fetch('https://api.github.com/orgs/rialo-labs/repos?sort=updated&per_page=6')
        const reposData = await reposRes.json()
        setRepos(Array.isArray(reposData) ? reposData : [])

        const contribRes = await fetch('https://api.github.com/repos/rialo-labs/rialo/contributors?per_page=5')
        const contribData = await contribRes.json()
        setContributors(Array.isArray(contribData) ? contribData : [])
      } catch (e) {
        console.error('GitHub API Rate Limit or Network Error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // Авто-обновление каждые 60 сек
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Rialo Ecosystem</h2>
            <p className="text-xs text-[var(--text-muted)]">Live repos & contributor tracking</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://github.com/rialo-labs" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1">
            <Github size={14} /> Org
          </a>
          <a href="https://docs.rialo.io" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1">
            <BookOpen size={14} /> Docs
          </a>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-10 text-[var(--text-muted)] animate-pulse">Loading ecosystem data via GitHub API...</div>
      ) : (
        <>
          {/* Repos List */}
          <div className="grid gap-3">
            {repos.slice(0, 4).map(repo => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="card flex items-center justify-between p-4 hover:border-[var(--accent-primary)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent-primary)]">
                    <GitBranch size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                      {repo.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{repo.description || 'Core infrastructure'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><Star size={12} /> <AnimatedCounter value={repo.stargazers_count} duration={800} /></span>
                  <span className="flex items-center gap-1"><GitBranch size={12} /> {repo.forks_count}</span>
                  {repo.language && <span className="px-2 py-0.5 bg-[var(--bg-elevated)] rounded-sm">{repo.language}</span>}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>

          {/* Top Contributors */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users size={16} className="text-[var(--accent-primary)]" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              {contributors.length > 0 ? contributors.slice(0, 5).map((c, i) => (
                <div key={c.login} className="flex items-center justify-between p-2 hover:bg-[var(--bg-elevated)] rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)] w-4">#{i + 1}</span>
                    <img src={c.avatar_url} alt={c.login} className="w-8 h-8 rounded-sm" />
                    <span className="text-sm font-medium">{c.login}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-primary)]">{c.contributions} commits</span>
                </div>
              )) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No public contributors data</p>
              )}
            </div>
          </div>

          {/* Ecosystem Links */}
          <div className="grid grid-cols-2 gap-3">
            <a href="https://discord.gg/rialo" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all">
              <MessageCircle size={20} className="mx-auto mb-2 text-[var(--accent-primary)]" />
              <p className="text-xs text-[var(--text-muted)]">Community</p>
              <p className="font-semibold text-sm">Discord</p>
            </a>
            <a href="https://rialo.io/shark-tank" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all">
              <Zap size={20} className="mx-auto mb-2 text-[var(--accent-primary)]" />
              <p className="text-xs text-[var(--text-muted)]">Build</p>
              <p className="font-semibold text-sm">Shark Tank</p>
            </a>
          </div>
        </>
      )}
    </div>
  )
}
