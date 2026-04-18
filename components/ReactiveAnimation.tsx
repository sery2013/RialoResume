'use client'
import { useState, useEffect } from 'react'
import { Zap, Globe, Database, CheckCircle, Loader2 } from 'lucide-react'

interface Props {
  isActive: boolean
  onComplete: () => void
}

export default function ReactiveAnimation({ isActive, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    if (!isActive) {
      setStep(0)
      return
    }

    const hash = '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random()*16).toString(16)
    ).join('')
    setTxHash(hash)

    const steps = [0, 1, 2, 3, 4]
    let current = 0

    const interval = setInterval(() => {
      if (current < steps.length) {
        setStep(current + 1)
        current++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 800)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive) return null

  const steps = [
    { icon: Zap, title: 'Event Detected', desc: 'GitHub webhook triggered', color: 'text-yellow-400' },
    { icon: Globe, title: 'HTTP Request', desc: 'Smart contract fetches API', color: 'text-blue-400' },
    { icon: Database, title: 'Data Processing', desc: 'Validating & transforming', color: 'text-purple-400' },
    { icon: CheckCircle, title: 'On-Chain Write', desc: 'State transition committed', color: 'text-green-400' },
    { icon: CheckCircle, title: 'Confirmed', desc: 'Sub-second finality', color: 'text-emerald-400' }
  ]

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-white">Reactive Transaction</h3>
          <p className="text-[var(--text-muted)]">Smart contract auto-executing on external event</p>
        </div>

        <div className="space-y-3">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isCompleted = step > i + 1
            const isCurrent = step === i + 1
            const isPending = step <= i

            return (
              <div 
                key={i}
                className={`p-4 rounded-sm border transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-[var(--accent-glow)] to-transparent border-[var(--accent-primary)]' 
                    : isCurrent 
                    ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-[0_0_30px_rgba(169,221,211,0.3)] animate-pulse' 
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] opacity-40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all ${
                    isCompleted || isCurrent ? 'bg-[var(--accent-primary)]/20' : 'bg-gray-800'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className={`w-6 h-6 ${s.color}`} />
                    ) : isCurrent ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-primary)]" />
                    ) : (
                      <Icon className={`w-6 h-6 ${s.color}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`}>
                      {s.title}
                    </h4>
                    <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
                  </div>
                  {isCompleted && <div className="text-green-400 text-sm font-mono">✓ Done</div>}
                </div>
              </div>
            )
          })}
        </div>

        {txHash && step >= 3 && (
          <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">TX Hash:</span>
              <span className="text-[var(--accent-primary)]">{txHash.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Block:</span>
              <span>{(8000000 + Math.floor(Math.random() * 1000000)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Gas:</span>
              <span>{(21000 + Math.floor(Math.random() * 50000)).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
