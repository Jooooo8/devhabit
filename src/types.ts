export interface Checkin {
    id: string
    habitId: string
    date: string
    createdAt: string
}

export interface Habit {
    id: string
    name: string
    userId: string
    createdAt: string
    checkins: Checkin[]
}
