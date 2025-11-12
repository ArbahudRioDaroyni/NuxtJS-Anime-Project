import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    })

    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return {
      success: true,
      data: user
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    throw error
  }
})
