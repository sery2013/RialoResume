import { Github, Twitter, RefreshCw, Shield, Zap } from 'lucide-react'

interface Props {
  data: any
  onSync: () => void
}

export default function ResumeCard({ data, onSync }: Props) {
  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <div className="flex gap-2 mt-1 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Github size={14} /> {data.github}</span>
            <span className="flex items-center gap-1"><Twitter size={14} /> {data.twitter}</span>
          </div>
        </div>
        <button onClick={onSync} className="btn btn-primary flex items-center gap-2">
          <RefreshCw size={14} className={data.syncing ? 'animate-spin' : ''} />
          Sync Now
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-500 uppercase">Repos</p>
          <p className="font-mono text-lg">{data.repos}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Commits (30d)</p>
          <p className="font-mono text-lg">{data.commits}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Followers</p>
          <p className="font-mono text-lg">{data.followers}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Last Sync</p>
          <p className="font-mono text-lg">{data.lastSync}</p>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Shield size={12} /> Privacy: {data.privacy ? 'ON' : 'OFF'}</span>
        <span className="flex items-center gap-1"><Zap size={12} /> Reactive: {data.reactive ? 'ENABLED' : 'DISABLED'}</span>
      </div>
    </div>
  )
}
