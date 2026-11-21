import type { Habit } from '../types'

interface Props {
    habit: Habit
    onCheckin: () => void
}

function HabitCard({ habit, onCheckin }: Props) {
    function calcStreak() {
        const dates = new Set(habit.checkins.map((c) => c.date))
        let streak = 0
        const d = new Date()
        while (dates.has(d.toISOString().slice(0, 10))) {
            streak++
            d.setDate(d.getDate() - 1)
        }
        return streak
    }

    return (
        <article className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
            <div>
                <h3 className="mb-2 text-base font-medium">{habit.name}</h3>
                <p className="text-sm text-gray-500">
                    连续 <strong className="text-lg text-green-600">{calcStreak()}</strong> 天
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
