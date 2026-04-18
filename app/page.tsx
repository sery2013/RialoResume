import Header from '@/components/Header'
import GitHubResume from '@/components/GitHubResume'
import RialoEcosystemTracker from '@/components/RialoEcosystemTracker'

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#010101] text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Общий Хедер (теперь он один на всю страницу) */}
        <Header />
        
        {/* 2. Связующий заголовок (поясняет концепцию 2-в-1) */}
        <div className="text-center mb-8 mt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Your Identity <span className="text-[var(--accent-primary)]">×</span> Rialo Ecosystem
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm">
            Real-time GitHub analytics on the left. Live Rialo repository & contributor tracking on the right.
          </p>
        </div>

        {/* 3. Сетка 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА: Твой проект (логика не изменена) */}
          <GitHubResume />
          
          {/* ПРАВАЯ КОЛОНКА: Трекер репозиториев (реальные данные) */}
          <RialoEcosystemTracker />
          
        </div>
      </div>
    </main>
  )
}
