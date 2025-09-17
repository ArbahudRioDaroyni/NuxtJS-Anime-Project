import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (_event: H3Event): Promise<ResponseType> => {
  try {
    // Define the base URLs for each external site ID
    const externalSiteBaseUrls: Record<number, string | null> = {
      1: 'https://www.hulu.com/',
      2: 'https://www.crunchyroll.com/',
      3: 'https://www.amazon.com/',
      4: 'https://tubitv.com/',
      5: 'https://www.adultswim.com/',
      6: 'https://www.netflix.com/',
      7: null,
      8: 'https://play.hbomax.com/',
      9: 'https://www.retrocrush.tv/',
      10: 'https://www.youtube.com/',
      11: 'https://www.bilibili.tv/',
      12: 'https://www.iq.com/',
      13: 'https://www.bilibili.tv/',
      14: 'https://wetv.vip/',
      15: 'https://twitter.com/',
      16: 'https://www.hidive.com/',
      17: 'https://www.contv.com/',
      18: 'https://www.max.com/',
      19: 'https://www.crackle.com/',
      20: 'https://www.tiktok.com/',
      21: 'https://www.instagram.com/',
      22: 'https://www.criterionchannel.com/',
      23: 'https://www.disneyplus.com/',
      24: 'https://www.starplus.com/',
      25: 'https://www.asiancrush.com/',
      26: 'https://www.midnightpulp.com/',
      27: 'https://stream.cineverse.com/',
      28: 'https://animation.filmarchives.jp/',
      29: 'https://vimeo.com/',
      30: 'https://www.facebook.com/',
      31: 'https://www.nicovideo.jp/',
      32: 'https://weibo.com/',
      33: 'https://www.wakanim.tv/',
      34: null,
      35: 'https://v.qq.com/',
      36: 'https://www.iqiyi.com/',
      37: 'https://v.youku.com/',
      38: 'https://coolmic.me/'
    }

    // Find all external site relations that don't start with 'http'
    // Limit the number of records to process per request to avoid connection pool issues
    const externalSiteRelationsWithoutHttp = await prisma.anime_external_site_relations.findMany({
      where: {
        NOT: {
          url: {
            startsWith: 'http'
          }
        }
      },
      select: {
        id: true,
        anime_id: true,
        external_site_id: true,
        url: true,
        external_site: {
          select: {
            name: true
          }
        }
      },
      take: 500 // Limit to 50 records per request
    })

    if (externalSiteRelationsWithoutHttp.length === 0) {
      return {
        success: true,
        code: 200,
        message: 'No external site relations found without HTTP prefix.',
        length: 0,
        data: [],
      }
    }

    // Count total records that need processing (for information purposes)
    const totalRecordsToProcess = await prisma.anime_external_site_relations.count({
      where: {
        NOT: {
          url: {
            startsWith: 'http'
          }
        }
      }
    })

    // Process records in batches to avoid connection pool timeout
    const batchSize = 10
    const successfulUpdates = []
    
    for (let i = 0; i < externalSiteRelationsWithoutHttp.length; i += batchSize) {
      const batch = externalSiteRelationsWithoutHttp.slice(i, i + batchSize)
      
      // Process current batch
      const batchPromises = batch.map(async (relation) => {
        const baseUrl = externalSiteBaseUrls[relation.external_site_id]
        
        // Skip if base URL is null or undefined
        if (!baseUrl) {
          return null
        }

        // Create the new URL by combining base URL with existing URL
        const newUrl = baseUrl + relation.url

        try {
          // Update the record
          await prisma.anime_external_site_relations.update({
            where: { id: relation.id },
            data: { url: newUrl }
          })

          return {
            id: relation.id,
            anime_id: relation.anime_id,
            external_site_id: relation.external_site_id,
            external_site_name: relation.external_site.name,
            old_url: relation.url,
            new_url: newUrl
          }
        } catch (error) {
          console.error(`Failed to update record ${relation.id}:`, error)
          return null
        }
      })

      // Execute current batch
      const batchResults = await Promise.all(batchPromises)
      
      // Filter out null results and add to successful updates
      const successfulBatchUpdates = batchResults.filter(result => result !== null)
      successfulUpdates.push(...successfulBatchUpdates)
      
      // Add small delay between batches to prevent overwhelming the connection pool
      if (i + batchSize < externalSiteRelationsWithoutHttp.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return {
      success: true,
      code: 200,
      message: `Successfully updated ${successfulUpdates.length} external site relation URLs with HTTP prefixes. Total records remaining to process: ${totalRecordsToProcess - successfulUpdates.length}`,
      length: successfulUpdates.length,
      data: [],
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while updating external site relation URLs.',
      length: 0,
      data: [],
    }
  }
})
