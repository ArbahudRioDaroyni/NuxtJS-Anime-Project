import jwt from 'jsonwebtoken'
import { getPrismaClient } from '~/server/utils/prisma'
import { verifyPassword } from '~/server/utils/password'

const prisma = getPrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, message: 'Email not registered' })

  const valid = verifyPassword(password, user.password_hash)
  if (!valid) throw createError({ statusCode: 401, message: 'Incorrect password' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return { user: { id: user.id, email: user.email, name: user.name } }
})
