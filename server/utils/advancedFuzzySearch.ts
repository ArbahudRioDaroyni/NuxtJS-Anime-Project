/**
 * Common typo corrections for anime terms
 */
export const ANIME_TYPO_CORRECTIONS: Record<string, string> = {
  // Common anime term typos
  'narto': 'naruto',
  'naroto': 'naruto',
  'narito': 'naruto',
  'bleech': 'bleach',
  'demonslayer': 'demon slayer',
  'attackontitan': 'attack on titan',
  'onepice': 'one piece',
  'onepeice': 'one piece',
  'dragonbal': 'dragon ball',
  'dragonball': 'dragon ball',
  'deathnot': 'death note',
  'deathnote': 'death note',
  'fullmetalalchemist': 'fullmetal alchemist',
  'hunterxhunter': 'hunter x hunter',
  'jujutsukaisen': 'jujutsu kaisen',
  'demonslayar': 'demon slayer',
  'kimetsunoyaiba': 'kimetsu no yaiba',
  'shingekinokyojin': 'shingeki no kyojin',
  'atk': 'attack',
  'dmn': 'demon',
  'slyr': 'slayer',
  'bnha': 'boku no hero academia',
  'mha': 'my hero academia',
  'aot': 'attack on titan',
  'snk': 'shingeki no kyojin',
  'fma': 'fullmetal alchemist',
  'hxh': 'hunter x hunter',
  'jjk': 'jujutsu kaisen',
  'kny': 'kimetsu no yaiba',
  'ds': 'demon slayer'
}

/**
 * Preprocess query with typo corrections
 */
export function correctTypos(query: string): string {
  const normalized = query.toLowerCase().trim()
  
  // Check for exact typo matches
  if (ANIME_TYPO_CORRECTIONS[normalized]) {
    return ANIME_TYPO_CORRECTIONS[normalized]
  }
  
  // Check for partial typo matches
  for (const [typo, correction] of Object.entries(ANIME_TYPO_CORRECTIONS)) {
    if (normalized.includes(typo)) {
      return normalized.replace(typo, correction)
    }
  }
  
  return query
}

/**
 * Jaro-Winkler Distance for better string similarity
 */
export function jaroWinklerDistance(s1: string, s2: string): number {
  const jaro = jaroDistance(s1, s2)
  
  if (jaro < 0.7) return jaro
  
  // Calculate common prefix (up to 4 characters)
  let prefix = 0
  for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
    if (s1[i] === s2[i]) prefix++
    else break
  }
  
  return jaro + (0.1 * prefix * (1 - jaro))
}

function jaroDistance(s1: string, s2: string): number {
  if (s1 === s2) return 1
  
  const len1 = s1.length
  const len2 = s2.length
  
  if (len1 === 0 || len2 === 0) return 0
  
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1
  if (matchWindow < 0) return 0
  
  const s1Matches = new Array(len1).fill(false)
  const s2Matches = new Array(len2).fill(false)
  
  let matches = 0
  let transpositions = 0
  
  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow)
    const end = Math.min(i + matchWindow + 1, len2)
    
    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue
      s1Matches[i] = s2Matches[j] = true
      matches++
      break
    }
  }
  
  if (matches === 0) return 0
  
  // Find transpositions
  let k = 0
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue
    while (!s2Matches[k]) k++
    if (s1[i] !== s2[k]) transpositions++
    k++
  }
  
  return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3
}

/**
 * Damerau-Levenshtein Distance (handles transpositions)
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const sourceLength = source.length
  const targetLength = target.length
  
  if (sourceLength === 0) return targetLength
  if (targetLength === 0) return sourceLength
  
  const matrix: number[][] = []
  
  // Initialize matrix
  for (let i = 0; i <= sourceLength; i++) {
    matrix[i] = []
    matrix[i][0] = i
  }
  
  for (let j = 0; j <= targetLength; j++) {
    matrix[0][j] = j
  }
  
  // Fill matrix
  for (let i = 1; i <= sourceLength; i++) {
    for (let j = 1; j <= targetLength; j++) {
      let cost = 0
      if (source[i - 1] !== target[j - 1]) {
        cost = 1
      }
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
      
      // Transposition
      if (i > 1 && j > 1 &&
          source[i - 1] === target[j - 2] &&
          source[i - 2] === target[j - 1]) {
        matrix[i][j] = Math.min(
          matrix[i][j],
          matrix[i - 2][j - 2] + cost
        )
      }
    }
  }
  
  return matrix[sourceLength][targetLength]
}

/**
 * Soundex algorithm for phonetic matching
 */
