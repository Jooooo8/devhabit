import { useState, type FormEvent } from 'react'
import { api, setToken } from '../lib/api'

interface Props {
    onSuccess: () => void
}

function AuthForm({ onSuccess }: Props) {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (isRegister) await api.register(email, password)
            const { token } = await api.login(email, password)
            setToken(token)
            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : '操作失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8"
            >
                <h1 className="mb-1 text-center text-2xl font-medium">DevHabit</h1>
                <h2 className="mb-6 text-center text-gray-500">
                    {isRegister ? '创建账号' : '登录'}
                </h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="邮箱"
                    required
                    className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密码（至少 6 位）"
                    required
                    minLength={6}
                    className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                />
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? '处理中…' : isRegister ? '注册并登录' : '登录'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-green-600"
                >
                    {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
                </button>
            </form>
        </div>
    )
}

export default AuthForm
