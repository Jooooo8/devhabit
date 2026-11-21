import { describe, it, expect } from 'vitest'
import { calcStreak } from './streak'
import type { Checkin } from '../types'

function checkin(date: string): Checkin {
  return { id: date, habitId: 'h1', date, createdAt: date }
}

describe('calcStreak 连续天数计算', () => {
  it('空记录返回 0', () => {
    expect(calcStreak([])).toBe(0)
  })

  it('昨天下雨今天没打卡，返回 0', () => {
    const data = [checkin('2026-11-20')]
    expect(calcStreak(data, new Date('2026-11-21T12:00:00'))).toBe(0)
  })

  it('连续三天打卡返回 3', () => {
    const data = [
      checkin('2026-11-21'),
      checkin('2026-11-20'),
      checkin('2026-11-19'),
    ]
    expect(calcStreak(data, new Date('2026-11-21T12:00:00'))).toBe(3)
  })

  it('中间断一天就停，从今天往回算', () => {
    const data = [
      checkin('2026-11-21'),
      checkin('2026-11-20'),
      checkin('2026-11-18'),
      checkin('2026-11-17'),
    ]
    expect(calcStreak(data, new Date('2026-11-21T12:00:00'))).toBe(2)
  })

  it('今天没打卡但昨天打了，返回 0', () => {
    const data = [checkin('2026-11-20'), checkin('2026-11-19')]
    expect(calcStreak(data, new Date('2026-11-21T12:00:00'))).toBe(0)
  })

  it('重复日期不会重复计数', () => {
    const data = [
      checkin('2026-11-21'),
      checkin('2026-11-21'),
      checkin('2026-11-20'),
    ]
    expect(calcStreak(data, new Date('2026-11-21T12:00:00'))).toBe(2)
  })
})
