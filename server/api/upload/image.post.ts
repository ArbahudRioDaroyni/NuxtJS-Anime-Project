import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      })
    }

    const imageFile = formData.find(item => item.name === 'image')
    const imageType = formData.find(item => item.name === 'type')?.data.toString()
    
    if (!imageFile || !imageFile.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No image file found'
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!imageFile.type || !allowedTypes.includes(imageFile.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (imageFile.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size too large. Maximum size is 5MB.'
      })
    }

    // Generate unique filename
    const extension = imageFile.type.split('/')[1]
    const filename = `${imageType || 'image'}_${randomUUID()}.${extension}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'anime')
    await fs.mkdir(uploadDir, { recursive: true })
    
    // Save file
    const filepath = join(uploadDir, filename)
    await fs.writeFile(filepath, imageFile.data)
    
    // Return public URL
    const publicUrl = `/uploads/anime/${filename}`
    
    return {
      success: true,
      data: {
        url: publicUrl,
        filename,
        type: imageFile.type,
        size: imageFile.data.length
      }
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error'
    })
  }
})