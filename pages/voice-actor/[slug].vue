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
        <h2 class="col-span-full text-2xl font-bold">Voice Acting Roles</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="(item, index) in staff.anime_characters_voice_actor_relations"
            :key="`character-${index}`"
            :aria-label="`Anime character: ${item?.character?.name}, Role: ${item.character_role?.name}, Voice actor: ${item?.anime?.title_romaji}`"
            variant="neumorphic-outline"
            as="li"
            :ui="{ body: 'flex flex-row gap-4 h-full' }"
            class="hover:cursor-pointer transition duration-300 ease-in-out hover:translate-0.5"
          >
            <div
              class="basis-1/2 group flex flex-row gap-4 hover:cursor-pointer"
              @click="$router.push(item?.character ? `/character/${item?.character?.id}-${item?.character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` : '#')"
            >
              <V1Image
                data-src="/image/image-230x345.webp"
                :src="item?.character?.medium_image_url || '/image/image-230x345.webp'"
                :alt="item?.character?.name"
                :width="72"
                :height="88"
              />
              <div class="flex flex-col justify-between">
                <NuxtLink
                  :to="`/character/${item?.character?.id}-${item?.character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`"
                  class="transition duration-300 ease-in-out group-hover:text-primary"
                >
                  {{ item?.character?.name }}
                </NuxtLink>
                <UBadge
                  :label="item.character_role?.name"
                  :color="getGradientBadgeColor(item.character_role?.name || '')"
                  variant="solid"
                  size="md"
                  class="w-min"
                />
              </div>
            </div>
            <div
              class="basis-1/2 group flex flex-row-reverse gap-4 hover:cursor-pointer"
              @click="$router.push(item?.anime ? '/'+item?.anime?.slug : '#')"
            >
              <V1Image
                data-src="/image/image-230x345.webp"
                :src="item?.anime?.medium_cover_image_url || '/image/image-230x345.webp'"
                :alt="item?.anime?.title_romaji"
                :width="72"
                :height="88"
              />
              <div class="flex flex-col justify-between flex-end text-right">
                <NuxtLink :to="'/'+item?.anime?.slug" class="transition duration-300 ease-in-out group-hover:text-primary">
                  {{ item?.anime?.title_romaji }}
                </NuxtLink>
                <span class="text-sm opacity-80">
                  Subtitle
                </span>
              </div>
            </div>
          </UCard>
        </ul>
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

const getGradientBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'MAIN':
      return 'gradient-megatron'
    case 'SUPPORTING':
      return 'gradient-delicate'
    case 'BACKGROUND':
      return 'gradient-sky'
    default:
      return 'gradient-cloudy'
  }
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
    color: hsl(from var(--primary-color) h s 10%);
    margin: 0;

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 90%);
    }
  }

  &-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &-native {
    font-size: 1.25rem;
    color: hsl(from var(--primary-color) h s 30%);

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 70%);
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
  color: hsl(from var(--primary-color) h s 20%);
  min-width: 120px;

  @media (prefers-color-scheme: dark) {
    color: hsl(from var(--primary-color) h s 80%);
  }
}

.stat-value {
  color: hsl(from var(--primary-color) h s 10%);

  @media (prefers-color-scheme: dark) {
    color: hsl(from var(--primary-color) h s 90%);
  }
}

// Description Section
.staff-description {
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: hsl(from var(--primary-color) h s 10%);

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 90%);
    }
  }
}

.description-content {
  line-height: 1.6;
  color: hsl(from var(--primary-color) h s 20%);

  @media (prefers-color-scheme: dark) {
    color: hsl(from var(--primary-color) h s 80%);
  }
}

// Voice Acting Roles
.voice-roles {
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: hsl(from var(--primary-color) h s 10%);

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 90%);
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
    background: hsl(from var(--primary-color) h s 90%);
    color: hsl(from var(--primary-color) h s 10%);
    text-decoration: none;
    border-radius: var(--radius);
    transition: all 0.2s ease;
    
    &:hover {
      background: hsl(from var(--primary-color) h s 80%);
      transform: translateX(-4px);
    }
    
    @media (prefers-color-scheme: dark) {
      background: hsl(from var(--primary-color) h s 10%);
      color: hsl(from var(--primary-color) h s 90%);
      
      &:hover {
        background: hsl(from var(--primary-color) h s 20%);
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
    color: hsl(from var(--primary-color) h s 20%);

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 80%);
    }
  }
  
  p {
    margin-bottom: 2rem;
    color: hsl(from var(--primary-color) h s 40%);

    @media (prefers-color-scheme: dark) {
      color: hsl(from var(--primary-color) h s 60%);
    }
  }
}
</style>
