import { Github, Twitter, RefreshCw, Shield, Zap, Link2 } from 'lucide-react'

interface Props {
  data: any
  onSync: () => void
}

export default function ResumeCard({ data, onSync }: Props) {
  return (
    <div className="card group">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {data.name}
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <a 
              href={`https://github.com/${data.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[var(--neutral-dim)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <Github size={14} />
              <span className="truncate max-w-[120px]">@{data.github}</span>
            </a>
            <a 
              href={`https://twitter.com/${data.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[var(--neutral-dim)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <Twitter size={14} />
              <span className="truncate max-w-[120px]">@{data.twitter}</span>
            </a>
          </div>
        </div>
        
        <button 
          onClick={onSync} 
          disabled={data.syncing}
          className="btn btn-primary group/btn"
        >
          <RefreshCw 
            size={14} 
            className={`transition-transform duration-500 ${data.syncing ? 'animate-spin' : 'group-hover/btn:rotate-180'}`} 
          />
          {data.syncing ? 'Syncing...' : 'Sync'}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-5 border-t border-[var(--border-subtle)]">
        <div className="metric">
          <span className="metric-label">Repositories</span>
          <span className="metric-value">{data.repos}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Commits (30d)</span>
          <span className="metric-value">{data.commits}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Followers</span>
          <span className="metric-value">{data.followers}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Last Sync</span>
          <span className="metric-value font-mono text-sm">{data.lastSync}</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-5 mt-5 border-t border-[var(--border-subtle)] text-sm">
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-sm ${
          data.privacy 
            ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-accent)]' 
            : 'text-[var(--text-muted)]'
        }`}>
          <Shield size={13} />
          Privacy: {data.privacy ? 'Enabled' : 'Public'}
        </span>
        
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-sm ${
          data.reactive 
            ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-accent)]' 
            : 'text-[var(--text-muted)]'
        }`}>
          <Zap size={13} />
          Reactive: {data.reactive ? 'Active' : 'Manual'}
        </span>
        
        <span className="flex items-center gap-1.5 text-[var(--text-muted)] ml-auto">
          <Link2 size={13} />
          <span className="text-xs font-mono">{data.chainId || 'rialo-devnet'}</span>
        </span>
      </div>

      {/* Subtle decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
    </div>
  )
}
