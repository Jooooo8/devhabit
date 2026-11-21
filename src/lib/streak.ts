import type { Checkin } from '../types'

export function calcStreak(checkins: Checkin[], today = new Date()): number {
  const dates = new Set(checkins.map((c) => c.date))
  let streak = 0
  const d = new Date(today)

  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }

  return streak
}
