// import type { H3Event } from 'h3'
// import type { ResponseType } from '~/types/database'
// import { getPrismaClient } from '~/server/utils/prisma'
// import { advancedFuzzyMatch, keyboardAwareFuzzyMatch, correctTypos } from '~/server/utils/advancedFuzzySearch'

// const prisma = getPrismaClient()

// // Keep the original interface
// interface AnimeWithScore {
//   id: number
//   slug: string
//   title_romaji: string
//   title_english?: string
//   title_native?: string
//   year: string
//   popularity: number
//   episodes?: number
//   medium_cover_image_url?: string
//   score: number
//   algorithm: string
//   confidence: number
// }

// // Helper function to safely convert Prisma result to our interface
// function convertToAnimeWithScore(
//   anime: any,
//   score: number,
//   algorithm: string,
//   confidence: number
// ): AnimeWithScore {
//   return {
//     id: anime.id,
//     slug: anime.slug,
//     title_romaji: anime.title_romaji || 'Unknown Title',
//     title_english: anime.title_english || undefined,
//     title_native: anime.title_native || undefined,
//     year: anime.year || '',
//     popularity: anime.popularity || 0,
//     episodes: anime.episodes || undefined,
//     medium_cover_image_url: anime.medium_cover_image_url || undefined,
//     score,
//     algorithm,
//     confidence
//   }
// }

// export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
//   try {
//     const query = getQuery(event)
//     const originalSearchTerm = (query.q as string || '').trim()
//     const limit = Math.min(Number(query.limit) || 10, 50)
//     const threshold = Number(query.threshold) || 0.5
//     const useAdvanced = query.advanced !== 'false'
    
//     if (!originalSearchTerm || originalSearchTerm.length < 2) {
//       return {
//         success: true,
//         code: 200,
//         message: 'Minimum 2 characters required for search',
//         length: 0,
//         data: [],
//         meta: { searchTerm: originalSearchTerm, minLength: 2 }
//       }
//     }

//     // STEP 1: Direct database search (untuk exact/partial matches)
//     const directMatches = await prisma.anime.findMany({
//       where: {
//         deleted_at: null,
//         OR: [
//           { title_romaji: { contains: originalSearchTerm, mode: 'insensitive' } },
//           { title_english: { contains: originalSearchTerm, mode: 'insensitive' } },
//           { title_native: { contains: originalSearchTerm, mode: 'insensitive' } }
//         ]
//       },
//       select: {
//         id: true,
//         slug: true,
//         title_romaji: true,
//         title_english: true,
//         title_native: true,
//         year: true,
//         popularity: true,
//         episodes: true,
//         medium_cover_image_url: true
//       },
//       take: limit * 2, // Ambil lebih banyak untuk filtering
//       orderBy: [
//         { popularity: 'desc' },
//         { title_romaji: 'asc' }
//       ]
//     })

//     // STEP 2: Jika direct match tidak cukup, lakukan fuzzy search
//     let allMatches = directMatches
//     if (directMatches.length < limit) {
//       const fuzzyMatches = await performFuzzySearch(originalSearchTerm, threshold, useAdvanced, limit - directMatches.length)
      
//       // Gabungkan hasil, hindari duplikasi
//       const directIds = new Set(directMatches.map(a => a.id))
//       const uniqueFuzzyMatches = fuzzyMatches.filter(a => !directIds.has(a.id))
//       allMatches = [...directMatches, ...uniqueFuzzyMatches]
//     }

//     // STEP 3: Apply scoring dan sorting
//     const scoredResults: AnimeWithScore[] = []
    
//     for (const anime of allMatches) {
//       const titles = [
//         anime.title_romaji,
//         anime.title_english,
//         anime.title_native
//       ].filter((title): title is string => Boolean(title))
      
//       if (titles.length === 0) continue
      
//       let bestMatch = { 
//         isMatch: false, 
//         score: 0, 
//         algorithm: 'none', 
//         confidence: 0 
//       }
      
//       for (const title of titles) {
//         // Exact match gets highest score
//         if (title.toLowerCase() === originalSearchTerm.toLowerCase()) {
//           bestMatch = {
//             isMatch: true,
//             score: 1.0,
//             algorithm: 'exact',
//             confidence: 1.0
//           }
//           break
//         }
        
//         // Contains match gets high score
//         if (title.toLowerCase().includes(originalSearchTerm.toLowerCase())) {
//           const containsScore = 0.9 * (originalSearchTerm.length / title.length)
//           if (containsScore > bestMatch.score) {
//             bestMatch = {
//               isMatch: true,
//               score: containsScore,
//               algorithm: 'contains',
//               confidence: containsScore
//             }
//           }
//         }
        
//         // Fuzzy matching for typos
//         if (useAdvanced) {
//           const correctedQuery = correctTypos(originalSearchTerm)
//           if (correctedQuery !== originalSearchTerm) {
//             const correctedMatch = advancedFuzzyMatch(correctedQuery, title, threshold)
//             if (correctedMatch.score > bestMatch.score) {
//               bestMatch = correctedMatch
//             }
//           }
          
