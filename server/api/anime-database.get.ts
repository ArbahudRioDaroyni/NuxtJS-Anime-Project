import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const part = query.part ? parseInt(query.part as string) : null

    // If specific part requested, return only that part
    if (part && part >= 1 && part <= 50) {
      const filePath = join(process.cwd(), 'database', `anime-database-${part}.json`)
      const fileContent = readFileSync(filePath, 'utf-8')
      const jsonData = JSON.parse(fileContent)

      return {
        success: true,
        data: jsonData.data || jsonData,
        length: Array.isArray(jsonData.data) ? jsonData.data.length : 0,
        metadata: jsonData.metadata || null
      }
    }

    // If no part specified, merge all 50 files
    const allData: unknown[] = []
    const totalParts = 50

    for (let i = 1; i <= totalParts; i++) {
      try {
        const filePath = join(process.cwd(), 'database', `anime-database-${i}.json`)
        const fileContent = readFileSync(filePath, 'utf-8')
        const jsonData = JSON.parse(fileContent)
        
        if (Array.isArray(jsonData.data)) {
          allData.push(...jsonData.data)
        }
      } catch {
        console.warn(`Warning: Could not read anime-database-${i}.json`)
      }
    }

    return {
      success: true,
      data: allData,
      length: allData.length,
      parts: totalParts
    }
  } catch (error) {
    console.error('Error reading anime-database files:', error)
    
    return {
      success: false,
      error: 'Failed to read anime-database files',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
