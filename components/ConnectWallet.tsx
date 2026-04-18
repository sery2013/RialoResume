'use client'
import { useState } from 'react'
import { Github, Loader2 } from 'lucide-react'

interface Props {
  onConnect: (username: string) => void
  loading: boolean
}

export default function GitHubConnect({ onConnect, loading }: Props) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onConnect(username.trim())
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center">
          <Github size={24} className="text-black" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect GitHub Profile</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Enter your GitHub username to fetch real data via Rialo native HTTP calls
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-github-username"
            className="field w-full text-center font-mono"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !username.trim()}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Fetching via Rialo RPC...
            </>
          ) : (
            <>
              <Github size={16} />
              Connect & Sync
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] text-center">
        <p>🔒 Public data only • No OAuth required</p>
        <p className="mt-1">Powered by Rialo native HTTP oracle</p>
      </div>
    </div>
  )
}
