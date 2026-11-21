import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db'
import { authMiddleware } from '../middleware/auth'

export const habitsRouter = Router()
habitsRouter.use(authMiddleware)

const habitSchema = z.object({ name: z.string().min(1).max(50) })

const today = () => new Date().toISOString().slice(0, 10)

habitsRouter.get('/', async (req, res) => {
  const habits = await prisma.habit.findMany({
    where: { userId: req.userId },
    include: { checkins: true },
    orderBy: { createdAt: 'asc' },
  })
  res.json(habits)
})

habitsRouter.post('/', async (req, res) => {
  const parsed = habitSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: '习惯名称不能为空' })
    return
  }
  const habit = await prisma.habit.create({
    data: { name: parsed.data.name, userId: req.userId! },
  })
  res.status(201).json(habit)
})

habitsRouter.post('/:id/checkin', async (req, res) => {
  const habit = await prisma.habit.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!habit) {
    res.status(404).json({ error: '习惯不存在' })
    return
  }

  try {
    const checkin = await prisma.checkin.create({
      data: { habitId: habit.id, date: today() },
    })
    res.status(201).json(checkin)
  } catch {
    res.status(409).json({ error: '今天已经打过卡了' })
  }
})
