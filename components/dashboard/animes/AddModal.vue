<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Schema validation untuk anime
const schema = z.object({
  title_romaji: z.string().min(1, 'Title Romaji is required').max(255),
  title_english: z.string().min(1, 'Title English is required').max(255),
  title_native: z.string().optional(),
  description: z.string().optional(),
  
  // Relations
  release_media_type_id: z.number().optional(),
  release_format_id: z.number().optional(),
  release_status_type_id: z.number().optional(),
  source_media_type_id: z.number().optional(),
  season_id: z.number().optional(),
  
  // Metadata
  year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits').optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  episodes: z.number().min(0).max(10000).optional(),
  duration: z.number().min(0).optional(),
  duration_unit: z.enum(['m', 'h', 's']).optional(),
  origin: z.string().max(2).optional(),
  
  // Images
  thumbnail_image_url: z.string().url().optional().or(z.literal('')),
  medium_cover_image_url: z.string().url().optional().or(z.literal('')),
  large_cover_image_url: z.string().url().optional().or(z.literal('')),
  banner_image_url: z.string().url().optional().or(z.literal('')),
  color_image: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  
  // Flags
  is_licensed: z.boolean().default(true),
  is_adult: z.boolean().default(false),
  
  // Many-to-many relations
  studio_ids: z.array(z.number()).optional(),
  genre_ids: z.array(z.number()).optional()
})

type Schema = z.output<typeof schema>

const open = ref(false)
const loading = ref(false)
const toast = useToast()

// State form
const state = reactive<Partial<Schema>>({
  title_romaji: undefined,
  title_english: undefined,
  title_native: undefined,
  description: undefined,
  release_media_type_id: undefined,
  release_format_id: undefined,
  release_status_type_id: undefined,
  source_media_type_id: undefined,
  season_id: undefined,
  year: undefined,
  start_date: undefined,
  end_date: undefined,
  episodes: undefined,
  duration: undefined,
  duration_unit: 'm',
  origin: undefined,
  thumbnail_image_url: undefined,
  medium_cover_image_url: undefined,
  large_cover_image_url: undefined,
  banner_image_url: undefined,
  color_image: undefined,
  is_licensed: true,
  is_adult: false,
  studio_ids: [],
  genre_ids: []
})

// Define the expected metadata type
type AnimeMetadata = {
  mediaTypes: { id: number; name: string }[];
  releaseFormats: { id: number; name: string; stands_for?: string }[];
  statusTypes: { id: number; name: string }[];
  seasons: { id: number; name: string }[];
  studios: { id: number; name: string }[];
  genres: { id: number; name: string }[];
};

type MetadataResponse = {
  data: AnimeMetadata[];
};

// Fetch metadata for dropdowns
const { data: metadata } = await useFetch<MetadataResponse>('/api/anime/metadata', {
  lazy: true
})


// Computed options for dropdowns
const mediaTypeOptions = computed(() => 
  metadata.value?.data[0]?.mediaTypes?.map(item => ({
    label: item.name,
    value: item.id
  })) || []
)

const releaseFormatOptions = computed(() => 
  metadata.value?.data[0]?.releaseFormats?.map(item => ({
    label: item.stands_for ? `${item.name} (${item.stands_for})` : item.name,
    value: item.id
  })) || []
)

const statusTypeOptions = computed(() => 
  metadata.value?.data[0]?.statusTypes?.map(item => ({
    label: item.name,
    value: item.id
  })) || []
)

const seasonOptions = computed(() => 
  metadata.value?.data[0]?.seasons?.map(item => ({
    label: item.name,
    value: item.id
  })) || []
)

const studioOptions = computed(() => 
  metadata.value?.data[0]?.studios?.map(item => ({
    label: item.name,
    value: item.id
  })) || []
)

const genreOptions = computed(() => 
  metadata.value?.data[0]?.genres?.map(item => ({
    label: item.name,
    value: item.id
  })) || []
)

