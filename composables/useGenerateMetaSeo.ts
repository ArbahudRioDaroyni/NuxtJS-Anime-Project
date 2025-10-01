import type { AnimeDetails } from '~/types/anime'
import type { Staff } from '~/types/metadata'

interface useSeoMeta {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: 'website'
  twitterCard: 'summary_large_image'
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
}

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

export const useAnimeSeo = (anime: ComputedRef<AnimeDetails | undefined>) => {
  const seoMeta = computed((): useSeoMeta => {
    const defaultMeta: useSeoMeta = {
      title: 'Anime not found',
      description: 'The requested anime could not be found.',
      keywords: 'anime, not found',
      ogTitle: 'Anime not found',
      ogDescription: 'The requested anime could not be found.',
      ogImage: '/image/image-230x345.webp',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Anime not found',
      twitterDescription: 'The requested anime could not be found.',
      twitterImage: '/image/image-230x345.webp'
    }

    if (!anime.value) {
      return defaultMeta
    }

    let title = anime.value.title_english || anime.value.title_romaji || anime.value.title_native || 'Unknown Anime'
    if (title.length > 60) {
      title = title.slice(0, 60) + '...'
    }

    const description = anime.value.description
      ? stripHtmlTags(anime.value.description).slice(0, 160) + '...'
      : 'No description available for this anime.'

    const synonyms = anime.value.synonyms ? JSON.parse(anime.value.synonyms) : []

    const keywords = [
      anime.value.title_romaji,
      anime.value.title_english,
      anime.value.title_native,
      ...synonyms,
      'anime', 'details', 'watch'
    ].filter(Boolean).join(', ')
  
    const image = anime.value.large_cover_image_url ||
                 anime.value.medium_cover_image_url ||
                 '/image/image-230x345.webp'

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image
    }
  })

  return { seoMeta }
}

export const useStaffSeo = (staff: ComputedRef<Staff | undefined>) => {
  const seoMeta = computed((): useSeoMeta => {
    const defaultMeta: useSeoMeta = {
      title: 'Staff not found',
      description: 'The requested staff member could not be found.',
      keywords: 'staff, not found',
      ogTitle: 'Staff not found',
      ogDescription: 'The requested staff member could not be found.',
      ogImage: '/image/image-230x345.webp',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Staff not found',
      twitterDescription: 'The requested staff member could not be found.',
      twitterImage: '/image/image-230x345.webp'
    }

    if (!staff.value) {
      return defaultMeta
    }

    let title = staff.value.name || 'Unknown Staff'
    if (title.length > 60) {
      title = title.slice(0, 60) + '...'
    }
    const description = staff.value.description
      ? stripHtmlTags(staff.value.description).slice(0, 160) + '...'
      : 'No description available for this staff member.'
    const keywords = [
      staff.value.name,
      staff.value.name_native,
      'staff', 'profile'
    ].filter(Boolean).join(', ')
    const image = staff.value.medium_image_url ||
                 staff.value.large_image_url ||
                 '/image/image-230x345.webp'
    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image
    }
  })

  return { seoMeta }
}