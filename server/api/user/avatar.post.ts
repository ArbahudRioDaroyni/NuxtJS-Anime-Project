import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'
import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const prisma = getPrismaClient()

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

    // Read form data
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      })
    }

    const avatarFile = formData.find(item => item.name === 'avatar')
    
    if (!avatarFile || !avatarFile.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No avatar file found'
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!avatarFile.type || !allowedTypes.includes(avatarFile.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      })
    }

    // Validate file size (max 2MB for avatars)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (avatarFile.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size too large. Maximum size is 2MB.'
      })
    }

    // Generate unique filename
    const extension = avatarFile.type.split('/')[1]
    const filename = `avatar_${decoded.userId}_${randomUUID()}.${extension}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    await fs.mkdir(uploadDir, { recursive: true })
    
    // Delete old avatar file if exists
    if (existingUser.avatar && existingUser.avatar.startsWith('/uploads/avatars/')) {
      const oldFilePath = join(process.cwd(), 'public', existingUser.avatar)
      try {
        await fs.unlink(oldFilePath)
      } catch (error) {
        // Ignore error if file doesn't exist
        console.log('Could not delete old avatar:', error)
      }
    }
    
    // Save new file
    const filepath = join(uploadDir, filename)
    await fs.writeFile(filepath, avatarFile.data)
    
    // Return public URL
    const publicUrl = `/uploads/avatars/${filename}`
    
    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { avatar: publicUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true
      }
    })
    
    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: publicUrl,
        filename,
        type: avatarFile.type,
        size: avatarFile.data.length,
        user: updatedUser
      }
    }
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    
    console.error('Avatar upload error:', error)
    throw error
  }
})
