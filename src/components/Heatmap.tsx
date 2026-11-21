import type { Checkin } from '../types'

interface Props {
    data: Checkin[]
}

const levelColors = [
    'bg-gray-100',
    'bg-green-100',
    'bg-green-300',
    'bg-green-500',
    'bg-green-700',
]

function Heatmap({ data }: Props) {
    return (
        <div className="overflow-x-auto">
            <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
                {data.map((day, index) => (
                    <div
                        key={index}
                        className={`h-3 w-3 rounded-[2px] ${levelColors[day.level]}`}
                        title={`${day.date}: 等级 ${day.level}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Heatmap
