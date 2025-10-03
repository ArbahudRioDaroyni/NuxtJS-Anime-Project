<template>
  <V1Container>
    <!-- Loading State -->
    <CommonLoading v-if="pending" type="spinner" size="md" message="Loading character details..." overlay center />
    
    <!-- Character Details -->
    <div v-else-if="character && !isNotFound" class="character-content">
      <!-- Header Section -->
      <section class="character-header">
        <div class="character-image">
          <V1Image
            :src="character.large_image_url || character.medium_image_url || '/image/image-230x345.webp'"
            :alt="character.name"
            :width="300"
            :height="450"
          />
        </div>
        
        <div class="character-info">
          <h1 class="character-name">{{ character.name }}</h1>
          <div class="character-meta">
            <div v-if="character.name_native" class="character-native">
              {{ character.name_native }}
            </div>
          </div>
          
          <!-- Character Stats -->
          <div class="character-stats">
            <div v-if="character.age" class="stat-item">
              <span class="stat-label">Age:</span>
              <span class="stat-value">{{ character.age }}</span>
            </div>
            <div v-if="character.gender" class="stat-item">
              <span class="stat-label">Gender:</span>
              <span class="stat-value">{{ character.gender }}</span>
            </div>
            <div v-if="character.date_of_birth" class="stat-item">
              <span class="stat-label">Birthday:</span>
              <span class="stat-value">{{ character.date_of_birth }}</span>
            </div>
            <div v-if="character.home_town" class="stat-item">
              <span class="stat-label">Hometown:</span>
              <span class="stat-value">{{ character.home_town }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Description Section -->
      <section v-if="character.description" class="character-description">
        <h2>Biography</h2>
        <div class="description-content">{{ character.description }}</div>
      </section>

      <!-- Voice Acting Roles -->
      <section v-if="character.anime_characters_voice_actor_relations?.length" class="voice-roles">
        <h2>Voice Acting Roles</h2>
        <V1Grid tag="ul" template="columns" gap="3rem 2rem" length="400px">
          <V1Card
            v-for="(item, index) in character.anime_characters_voice_actor_relations"
            :key="`voice_actor-${index}`"
            :title="item?.voice_actor?.name"
            :aria-label="`Voice actor: ${item?.voice_actor?.name}, Anime: ${item?.anime?.title_romaji}`"
            variant="both"
            layout="twin"
            tag="li"
          >
            <div>
              <V1Image
                v-if="item?.voice_actor?.medium_image_url"
                :src="item?.voice_actor?.medium_image_url"
                :alt="item?.voice_actor?.name"
                :width="72"
                :height="88"
              />
              <div>
                <NuxtLink :to="`/voice_actor/${item?.voice_actor?.id}-${item?.voice_actor?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`">
                  {{ item?.voice_actor?.name }}
                </NuxtLink>
                <V1Badge
                  :variant="getGradientBadgeColor(item.character_role?.name || '')"
                  :text="item.character_role?.name"
                />
              </div>
            </div>
            <div>
              <V1Image
                v-if="item?.anime?.medium_cover_image_url"
                :src="item?.anime?.medium_cover_image_url"
                :alt="item?.anime?.title_romaji"
                :width="72"
                :height="88"
              />
              <div>
                <NuxtLink :to="'/'+item?.anime?.slug">
                  {{ item?.anime?.title_romaji }}
                </NuxtLink>
                <span class="card-subtitle">
                  Subtitle
                </span>
              </div>
            </div>
          </V1Card>
        </V1Grid>
      </section>

      <!-- Back Link -->
      <div class="back-link">
        <NuxtLink to="/" class="btn-back">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isNotFound" class="error-container">
      <div class="error-content">
        <h2>Character Member Not Found</h2>
        <p>The character member you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/" class="btn-back">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </V1Container>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'
import type { Character } from '~/types/metadata'

interface CharacterData extends Character {
  anime_characters_voice_actor_relations: AnimeCharacterVoiceActorRelation[]
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const characterId = computed(() => {
  const parts = slug.value.split('-')
  return parts[0] ? parseInt(parts[0]) : null
})

// Fetch character data
const { data: response, pending, error } = await useFetch<ResponseType>(`/api/character/${characterId.value}`, {
  key: `character-${characterId.value}`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'character member not found', length: 0, data: [] })
})

// Extract character data from response
const character = computed(() => response.value?.data?.[0] as CharacterData | undefined)
const description = computed(() => descriptionParser(character.value?.description || ''))

// Reactive error state
const isNotFound = computed(() => {
  return error.value || !response.value?.success || !character.value
})

// Computed SEO meta - better than watchEffect
const meta = computed(() => {
  const title = character.value?.name || 'Unknown Character Member'
  const description = character.value?.description || 'No description available for this character member.'
  const image = character.value?.large_image_url || character.value?.medium_image_url || '/image/image-230x345.webp'
  
  return {
    title: `${title} - Character Details`,
    description: description.slice(0, 160) + '...',
    keywords: [
      title,
      character.value?.name_native || '',
      'anime', 'character', 'details'
    ].filter(Boolean).join(', '),
    image: image,
  }
})

function getGradientBadgeColor(role?: string): string {
  if (!role) return 'arctic'
  
  const roleMap = {
    MAIN: 'oceanic',
    SUPPORTING: 'megatron', 
    BACKGROUND: 'tranquil'
  } as const
  
  return roleMap[role.toUpperCase() as keyof typeof roleMap] || 'arctic'
}

useHead({script: [ { innerHTML: `console.log(${JSON.stringify(character.value, null, 2)})` }, { innerHTML: `console.log(${JSON.stringify(description.value, null, 2)})` } ]})

useSeoMeta({
  title: meta.value.title,
  description: meta.value.description,
  keywords: meta.value.keywords,
  ogTitle: meta.value.title,
  ogDescription: meta.value.description,
  ogImage: meta.value.image,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: meta.value.title,
  twitterDescription: meta.value.description,
  twitterImage: meta.value.image
})
</script>

<style scoped lang="scss">
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.character-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

// Header Section
.character-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.character-image {
  position: sticky;
  top: 2rem;
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.character-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-level-10);
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-90);
  }
}

.character-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.character-native {
  font-size: 1.25rem;
  color: var(--color-level-30);

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-70);
  }
}

.character-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  gap: 0.5rem;
}

.stat-label {
  font-weight: 600;
  color: var(--color-level-20);
  min-width: 120px;

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-80);
  }
}

.stat-value {
  color: var(--color-level-10);

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-90);
  }
}

// Description Section
.character-description {
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: var(--color-level-10);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }
}

.description-content {
  line-height: 1.6;
  color: var(--color-level-20);

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-80);
  }
}

// Voice Acting Roles
.voice-roles {
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: var(--color-level-10);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }
}

// Back Link
.back-link {
  margin-top: 2rem;
  
  .btn-back {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: var(--color-level-90);
    color: var(--color-level-10);
    text-decoration: none;
    border-radius: var(--radius);
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-level-80);
      transform: translateX(-4px);
    }
    
    @media (prefers-color-scheme: dark) {
      background: var(--color-level-10);
      color: var(--color-level-90);
      
      &:hover {
        background: var(--color-level-20);
      }
    }
  }
}

// Error State
.error-content {
  text-align: center;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-level-20);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-80);
    }
  }
  
  p {
    margin-bottom: 2rem;
    color: var(--color-level-40);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-60);
    }
  }
}
</style>
