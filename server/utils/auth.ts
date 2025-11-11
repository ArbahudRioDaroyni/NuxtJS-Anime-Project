import type { H3Event } from 'h3'
import { getPrismaClient } from './prisma'
import type { UserRole } from '~/types/auth'
import { hasRole, parseUserRole } from '~/types/auth'

const prisma = getPrismaClient()

/**
 * Get current user from auth token cookie
 * @param event - H3 event
 * @returns User object or null
 */
export async function getCurrentUser(event: H3Event) {
  const token = getCookie(event, 'auth_token')
  if (!token) return null

  try {
    const jwt = await import('jsonwebtoken')
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
    
    if (!user) return null
    
    return {
      ...user,
      role: parseUserRole(user.role)
    }
  } catch {
    return null
  }
}

/**
 * Require authentication - throws error if not authenticated
 * @param event - H3 event
 * @returns User object
 */
export async function requireAuth(event: H3Event) {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }
  return user
}

/**
 * Require specific role - throws error if insufficient permissions
 * @param event - H3 event
 * @param requiredRole - Minimum required role
 * @returns User object
 */
export async function requireRole(event: H3Event, requiredRole: UserRole) {
  const user = await requireAuth(event)
  
  if (!hasRole(user.role, requiredRole)) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    })
  }
  
  return user
}

/**
 * Require admin role - throws error if not admin or super user
 * @param event - H3 event
 * @returns User object
 */
export async function requireAdmin(event: H3Event) {
  return requireRole(event, 'ADMIN')
}

/**
 * Require super user role - throws error if not super user
 * @param event - H3 event
 * @returns User object
 */
export async function requireSuperUser(event: H3Event) {
  return requireRole(event, 'SUPER_USER')
}
