import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'
import { verifyPassword } from '~/server/utils/password'
import * as z from 'zod'

const prisma = getPrismaClient()

const deleteAccountSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Verify user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        password_hash: true
      }
    })

    if (!existingUser) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    // Parse and validate request body
    const body = await readBody(event)
    const validationResult = deleteAccountSchema.safeParse(body)

    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: validationResult.error.issues
      })
    }

    const { password } = validationResult.data

    // Verify password before deletion
    const isValidPassword = verifyPassword(password, existingUser.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Password is incorrect'
      })
    }

    // Delete all user sessions first
    await prisma.user_session.deleteMany({
      where: { user_id: decoded.userId }
    })

    // Delete user account (hard delete)
    await prisma.user.delete({
      where: { id: decoded.userId }
    })

    // Clear auth cookie
    deleteCookie(event, 'auth_token')

    return {
      success: true,
      message: 'Account deleted successfully'
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    throw error
  }
})
