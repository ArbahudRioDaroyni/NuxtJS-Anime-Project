<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AnimeDetails } from '~/types/anime'

interface Props {
  anime: AnimeDetails
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<{
  close: []
  updated: [anime: AnimeDetails]
}>()

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
  thumbnail_image_url: z.string().optional().or(z.literal('')),
  medium_cover_image_url: z.string().optional().or(z.literal('')),
  large_cover_image_url: z.string().optional().or(z.literal('')),
  banner_image_url: z.string().optional().or(z.literal('')),
  color_image: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  
  // Flags
  is_licensed: z.boolean().default(true),
  is_adult: z.boolean().default(false),
  
  // Many-to-many relations
  studio_ids: z.array(z.number()).optional(),
  genre_ids: z.array(z.number()).optional()
})

type Schema = z.output<typeof schema>

const open = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) emit('close')
  }
})

const loading = ref(false)
const toast = useToast()

// State form - populate dengan data anime yang ada
const state = reactive<Partial<Schema>>({
  title_romaji: props.anime.title_romaji || undefined,
  title_english: props.anime.title_english || undefined,
  title_native: props.anime.title_native || undefined,
  description: props.anime.description || undefined,
  release_media_type_id: props.anime.release_media_type_id || undefined,
  release_format_id: props.anime.release_format_id || undefined,
  release_status_type_id: props.anime.release_status_type_id || undefined,
  source_media_type_id: props.anime.source_media_type_id || undefined,
  season_id: props.anime.season_id || undefined,
  year: props.anime.year?.toString() || undefined,
  start_date: props.anime.start_date || undefined,
  end_date: props.anime.end_date || undefined,
  episodes: props.anime.episodes || undefined,
  duration: props.anime.duration || undefined,
  duration_unit: (props.anime.duration_unit as 'm' | 'h' | 's') || 'm',
  origin: props.anime.origin || undefined,
  thumbnail_image_url: props.anime.thumbnail_image_url || undefined,
  medium_cover_image_url: props.anime.medium_cover_image_url || undefined,
  large_cover_image_url: props.anime.large_cover_image_url || undefined,
  banner_image_url: props.anime.banner_image_url || undefined,
  color_image: props.anime.color_image || undefined,
  is_licensed: props.anime.is_licensed ?? true,
  is_adult: props.anime.is_adult ?? false,
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

// Upload functions
async function uploadImage(file: File, type: string): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', type)
  
  const response = await $fetch<{ success: boolean; data: { url: string } }>('/api/upload/image', {
    method: 'POST',
    body: formData
  })
  
  if (response.success) {
    return response.data.url
  }
  throw new Error('Failed to upload image')
}

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
    const response = await $fetch<{ success: boolean; data: AnimeDetails; message?: string }>(`/api/anime/${props.anime.id}`, {
      method: 'PUT',
      body: event.data
    })
    
    if (response.success) {
      toast.add({ 
        title: 'Success', 
        description: `Anime "${event.data.title_english}" berhasil diupdate`, 
        color: 'success' 
      })
      
      emit('updated', response.data)
      emit('close')
      
      // Refresh data
      await refreshNuxtData('animes')
    } else {
      toast.add({ 
        title: 'Error', 
        description: response.message || 'Failed to update anime', 
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
  <UModal 
    v-model:open="open" 
    :title="`Edit Anime: ${anime.title_english || anime.title_romaji}`" 
    description="Update anime information"
    prevent-close
  >
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
              <USelect
                v-model="state.studio_ids"
                :items="studioOptions"
                multiple
                placeholder="Select studios"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Genres" name="genre_ids">
              <USelect
                v-model="state.genre_ids"
                :items="genreOptions"
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Thumbnail Image" name="thumbnail_image_url">
              <div class="space-y-2">
                <!-- Image Preview -->
                <div v-if="state.thumbnail_image_url" class="relative w-24 h-32 border rounded-lg overflow-hidden">
                  <img 
                    :src="state.thumbnail_image_url" 
                    alt="Thumbnail preview"
                    class="w-full h-full object-cover">
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    color="error"
                    variant="solid"
                    class="absolute top-1 right-1"
                    @click="state.thumbnail_image_url = undefined"
                  />
                </div>
                
                <UInput 
                  type="file" 
                  accept="image/*"
                  @change="async (event: Event) => {
                    const file = (event.target as HTMLInputElement).files?.[0]
                    if (file) {
                      try {
                        const url = await uploadImage(file, 'thumbnail')
                        state.thumbnail_image_url = url
                        toast.add({ title: 'Success', description: 'Thumbnail uploaded successfully', color: 'success' })
                      } catch (error) {
                        toast.add({ title: 'Error', description: 'Failed to upload thumbnail', color: 'error' })
                      }
                    }
                  }"
                />
                <UInput 
                  v-model="state.thumbnail_image_url" 
                  type="url"
                  placeholder="Or paste URL..."
                  class="w-full" 
                />
              </div>
            </UFormField>

            <UFormField label="Medium Cover Image" name="medium_cover_image_url">
              <div class="space-y-2">
                <!-- Image Preview -->
                <div v-if="state.medium_cover_image_url" class="relative w-24 h-32 border rounded-lg overflow-hidden">
                  <img 
                    :src="state.medium_cover_image_url" 
                    alt="Medium cover preview"
                    class="w-full h-full object-cover">
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    color="error"
                    variant="solid"
                    class="absolute top-1 right-1"
                    @click="state.medium_cover_image_url = undefined"
                  />
                </div>
                
                <UInput 
                  type="file" 
                  accept="image/*"
                  @change="async (event: Event) => {
                    const file = (event.target as HTMLInputElement).files?.[0]
                    if (file) {
                      try {
                        const url = await uploadImage(file, 'medium_cover')
                        state.medium_cover_image_url = url
                        toast.add({ title: 'Success', description: 'Medium cover uploaded successfully', color: 'success' })
                      } catch (error) {
                        toast.add({ title: 'Error', description: 'Failed to upload medium cover', color: 'error' })
                      }
                    }
                  }"
                />
                <UInput 
                  v-model="state.medium_cover_image_url" 
                  type="url"
                  placeholder="Or paste URL..."
                  class="w-full" 
                />
              </div>
            </UFormField>

            <UFormField label="Large Cover Image" name="large_cover_image_url">
              <div class="space-y-2">
                <!-- Image Preview -->
                <div v-if="state.large_cover_image_url" class="relative w-24 h-32 border rounded-lg overflow-hidden">
                  <img 
                    :src="state.large_cover_image_url" 
                    alt="Large cover preview"
                    class="w-full h-full object-cover">
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    color="error"
                    variant="solid"
                    class="absolute top-1 right-1"
                    @click="state.large_cover_image_url = undefined"
                  />
                </div>
                
                <UInput 
                  type="file" 
                  accept="image/*"
                  @change="async (event: Event) => {
                    const file = (event.target as HTMLInputElement).files?.[0]
                    if (file) {
                      try {
                        const url = await uploadImage(file, 'large_cover')
                        state.large_cover_image_url = url
                        toast.add({ title: 'Success', description: 'Large cover uploaded successfully', color: 'success' })
                      } catch (error) {
                        toast.add({ title: 'Error', description: 'Failed to upload large cover', color: 'error' })
                      }
                    }
                  }"
                />
                <UInput 
                  v-model="state.large_cover_image_url" 
                  type="url"
                  placeholder="Or paste URL..."
                  class="w-full" 
                />
              </div>
            </UFormField>

            <UFormField label="Banner Image" name="banner_image_url">
              <div class="space-y-2">
                <!-- Image Preview -->
                <div v-if="state.banner_image_url" class="relative w-full h-20 border rounded-lg overflow-hidden">
                  <img 
                    :src="state.banner_image_url" 
                    alt="Banner preview"
                    class="w-full h-full object-cover">
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    color="error"
                    variant="solid"
                    class="absolute top-1 right-1"
                    @click="state.banner_image_url = undefined"
                  />
                </div>
                
                <UInput 
                  type="file" 
                  accept="image/*"
                  @change="async (event: Event) => {
                    const file = (event.target as HTMLInputElement).files?.[0]
                    if (file) {
                      try {
                        const url = await uploadImage(file, 'banner')
                        state.banner_image_url = url
                        toast.add({ title: 'Success', description: 'Banner uploaded successfully', color: 'success' })
                      } catch (error) {
                        toast.add({ title: 'Error', description: 'Failed to upload banner', color: 'error' })
                      }
                    }
                  }"
                />
                <UInput 
                  v-model="state.banner_image_url" 
                  type="url"
                  placeholder="Or paste URL..."
                  class="w-full" 
                />
              </div>
            </UFormField>
          </div>

          <UFormField label="Color (Hex)" name="color_image">
            <UInput 
              v-model="state.color_image" 
              placeholder="#FFFFFF"
              maxlength="7"
              class="w-full" 
            />
          </UFormField>
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
            @click="emit('close')"
          />
          <UButton
            label="Update Anime"
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