const durationUnitOptions = [
  { label: 'Minutes', value: 'm' },
  { label: 'Hours', value: 'h' },
  { label: 'Seconds', value: 's' }
]

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  
  try {
    const response = await $fetch('/api/anime/store', {
      method: 'POST',
      body: event.data
    })
    
    if (response.success) {
      toast.add({ 
        title: 'Success', 
        description: `Anime "${event.data.title_english}" berhasil ditambahkan`, 
        color: 'success' 
      })
      
      // Reset form
      Object.keys(state).forEach((key) => {
        const typedKey = key as keyof Schema
        if (typedKey === 'is_licensed') state[typedKey] = true
        else if (typedKey === 'is_adult') state[typedKey] = false
        else if (typedKey === 'duration_unit') state[typedKey] = 'm'
        else if (typedKey === 'studio_ids' || typedKey === 'genre_ids') state[typedKey] = []
        else state[typedKey] = undefined
      })
      
      open.value = false
      
      // Refresh page atau emit event untuk refresh list
      await refreshNuxtData('animes')
    } else {
      toast.add({ 
        title: 'Error', 
        description: response.message || 'Failed to create anime', 
        color: 'error' 
      })
    }
  } catch (error) {
    toast.add({ 
      title: 'Error', 
      description: error instanceof Error ? error.message : 'An error occurred', 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Add New Anime" description="Add a new anime to the database">
    <UButton label="Add Anime" icon="i-lucide-plus" color="primary" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- Basic Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h3>
          
          <div class="grid grid-cols-1 gap-4">
            <UFormField label="Title Romaji" name="title_romaji" required>
              <UInput 
                v-model="state.title_romaji" 
                placeholder="e.g., Shingeki no Kyojin"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Title English" name="title_english" required>
              <UInput 
                v-model="state.title_english" 
                placeholder="e.g., Attack on Titan"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Title Native" name="title_native">
              <UInput 
                v-model="state.title_native" 
                placeholder="e.g., 進撃の巨人"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Description" name="description">
              <UTextarea 
                v-model="state.description" 
                placeholder="Enter anime description..."
                :rows="4"
                class="w-full" 
              />
            </UFormField>
          </div>
        </div>

        <!-- Media Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Media Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Media Type" name="release_media_type_id">
              <USelect
                v-model="state.release_media_type_id"
                :items="mediaTypeOptions"
                placeholder="Select media type"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Release Format" name="release_format_id">
              <USelect
                v-model="state.release_format_id"
                :items="releaseFormatOptions"
                placeholder="Select format"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Status" name="release_status_type_id">
              <USelect
                v-model="state.release_status_type_id"
                :items="statusTypeOptions"
                placeholder="Select status"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Source" name="source_media_type_id">
              <USelect
                v-model="state.source_media_type_id"
                :items="mediaTypeOptions"
                placeholder="Select source"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- Release Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Release Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Year" name="year">
              <UInput 
                v-model="state.year" 
                placeholder="e.g., 2024"
                maxlength="4"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Season" name="season_id">
              <USelect
                v-model="state.season_id"
                :items="seasonOptions"
                placeholder="Select season"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Start Date" name="start_date">
              <UInput 
                v-model="state.start_date" 
                type="date"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="End Date" name="end_date">
              <UInput 
                v-model="state.end_date" 
                type="date"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Episodes" name="episodes">
              <UInput 
                v-model.number="state.episodes" 
                type="number"
                min="0"
                placeholder="e.g., 12"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Origin (Country Code)" name="origin">
              <UInput 
                v-model="state.origin" 
                placeholder="e.g., JP"
                maxlength="2"
                class="w-full" 
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Duration" name="duration">
              <UInput 
                v-model.number="state.duration" 
                type="number"
                min="0"
                placeholder="e.g., 24"
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Duration Unit" name="duration_unit">
              <USelect
                v-model="state.duration_unit"
                :items="durationUnitOptions"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- Relations -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Relations
          </h3>
          
          <div class="grid grid-cols-1 gap-4">
            <UFormField label="Studios" name="studio_ids">
              <USelectMenu
                v-model="state.studio_ids"
                :items="studioOptions"
                value-attribute="value"
                multiple
                placeholder="Select studios"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Genres" name="genre_ids">
              <USelectMenu
                v-model="state.genre_ids"
                :items="genreOptions"
                value-attribute="value"
                track-by="value"
                multiple
                placeholder="Select genres"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- Images -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Images & Media
          </h3>
          
          <div class="grid grid-cols-1 gap-4">
            <UFormField label="Thumbnail Image URL" name="thumbnail_image_url">
              <UInput 
                v-model="state.thumbnail_image_url" 
                type="url"
                placeholder="https://..."
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Medium Cover Image URL" name="medium_cover_image_url">
              <UInput 
                v-model="state.medium_cover_image_url" 
                type="url"
                placeholder="https://..."
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Large Cover Image URL" name="large_cover_image_url">
              <UInput 
                v-model="state.large_cover_image_url" 
                type="url"
                placeholder="https://..."
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Banner Image URL" name="banner_image_url">
              <UInput 
                v-model="state.banner_image_url" 
                type="url"
                placeholder="https://..."
                class="w-full" 
              />
            </UFormField>

            <UFormField label="Color (Hex)" name="color_image">
              <UInput 
                v-model="state.color_image" 
                placeholder="#FFFFFF"
                maxlength="7"
                class="w-full" 
              />
            </UFormField>
          </div>
        </div>

        <!-- Flags -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
          
          <div class="flex gap-6">
            <UFormField name="is_licensed">
              <UCheckbox v-model="state.is_licensed" label="Licensed" />
            </UFormField>

            <UFormField name="is_adult">
              <UCheckbox v-model="state.is_adult" label="Adult Content (18+)" />
            </UFormField>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            :disabled="loading"
            @click="open = false"
          />
          <UButton
            label="Create Anime"
            color="primary"
            variant="solid"
            type="submit"
            :loading="loading"
            icon="i-lucide-save"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>