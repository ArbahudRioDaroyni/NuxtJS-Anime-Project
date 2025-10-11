<script setup lang="ts">
import type { CommandPaletteGroup }  from '@nuxt/ui'
import type { AnimeDetails } from '~/types/anime'
import type { ResponseType } from '~/types/database'
import { refDebounced } from '@vueuse/core'

const searchTerm = ref('')
const debouncedSearch = refDebounced(searchTerm, 500)

const toast = useToast()

const { data: responses, status } = await useFetch<ResponseType>('/api/anime/search', {
  key: 'command-palette-animes',
  params: {
    q: debouncedSearch,
    limit: 10,
    threshold: 0.4
  },
  dedupe: 'cancel',
  lazy: true
})

const formattedAnimes = computed(() => {
  const animes = responses.value?.data as AnimeDetails[] | undefined
  const message = responses.value?.message
  const items = animes?.map(anime => ({
    id: anime.id,
    label: anime.title_english || anime.title_romaji || 'Unknown Title',
    suffix: anime.title_romaji && anime.title_english ? anime.title_romaji : undefined,
    avatar: {
      src: anime.thumbnail_image_url || anime.medium_cover_image_url || anime.large_cover_image_url || '/image/image-230x345.webp'
    },
    to: `/${anime.slug}`
  })) || []
  const searchSuggestions = searchTerm.value
    ? responses.value?.meta?.searchSuggestions?.map((suggestion: string) => ({
      id: suggestion,
      label: suggestion,
      icon: 'i-lucide-search',
      onSelect() {
        toast.add({ title: 'Add new file' })
        searchTerm.value = suggestion
        console.log('Selected suggestion:', searchTerm.value)
      }
    }))
    : []

  return [
    {
      id: 'suggestions',
      label: searchTerm.value ? 'Did you mean?' : 'Search Suggestions',
      items: searchSuggestions,
      ignoreFilter: true
    },
    {
      id: 'animes',
      label: searchTerm.value ? message : 'Animes',
      items: items,
      ignoreFilter: true
    }
  ] as CommandPaletteGroup[]
})
</script>

<template>
  <UModal>
    <UButton icon="i-lucide-search" size="md" color="neutral" variant="ghost" />

    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="formattedAnimes"
        placeholder="Search animes..."
        class="max-h-3/5"
      >
        <template #footer>
          <div class="flex items-center justify-between gap-2">
            <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-dimmed ml-1" />
            <div class="flex items-center gap-1">
              <UButton color="neutral" variant="ghost" label="Open Command" class="text-dimmed" size="xs">
                <template #trailing>
                  <UKbd value="enter" />
                </template>
              </UButton>
              <USeparator orientation="vertical" class="h-4" />
              <UButton color="neutral" variant="ghost" label="Actions" class="text-dimmed" size="xs">
                <template #trailing>
                  <UKbd value="meta" />
                  <UKbd value="k" />
                </template>
              </UButton>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>