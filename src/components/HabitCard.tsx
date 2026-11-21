import type { Habit } from '../types'
import { calcStreak } from '../lib/streak'

interface Props {
  habit: Habit
  onCheckin: () => void
}

function HabitCard({ habit, onCheckin }: Props) {
  const streak = calcStreak(habit.checkins)

  return (
        <article className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
            <div>
                <h3 className="mb-2 text-base font-medium">{habit.name}</h3>
                <p className="text-sm text-gray-500">
                    连续 <strong className="text-lg text-green-600">{streak}</strong> 天
                </p>
            </div>
            <button
                onClick={onCheckin}
                className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:opacity-85"
            >
                打卡
            </button>
        </article>
    )
}

export default HabitCard
