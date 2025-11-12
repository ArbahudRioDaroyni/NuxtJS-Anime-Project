import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'
import { hashPassword, verifyPassword } from '~/server/utils/password'
import * as z from 'zod'

const prisma = getPrismaClient()

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
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
        password_hash: true
      }
    })

    if (!existingUser) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    // Parse and validate request body
    const body = await readBody(event)
    const validationResult = changePasswordSchema.safeParse(body)

    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: validationResult.error.issues
      })
    }

    const { currentPassword, newPassword } = validationResult.data

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      throw createError({
        statusCode: 400,
        message: 'New password must be different from current password'
      })
    }

    // Verify current password
    const isValidPassword = verifyPassword(currentPassword, existingUser.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Current password is incorrect'
      })
    }

    // Hash new password
    const newPasswordHash = hashPassword(newPassword)

    // Update user password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password_hash: newPasswordHash
      }
    })

    // Optional: Invalidate all existing sessions except current
    // This forces re-login on other devices for security
    await prisma.user_session.deleteMany({
      where: {
        user_id: decoded.userId,
        token: { not: token }
      }
    })

    return {
      success: true,
      message: 'Password updated successfully. Other sessions have been logged out for security.'
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    throw error
  }
})
