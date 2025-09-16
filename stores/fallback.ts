export const useFallbackStore = defineStore('fallback', () => {
  // Text fallbacks
  const fallbackText = ref('N/A')
  
  const setFallbackText = (text: string) => {
    fallbackText.value = text
  }

  // Media fallbacks
  const MEDIA_FALLBACK = {
    // Basic info
    id: () => Math.random().toString(),
    name: 'Unknown Title',
    title: 'Unknown Title',
    slug: '#',
    
    // Images
    image: '/image/image-230x345.webp',
    thumbnail: '/image/image-230x345.webp',
    cover: '/image/cover-fallback.webp',
    banner: '/image/banner-fallback.webp',
    
    // Metadata
    subtitle: 'Unknown',
    description: 'No description available',
    year: new Date().getFullYear(),
    status: 'Unknown',
    source: 'Unknown',
    type: 'Unknown',
    
    // Ratings & Stats
    rating: 0,
    score: 0,
    episodes: 0,
    duration: 0,
    
    // Links
    link: undefined,
    externalLinks: [],
    
    // UI Components
    badge: {
      text: 'Unknown',
      variant: 'cloudy' as const
    },
    additionalInfo: ''
  } as const

  // User fallbacks
  const USER_FALLBACK = {
    id: () => Math.random().toString(),
    username: 'Anonymous',
    displayName: 'Unknown User',
    avatar: '/image/avatar-default.webp',
    email: '',
    role: 'user' as const,
    isVerified: false,
    joinDate: new Date().toISOString()
  } as const

  // Generic fallbacks
  const GENERIC_FALLBACK = {
    string: fallbackText,
    number: 0,
    boolean: false,
    array: () => [],
    object: () => ({}),
    date: () => new Date().toISOString(),
    url: '#',
    image: '/image/placeholder.webp'
  } as const

  // API Response fallbacks
  const API_FALLBACK = {
    loading: false,
    error: null,
    data: null,
    message: 'No data available',
    status: 'idle' as const
  } as const

  // Utility functions
  const getMediaFallback = (type?: 'anime' | 'manga' | 'character' | 'studio') => {
    const base = { ...MEDIA_FALLBACK }
    
    switch (type) {
      case 'anime':
        return {
          ...base,
          name: 'Unknown Anime',
          type: 'TV',
          episodes: 12,
          duration: 24
        }
      case 'manga':
        return {
          ...base,
          name: 'Unknown Manga',
          type: 'Manga',
          episodes: 0, // chapters
          duration: 0
        }
      case 'character':
        return {
          ...base,
          name: 'Unknown Character',
          image: '/image/character-default.webp'
        }
      case 'studio':
        return {
          ...base,
          name: 'Unknown Studio',
          image: '/image/studio-default.webp'
        }
      default:
        return base
    }
  }

  const getUserFallback = (role?: 'user' | 'admin' | 'moderator') => {
    return {
      ...USER_FALLBACK,
      role: role || 'user'
    }
  }

  const getCardFallback = (variant?: string) => {
    return {
      id: MEDIA_FALLBACK.id(),
      name: MEDIA_FALLBACK.name,
      image: MEDIA_FALLBACK.image,
      subtitle: MEDIA_FALLBACK.subtitle,
      slug: MEDIA_FALLBACK.slug,
      badge: {
        text: MEDIA_FALLBACK.badge.text,
        variant: variant || MEDIA_FALLBACK.badge.variant
      },
      link: MEDIA_FALLBACK.link,
      additionalInfo: MEDIA_FALLBACK.additionalInfo
    }
  }

  // Validation helpers
  const withFallback = <T>(value: T | null | undefined, fallback: T): T => {
    return value ?? fallback
  }

  const withMediaFallback = (data: Record<string, unknown>, type?: 'anime' | 'manga' | 'character' | 'studio') => {
    if (!data || typeof data !== 'object') {
      return getMediaFallback(type)
    }

    const fallback = getMediaFallback(type)
    return {
      id: withFallback(data.id, fallback.id()),
      name: withFallback(data.name || data.title, fallback.name),
      image: withFallback(data.image || data.cover_image || data.thumbnail, fallback.image),
      subtitle: withFallback(data.subtitle || data.type, fallback.subtitle),
      slug: withFallback(data.slug, fallback.slug),
      ...data
    }
  }

  const withUserFallback = (data: Record<string, unknown>) => {
    if (!data || typeof data !== 'object') {
      return getUserFallback()
    }

    const fallback = getUserFallback()
    return {
      id: withFallback(data.id, fallback.id()),
      username: withFallback(data.username, fallback.username),
      displayName: withFallback(data.displayName || data.name, fallback.displayName),
      avatar: withFallback(data.avatar || data.profileImage, fallback.avatar),
      ...data
    }
  }

  // Error handling
  const getErrorFallback = (error?: Error | string) => {
    return {
      ...API_FALLBACK,
      error: error || 'An unexpected error occurred',
      status: 'error' as const
    }
  }

  return {
    // State
    fallbackText: readonly(fallbackText),
    
    // Actions
    setFallbackText,
    
    // Fallback objects
    MEDIA_FALLBACK,
    USER_FALLBACK,
    GENERIC_FALLBACK,
    API_FALLBACK,
    
    // Utility functions
    getMediaFallback,
    getUserFallback,
    getCardFallback,
    getErrorFallback,
    
    // Validation helpers
    withFallback,
    withMediaFallback,
    withUserFallback,
    
    // Legacy support
    FALLBACK: MEDIA_FALLBACK
  }
})

// Type exports for better TypeScript support
export type MediaFallback = ReturnType<typeof useFallbackStore>['MEDIA_FALLBACK']
export type UserFallback = ReturnType<typeof useFallbackStore>['USER_FALLBACK']
export type GenericFallback = ReturnType<typeof useFallbackStore>['GENERIC_FALLBACK']

// // Basic usage
// const { getMediaFallback, withMediaFallback } = useFallbackStore()

// // Get anime fallback
// const animeFallback = getMediaFallback('anime')

// // Safely merge data with fallback
// const safeAnimeData = withMediaFallback(apiResponse.data, 'anime')

// // Use in components
// const cardData = getCardFallback('primary')