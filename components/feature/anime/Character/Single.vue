<template>
  <BaseCardTwin
    :left-item="leftItem"
    :right-item="rightItem"
    :aria-label="`Anime character: ${leftItem.name}, Voice Actor: ${rightItem.name}`"
    @left-click="handleCharacterClick"
    @right-click="handleVoiceActorClick"
  />
</template>

<script setup lang="ts">
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeCharacterVoiceActorRelation | null
}>()

// Transform data for DualCard component
const leftItem = computed(() => ({
  id: props.data?.character?.id,
  name: props.data?.character?.name,
  image: props.data?.character?.medium_image_url,
  subtitle: '',
  slug: generateCharacterSlug(),
  badge: {
    text: props.data?.character_role?.name,
    variant: getBadgeVariant(props.data?.character_role?.name)
  },
  link: generateCharacterSlug()
    ? { to: `${generateCharacterSlug()}` }
    : undefined
}))

const rightItem = computed(() => ({
  id: props.data?.voice_actor?.id,
  name: props.data?.voice_actor?.name,
  image: props.data?.voice_actor?.medium_image_url,
  subtitle: getLocationFromHometown(props.data?.voice_actor?.home_town),
  slug: generateVoiceActorSlug(),
  link: generateVoiceActorSlug()
    ? { to: `${generateVoiceActorSlug()}` }
    : undefined
}))

// Helper functions
function generateCharacterSlug(): string | null {
  if (!props.data?.character?.id || !props.data?.character?.name) return null
  return '/character/'+generateSlug(props.data.character.name, props.data.character.id)
}

function generateVoiceActorSlug(): string | null {
  if (!props.data?.voice_actor?.id || !props.data?.voice_actor?.name) return null
  return '/staff/'+generateSlug(props.data.voice_actor.name, props.data.voice_actor.id)
}

function generateSlug(name: string, id: number): string {
  return `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

function getLocationFromHometown(hometown?: string): string {
  if (!hometown) return 'Unknown'
  return hometown.split(',').at(-1)?.trim() || 'Unknown'
}

function getBadgeVariant(role?: string): string {
  if (!role) return 'arctic'
  
  const roleMap = {
    MAIN: 'oceanic',
    SUPPORTING: 'megatron', 
    BACKGROUND: 'tranquil'
  } as const
  
  return roleMap[role.toUpperCase() as keyof typeof roleMap] || 'arctic'
}

// Event handlers
const handleCharacterClick = (item: unknown) => {
  // Handle character click
  console.log('Character clicked:', item)
}

const handleVoiceActorClick = (item: unknown) => {
  // Handle voice actor click
  console.log('Voice actor clicked:', item)
}
</script>