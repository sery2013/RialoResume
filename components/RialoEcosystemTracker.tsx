// components/RialoEcosystemTracker.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { Github, GitBranch, Star, Users, ArrowUpRight, BookOpen, MessageCircle, Search, X } from 'lucide-react'
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

interface SearchResult extends Repo {
  full_name: string
}

// ================= CONFIG =================
const CONFIG = {
  organizations: ['subzero-labs', 'rialo-labs', 'rialo', 'rialo-io'],
  searchQueries: [
    'Rialo in:name,description',
    'rialo.io in:name,description',
    'Rialo blockchain in:name,description',
    'RWA blockchain in:name,description',
    'real-world assets blockchain in:name,description',
    'Subzero Labs in:name,description',
  ],
  specificRepos: [
    'subzero-labs/rialo',
    'rialo-labs/rialo',
  ]
}

// ================= COMPONENT =================
export default function RialoEcosystemTracker() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let reposData: Repo[] = []
        let contributorsData: Contributor[] = []

        // Метод 1: Поиск по организациям
        for (const org of CONFIG.organizations) {
          try {
            const res = await fetch(`https://api.github.com/orgs/${org}/repos?sort=updated&per_page=10`)
            if (res.ok) {
              const data = await res.json()
              const rialoRepos = data.filter((repo: any) => 
                repo.name.toLowerCase().includes('rialo') || 
                repo.description?.toLowerCase().includes('rialo') ||
                repo.description?.toLowerCase().includes('rwa')
              )
              if (rialoRepos.length > 0) {
                reposData = rialoRepos.slice(0, 4)
                if (rialoRepos[0]) {
                  const contribRes = await fetch(
                    `https://api.github.com/repos/${org}/${rialoRepos[0].name}/contributors?per_page=5`
                  )
                  if (contribRes.ok) {
                    contributorsData = await contribRes.json()
                  }
                }
                break
              }
            }
          } catch (e) {
            console.log(`Org ${org} not found`)
          }
        }

        // Метод 2: Поиск по запросам
        if (reposData.length === 0) {
          for (const query of CONFIG.searchQueries) {
            try {
              const searchRes = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=4`
              )
              if (searchRes.ok) {
                const searchData = await searchRes.json()
                if (searchData.items && searchData.items.length > 0) {
                  const uniqueRepos = searchData.items.filter((repo: any) => 
                    !reposData.find(r => r.html_url === repo.html_url)
                  )
                  reposData = [...reposData, ...uniqueRepos].slice(0, 4)
                  if (reposData[0]) {
                    const contribRes = await fetch(
                      `https://api.github.com/repos/${reposData[0].owner.login}/${reposData[0].name}/contributors?per_page=5`
                    )
                    if (contribRes.ok) {
                      contributorsData = await contribRes.json()
                    }
                  }
                  break
                }
              }
            } catch (e) {
              console.log(`Query failed`)
            }
          }
        }

        if (reposData.length === 0) {
          throw new Error('No Rialo repositories found')
        }

        setRepos(reposData)
        setContributors(contributorsData)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowResults(true)

    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=10`
      )
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.items || [])
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

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
              {loading ? 'Loading...' : error ? 'Error' : `${repos.length} repos found`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://rialo.io" target="_blank" rel="noreferrer" className="btn btn-outline text-xs flex items-center gap-1 px-2 py-1 h-8">
            <BookOpen size={14} /> Website
          </a>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Rialo repos on GitHub..."
            className="field w-full pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || isSearching) && (
          <div className="absolute top-full left-0 right-0 mt-2 card bg-[var(--bg-elevated)] border border-[var(--border-subtle)] z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-[var(--text-muted)]">
                <div className="w-6 h-6 mx-auto mb-2 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  {searchResults.length} results for "{searchQuery}"
                </div>
                {searchResults.slice(0, 10).map((repo) => (
                  <a
                    key={repo.html_url}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-card)] transition-colors border-b border-[var(--border-subtle)] last:border-0"
                    onClick={() => setShowResults(false)}
                  >
                    <img src={repo.owner.avatar_url} alt="" className="w-6 h-6 rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{repo.full_name}</span>
                        {repo.language && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-elevated)] rounded-sm text-[var(--text-muted)]">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate">{repo.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Star size={12} /> {repo.stargazers_count}
                      </span>
                      <ArrowUpRight size={14} />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No results message */}
        {showResults && searchResults.length === 0 && !isSearching && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 card bg-[var(--bg-elevated)] border border-[var(--border-subtle)] z-50 p-4 text-center text-[var(--text-muted)]">
            No repositories found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="card text-center py-12 text-[var(--text-muted)] animate-pulse">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          Loading ecosystem data...
        </div>
      ) : error ? (
        <div className="card p-6 border border-red-500/30">
          <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>
          <p className="text-xs text-[var(--text-muted)]">Use search above to find Rialo repositories</p>
        </div>
      ) : (
        <>
          {/* Featured Repos */}
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

          {/* Contributors */}
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
