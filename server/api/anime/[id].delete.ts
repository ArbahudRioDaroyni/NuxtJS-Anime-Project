import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  // Require Admin role or higher
  await requireAdmin(event)
  
  try {
    const id = getRouterParam(event, 'id')
    const safeId = Number(id)
    const query = getQuery(event)
    const force = query.force === 'true'

    if (!safeId || isNaN(Number(safeId)) || Number(safeId) <= 0) {
      // event.node.res.statusCode = 400
      return {
        success: false,
        code: 400,
        message: `Invalid ID: ${id}. It must be a positive number.`,
        length: 0,
        data: []
      }
    }

    // Check if anime exists
    const existingAnime = await prisma.anime.findUnique({
      where: { id: safeId }
    })

    if (!existingAnime) {
      // event.node.res.statusCode = 404
      return {
        success: false,
        code: 404,
        message: `Anime with ID ${safeId} not found.`,
        length: 0,
        data: []
      }
    }

    if (force) {
      // Hard delete - permanently remove from database
      // Delete all related records first to avoid foreign key constraint violations
      await prisma.$transaction(async (tx) => {
        // Delete related records in order
        await tx.anime_genre_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_external_site_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_tag_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_studio_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_characters_voice_actor_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_staff_relations.deleteMany({ where: { anime_id: safeId } })
        await tx.anime_relation_relations.deleteMany({ where: { anime_id: safeId } })
        
        // Finally, delete the anime itself
        await tx.anime.delete({ where: { id: safeId } })
      })

      return {
        success: true,
        code: 200,
        message: 'Anime and all related data permanently deleted',
        length: 0,
        data: []
      }
    } else {
      // Soft delete - mark as deleted
      const deletedAnime = await prisma.anime.update({
        where: { id: safeId },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      })

      return {
        success: true,
        code: 200,
        message: 'Anime deleted successfully',
        length: 1,
        data: [deletedAnime]
      }
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while deleting anime.',
      length: 0,
      data: []
    }
  }
})
