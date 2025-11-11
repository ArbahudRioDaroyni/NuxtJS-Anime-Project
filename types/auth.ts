// User Role Types
export type UserRole = 'SUPER_USER' | 'ADMIN' | 'MEMBER' | 'USER'

// Role hierarchy - lower number = higher access
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_USER: 1,
  ADMIN: 2,
  MEMBER: 3,
  USER: 4
}

// Role labels for display
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_USER: 'Super User',
  ADMIN: 'Admin',
  MEMBER: 'Member',
  USER: 'User'
}

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPER_USER: 'Full access + user management',
  ADMIN: 'Dashboard access + CRUD operations',
  MEMBER: 'Enhanced features + content interaction',
  USER: 'Basic read access'
}

// User interface
export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: UserRole
  created_at?: Date
  updated_at?: Date
}

/**
 * Check if user has required role or higher
 * @param userRole - Current user's role
 * @param requiredRole - Required role to access resource
 * @returns true if user has sufficient permissions
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[requiredRole]
}

/**
 * Check if user has admin role or higher
 * @param userRole - Current user's role
 * @returns true if user is admin or super user
 */
export function isAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, 'ADMIN')
}

/**
 * Check if user has super user role
 * @param userRole - Current user's role
 * @returns true if user is super user
 */
export function isSuperUser(userRole: UserRole): boolean {
  return userRole === 'SUPER_USER'
}

/**
 * Check if user can access dashboard
 * @param userRole - Current user's role
 * @returns true if user is admin or higher
 */
export function canAccessDashboard(userRole: UserRole): boolean {
  return isAdmin(userRole)
}

/**
 * Get user role from string (with validation)
 * @param role - Role string from database
 * @returns Valid UserRole or 'USER' as default
 */
export function parseUserRole(role: string): UserRole {
  const validRoles: UserRole[] = ['SUPER_USER', 'ADMIN', 'MEMBER', 'USER']
  return validRoles.includes(role as UserRole) ? (role as UserRole) : 'USER'
}
