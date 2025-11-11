import type { H3Event } from 'h3'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  // Require Super User role only
  await requireSuperUser(event)
  
  try {
    // Reset anime sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('anime', 'id'), COALESCE(MAX(id), 1)) FROM anime;
    `)
    
    // Get current sequence value
    const result = await prisma.$queryRawUnsafe<Array<{ currval: bigint }>>(`
      SELECT currval(pg_get_serial_sequence('anime', 'id')) as currval;
    `)
    
    return {
      success: true,
      message: 'Sequence reset successfully',
      currentValue: result[0]?.currval?.toString() || 'unknown'
    }
  } catch (e: unknown) {
    console.error('Error resetting sequence:', e)
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error'
    }
  }
})
