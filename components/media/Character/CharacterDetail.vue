<script setup lang="ts">
import type { Character } from '~/types/metadata'

interface Props {
  character?: Character | null
  loading?: boolean
}

const props = defineProps<Props>()

const characterImage = computed(() => 
  props.character?.large_image_url ||
  props.character?.medium_image_url ||
  '/image/character-placeholder.jpg'
)

const characterName = computed(() => 
  props.character?.name || 'Unknown Character'
)

const alternativeNames = computed(() => 
  props.character?.name_native || 'Unknown'
)

const description = computed(() => {
  if (!props.character?.description) return ''
  
  // Strip HTML tags and clean up description
  return props.character.description
    .replace(/<[^>]*>/g, '')
    .replace(/\n\n+/g, '\n\n')
    .trim()
})

const characterStats = computed(() => ({
  favorites: props.character?.favorites || 0,
  age: props.character?.age,
  gender: props.character?.gender,
  birthDate: props.character?.date_of_birth
}))

const formattedBirthDate = computed(() => {
  if (!characterStats.value.birthDate) return null
  
  try {
    return new Date(characterStats.value.birthDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return characterStats.value.birthDate
  }
})
</script>

<template>
  <div class="character-detail">
    <!-- Loading State -->
    <div v-if="loading" class="character-loading">
      <div class="character-skeleton-header">
        <div class="skeleton-image" />
        <div class="skeleton-info">
          <div class="skeleton-title" />
          <div class="skeleton-subtitle" />
          <div class="skeleton-stats" />
        </div>
      </div>
      <div class="skeleton-description" />
    </div>

    <!-- Character Content -->
    <div v-else-if="character" class="character-content">
      <!-- Character Header -->
      <header class="character-header">
        <div class="character-image-container">
          <BaseImageResponsive
            :src="characterImage"
            :alt="characterName"
            :width="300"
            :height="400"
            class="character-image"
            loading="eager"
          />
        </div>

        <div class="character-info">
          <!-- Name -->
          <div class="name-section">
            <h1 class="character-name">{{ characterName }}</h1>
            
            <!-- Alternative Names -->
            <div v-if="alternativeNames.length" class="alternative-names">
              <span 
                v-for="(name, index) in alternativeNames" 
                :key="index"
                class="alt-name"
              >
                {{ name }}
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="character-stats">
            <div v-if="characterStats.favorites" class="stat-item">
              <Icon name="mdi:heart" class="stat-icon" />
              <span class="stat-label">Favorites:</span>
              <span class="stat-value">{{ characterStats.favorites.toLocaleString() }}</span>
            </div>

            <div v-if="characterStats.age" class="stat-item">
              <Icon name="mdi:calendar" class="stat-icon" />
              <span class="stat-label">Age:</span>
              <span class="stat-value">{{ characterStats.age }}</span>
            </div>

            <div v-if="characterStats.gender" class="stat-item">
              <Icon name="mdi:human-male-female" class="stat-icon" />
              <span class="stat-label">Gender:</span>
              <span class="stat-value">{{ characterStats.gender }}</span>
            </div>

            <div v-if="formattedBirthDate" class="stat-item">
              <Icon name="mdi:cake-variant" class="stat-icon" />
              <span class="stat-label">Birth Date:</span>
              <span class="stat-value">{{ formattedBirthDate }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Character Description -->
      <section v-if="description" class="character-description">
        <h2 class="section-title">About</h2>
        <div class="description-content">
          <p 
            v-for="(paragraph, index) in description.split('\n\n')" 
            :key="index"
            class="description-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- Character Media (Placeholder for future implementation) -->
      <section class="character-media">
        <h2 class="section-title">Appears In</h2>
        <div class="media-placeholder">
          <p class="placeholder-text">Media appearances will be displayed here</p>
        </div>
      </section>
    </div>

    <!-- Not Found State -->
    <div v-else class="character-not-found">
      <div class="not-found-icon">👤</div>
      <h2 class="not-found-title">Character Not Found</h2>
      <p class="not-found-text">The character you're looking for doesn't exist or has been removed.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header Section
.character-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
}

.character-image-container {
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    align-self: center;
  }
}

