import { useEffect, useState, type FormEvent } from 'react'
import HabitCard from './components/HabitCard'
import Heatmap from './components/Heatmap'
import AuthForm from './components/AuthForm'
import { api, clearToken, getToken } from './lib/api'
import type { Checkin, Habit } from './types'

function App() {
  const [token, setToken] = useState(getToken())
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newHabit, setNewHabit] = useState('')

  async function loadHabits() {
    setLoading(true)
    setError('')
    try {
      setHabits(await api.getHabits())
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
      if (err instanceof Error && err.message.includes('令牌')) handleLogout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadHabits()
  }, [token])

  function handleLoginSuccess() {
    setToken(getToken())
  }

  function handleLogout() {
    clearToken()
    setToken(null)
    setHabits([])
  }

  async function handleCreateHabit(e: FormEvent) {
    e.preventDefault()
    if (!newHabit.trim()) return
    try {
      await api.createHabit(newHabit.trim())
      setNewHabit('')
      loadHabits()
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
    }
  }

  async function handleCheckin(id: string) {
    try {
      await api.checkin(id)
      loadHabits()
    } catch (err) {
      setError(err instanceof Error ? err.message : '打卡失败')
    }
  }

  if (!token) return <AuthForm onSuccess={handleLoginSuccess} />

  const allCheckins: Checkin[] = habits.flatMap((h) => h.checkins)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium">DevHabit</h1>
            <p className="mt-2 text-gray-500">每一次坚持，都值得被看见</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            退出登录
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">我的习惯</h2>
          <form onSubmit={handleCreateHabit} className="mb-4 flex gap-2">
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="新习惯名称，回车添加"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              添加
            </button>
          </form>
          {loading ? (
            <p className="text-gray-500">加载中…</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckin={() => handleCheckin(habit.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium">过去一年的打卡记录</h2>
          <Heatmap checkins={allCheckins} />
        </section>
      </div>
    </div>
  )
}

export default App
