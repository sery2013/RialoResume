'use client'
import { useState, useEffect } from 'react'
import { Github, GitBranch, Star, Users, ArrowUpRight, BookOpen, MessageCircle } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

// Типы данных (чтобы TypeScript не ругался)
interface Repo {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
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
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Получаем репозитории
        const reposRes = await fetch('https://api.github.com/orgs/rialo-labs/repos?sort=stars&per_page=4')
        if (!reposRes.ok) throw new Error('Failed to fetch repos')
        const reposData = await reposRes.json()
        setRepos(reposData)

        // 2. Получаем контрибьюторов главного репо
        const contribRes = await fetch('https://api.github.com/repos/rialo-labs/rialo/contributors?per_page=5')
        if (!contribRes.ok) throw new Error('Failed to fetch contributors')
        const contribData = await contribRes.json()
        setContributors(contribData)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Заголовок блока */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Rialo Ecosystem</h2>
            <p className="text-xs text-[var(--text-muted)]">Live repo & contributor tracking</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://github.com/rialo-labs" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1 px-2 py-1 h-8">
            <Github size={14} /> Org
          </a>
          <a href="https://docs.rialo.io" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1 px-2 py-1 h-8">
            <BookOpen size={14} /> Docs
          </a>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-12 text-[var(--text-muted)] animate-pulse">
          Loading ecosystem data...
        </div>
      ) : error ? (
        <div className="card text-center py-12 border border-red-500/30">
          <p className="text-red-400">Failed to load data. GitHub API might be rate limited.</p>
        </div>
      ) : (
        <>
          {/* Список репозиториев */}
          <div className="grid gap-3">
            {repos.length > 0 ? repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="card flex items-center justify-between p-4 hover:border-[var(--accent-primary)] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 flex-shrink-0 rounded-sm bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent-primary)]">
                    <GitBranch size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {repo.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] truncate">{repo.description || 'Core infrastructure'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-shrink-0 pl-2">
                  <span className="flex items-center gap-1"><Star size={12} /> <AnimatedCounter value={repo.stargazers_count} duration={1000} /></span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            )) : (
              <p className="text-sm text-center text-[var(--text-muted)]">No repositories found</p>
            )}
          </div>

          {/* Топ контрибьюторов */}
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
                    <span className="text-sm font-medium truncate max-w-[120px]">{c.login}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-primary)]">{c.contributions} commits</span>
                </div>
              )) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-2">No contributor data</p>
              )}
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="grid grid-cols-2 gap-3">
            <a href="https://discord.gg/rialo" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all group">
              <MessageCircle size={20} className="mx-auto mb-2 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[var(--text-muted)]">Community</p>
              <p className="font-semibold text-sm">Discord</p>
            </a>
            <a href="https://rialo.io" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all group">
              <Github size={20} className="mx-auto mb-2 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[var(--text-muted)]">Codebase</p>
              <p className="font-semibold text-sm">GitHub</p>
            </a>
          </div>
        </>
      )}
    </div>
  )
}
