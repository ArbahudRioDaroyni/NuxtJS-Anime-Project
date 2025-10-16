<template>
  <V1Grid tag="ul" template="columns" length="400px">
    <h2 class="col-span-full text-2xl font-bold">Characters</h2>
    <UCard
      v-for="(item, index) in orderedCharacters"
      :key="`character-${index}`"
      :aria-label="`Anime character: ${item[0]?.name}, Role: ${item[0]?.character_role}, Voice actor: ${item[1]?.name}`"
      variant="neumorphic-outline"
      as="li"
      :ui="{ body: 'flex flex-row gap-4 h-full' }"
      class="hover:cursor-pointer transition duration-300 ease-in-out hover:translate-0.5"
    >
      <div
        class="basis-1/2 group flex flex-row gap-4 hover:cursor-pointer"
        @click="$router.push(item[0]?.slug || '#')"
      >
        <V1Image
          :src="item[0]?.image"
          :alt="item[0]?.name"
          :width="72"
          :height="88"
        />
        <div class="flex flex-col justify-between">
          <NuxtLink :to="item[0]?.slug" class="transition duration-300 ease-in-out group-hover:text-primary">
            {{ item[0]?.name }}
          </NuxtLink>
          <UBadge
            :label="item[0]?.character_role"
            :color="getGradientBadgeColor(item[0]?.character_role || '')"
            variant="solid"
            size="md"
          />
        </div>
      </div>
      <div
        class="basis-1/2 group flex flex-row-reverse gap-4 hover:cursor-pointer"
        @click="$router.push(item[1]?.slug || '#')"
      >
        <V1Image
          :src="item[1]?.image"
          :alt="item[1]?.name"
          :width="72"
          :height="88"
        />
        <div class="flex flex-col justify-between flex-end text-right">
          <NuxtLink :to="item[1]?.slug" class="transition duration-300 ease-in-out group-hover:text-primary">
            {{ item[1]?.name }}
          </NuxtLink>
          <span class="text-sm opacity-80">
            {{ item[1]?.subtitle }}
          </span>
        </div>
      </div>
    </UCard>
  </V1Grid>
</template>

<script setup lang="ts">
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeCharacterVoiceActorRelation[]
  countShow?: number
}>()

const getGradientBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'MAIN':
      return 'gradient-megatron'
    case 'SUPPORTING':
      return 'gradient-arctic'
    default:
      return 'gradient-cloudy'
  }
}

const orderedCharacters = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
      // Priority order: Main -> Supporting -> Other roles
      const roleOrder = {
        'Main': 1,
        'Supporting': 2,
        'Background': 3,
      }

      const aRole = a.character_role?.name || 'Other'
      const bRole = b.character_role?.name || 'Other'
      const aOrder = roleOrder[aRole as keyof typeof roleOrder] || 3
      const bOrder = roleOrder[bRole as keyof typeof roleOrder] || 3
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // If same role, sort by character name alphabetically
      const aName = a.character?.name || ''
      const bName = b.character?.name || ''
      return aName.localeCompare(bName)
    })
    .slice(0, props.countShow || Object.values(props.data).length)
    .map(relation => {
      const character = relation.character;
      const voiceActor = relation.voice_actor;
      return [
        {
          name: character?.name || 'Anonymous',
          image: character?.medium_image_url || '/image/image-230x345.webp',
          character_role: relation.character_role?.name || 'Not specified',
          slug: character?.id
            ? `/character/${character.id}-${character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
            : '#'
        },
        {
          id: voiceActor?.id,
          name: voiceActor?.name || 'Anonymous',
          image: voiceActor?.medium_image_url || '/image/image-230x345.webp',
          subtitle: voiceActor?.home_town?.split(',').at(-1)?.trim() || 'Unknown',
          slug: voiceActor?.id
            ? `/voice-actor/${voiceActor?.id}-${voiceActor?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
            : '#'
        }
      ];
    })
});
</script>