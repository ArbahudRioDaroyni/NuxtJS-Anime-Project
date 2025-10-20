/**
 * Script to split anime-database.json into 4 smaller files
 * Run: node scripts/split-anime-database.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

try {
  console.log('📖 Reading anime-database.json...')
  
  // Read the original file
  const filePath = join(process.cwd(), 'database', 'anime-database.json')
  const fileContent = readFileSync(filePath, 'utf-8')
  const jsonData = JSON.parse(fileContent)
  
  // Get the data array
  const data = jsonData.data || []
  const totalItems = data.length
  
  console.log(`✅ Total items found: ${totalItems}`)
  
  // Calculate items per file
  const filesCount = 50
  const itemsPerFile = Math.ceil(totalItems / filesCount)
  
  console.log(`📊 Items per file: ${itemsPerFile}`)
  console.log('---')
  
  // Split and write files
  for (let i = 0; i < filesCount; i++) {
    const startIndex = i * itemsPerFile
    const endIndex = Math.min(startIndex + itemsPerFile, totalItems)
    const chunk = data.slice(startIndex, endIndex)
    
    const fileName = `anime-database-${i + 1}.json`
    const outputPath = join(process.cwd(), 'database', fileName)
    
    const outputData = {
      ...jsonData,
      data: chunk,
      metadata: {
        ...(jsonData.metadata || {}),
        partNumber: i + 1,
        totalParts: filesCount,
        itemsInPart: chunk.length,
        startIndex,
        endIndex: endIndex - 1
      }
    }
    
    writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8')
    
    console.log(`✅ Created ${fileName}`)
    console.log(`   Items: ${chunk.length} (index ${startIndex} to ${endIndex - 1})`)
  }
  
  console.log('---')
  console.log('🎉 Split completed successfully!')
  console.log(`📁 Files created in: database/`)
  
} catch (error) {
  console.error('❌ Error splitting file:', error.message)
  process.exit(1)
}