export function soundex(str: string): string {
  const code = str.toUpperCase().replace(/[^A-Z]/g, '')
  if (code.length === 0) return '0000'
  
  let soundexCode = code[0]
  const mapping: { [key: string]: string } = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6'
  }
  
  for (let i = 1; i < code.length && soundexCode.length < 4; i++) {
    const mapped = mapping[code[i]]
    if (mapped && mapped !== soundexCode[soundexCode.length - 1]) {
      soundexCode += mapped
    }
  }
  
  return soundexCode.padEnd(4, '0')
}

/**
 * N-gram similarity
 */
export function ngramSimilarity(str1: string, str2: string, n: number = 2): number {
  const getNgrams = (str: string, size: number) => {
    const ngrams = new Set<string>()
    for (let i = 0; i <= str.length - size; i++) {
      ngrams.add(str.substr(i, size))
    }
    return ngrams
  }
  
  const ngrams1 = getNgrams(str1.toLowerCase(), n)
  const ngrams2 = getNgrams(str2.toLowerCase(), n)
  
  const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)))
  const union = new Set([...ngrams1, ...ngrams2])
  
  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * Keyboard-based typo detection (QWERTY layout)
 */
export function keyboardDistance(char1: string, char2: string): number {
  const qwertyLayout = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ]
  
  let pos1 = { row: -1, col: -1 }
  let pos2 = { row: -1, col: -1 }
  
  for (let row = 0; row < qwertyLayout.length; row++) {
    const col1 = qwertyLayout[row].indexOf(char1.toLowerCase())
    const col2 = qwertyLayout[row].indexOf(char2.toLowerCase())
    
    if (col1 !== -1) pos1 = { row, col: col1 }
    if (col2 !== -1) pos2 = { row, col: col2 }
  }
  
  if (pos1.row === -1 || pos2.row === -1) return Infinity
  
  return Math.sqrt(Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2))
}

/**
 * Enhanced fuzzy search with keyboard awareness
 */
export function keyboardAwareFuzzyMatch(query: string, target: string): number {
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  
  if (q.length === 0 || t.length === 0) return 0
  
  let totalDistance = 0
  let matches = 0
  
  for (let i = 0; i < Math.min(q.length, t.length); i++) {
    const keyboardDist = keyboardDistance(q[i], t[i])
    if (keyboardDist <= 2) { // Adjacent keys
      matches++
      totalDistance += keyboardDist
    }
  }
  
  if (matches === 0) return 0
  
  const avgDistance = totalDistance / matches
  const matchRatio = matches / Math.max(q.length, t.length)
  
  return matchRatio * (1 - avgDistance / 3) // Normalize keyboard distance
}

/**
 * Comprehensive fuzzy matching with multiple algorithms
 */
export function advancedFuzzyMatch(query: string, target: string, threshold: number = 0.6): {
  isMatch: boolean
  score: number
  algorithm: string
  confidence: number
} {
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase().trim()
  
  if (q === t) {
    return { isMatch: true, score: 1.0, algorithm: 'exact', confidence: 1.0 }
  }
  
  if (t.includes(q)) {
    return { isMatch: true, score: 0.95, algorithm: 'contains', confidence: 0.9 }
  }
  
  // Calculate multiple similarity scores
  const jaroWinkler = jaroWinklerDistance(q, t)
  const damerauLev = 1 - (damerauLevenshteinDistance(q, t) / Math.max(q.length, t.length))
  const ngram2 = ngramSimilarity(q, t, 2)
  const ngram3 = ngramSimilarity(q, t, 3)
  
  // Phonetic matching for sound-alike words
  const soundexMatch = soundex(q) === soundex(t) ? 0.7 : 0
  
  // Weighted combination of algorithms
  const combinedScore = (
    jaroWinkler * 0.3 +
    damerauLev * 0.3 +
    ngram2 * 0.2 +
    ngram3 * 0.15 +
    soundexMatch * 0.05
  )
  
  // Determine best algorithm and confidence
  const scores = [
    { score: jaroWinkler, algorithm: 'jaro-winkler' },
    { score: damerauLev, algorithm: 'damerau-levenshtein' },
    { score: ngram2, algorithm: 'bigram' },
    { score: ngram3, algorithm: 'trigram' },
    { score: soundexMatch, algorithm: 'soundex' }
  ]
  
  const bestMatch = scores.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  )
  
  const confidence = Math.min(1.0, combinedScore + (bestMatch.score > 0.8 ? 0.1 : 0))
  
  return {
    isMatch: combinedScore >= threshold,
    score: combinedScore,
    algorithm: bestMatch.algorithm,
    confidence
  }
}

/**
 * Simple Levenshtein distance for fallback
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  if (str1.length === 0) return str2.length
  if (str2.length === 0) return str1.length

  // Create matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Calculate similarity score (0-1, where 1 is exact match)
 */
export function similarityScore(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return (maxLength - distance) / maxLength
}