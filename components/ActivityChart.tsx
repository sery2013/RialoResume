'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  data: Array<{ day: string; commits: number }>
}

export default function ActivityChart({ data }: Props) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-4 text-[var(--neutral)]">Commit Activity (7 Days)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#111', 
                border: '1px solid #2a2a2a',
                borderRadius: '2px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(169, 221, 211, 0.1)' }}
            />
            <Bar 
              dataKey="commits" 
              fill="#a9ddd3" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
