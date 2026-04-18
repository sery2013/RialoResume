export default function Header() {
  return (
    <header className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
      <div className="w-8 h-8 bg-purple-500 rounded-sm flex items-center justify-center font-bold text-white text-xs">LF</div>
      <h1 className="text-xl font-semibold tracking-tight">LiveFolio</h1>
      <span className="ml-auto text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-sm border border-gray-700">Shark Tank MVP</span>
    </header>
  )
}
