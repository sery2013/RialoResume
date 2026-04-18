'use client'
import { useEffect, useState } from 'react'

interface Props {
  activity: Array<{ date: string; count: number }>
}

export default function GitHubHeatmap({ activity }: Props) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100)
  }, [])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800'
    if (count <= 2) return 'bg-[#0e4429]'
    if (count <= 5) return 'bg-[#006d32]'
    if (count <= 10) return 'bg-[#26a641]'
    return 'bg-[#39d353]'
  }

  // Группируем по неделям
  const weeks: Array<typeof activity> = []
  for (let i = 0; i < activity.length; i += 7) {
    weeks.push(activity.slice(i, i + 7))
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-4 text-[var(--neutral)]">Contribution Activity</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-all duration-700 ${
                  animated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{ transitionDelay: `${weekIdx * 50 + dayIdx * 30}ms` }}
                title={`${day.date}: ${day.count} commits`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-muted)] justify-end">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-[#0e4429]" />
          <div className="w-3 h-3 rounded-sm bg-[#006d32]" />
          <div className="w-3 h-3 rounded-sm bg-[#26a641]" />
          <div className="w-3 h-3 rounded-sm bg-[#39d353]" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
