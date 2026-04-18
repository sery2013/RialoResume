import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center gap-4 mb-10 pb-6 border-b border-[var(--border-subtle)]">
      {/* Logo with subtle glow */}
      <div className="relative">
        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center font-bold text-black text-sm">
          LF
        </div>
        <div className="absolute inset-0 rounded-sm bg-[var(--accent-primary)] blur-lg opacity-20 -z-10" />
      </div>
      
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Live<span className="text-[var(--accent-primary)]">Folio</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)]">Reactive Resume Protocol</p>
      </div>
      
      <div className="ml-auto">
        <span className="badge">
          <Zap size={12} />
          Rialo Native
        </span>
      </div>
    </header>
  )
}
