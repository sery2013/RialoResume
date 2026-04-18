'use client'
import { Trophy } from 'lucide-react'

interface Badge {
  id: string
  name: string
  icon: string
  desc: string
}

interface Props {
  badges: Badge[]
}

export default function AchievementBadge({ badges }: Props) {
  if (badges.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold">Achievements</h3>
        <span className="ml-auto text-xs bg-[var(--accent-glow)] text-[var(--accent-primary)] px-2 py-1 rounded-sm">
          {badges.length} unlocked
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className="p-3 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)] border border-[var(--border-subtle)] rounded-sm hover:border-[var(--accent-primary)] transition-all group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{badge.icon}</div>
            <h4 className="font-semibold text-sm text-white">{badge.name}</h4>
            <p className="text-xs text-[var(--text-muted)]">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
