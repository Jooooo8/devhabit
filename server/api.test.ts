import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

process.env.DATABASE_URL = 'file:./test.db'
process.env.JWT_SECRET = 'test-secret'

const { prisma } = await import('./db')
const { default: app } = await import('./app')

let token = ''
let habitId = ''

beforeAll(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('Auth API', () => {
  it('GET /api/health 返回 ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('注册成功返回 201 和用户信息，不含密码', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '123456' })
    expect(res.status).toBe(201)
    expect(res.body.email).toBe('test@example.com')
    expect(res.body).not.toHaveProperty('password')
    expect(res.body).not.toHaveProperty('passwordHash')
  })

  it('重复邮箱注册返回 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '123456' })
    expect(res.status).toBe(409)
  })

  it('密码少于 6 位返回 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'short@example.com', password: '123' })
    expect(res.status).toBe(400)
  })

  it('错误密码登录返回 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' })
    expect(res.status).toBe(401)
  })

  it('正确密码登录返回 JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '123456' })
    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    token = res.body.token
  })
})

describe('Habits API（需鉴权）', () => {
  it('不带 token 访问返回 401', async () => {
    const res = await request(app).get('/api/habits')
    expect(res.status).toBe(401)
  })

  it('创建习惯返回 201', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '每天写代码' })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('每天写代码')
    habitId = res.body.id
  })

  it('查询列表只包含当前用户的数据', async () => {
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe('每天写代码')
  })

  it('打卡返回 201 并记录当天日期', async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/checkin`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(201)
    expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('同一天重复打卡返回 409', async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/checkin`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(409)
  })

  it('查询列表带出 checkins 关联数据', async () => {
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body[0].checkins).toHaveLength(1)
  })
})
