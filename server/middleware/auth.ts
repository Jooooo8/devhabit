import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供认证令牌' })
    return
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as {
      userId: string
    }
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: '令牌无效或已过期' })
  }
}
