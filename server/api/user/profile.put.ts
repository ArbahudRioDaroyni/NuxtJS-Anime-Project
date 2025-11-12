import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'
import * as z from 'zod'

const prisma = getPrismaClient()

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name is too short').optional(),
  email: z.string().email('Invalid email').optional(),
  // Accept either a full URL or a relative uploads path (e.g. /uploads/avatars/xxx.png)
  avatar: z
    .union([
      z.string().url('Invalid avatar URL'),
      z.string().regex(/^\/uploads\/avatars\/.+/, 'Invalid avatar path')
    ])
    .optional()
    .nullable()
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
      where: { id: decoded.userId }
    })

    if (!existingUser) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    // Parse and validate request body
    const body = await readBody(event)
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: validationResult.error.issues
      })
    }

    const { name, email, avatar } = validationResult.data

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        throw createError({
          statusCode: 409,
          message: 'Email is already taken'
        })
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        updated_at: true
      }
    })

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    throw error
  }
})
