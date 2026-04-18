// components/RialoEcosystemTracker.tsx
'use client'
import { useState, useEffect } from 'react'
import { Github, GitBranch, Star, Users, ArrowUpRight, BookOpen, MessageCircle } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

// ================= TYPES =================
interface Repo {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  html_url: string
  owner: {
    login: string
    avatar_url: string
  }
}

interface Contributor {
  login: string
  avatar_url: string
  contributions: number
}

// ================= CONFIG =================
const CONFIG = {
  // Вариант 1: Основные организации
  organizations: [
    'subzero-labs', 
    'rialo-labs', 
    'rialo',
    'rialo-io'
  ],
  
  // Вариант 2: Расширенный поиск по ключевым словам (все запрошенные)
  searchQueries: [
    'Rialo in:name,description',
    'rialo.io in:name,description',
    'Rialo blockchain in:name,description',
    'Rialo crypto in:name,description',
    'Rialo проект in:name,description',
    'RWA blockchain in:name,description',
    'Pantera Capital Rialo in:name,description',
    'real-world assets blockchain in:name,description',
    'Web2 to Web3 onboarding in:name,description',
    'Subzero Labs in:name,description',
    // Комбинированный поиск (самый широкий)
    'Rialo rialo.io blockchain RWA real-world-assets language:Rust language:TypeScript'
  ],
  
  // Вариант 3: Конкретные репозитории (если знаешь точные названия)
  specificRepos: [
    'subzero-labs/rialo',
    'rialo-labs/rialo',
    'rialo-labs/rialo-core',
    'rialo-labs/rialo-sdk',
    'subzero-labs/rialo-protocol',
  ]
}

