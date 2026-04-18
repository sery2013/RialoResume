import { Wallet } from 'lucide-react'

interface Props { onConnect: (addr: string) => void }

export default function ConnectWallet({ onConnect }: Props) {
  const connect = () => {
    const mock = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random()*16).toString(16)
    ).join('')
    onConnect(mock)
  }

  return (
    <button 
      onClick={connect} 
      className="btn btn-outline group relative overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        <Wallet size={16} className="group-hover:scale-110 transition-transform" />
        Connect Wallet
      </span>
      {/* Subtle hover gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] opacity-0 group-hover:opacity-10 transition-opacity" />
    </button>
  )
}
