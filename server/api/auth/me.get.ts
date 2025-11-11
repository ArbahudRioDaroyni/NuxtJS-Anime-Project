import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, message: 'Not logged in' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true
      }
    })
    if (!user) throw createError({ statusCode: 401, message: 'User not found' })
    return { user }
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})
