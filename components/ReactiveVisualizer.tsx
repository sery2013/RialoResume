'use client'
import { useState, useEffect } from 'react'
import { Zap, Globe, Database, CheckCircle2, Loader2 } from 'lucide-react'

interface Props {
  isActive: boolean
  onComplete: () => void
}

export default function ReactiveVisualizer({ isActive, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [txData, setTxData] = useState<any>(null)

  useEffect(() => {
    if (!isActive) {
      setStep(0)
      setTxData(null)
      return
    }

    const steps = [
      { delay: 0, name: 'Event Detected' },
      { delay: 800, name: 'HTTP Request to GitHub' },
      { delay: 2000, name: 'Data Fetched' },
      { delay: 2600, name: 'Writing to Blockchain' },
      { delay: 3200, name: 'Transaction Confirmed' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStep(currentStep + 1)
        currentStep++
      } else {
        clearInterval(interval)
        setTxData({
          hash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          block: Math.floor(Math.random() * 1000000) + 8000000,
          gas: Math.floor(Math.random() * 50000) + 21000
        })
        setTimeout(onComplete, 500)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive) return null

  const steps = [
    { icon: Zap, label: 'GitHub Event', desc: 'New commit detected' },
    { icon: Globe, label: 'Native HTTP', desc: 'Smart contract fetches API' },
    { icon: Database, label: 'On-Chain Update', desc: 'State transition committed' },
    { icon: CheckCircle2, label: 'Confirmed', desc: 'Sub-second finality' }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Reactive Transaction Executing</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Smart contract automatically responding to external event
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isCompleted = step > i + 1
            const isCurrent = step === i + 1
            const isPending = step <= i

            return (
              <div 
                key={i}
                className={`flex items-center gap-4 p-3 rounded-sm border transition-all ${
                  isCompleted 
                    ? 'bg-[var(--accent-glow)] border-[var(--border-accent)]' 
                    : isCurrent 
                    ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] animate-pulse' 
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] opacity-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                  isCompleted ? 'bg-[var(--accent-primary)]' : 
                  isCurrent ? 'bg-[var(--accent-primary)]/20' : 'bg-gray-800'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-black" />
                  ) : isCurrent ? (
                    <Loader2 size={20} className="animate-spin text-[var(--accent-primary)]" />
                  ) : (
                    <Icon size={20} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted || isCurrent ? 'text-[var(--text-primary)]' : 'text-gray-500'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transaction Data */}
        {txData && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">TX Hash:</span>
              <span className="text-[var(--accent-primary)]">{txData.hash.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Block:</span>
              <span>{txData.block.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Gas Used:</span>
              <span>{txData.gas.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