//           const advancedMatch = advancedFuzzyMatch(originalSearchTerm, title, threshold)
//           if (advancedMatch.score > bestMatch.score) {
//             bestMatch = advancedMatch
//           }
          
//           const keyboardScore = keyboardAwareFuzzyMatch(originalSearchTerm, title)
//           if (keyboardScore > 0.6 && keyboardScore > bestMatch.score) {
//             bestMatch = {
//               isMatch: true,
//               score: keyboardScore,
//               algorithm: 'keyboard-aware',
//               confidence: keyboardScore
//             }
//           }
//         }
//       }
      
//       if (bestMatch.isMatch) {
//         scoredResults.push(
//           convertToAnimeWithScore(anime, bestMatch.score, bestMatch.algorithm, bestMatch.confidence)
//         )
//       }
//     }

//     // Sort by score, confidence, then popularity
//     const sortedResults = scoredResults
//       .sort((a, b) => {
//         // Exact matches first
//         if (a.algorithm === 'exact' && b.algorithm !== 'exact') return -1
//         if (b.algorithm === 'exact' && a.algorithm !== 'exact') return 1
        
//         // High confidence matches
//         if (a.confidence > 0.9 && b.confidence <= 0.9) return -1
//         if (b.confidence > 0.9 && a.confidence <= 0.9) return 1
        
//         // Score difference
//         const scoreDiff = b.score - a.score
//         if (Math.abs(scoreDiff) > 0.05) return scoreDiff
        
//         // Finally by popularity
//         return (b.popularity || 0) - (a.popularity || 0)
//       })
//       .slice(0, limit)

//     const finalResults = sortedResults.map(({ score, algorithm, confidence, ...anime }) => anime)
//     const suggestions = generateSearchSuggestions(originalSearchTerm, sortedResults)

//     return {
//       success: true,
//       code: 200,
//       message: `Found ${finalResults.length} anime matching "${originalSearchTerm}"`,
//       length: finalResults.length,
//       data: finalResults,
//       meta: {
//         originalQuery: originalSearchTerm,
//         threshold,
//         useAdvanced,
//         hasMore: scoredResults.length >= limit,
//         algorithms: [...new Set(sortedResults.map(r => r.algorithm))],
//         searchSuggestions: suggestions,
//         searchMethod: directMatches.length >= limit ? 'direct' : 'hybrid',
//         searchStrategies: {
//           firstChar: originalSearchTerm.charAt(0).toLowerCase(),
//           alphabeticalSearch: true,
//           ngramSearch: originalSearchTerm.length >= 3,
//           popularityFallback: true
//         },
//         searchStats: {
//           directMatches: directMatches.length,
//           fuzzyMatches: scoredResults.length - directMatches.length,
//           totalScanned: allMatches.length,
//           matched: scoredResults.length,
//           highConfidence: sortedResults.filter(r => r.confidence > 0.8).length
//         }
//       }
//     }
//   } catch (e: unknown) {
//     return {
//       success: false,
//       code: 500,
//       message: e instanceof Error ? e.message : 'Search failed',
//       length: 0,
//       data: []
//     }
//   }
// })

// // Helper function untuk fuzzy search dengan multiple strategies
// async function performFuzzySearch(
//   searchTerm: string, 
//   threshold: number, 
//   useAdvanced: boolean, 
//   limit: number
// ): Promise<any[]> {
  
//   const fuzzyMatches = []
  
//   // Strategy 1: Alphabetical search berdasarkan huruf awal
//   const alphabeticalMatches = await performAlphabeticalSearch(searchTerm, limit)
//   fuzzyMatches.push(...alphabeticalMatches)
  
//   // Strategy 2: Jika belum cukup, cari dengan n-gram similarity
//   if (fuzzyMatches.length < limit && searchTerm.length >= 3) {
//     const ngramMatches = await performNgramSearch(searchTerm, limit - fuzzyMatches.length)
    
//     // Avoid duplicates
//     const existingIds = new Set(fuzzyMatches.map(a => a.id))
//     const uniqueNgramMatches = ngramMatches.filter(a => !existingIds.has(a.id))
//     fuzzyMatches.push(...uniqueNgramMatches)
//   }
  
//   // Strategy 3: Fallback ke popularity search jika masih kurang
//   if (fuzzyMatches.length < limit) {
//     const popularityMatches = await performPopularitySearch(searchTerm, threshold, useAdvanced, limit - fuzzyMatches.length)
    
//     // Avoid duplicates
//     const existingIds = new Set(fuzzyMatches.map(a => a.id))
//     const uniquePopularityMatches = popularityMatches.filter(a => !existingIds.has(a.id))
//     fuzzyMatches.push(...uniquePopularityMatches)
//   }
  
//   return fuzzyMatches.slice(0, limit)
// }

// // Strategy 1: Alphabetical search
// async function performAlphabeticalSearch(searchTerm: string, limit: number): Promise<any[]> {
//   const firstChar = searchTerm.charAt(0).toLowerCase()
//   const isAlphabetic = /^[a-zA-Z]$/.test(firstChar)
  
//   if (!isAlphabetic) return []
  
