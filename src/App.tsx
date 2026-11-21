import HabitCard from './components/HabitCard'
import Heatmap from './components/Heatmap'
import type { Checkin, Habit } from './types'

const habits: Habit[] = [
  { id: 1, name: '每天写代码', streak: 12 },
  { id: 2, name: '阅读 30 分钟', streak: 7 },
  { id: 3, name: '早起 7 点', streak: 3 },
]

const checkins: Checkin[] = Array.from({ length: 52 * 7 }, (_, i) => ({
  date: `day-${i}`,
  level: Math.floor(Math.random() * 5),
}))

function App() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-medium">DevHabit</h1>
          <p className="text-gray-500">每一次坚持，都值得被看见</p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">我的习惯</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium">过去一年的打卡记录</h2>
          <Heatmap data={checkins} />
        </section>
      </div>
    </div>
  )
}

export default App
