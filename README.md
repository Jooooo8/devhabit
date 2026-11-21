# DevHabit

一个全栈习惯养成应用。通过每日打卡、连续天数统计和 GitHub 风格年度热力图，把"坚持"这件事可视化。

## 功能

- 用户注册与登录（JWT 鉴权，bcrypt 密码加密）
- 习惯的创建与查询
- 每日打卡，数据库层面防止重复打卡
- 连续天数（streak）实时计算
- 年度热力图可视化，展示过去 364 天的打卡强度

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 |
| 后端 | Node.js + Express 5 + JWT + Zod |
| 数据库 | SQLite + Prisma 6 |
| 测试 | Vitest + Supertest |

## 本地运行

```bash
npm install
npx prisma db push       # 建库建表
npx prisma generate      # 生成 Prisma Client
```

准备 `.env` 文件：

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

启动（需要两个终端）：

```bash
npm run dev          # 前端 http://localhost:5173
npm run dev:server   # 后端 http://localhost:3001
```

## 测试

```bash
npm test
```

18 个测试用例，覆盖 streak 连续天数算法的边界情况（空记录、断签、重复日期、今天未打卡）和后端 API（注册登录、鉴权拦截、打卡冲突、关联查询）。测试使用独立的 `test.db`，不污染开发数据。

## API 设计

| 方法 | 路径 | 说明 | 鉴权 |
|---|---|---|---|
| POST | `/api/auth/register` | 注册 | 否 |
| POST | `/api/auth/login` | 登录，返回 JWT | 否 |
| GET | `/api/habits` | 获取习惯列表（含打卡记录） | 是 |
| POST | `/api/habits` | 创建习惯 | 是 |
| POST | `/api/habits/:id/checkin` | 今日打卡 | 是 |

## 数据模型

```
User 1 ──< Habit 1 ──< Checkin
```

`Checkin` 上对 `(habitId, date)` 建了联合唯一索引，从数据库层面保证同一天不能重复打卡。
