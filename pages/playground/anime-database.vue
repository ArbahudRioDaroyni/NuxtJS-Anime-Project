<template>
  <UContainer>
    <div class="py-8 space-y-6">
      <h1 class="text-3xl font-bold mb-6">
        Anime Database Playground
      </h1>

      <!-- Load Options -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            📦 Load Options
          </h2>
        </template>

        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UButton 
              label="Load All Data (Merged)" 
              color="primary"
              :loading="loadingAll"
              @click="loadAllData"
            />
            <UButton
              v-for="i in 50"
              :key="i"
              :label="`Load Part ${i}`"
              color="secondary"
              :loading="loadingPart === i"
              @click="loadPart(i)"
            />
          </div>

          <div v-if="currentData" class="space-y-2">
            <UBadge 
              :label="`✅ Data Loaded: ${currentData.length} items`" 
              color="success"
              variant="soft"
              size="lg"
            />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Check browser console for full data
            </p>
          </div>
        </div>
      </UCard>

      <!-- Stats -->
      <UCard v-if="currentData">
        <template #header>
          <h2 class="text-xl font-semibold">
            📊 Database Statistics
          </h2>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary">
              {{ currentData.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total Items
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-secondary">
              {{ loadedPart || 'All' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Current Part
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-success">
              {{ metadata?.totalParts || 50 }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total Parts
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-info">
              {{ (currentData.length / 1000).toFixed(1) }}k
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Items (K)
            </div>
          </div>
        </div>
      </UCard>

      <!-- Preview First 5 Items -->
      <UCard v-if="currentData && currentData.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold">
            👀 Preview (First 5 Items)
          </h2>
        </template>

        <div class="space-y-3">
          <div 
            v-for="(item, index) in currentData.slice(0, 5)" 
            :key="index"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <pre class="text-sm">{{ JSON.stringify(item, null, 2) }}</pre>
          </div>
        </div>
      </UCard>

      <!-- List of All Titles And Slugs -->
      <UCard v-if="listAllTitlesAndSlugs">
        <template #header>
          <h2 class="text-xl font-semibold">
            📝 All Titles And Slug
          </h2>
        </template>

        <div class="p-4">
          <ul class="list-disc list-inside text-sm">
            <li 
              v-for="(entry, index) in listAllTitlesAndSlugs" 
              :key="index"
            >
              {{ entry.title }} - {{ entry.slug }}
            </li>
          </ul>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
interface Metadata {
  totalParts?: number
  partNumber?: number
  itemsInPart?: number
}
interface ApiResponse {
  data: unknown[]
  metadata: Metadata
  parts?: number
}
interface AnimeDatabaseItem {
  slug?: string
  title?: string
  type?: string
  episodes?: number
  status?: string
  animeSeason?: {
    season?: string
    year?: number
  }
  picture?: string
  thumbnail?: string
  duration?: {
    value?: number
    unit?: string
  }
  score?: {
    arithmeticGeometricMean?: number
    arithmeticMean?: number
    median?: number
  }
  synonyms?: string[]
  relatedAnime?: string[]
  tags?: string[]
}

const currentData = ref<unknown[] | null>(null)
const loadingAll = ref(false)
const loadingPart = ref<number | null>(null)
const loadedPart = ref<number | null>(null)
const metadata = ref<Metadata>({})
const listAllTitlesAndSlugs = ref<AnimeDatabaseItem[]>([])

async function loadAllData() {
  loadingAll.value = true
  loadedPart.value = null
  
  try {
    const response = await $fetch<ApiResponse>('/api/anime-database')
    currentData.value = response.data
    metadata.value = { totalParts: response.parts }
    console.log('📦 All Anime Database (Merged):', response)
  } catch (error) {
    console.error('Error loading all data:', error)
  } finally {
    loadingAll.value = false
  }
}

async function loadPart(part: number) {
  loadingPart.value = part
  loadedPart.value = part
  
  try {
    const response = await $fetch<ApiResponse>(`/api/anime-database?part=${part}`)
    currentData.value = response.data
    metadata.value = response.metadata
    console.log(`📦 Anime Database Part ${part}:`, response)
    listAllTitlesAndSlugs.value = response.data
      .slice(0, 10)
      .map(item => {
        const entry = item as AnimeDatabaseItem
        const rawSlug = `${entry.title || ''} ${entry.type || ''} ${entry.animeSeason?.year ?? ''}`
        const slug = rawSlug
          .toString()
          .toLowerCase()
          .trim()
          .replace(/&/g, 'and')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-!.]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/^-|-$/g, '')
        return {
          title: entry.title || 'Unknown Title',
          slug: slug,
          type: entry.type || 'Unknown Type',
          episodes: entry.episodes || 0,
        }
      })
  } catch (error) {
    console.error(`Error loading part ${part}:`, error)
  } finally {
    loadingPart.value = null
  }
}

definePageMeta({
  layout: 'blank',
})
</script>