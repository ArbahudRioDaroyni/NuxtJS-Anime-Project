const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]!
    const nextChar = line[i + 1]
    
    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Push last field
  result.push(current.trim())
  
  return result
}

export const useParseCSV = async (raw: string) => {
  if (!raw) return
  
  try {
    const text = raw
    
    // Single pass split, no double filtering
    const lines = text.split('\n')
    const nonEmptyLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? ''
      const trimmed = line.trim()
      if (trimmed) nonEmptyLines.push(trimmed)
    }
    
    if (nonEmptyLines.length === 0) {
      alert('CSV file is empty')
      return
    }
    
    // Parse headers once with proper CSV parsing
    const headerLine = nonEmptyLines[0]!
    const headers = parseCSVLine(headerLine)
    const headerCount = headers.length
    
    // Pre-allocate array with exact size
    const rowCount = nonEmptyLines.length - 1
    const data: Record<string, string>[] = new Array(rowCount)
    
    // Single loop with optimized object creation
    for (let i = 0; i < rowCount; i++) {
      const line = nonEmptyLines[i + 1]!
      const values = parseCSVLine(line)
      const row: Record<string, string> = {}
      
      // Direct loop instead of forEach (faster)
      for (let j = 0; j < headerCount; j++) {
        row[headers[j]!] = values[j] || ''
      }
      
      data[i] = row
    }
    
    return data
  } catch (error) {
    console.error('Error parsing CSV:', error)
    alert('Error parsing CSV file')
  }
}

export const useNewText2Slug = (title: string, type: string, year: string): string => {
  if (!title) {
    console.log('Title is required')
    return ''
  }

  const validType = type || 'unknown'
  const validYear = year || 'unknown'

  const raw = `${title}-${validType}-${validYear}`
  return raw
    .toString()
    .toLowerCase() // Convert to lowercase
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^a-z0-9!.]+/g, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Trim hyphens from start and end
}