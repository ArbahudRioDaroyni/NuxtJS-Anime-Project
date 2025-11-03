/**
 * A simple CSV parser that handles quoted fields and commas within quotes.
 * This implementation avoids using external libraries for better performance.
 */
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

/**
 * Parses a raw CSV string into an array of objects.
 * Each object represents a row with key-value pairs based on the header row.
 * This implementation is optimized for performance and memory usage.
 */
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

/**
 * Converts a given title, type, and year into a URL-friendly slug.
 * Handles special characters and ensures the slug is lowercase and hyphenated.
 */
export const useText2Slug = (title: string, type: string, year: string): string => {
  if (!title) {
    console.log('Title is required')
    return ''
  }

  const validType = type || ''
  const validYear = year || ''

  // const raw = `${title}-${validType}-${validYear}`
  // const raw = `${title}`
  let rawSlug = title;

  if (validType && rawSlug.includes(validType)) {
    rawSlug = rawSlug.replace(validType, '').trim()
  }
  
  if (validYear && rawSlug.includes(validYear.toLowerCase())) {
    rawSlug = rawSlug.replace(validYear, '').trim()
  }

  rawSlug = `${rawSlug}-${validType}-${validYear}`.trim()

  rawSlug = rawSlug
    .toString()
    .toLowerCase() // Convert to lowercase
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/[^a-z0-9!.-]+/g, '') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Trim hyphens from start and end
  // const finalSlug = [...new Set(rawSlug.split('-'))].join('-') // Remove duplicate hyphens

  if (!rawSlug) {
    console.log('Generated slug is empty')
    return ''
  }

  return rawSlug
}

/**
 * Converts a duration string (e.g., "1 hr 30 min") into total minutes as a number.
 * @example
 * useDurationToMinutes("1 hr 30 min") // returns 90
 * useDurationToMinutes('2 hrs 45 mins') // returns 165
 * useDurationToMinutes('1hr30min') // returns 90
 * useDurationToMinutes('90 mins') // returns 90
 */
export const useDurationToMinutes = (duration: string): number => {
  if (!duration) return 0
  let totalMinutes = 0

  // Match hours pattern (e.g., "1 hr", "2 hrs")
  const hoursMatch = duration.match(/(\d+)\s*hrs?/i)
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]!, 10)
    if (!isNaN(hours)) {
      totalMinutes += hours * 60
    }
  }

  // Match minutes pattern (e.g., "30 min", "45 mins")
  const minutesMatch = duration.match(/(\d+)\s*mins?/i)
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]!, 10)
    if (!isNaN(minutes)) {
      totalMinutes += minutes
    }
  }

  return totalMinutes
}
