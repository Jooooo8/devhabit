import type { Checkin, Habit } from '../types'

const API_BASE = 'http://localhost:3001/api'
const TOKEN_KEY = 'devhabit_token'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken()
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.error || '请求失败')
    }
    return data
}

export const api = {
    register: (email: string, password: string) =>
        request<{ id: string; email: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    login: (email: string, password: string) =>
        request<{ token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    getHabits: () => request<Habit[]>('/habits'),
    createHabit: (name: string) =>
        request<Habit>('/habits', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),
    checkin: (habitId: string) =>
        request<Checkin>(`/habits/${habitId}/checkin`, { method: 'POST' }),
}
