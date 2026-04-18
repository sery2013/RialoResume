interface Props { onConnect: (addr: string) => void }

export default function ConnectWallet({ onConnect }: Props) {
  const connect = () => {
    // Mock wallet generation
    const mock = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
    onConnect(mock)
  }

  return (
    <button onClick={connect} className="btn btn-outline">
      Connect Wallet
    </button>
  )
}
