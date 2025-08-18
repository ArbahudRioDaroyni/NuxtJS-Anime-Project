import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  const characterId = getRouterParam(event, 'id')
  
  if (!characterId || isNaN(Number(characterId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid character ID'
    })
  }

  try {
    const character = await prisma.characters.findUnique({
      where: {
        id: parseInt(characterId)
      },
      include: {
        // Include related data
        anime_characters_voice_actor_relations: {
          include: {
            anime: {
              select: {
                id: true,
                title_romaji: true,
                medium_cover_image_url: true,
                start_date: true
              }
            },
            character_role: {
              select: {
                name: true
              }
            },
            voice_actor: {
              select: {
                id: true,
                name: true,
                medium_image_url: true,
                home_town: true
              }
            }
          }
        }
      }
    })

    if (!character) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Character not found'
      })
    }

    // Transform the data for the frontend
    const transformedCharacter = {
      id: character.id,
      name: character.name,
      name_kanji: null, // This field doesn't exist in the schema
      name_native: character.name_native,
      image: character.large_image_url || character.medium_image_url,
      description: character.description,
      age: character.age,
      gender: character.gender,
      birth_date: character.date_of_birth,
      anime_appearances: character.anime_characters_voice_actor_relations.map((relation: any) => ({
        anime: {
          id: relation.anime.id,
          title: relation.anime.title_romaji,
          image: relation.anime.medium_cover_image_url,
          year: relation.anime.start_date ? new Date(relation.anime.start_date).getFullYear() : null
        },
        role: relation.character_role?.name || 'Unknown'
      })),
      voice_actors: character.anime_characters_voice_actor_relations
        .filter((relation: any) => relation.voice_actor)
        .map((relation: any) => ({
          id: relation.voice_actor!.id,
          name: relation.voice_actor!.name,
          image: relation.voice_actor!.medium_image_url,
          language: 'Japanese', // Default - you might want to add this to your schema
          hometown: relation.voice_actor!.home_town
        }))
    }

    return transformedCharacter
  } catch (error) {
    console.error('Error fetching character:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