// ================= COMPONENT =================
export default function RialoEcosystemTracker() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let reposData: Repo[] = []
        let contributorsData: Contributor[] = []

        // ── Метод 1: Поиск по организациям ──
        for (const org of CONFIG.organizations) {
          try {
            const res = await fetch(`https://api.github.com/orgs/${org}/repos?sort=updated&per_page=10`)
            if (res.ok) {
              const data = await res.json()
              const rialoRepos = data.filter((repo: any) => 
                repo.name.toLowerCase().includes('rialo') || 
                repo.description?.toLowerCase().includes('rialo') ||
                repo.description?.toLowerCase().includes('rwa') ||
                repo.description?.toLowerCase().includes('real-world')
              )
              if (rialoRepos.length > 0) {
                reposData = rialoRepos.slice(0, 4)
                
                // Получаем контрибьюторов первого репо
                if (rialoRepos[0]) {
                  const contribRes = await fetch(
                    `https://api.github.com/repos/${org}/${rialoRepos[0].name}/contributors?per_page=5`
                  )
                  if (contribRes.ok) {
                    contributorsData = await contribRes.json()
                  }
                }
                break // нашли организацию
              }
            }
          } catch (e) {
            console.log(`Org ${org} not found, trying next...`)
          }
        }

        // ── Метод 2: Поиск по всем запросам из CONFIG.searchQueries ──
        if (reposData.length === 0) {
          for (const query of CONFIG.searchQueries) {
            try {
              const searchRes = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=4`
              )
              if (searchRes.ok) {
                const searchData = await searchRes.json()
                if (searchData.items && searchData.items.length > 0) {
                  // Фильтруем дубликаты и релевантные репозитории
                  const uniqueRepos = searchData.items.filter((repo: any) => 
                    !reposData.find(r => r.html_url === repo.html_url)
                  )
                  reposData = [...reposData, ...uniqueRepos].slice(0, 4)
                  
                  // Контрибьюторы для первого найденного
                  if (reposData[0]) {
                    const contribRes = await fetch(
                      `https://api.github.com/repos/${reposData[0].owner.login}/${reposData[0].name}/contributors?per_page=5`
                    )
                    if (contribRes.ok) {
                      contributorsData = await contribRes.json()
                    }
                  }
                  break // нашли хотя бы один репозиторий
                }
              }
            } catch (e) {
              console.log(`Query "${query}" failed, trying next...`)
            }
          }
        }

        // ── Метод 3: Конкретные репозитории ──
        if (reposData.length === 0 && CONFIG.specificRepos.length > 0) {
          for (const repoPath of CONFIG.specificRepos) {
            try {
              const res = await fetch(`https://api.github.com/repos/${repoPath}`)
              if (res.ok) {
                const repoData = await res.json()
                reposData.push(repoData)
                
                const contribRes = await fetch(
                  `https://api.github.com/repos/${repoPath}/contributors?per_page=5`
                )
                if (contribRes.ok) {
                  contributorsData = await contribRes.json()
                }
                break
              }
            } catch (e) {
              console.log(`Repo ${repoPath} not found`)
            }
          }
        }

        if (reposData.length === 0) {
          throw new Error('No Rialo repositories found. Try updating CONFIG with correct organization/repo names')
        }

        setRepos(reposData)
        setContributors(contributorsData)
        setError(null)
      } catch (err: any) {
        console.error('Fetch error:', err)
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Rialo Ecosystem</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {loading ? 'Searching repositories...' : error ? 'Search failed' : `${repos.length} repos found`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://github.com/search?q=rialo&type=repositories" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1 px-2 py-1 h-8">
            <Github size={14} /> Search
          </a>
          <a href="https://rialo.io" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1 px-2 py-1 h-8">
            <BookOpen size={14} /> Website
          </a>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="card text-center py-12 text-[var(--text-muted)] animate-pulse">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          Searching GitHub for Rialo repositories...
        </div>
      ) : error ? (
        /* Error State */
        <div className="card p-6 border border-red-500/30">
          <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>
          <p className="text-xs text-[var(--text-muted)]">
            Try updating CONFIG in RialoEcosystemTracker.tsx with correct organization/repo names
          </p>
        </div>
      ) : (
        /* Success State */
        <>
          {/* Repos List */}
          <div className="grid gap-3">
            {repos.map((repo) => (
              <a
                key={repo.html_url}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="card flex items-center justify-between p-4 hover:border-[var(--accent-primary)] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={repo.owner.avatar_url} alt="" className="w-8 h-8 rounded-sm flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {repo.owner.login}/{repo.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] truncate">{repo.description || 'Rialo-related repository'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-shrink-0 pl-2">
                  {repo.language && (
                    <span className="px-2 py-0.5 bg-[var(--bg-elevated)] rounded-sm text-[10px]">{repo.language}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star size={12} /> 
                    <AnimatedCounter value={repo.stargazers_count} duration={1000} />
                  </span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>

          {/* Contributors List */}
          {contributors.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Users size={16} className="text-[var(--accent-primary)]" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {contributors.slice(0, 5).map((c, i) => (
                  <div key={c.login} className="flex items-center justify-between p-2 hover:bg-[var(--bg-elevated)] rounded-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-muted)] w-4">#{i + 1}</span>
                      <img src={c.avatar_url} alt={c.login} className="w-8 h-8 rounded-sm" />
                      <span className="text-sm font-medium truncate max-w-[120px]">{c.login}</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--accent-primary)]">{c.contributions} commits</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <a href="https://github.com/topics/rialo" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all group">
              <Github size={20} className="mx-auto mb-2 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[var(--text-muted)]">Topic</p>
              <p className="font-semibold text-sm">All Rialo Repos</p>
            </a>
            <a href="https://discord.gg/rialo" target="_blank" rel="noreferrer" className="card p-4 text-center hover:border-[var(--accent-primary)] transition-all group">
              <MessageCircle size={20} className="mx-auto mb-2 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[var(--text-muted)]">Community</p>
              <p className="font-semibold text-sm">Discord</p>
            </a>
          </div>
        </>
      )}
    </div>
  )
}
