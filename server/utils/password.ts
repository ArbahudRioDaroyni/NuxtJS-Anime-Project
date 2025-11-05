import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Hash a password using scrypt algorithm with random salt
 * @param password - Plain text password
 * @returns Hashed password in format "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored hash
 * Uses timing-safe comparison to prevent timing attacks
 * @param password - Plain text password to verify
 * @param storedHash - Stored hash in format "salt:hash"
 * @returns true if password matches, false otherwise
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  
  const hashBuffer = Buffer.from(hash, 'hex')
  const verifyBuffer = scryptSync(password, salt, 64)
  
  // Use timingSafeEqual to prevent timing attacks
  return timingSafeEqual(hashBuffer, verifyBuffer)
}
