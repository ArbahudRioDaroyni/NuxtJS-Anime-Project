/**
 * Composable to read anime-database.json file
 * Usage: const animeDB = await useAnimeReadJSON()
 */
export async function useAnimeReadJSON() {
  try {
    // Fetch the JSON file from public/database folder or direct path
    const response = await $fetch('/api/anime-database', {
      method: 'GET',
    })
    
    return response
  } catch (error) {
    console.error('Error reading anime-database.json:', error)
    return null
  }
}
