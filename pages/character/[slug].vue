<script setup lang="ts">
// Extract ID and name from slug (format: id-name)
const route = useRoute()
const slug = route.params.slug as string

// Parse slug to get character ID
const characterId = computed(() => {
  const parts = slug.split('-')
  return parts[0] ? parseInt(parts[0]) : null
})

// SEO Meta
useSeoMeta({
  title: `Character Details - AniWorld`,
  description: 'View detailed information about this anime character'
})

// Fetch character data
const { data: character, pending, error } = await useLazyFetch(`/api/character/${characterId.value}`, {
  key: `character-${characterId.value}`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'Character not found', data: null })
})

// Handle not found
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Character not found'
  })
}

// Computed SEO meta - better than watchEffect
const seoTitle = computed(() => {
  if (character.value && 'name' in character.value) {
    return `${character.value.name} - Character Details`
  }
  return 'Character Details - AniWorld'
})

const seoDescription = computed(() => {
  if (character.value && 'name' in character.value) {
    return `View detailed information about ${character.value.name}, an anime character`
  }
  return 'View detailed information about this anime character'
})

// Update SEO meta reactively
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription
})
</script>

<template>
  <div class="character-detail-page">
    <!-- Loading State -->
    <div v-if="pending" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading character details...</p>
      </div>
    </div>

    <!-- Character Details -->
    <div v-else-if="character && 'name' in character" class="character-content">
      <!-- Header Section -->
      <section class="character-header">
        <div class="character-image">
          <BaseImageClickable
            :src="character.image || '/image/image-230x345.webp'"
            :alt="character.name"
            :width="300"
            :height="450"
            :enable-preview="true"
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
            <div v-if="character.birth_date" class="stat-item">
              <span class="stat-label">Birthday:</span>
              <span class="stat-value">{{ character.birth_date }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Description Section -->
      <section v-if="character.description" class="character-description">
        <h2>Description</h2>
        <div class="description-content" v-html="character.description"></div>
      </section>

      <!-- Anime Appearances -->
      <section v-if="character.anime_appearances?.length" class="anime-appearances">
        <h2>Anime Appearances</h2>
        <div class="anime-grid">
          <div 
            v-for="appearance in character.anime_appearances" 
            :key="appearance.anime.id"
            class="anime-card"
          >
            <NuxtLink :to="`/anime/${appearance.anime.id}`">
              <BaseImageClickable
                :src="appearance.anime.image"
                :alt="appearance.anime.title"
                :width="150"
                :height="200"
              />
              <div class="anime-info">
                <h3>{{ appearance.anime.title }}</h3>
                <span class="character-role">{{ appearance.role }}</span>
                <span v-if="appearance.anime.year" class="anime-year">{{ appearance.anime.year }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Voice Actors -->
      <section v-if="character.voice_actors?.length" class="voice-actors">
        <h2>Voice Actors</h2>
        <div class="voice-actors-grid">
          <div 
            v-for="va in character.voice_actors" 
            :key="va.id"
            class="voice-actor-card"
          >
            <NuxtLink :to="`/staff/${va.id}-${va.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`">
              <BaseImageClickable
                :src="va.image"
                :alt="va.name"
                :width="100"
                :height="150"
              />
              <div class="va-info">
                <h3>{{ va.name }}</h3>
                <span class="va-language">{{ va.language }}</span>
                <span v-if="va.hometown" class="va-hometown">{{ va.hometown }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Back Link -->
      <div class="back-link">
        <NuxtLink to="/" class="btn-back">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <div class="error-content">
        <h2>Character Not Found</h2>
        <p>The character you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/" class="btn-back">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-level-80);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  p {
    color: var(--color-level-40);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  min-width: 80px;

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

// Anime Appearances
.anime-appearances,
.voice-actors {
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: var(--color-level-10);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.anime-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  a {
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.anime-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-level-10);
    margin: 0;

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }
}

.character-role,
.anime-year {
  font-size: 0.75rem;
  color: var(--color-level-40);
  text-transform: capitalize;

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-60);
  }
}

// Voice Actors
.voice-actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
}

.voice-actor-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  a {
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.va-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-level-10);
    margin: 0;

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
    }
  }
}

.va-language,
.va-hometown {
  font-size: 0.75rem;
  color: var(--color-level-40);

  @media (prefers-color-scheme: dark) {
    color: var(--color-level-60);
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
