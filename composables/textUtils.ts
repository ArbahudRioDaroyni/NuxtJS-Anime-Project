/**
 * Log any raw data to the console in development mode
 * @param raw - any raw data to log
 */
export const useConsole = (raw: unknown) => {
  if (import.meta.dev) {
    useHead({ 
      script: [
        { innerHTML: `console.log(${JSON.stringify(raw, null, 2)})` }
      ]
    })
  }
}

/**
 * Format number with dot as thousand separator
 * e.g. 1000000 -> 1.000.000
 * @param num - the number to format
 * @returns formatted number string
 */
export const formatNumber = (num: number | undefined | null): string => {
  if (!num) return 'N/A'
  // Force consistent formatting regardless of server/client locale
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Convert a string to start case (capitalize first letter of each word)
 * @param str - input string
 * @returns start case string
 */
export const startCase = (str: string): string => {
  if (!str) return ''
  // Convert to start case (capitalize first letter of each word)
  if (str.includes(' ')) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase())
      .filter(word => word) // Remove empty words
      .join(' ')
  } else {
    // If no spaces, just capitalize the first letter
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()
  }
}

/**
 * Throttle a function to only allow it to be called once every specified time period
 * @param func - the function to throttle
 * @param limit - the time period in milliseconds
 * @returns a throttled version of the original function
 */
export function useThrottle<T extends (...args: unknown[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout> | undefined;
  let lastRan: number | undefined;

  return function(this: unknown, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (lastRan && (Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan ?? 0)));
    }
  };
}

export const descriptionParser = (raw: string) => {
  const result = {
    links: [] as { label: string; url: string }[],
    story: '',
    roles: [] as { title: string; work: string; type: string }[],
    fields: [] as { label: string; value: string }[],
    raw,
    rawAfterCleanup: raw
      .replace(/__[\w\d]+:__[^_[]*?(?=\s*(?:\[|__|$))/g, '')
      .replace(/__\[[^\]]+\]\([^)]+\)[^_]*?__/g, '')
      .replace(/\[[^\]]+\]\([^)]+\)/g, '')
      .trim()
      .replace(/\n{2,}/g, '\n\n')
      .trim(),
    rawToLinks: raw.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  // Get all fields with format __field:__ value (until link or end of paragraph)
  const fieldRegex = /__(\w+):__\s*([^_[]*?)(?=\s*(?:\[|__|$))/g
  let fieldMatch
  const fields: { label: string; value: string }[] = []
  
  while ((fieldMatch = fieldRegex.exec(raw)) !== null) {
    const label = fieldMatch[1]?.trim()
    const value = fieldMatch[2]?.trim()
    
    if (label && value) {
      fields.push({ label, value })
    }
  }

  result.fields = fields

  // Get links in format [Label](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  let linkMatch
  while ((linkMatch = linkRegex.exec(raw)) !== null) {
    result.links.push({ label: linkMatch[1] ?? '', url: linkMatch[2] ?? '' })
  }

  // Get story before any roles section
  // Check various formats: __Non-Anime Roles:__, **Non-Anime Roles:**, or Non-Anime Roles
  let storyMatch = raw
  const nonAnimePatterns = [
    '__Non-Anime Roles:__',
    '**Non-Anime Roles:**', 
    'Non-Anime Roles'
  ]
  
  for (const pattern of nonAnimePatterns) {
    const splitResult = raw.split(pattern)[0]
    if (splitResult && splitResult !== raw) {
      storyMatch = splitResult
      break
    }
  }
  
  if (storyMatch && storyMatch !== raw) {
    // Clean up the story by removing fields and links at the start
    let cleanStory = storyMatch
    // Remove all fields with format __field:__ value
    cleanStory = cleanStory.replace(/__\w+:__[^_[]*?(?=\s*(?:\[|__|$))/g, '')
    // Remove links that stick to the end of fields (e.g. __[Website]...)
    cleanStory = cleanStory.replace(/__\[[^\]]+\]\([^)]+\)[^_]*?__/g, '')
    // Remove standalone links that remain
    cleanStory = cleanStory.replace(/\[[^\]]+\]\([^)]+\)/g, '')
    result.story = cleanStory.trim()
  }

  // Get roles from the section after the non-anime roles patterns
  // Support various formats like:
  let rolesMatch = ''
  
  for (const pattern of nonAnimePatterns) {
    const splitResult = raw.split(pattern)[1]
    if (splitResult) {
      rolesMatch = splitResult
      break
    }
  }
  
  if (rolesMatch) {
    const lines = rolesMatch.split('\n').map(l => l.trim()).filter(Boolean)
    lines.forEach(line => {
      // Support for bullet "-" and "•"
      if (line.startsWith('-') || line.startsWith('•')) {
        // Clean bullet from the start of the line
        const cleanLine = line.replace(/^[-•]/, '').trim()
        
        // Format 1: "Name - Work (Type)" 
        if (cleanLine.includes(' - ')) {
          const parts = cleanLine.split(' - ')
          if (parts.length >= 2) {
            const title = parts[0] ? parts[0].trim() : ''
            const work = parts[1] ? parts[1].replace(/\(.*\)/, '').trim() : ''
            const typeMatch = parts[1] ? parts[1].match(/\((.*?)\)/) : null
            result.roles.push({
              title,
              work,
              type: typeMatch ? typeMatch[1] ?? '' : ''
            })
          }
        }
        // Format 2: "Name (Work) [Type]" 
        else if (cleanLine.includes('[') && cleanLine.includes(']')) {
          const match = cleanLine.match(/^(.*?)\s*\((.*?)\)\s*\[(.*?)\]/)
          if (match) {
            result.roles.push({
              title: match[1]?.trim() ?? '',
              work: match[2]?.trim() ?? '',
              type: match[3]?.trim() ?? ''
            })
          }
        }
        // Format 3: "Name (Work)" - no type specified
        else {
          const match = cleanLine.match(/^(.*?)\s*\((.*?)\)/)
          if (match) {
            result.roles.push({
              title: match[1]?.trim() ?? '',
              work: match[2]?.trim() ?? '',
              type: ''
            })
          }
        }
      }
    })
  }

  return result
}