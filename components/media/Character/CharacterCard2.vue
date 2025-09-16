<script setup lang="ts">
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'

interface Props {
  character: AnimeCharacterVoiceActorRelation
  variant?: 'default' | 'compact' | 'detailed'
  showVoiceActor?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showVoiceActor: true,
  clickable: true
})

const emit = defineEmits<{
  click: [character: AnimeCharacterVoiceActorRelation]
  voiceActorClick: [voiceActor: AnimeCharacterVoiceActorRelation['voice_actor']]
}>()

const characterImage = computed(() => 
  props.character.character?.large_image_url || 
  props.character.character?.medium_image_url ||
  '/image/character-placeholder.jpg'
)

const voiceActorImage = computed(() => 
  props.character.voice_actor?.large_image_url ||
  props.character.voice_actor?.medium_image_url ||
  '/image/staff-placeholder.jpg'
)

const characterName = computed(() => 
  props.character.character?.name || 'Unknown Character'
)

const voiceActorName = computed(() => 
  props.character.voice_actor?.name || 'Unknown Voice Actor'
)

const handleCharacterClick = () => {
  if (props.clickable) {
    emit('click', props.character)
  }
}

const handleVoiceActorClick = (event: Event) => {
  event.stopPropagation()
  if (props.clickable && props.character.voice_actor) {
    emit('voiceActorClick', props.character.voice_actor)
  }
}

const getRoleColor = (role?: string) => {
  switch (role?.toLowerCase()) {
    case 'main': return 'var(--role-main, #3b82f6)'
    case 'supporting': return 'var(--role-supporting, #10b981)'
    case 'background': return 'var(--role-background, #6b7280)'
    default: return 'var(--role-default, #8b5cf6)'
  }
}
</script>

<template>
  <div 
    :class="[
      'character-card',
      `character-card--${variant}`,
      { 'character-card--clickable': clickable }
    ]"
    @click="handleCharacterClick"
  >
    <!-- Character Side -->
    <div class="character-side">
      <div class="character-image">
        <BaseImageResponsive
          :src="characterImage"
          :alt="characterName"
          :width="variant === 'compact' ? 60 : 80"
          :height="variant === 'compact' ? 80 : 120"
          class="character-img"
          loading="lazy"
        />
        
        <!-- Role Badge -->
        <div 
          v-if="character.character_role"
          class="role-badge"
          :style="{ backgroundColor: getRoleColor(character.character_role) }"
        >
          {{ character.character_role }}
        </div>
      </div>
      
      <div class="character-info">
        <h3 class="character-name">{{ characterName }}</h3>
        <p v-if="character.character_role" class="character-role">
          {{ character.character_role }}
        </p>
      </div>
    </div>

    <!-- Voice Actor Side -->
    <div 
      v-if="showVoiceActor && character.voice_actor" 
      class="voice-actor-side"
      @click="handleVoiceActorClick"
    >
      <div class="voice-actor-info">
        <h4 class="voice-actor-name">{{ voiceActorName }}</h4>
        <p v-if="character.voice_actor?.language" class="voice-actor-language">
          {{ character.voice_actor.language }}
        </p>
      </div>
      
      <div class="voice-actor-image">
        <BaseImageResponsive
          :src="voiceActorImage"
          :alt="voiceActorName"
          :width="variant === 'compact' ? 60 : 80"
          :height="variant === 'compact' ? 80 : 120"
          class="voice-actor-img"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character-card {
  display: flex;
  background: var(--card-bg, #1a1a1a);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color, #2b2b2b);
  transition: all 0.2s ease;
  
  &--clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border-color: var(--border-hover, #404040);
    }
  }
  
  &--compact {
    .character-info,
    .voice-actor-info {
      padding: 0.5rem;
    }
    
    .character-name,
    .voice-actor-name {
      font-size: 0.875rem;
    }
  }
  
  &--detailed {
    flex-direction: column;
    
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }
}

.character-side,
.voice-actor-side {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  
  .character-card--compact & {
    padding: 0.5rem;
    gap: 0.5rem;
  }
}

.voice-actor-side {
  border-left: 1px solid var(--border-color, #2b2b2b);
  flex-direction: row-reverse;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover, rgba(255, 255, 255, 0.05));
  }
  
  .character-card--detailed & {
    border-left: none;
    border-top: 1px solid var(--border-color, #2b2b2b);
    
    @media (min-width: 768px) {
      border-top: none;
      border-left: 1px solid var(--border-color, #2b2b2b);
    }
  }
}

.character-image,
.voice-actor-image {
  position: relative;
  flex-shrink: 0;
}

.character-img,
.voice-actor-img {
  border-radius: 0.375rem;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.role-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  border-radius: 0.25rem;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.character-info,
.voice-actor-info {
  flex: 1;
  min-width: 0;
}

.character-name,
.voice-actor-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #ffffff);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  
  // Text truncation
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.character-role,
.voice-actor-language {
  font-size: 0.875rem;
  color: var(--text-secondary, #a1a1aa);
  margin: 0;
  text-transform: capitalize;
}

// Dark mode
@media (prefers-color-scheme: dark) {
  .character-card {
    --card-bg: #1a1a1a;
    --border-color: #2b2b2b;
    --border-hover: #404040;
    --bg-hover: rgba(255, 255, 255, 0.05);
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --role-main: #3b82f6;
    --role-supporting: #10b981;
    --role-background: #6b7280;
    --role-default: #8b5cf6;
  }
}

// Light mode
@media (prefers-color-scheme: light) {
  .character-card {
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --border-hover: #d1d5db;
    --bg-hover: rgba(0, 0, 0, 0.05);
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --role-main: #2563eb;
    --role-supporting: #059669;
    --role-background: #4b5563;
    --role-default: #7c3aed;
  }
}

// Responsive
@media (max-width: 480px) {
  .character-card {
    flex-direction: column;
  }
  
  .voice-actor-side {
    border-left: none;
    border-top: 1px solid var(--border-color, #2b2b2b);
    flex-direction: row;
  }
}
</style>