import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  try {
    // Read the anime-database.json file
    const filePath = join(process.cwd(), 'database', 'anime-database.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    return {
      success: true,
      data: jsonData,
      length: Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length
    }
  } catch (error) {
    console.error('Error reading anime-database.json:', error)
    
    return {
      success: false,
      error: 'Failed to read anime-database.json',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
