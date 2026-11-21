import type { Checkin } from '../types'

interface Props {
    checkins: Checkin[]
}

const levelColors = [
    'bg-gray-100',
    'bg-green-100',
    'bg-green-300',
    'bg-green-500',
    'bg-green-700',
]

function buildHeatmapData(checkins: Checkin[]) {
    const countByDate = new Map<string, number>()
    checkins.forEach((c) => {
        countByDate.set(c.date, (countByDate.get(c.date) || 0) + 1)
    })

    const today = new Date()
    const data: { date: string; level: number }[] = []
    for (let i = 363; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        data.push({ date: dateStr, level: Math.min(countByDate.get(dateStr) || 0, 4) })
    }
    return data
}

function Heatmap({ checkins }: Props) {
    const data = buildHeatmapData(checkins)

    return (
        <div className="overflow-x-auto">
            <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
                {data.map((day) => (
                    <div
                        key={day.date}
                        className={`h-3 w-3 rounded-[2px] ${levelColors[day.level]}`}
                        title={`${day.date}: ${day.level > 0 ? '已打卡' : '未打卡'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Heatmap