//   console.log(`🔤 Alphabetical search for: "${firstChar}*"`)
  
//   const matches = await prisma.anime.findMany({
//     where: {
//       deleted_at: null,
//       OR: [
//         { title_romaji: { startsWith: firstChar, mode: 'insensitive' } },
//         { title_english: { startsWith: firstChar, mode: 'insensitive' } },
//         { title_native: { startsWith: firstChar, mode: 'insensitive' } }
//       ]
//     },
//     select: {
//       id: true,
//       slug: true,
//       title_romaji: true,
//       title_english: true,
//       title_native: true,
//       year: true,
//       popularity: true,
//       episodes: true,
//       medium_cover_image_url: true
//     },
//     take: limit * 3, // Ambil lebih banyak untuk filtering
//     orderBy: [
//       { popularity: 'desc' },
//       { title_romaji: 'asc' }
//     ]
//   })
  
//   // Filter yang benar-benar match dengan search term
//   const relevantMatches = matches.filter(anime => {
//     const titles = [anime.title_romaji, anime.title_english, anime.title_native]
//       .filter(Boolean)
//       .map(t => t!.toLowerCase())
    
//     return titles.some(title => 
//       title.includes(searchTerm.toLowerCase()) || 
//       advancedFuzzyMatch(searchTerm, title, 0.4).isMatch
//     )
//   })
  
//   console.log(`Found ${relevantMatches.length} relevant matches starting with "${firstChar}"`)
//   return relevantMatches.slice(0, limit)
// }

// // Strategy 2: N-gram based search
// async function performNgramSearch(searchTerm: string, limit: number): Promise<any[]> {
//   // Extract significant n-grams from search term (minimum 3 characters)
//   const ngrams = []
//   for (let i = 0; i <= searchTerm.length - 3; i++) {
//     ngrams.push(searchTerm.substring(i, i + 3))
//   }
  
//   if (ngrams.length === 0) return []
  
//   console.log(`🔍 N-gram search for: ${ngrams.join(', ')}`)
  
//   // Search for anime containing any of these n-grams
//   const orConditions = ngrams.flatMap(ngram => [
//     { title_romaji: { contains: ngram, mode: 'insensitive' } },
//     { title_english: { contains: ngram, mode: 'insensitive' } },
//     { title_native: { contains: ngram, mode: 'insensitive' } }
//   ])
  
//   const matches = await prisma.anime.findMany({
//     where: {
//       deleted_at: null,
//       OR: orConditions
//     },
//     select: {
//       id: true,
//       slug: true,
//       title_romaji: true,
//       title_english: true,
//       title_native: true,
//       year: true,
//       popularity: true,
//       episodes: true,
//       medium_cover_image_url: true
//     },
//     take: limit * 2,
//     orderBy: [
//       { popularity: 'desc' },
//       { title_romaji: 'asc' }
//     ]
//   })
  
//   console.log(`Found ${matches.length} n-gram matches`)
//   return matches.slice(0, limit)
// }

// // Strategy 3: Popularity fallback (original method)
// async function performPopularitySearch(
//   searchTerm: string, 
//   threshold: number, 
//   useAdvanced: boolean, 
//   limit: number
// ): Promise<any[]> {
//   console.log(`⭐ Fallback to popularity search`)
  
//   const potentialMatches = await prisma.anime.findMany({
//     where: {
//       deleted_at: null,
//       OR: [
//         { title_romaji: { not: null } },
//         { title_english: { not: null } },
//         { title_native: { not: null } }
//       ]
//     },
//     select: {
//       id: true,
//       slug: true,
//       title_romaji: true,
//       title_english: true,
//       title_native: true,
//       year: true,
//       popularity: true,
//       episodes: true,
//       medium_cover_image_url: true
//     },
//     take: useAdvanced ? 2000 : 500,
//     orderBy: { popularity: 'desc' }
//   })

//   const fuzzyMatches = []
  
//   for (const anime of potentialMatches) {
//     const titles = [
//       anime.title_romaji,
//       anime.title_english,
//       anime.title_native
//     ].filter(Boolean)
    
//     for (const title of titles) {
//       const fuzzyScore = advancedFuzzyMatch(searchTerm, title, threshold)
//       if (fuzzyScore.isMatch) {
//         fuzzyMatches.push(anime)
//         break
//       }
//     }
    
//     if (fuzzyMatches.length >= limit) break
//   }
  
//   return fuzzyMatches
// }

// function generateSearchSuggestions(query: string, results: AnimeWithScore[]): string[] {
//   const suggestions = new Set<string>()
  
//   // Add suggestions based on high-scoring matches
//   results
//     .filter(r => r.confidence > 0.7)
//     .slice(0, 3)
//     .forEach(result => {
//       if (result.title_romaji.toLowerCase() !== query.toLowerCase()) {
//         suggestions.add(result.title_romaji)
//       }
//       if (result.title_english && result.title_english.toLowerCase() !== query.toLowerCase()) {
//         suggestions.add(result.title_english)
//       }
//     })
  
//   return Array.from(suggestions).slice(0, 5)
// }
