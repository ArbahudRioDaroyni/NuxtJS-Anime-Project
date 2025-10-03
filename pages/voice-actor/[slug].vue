<template>
  <V1Container class="staff-page">
    <!-- Loading State -->
    <CommonLoading v-if="pending" type="spinner" size="md" message="Loading staff details..." overlay center />
    
    <!-- Staff Details -->
    <div v-else-if="staff && !isNotFound" class="staff-content">
      <!-- Header Section -->
      <section class="staff-header">
        <V1Image
          src="/image/image-230x345.webp"
          :data-src="staff.large_image_url || staff.medium_image_url || '/image/image-230x345.webp'"
          :alt="staff.name"
          :width="300"
          :height="450"
          clickable
        />
        
        <div class="staff-info">
          <h1 class="staff-name">{{ staff.name }}</h1>
          <div class="staff-meta">
            <div v-if="staff.name_native" class="staff-native">
              {{ staff.name_native }}
            </div>
          </div>
          
          <!-- Staff Stats -->
          <div class="staff-stats">
            <div v-if="staff.age" class="stat-item">
              <span class="stat-label">Age:</span>
              <span class="stat-value">{{ staff.age }}</span>
            </div>
            <div v-if="staff.gender" class="stat-item">
              <span class="stat-label">Gender:</span>
              <span class="stat-value">{{ staff.gender }}</span>
            </div>
            <div v-if="staff.date_of_birth" class="stat-item">
              <span class="stat-label">Birthday:</span>
              <span class="stat-value">{{ staff.date_of_birth }}</span>
            </div>
            <div v-if="staff.home_town" class="stat-item">
              <span class="stat-label">Hometown:</span>
              <span class="stat-value">{{ staff.home_town }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Description Section -->
      <section v-if="staff.description" class="staff-description">
        <h2>Biography</h2>
        <div class="description-content">{{ staff.description }}</div>
      </section>

      <!-- Voice Acting Roles -->
      <section v-if="staff.anime_characters_voice_actor_relations?.length" class="voice-roles">
        <h2>Voice Acting Roles</h2>
        <V1Grid tag="ul" template="columns" gap="3rem 2rem" length="400px">
          <V1Card
            v-for="(item, index) in staff.anime_characters_voice_actor_relations"
            :key="`character-${index}`"
            :title="item?.character?.name"
            :aria-label="`Anime character: ${item?.character?.name}, Role: ${item.character_role?.name}, Voice actor: ${item?.anime?.title_romaji}`"
            variant="both"
            layout="twin"
            tag="li"
          >
            <div>
              <V1Image
                src="/image/image-230x345.webp"
                :data-src="item?.character?.medium_image_url || '/image/image-230x345.webp'"
                :alt="item?.character?.name"
                :width="72"
              />
              <div>
                <NuxtLink :to="`/character/${item?.character?.id}-${item?.character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`">
                  {{ item?.character?.name }}
                </NuxtLink>
                <V1Badge
                  :variant="getGradientBadgeColor(item.character_role?.name || '')"
                  :text="item.character_role?.name"
                />
              </div>
            </div>
            <div>
              <V1Image
                src="/image/image-230x345.webp"
                :data-src="item?.anime?.medium_cover_image_url || '/image/image-230x345.webp'"
                :alt="item?.anime?.title_romaji"
                :width="72"
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
        <h2>Staff Member Not Found</h2>
        <p>The staff member you're looking for doesn't exist or has been removed.</p>
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
import type { Staff } from '~/types/metadata'

interface StaffData extends Staff {
  anime_characters_voice_actor_relations: AnimeCharacterVoiceActorRelation[]
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const staffId = computed(() => {
  const parts = slug.value.split('-')
  return parts[0] ? parseInt(parts[0]) : null
})

// Fetch staff data
const { data: response, pending, error } = await useFetch<ResponseType>(`/api/voice-actor/${staffId.value}`, {
  key: `staff-${staffId.value}`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'Staff member not found', length: 0, data: [] })
})

// Extract staff data from response
const staff = computed(() => response.value?.data?.[0] as StaffData | undefined)
const description = computed(() => descriptionParser(staff.value?.description || ''))

// Reactive error state
const isNotFound = computed(() => {
  return error.value || !response.value?.success || !staff.value
})

// Computed SEO meta - better than watchEffect
const meta = computed(() => {
  const title = staff.value?.name || 'Unknown Staff Member'
  const description = staff.value?.description || 'No description available for this staff member.'
  const image = staff.value?.large_image_url || staff.value?.medium_image_url || '/image/image-230x345.webp'
  
  return {
    title: `${title} - Voice Actor Details`,
    description: description.slice(0, 160) + '...',
    keywords: [
      title,
      staff.value?.name_native || '',
      'anime', 'staff', 'details'
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

useHead({script: [ { innerHTML: `console.log(${JSON.stringify(description.value, null, 2)})` } ]})

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

.staff {
  &-page {
    margin-top: 5rem;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  // Header Section
  &-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  &-image {
    position: sticky;
    top: 2rem;
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &-name {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-level-10);
    margin: 0;

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }

  &-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &-native {
    font-size: 1.25rem;
    color: var(--color-level-30);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-70);
    }
  }
}

.staff-stats {
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
.staff-description {
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
