import { getPrismaClient } from '~/server/utils/prisma'
import { hashPassword } from '~/server/utils/password'

const prisma = getPrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name } = body

  // Validation
  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Email has been registered' })
  }

  const password_hash = hashPassword(password)
  const user = await prisma.user.create({
    data: { email, password_hash, name }
  })

  return { user: { id: user.id, email: user.email, name: user.name } }
})