.character-image {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 300px;
  height: 400px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 333px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
    height: 267px;
  }
}

.character-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Name Section
.name-section {
  .character-name {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary, #ffffff);
    margin: 0 0 1rem 0;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 2rem;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
  
  .alternative-names {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
    
    .alt-name {
      padding: 0.25rem 0.75rem;
      background: var(--card-bg, #1a1a1a);
      color: var(--text-secondary, #a1a1aa);
      border: 1px solid var(--border-color, #2b2b2b);
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }
  }
}

// Stats Section
.character-stats {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-bg, #1a1a1a);
  border: 1px solid var(--border-color, #2b2b2b);
  border-radius: 0.5rem;
  
  .stat-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--primary-color, #3b82f6);
    flex-shrink: 0;
  }
  
  .stat-label {
    font-weight: 500;
    color: var(--text-secondary, #a1a1aa);
  }
  
  .stat-value {
    font-weight: 600;
    color: var(--text-primary, #ffffff);
    margin-left: auto;
  }
}

// Description Section
.character-description {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #ffffff);
  margin: 0 0 1.5rem 0;
  border-bottom: 2px solid var(--primary-color, #3b82f6);
  padding-bottom: 0.5rem;
}

.description-content {
  .description-paragraph {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary, #a1a1aa);
    margin: 0 0 1.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// Media Section (Placeholder)
.character-media {
  .media-placeholder {
    padding: 3rem;
    text-align: center;
    background: var(--card-bg, #1a1a1a);
    border: 2px dashed var(--border-color, #2b2b2b);
    border-radius: 0.75rem;
    
    .placeholder-text {
      color: var(--text-secondary, #a1a1aa);
      font-style: italic;
      margin: 0;
    }
  }
}

// Loading Skeletons
.character-loading {
  .character-skeleton-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }
  
  .skeleton-image {
    width: 300px;
    height: 400px;
    background: var(--skeleton-base, #2a2a2a);
    border-radius: 0.75rem;
    animation: skeleton-pulse 1.5s infinite;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 250px;
      height: 333px;
    }
  }
  
  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .skeleton-title {
    height: 3rem;
    background: var(--skeleton-base, #2a2a2a);
    border-radius: 0.5rem;
    animation: skeleton-pulse 1.5s infinite;
  }
  
  .skeleton-subtitle {
    height: 1.5rem;
    background: var(--skeleton-base, #2a2a2a);
    border-radius: 0.375rem;
    animation: skeleton-pulse 1.5s infinite;
    width: 60%;
  }
  
  .skeleton-stats {
    height: 8rem;
    background: var(--skeleton-base, #2a2a2a);
    border-radius: 0.5rem;
    animation: skeleton-pulse 1.5s infinite;
  }
  
  .skeleton-description {
    height: 200px;
    background: var(--skeleton-base, #2a2a2a);
    border-radius: 0.5rem;
    animation: skeleton-pulse 1.5s infinite;
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
}

// Not Found State
.character-not-found {
  text-align: center;
  padding: 4rem 2rem;
  
  .not-found-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .not-found-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary, #ffffff);
    margin: 0 0 1rem 0;
  }
  
  .not-found-text {
    color: var(--text-secondary, #a1a1aa);
    margin: 0;
  }
}

// Theme Support
@media (prefers-color-scheme: dark) {
  .character-detail {
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --primary-color: #3b82f6;
    --card-bg: #1a1a1a;
    --border-color: #2b2b2b;
    --skeleton-base: #2a2a2a;
  }
}

@media (prefers-color-scheme: light) {
  .character-detail {
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --primary-color: #2563eb;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --skeleton-base: #f3f4f6;
  }
}
</style>