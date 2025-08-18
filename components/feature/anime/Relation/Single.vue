<script setup lang="ts">
import type { AnimeRelationRelation } from '~/types/relations'

interface Props {
  data?: AnimeRelationRelation | null
  isSkeleton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  isSkeleton: false
})

const anime = computed(() => {
  const anime = props.data?.reference_anime
  return {
    slug: anime?.slug || '#',
    title: anime?.title_english || anime?.title_romaji || anime?.title_native || 'Unknown Anime',
    image: anime?.medium_cover_image_url || anime?.thumbnail_image_url || '/image/image-230x345.webp',
    status: (anime as { status_type?: { name?: string } })?.status_type?.name || 'Unknown',
    source: (anime as { source_media_type?: { name?: string } })?.source_media_type?.name || 'Unknown',
    relationType: props.data?.reference_type?.name || 'Unknown'
  }
})

const getRelationClass = (type: string) => {
  switch (type.toUpperCase()) {
    case 'SEQUEL':
      return 'relation-type--sequel'
    case 'PREQUEL':
      return 'relation-type--prequel'
    case 'SIDE_STORY':
      return 'relation-type--side-story'
    case 'SPIN_OFF':
      return 'relation-type--spin-off'
    case 'ALTERNATIVE':
      return 'relation-type--alternative'
    case 'SUMMARY':
      return 'relation-type--summary'
    case 'CHARACTER':
      return 'relation-type--character'
    case 'ADAPTATION':
      return 'relation-type--adaptation'
    case 'PARENT':
      return 'relation-type--parent'
    default:
      return 'relation-type--other'
  }
}
</script>

<template>
  <BaseCardNeomorphism 
    tag="article" 
    variant="both"
    class="card-relation"
    :aria-label="`Anime relation: ${anime?.title}, Type: ${anime?.relationType}`"
  >
    <!-- Image -->
    <header :class="['anime-cover', isSkeleton ? 'skeleton' : '']">
      <BaseImageClickable
        v-if="anime?.image"
        :src="anime?.image"
        :alt="anime?.title"
        :min-width="'60px'"
        :enable-preview="true"
        :is-background="true"
      />
    </header>

    <!-- Content -->
    <div class="anime-content" aria-labelledby="anime-title">
      <NuxtLink 
        :to="`/${anime?.slug}`"
        :class="['anime-link', isSkeleton ? 'skeleton' : '']"
        :aria-label="`View details for ${anime?.title}`"
      >
        <h3 id="anime-title" class="anime-title">
          {{ anime?.title }}
        </h3>
        
        <div class="anime-meta" role="group" aria-label="Anime metadata">
          <span 
            :class="['relation-type', getRelationClass(anime?.relationType)]"
            role="badge"
            :aria-label="`Relation type: ${anime?.relationType}`"
          >
            {{ anime?.relationType }}
          </span>
        </div>

        <div class="anime-meta" role="group" aria-label="Anime metadata">
          <span 
            class="anime-source"
            role="note"
            :aria-label="`Source: ${anime?.source}`"
          >
            {{ anime?.source }}
          </span>
          <span 
            class="anime-status"
            role="status"
            :aria-label="`Status: ${anime?.status}`"
          >
            {{ anime?.status }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </BaseCardNeomorphism>
</template>

<style scoped lang="scss">
.card-relation {
  align-items: stretch !important;
  min-height: 130px;
  gap: 1rem;
  cursor: pointer;

  &:hover,
  &:focus {
    & .anime-title {
      color: var(--color-level-70);
    }

    & img {
      transform: scale(1.2);
    }
  }
  
  &:focus-visible .anime-title {
    outline: 2px solid var(--color-level-70);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
}

.anime-cover {
  margin: 0;
  flex-shrink: 0;
  width: 72px;
  border-radius: var(--radius);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.anime-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
  height: 100%;
}

.anime-link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  justify-content: space-between;
}

.anime-title {
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  line-height: 1.3;
  transition: color 0.2s ease;
  
  // Clamp to 2 lines
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.anime-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin: 0.25rem 0;
}

.anime-source {
  font-size: 0.675rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  opacity: 0.8;
}

.anime-status {
  font-weight: 500;
  font-size: 0.675rem;
  border-radius: 0.25rem;
}

.relation-type {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.7rem;
  line-height: 1;
  color: var(--color-black);

  // Type-specific styles
  &--sequel {
    background: var(--gradient-megatron);
  }
  &--prequel {
    background: var(--gradient-arctic);
  }
  &--side-story {
    background: var(--gradient-tranquil);
  }
  &--spin-off {
    background: var(--gradient-maldives);
  }
  &--alternative {
    background: var(--gradient-martini);
  }
  &--summary {
    background: var(--gradient-oceanic);
  }
  &--other {
    background: var(--gradient-cloudy);
  }
  &--character {
    background: var(--gradient-blossom);
  }
  &--adaptation {
    background: var(--gradient-margo);
  }
  &--parent {
    background: var(--gradient-sky);
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .anime-title {
    &:focus-visible {
      outline-width: 3px;
    }
  }
  
  .relation-type {
    border: 1px solid currentColor;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .anime-title {
    transition: none;
  }
}

// Mobile responsiveness
@media (max-width: 640px) {
  .anime-cover {
    width: 75px;
  }
  
  .anime-title {
    font-size: 0.8rem;
  }
  
  .anime-meta {
    gap: 0.25rem;
  }
  
  .relation-type,
  .anime-status {
    font-size: 0.65rem;
    padding: 0.125rem 0.25rem;
  }
}
</style>
