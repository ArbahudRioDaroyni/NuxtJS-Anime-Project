<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AnimeMetadata } from '~/types/metadata'

const open = ref(false)
const loading = ref(false)
const toast = useToast()

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Schema validation untuk anime
const schema = z.object({
  title_romaji: z.string().min(1, 'Title Romaji is required').max(255),
  title_english: z.string().min(1, 'Title English is required').max(255),
  title_native: z.string().max(255).optional(),
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
  genre_ids: z.array(z.number()).optional(),

  test: z
    .instanceof(File, {
      message: 'Please select an image file.'
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
    })
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height
              resolve(meetsDimensions)
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`
      }
    )
    .optional()
})

type Schema = z.output<typeof schema>

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
  genre_ids: [],
  test: undefined
})

type MetadataResponse = {
  data: AnimeMetadata[];
};

// Fetch metadata for dropdowns
const { data: metadata } = await useFetch<MetadataResponse>('/api/anime/metadata', {
  lazy: true
})

// function onCreate(items: any, value: any, item: string) {
//   items.value.push(item)

//   value.value = item
// }

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

const { data: countries, status, execute } = await useLazyFetch<{
  name: string
  code: string
  emoji: string
}[]>('/api/countries', {
  immediate: false
})

function onSelectCountryOpen() {
  if (!countries.value?.length) {
    execute()
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
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
              />
            </UFormField>

            <UFormField label="Release Format" name="release_format_id">
              <USelect
                v-model="state.release_format_id"
                :items="releaseFormatOptions"
                placeholder="Select format"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
              />
            </UFormField>

            <UFormField label="Status" name="release_status_type_id">
              <USelect
                v-model="state.release_status_type_id"
                :items="statusTypeOptions"
                placeholder="Select status"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
              />
            </UFormField>

            <UFormField label="Source" name="source_media_type_id">
              <USelect
                v-model="state.source_media_type_id"
                :items="mediaTypeOptions"
                placeholder="Select source"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
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
              <UInputNumber
                v-model="state.episodes"
                :min=0
                placeholder="e.g., 12"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Origin (Country Code)" name="origin">
              <USelectMenu
                v-model="state.origin"
                :items="countries"
                :loading="status === 'pending'"
                label-key="name"
                value-key="code"
                label-
                :search-input="{ icon: 'i-lucide-search' }"
                placeholder="Select country"
                class="w-full"
                @update:open="onSelectCountryOpen"
              >
                <template #leading="{ modelValue, ui }">
                  <span v-if="modelValue" class="size-5 text-center">
                    {{ modelValue }}
                  </span>
                  <UIcon v-else name="i-lucide-earth" :class="ui.leadingIcon()" />
                </template>
                <template #item-leading="{ item }">
                  <span class="size-5 text-center">
                    {{ item.emoji }}
                  </span>
                </template>
              </USelectMenu>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Duration" name="duration">
              <UInputNumber
                v-model="state.duration"
                :min=0
                placeholder="e.g., 24"
                class="w-full"
                :format-options="{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                  roundingPriority: 'morePrecision'
                }"
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
                create-item
                multiple
                virtualize
                value-key="value"
                placeholder="Select studios"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
                @create="console.log('studioOptions', studioOptions, 'state.studio_ids', state.studio_ids, '$event', $event)"
                @change="console.log(state.studio_ids)"
              />
            </UFormField>

            <UFormField label="Genres" name="genre_ids">
              <USelect
                v-model="state.genre_ids"
                :items="genreOptions"
                multiple
                placeholder="Select genres"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
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
            <!-- <UFormField name="test" label="test" description="JPG, GIF or PNG. 2MB Max.">
              <UFileUpload v-model="state.test" accept="image/*" class="min-h-48" />
            </UFormField> -->
          </div>
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