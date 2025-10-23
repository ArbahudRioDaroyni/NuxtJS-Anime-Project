<template>
  <div class="p-6 max-w-7xl mx-auto overflow-auto">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">
              Bulk Import Anime dari CSV
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              Upload CSV → Preview → Compare → Import
            </p>
          </div>
          <UBadge :color="stepColor" variant="subtle" size="lg">
            Step {{ currentStep }} / 4
          </UBadge>
        </div>
      </template>

      <!-- Step Progress -->
      <UContainer class="mb-8">
         <UTimeline orientation="horizontal" :default-value="currentStep-1" :items="items" class="w-full" />
      </UContainer>

      <!-- STEP 1: Upload CSV -->
      <div v-if="currentStep === 1" class="space-y-6">
        <UFileUpload
          v-model="newUploadedFile"
          layout="list"
          :multiple="false"
          label="Drop your CSV here"
          description="CSV files only (max. 10MB)"
          accept=".csv"
          :ui="{
            base: 'min-h-48'
          }"
        />

        <UButton
          v-if="newUploadedFile"
          color="primary"
          size="lg"
          :loading="isProcessing"
          @click="parseCSV"
        >
          <UIcon name="i-heroicons-arrow-right" class="mr-2" />
          Preview Data
        </UButton>
      </div>

      <!-- STEP 2: Preview CSV Data -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">
              Preview Data CSV
            </h3>
            <p class="text-sm text-gray-500">
              Total: {{ csvData.length }} records
            </p>
          </div>
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="currentStep = 1"
            >
              <UIcon name="i-heroicons-arrow-left" class="mr-2" />
              Back
            </UButton>
            <UButton
              color="primary"
              size="lg"
              :loading="isComparing"
              @click="compareWithDatabase"
            >
              <UIcon name="i-heroicons-arrow-right" class="mr-2" />
              Compare with Database
            </UButton>
          </div>
        </div>

        <!-- CSV Data Table -->
        <UTable sticky :data="csvData.slice(0, 50)" class="flex-1 max-h-[500px]" />
      </div>

      <!-- STEP 3: Compare with Database -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">
              Compare Data
            </h3>
            <p class="text-sm text-gray-500">
              {{ comparisonResult.newRecords }} baru • 
              {{ comparisonResult.existingRecords }} sudah ada
            </p>
          </div>
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="currentStep = 2"
            >
              <UIcon name="i-heroicons-arrow-left" class="mr-2" />
              Back
            </UButton>
            <UButton
              color="primary"
              size="lg"
              @click="startImport"
            >
              <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
              Start Import
            </UButton>
          </div>
        </div>

        <!-- Comparison Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ comparisonResult.newRecords }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                New Records
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">
                {{ comparisonResult.existingRecords }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Will Update
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">
                {{ csvData.length }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Total to Process
              </div>
            </div>
          </UCard>
        </div>

        <!-- Filter Options -->
        <div class="flex gap-2">
          <UButton
            :color="comparisonFilter === 'all' ? 'primary' : 'neutral'"
            :variant="comparisonFilter === 'all' ? 'solid' : 'soft'"
            @click="comparisonFilter = 'all'"
          >
            All ({{ csvData.length }})
          </UButton>
          <UButton
            :color="comparisonFilter === 'new' ? 'primary' : 'neutral'"
            :variant="comparisonFilter === 'new' ? 'solid' : 'soft'"
            @click="comparisonFilter = 'new'"
          >
            New Only ({{ comparisonResult.newRecords }})
          </UButton>
          <UButton
            :color="comparisonFilter === 'existing' ? 'primary' : 'neutral'"
            :variant="comparisonFilter === 'existing' ? 'solid' : 'soft'"
            @click="comparisonFilter = 'existing'"
          >
            Existing ({{ comparisonResult.existingRecords }})
          </UButton>
        </div>

        <RekaTableComparison
          :existing-data="existingAnimeData"
          :new-data="newAnimeData"
        />

        <!-- Comparison Table -->
        <!-- <div class="border rounded-lg overflow-hidden">
          <div class="overflow-x-auto max-h-[500px]">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">
                    Status
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">
                    Name (CSV)
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">
                    Name (DB)
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">
                    Episodes
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">
                    Score
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">
                    Changes
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                <tr 
                  v-for="(comparison, index) in filteredComparisons.slice(0, 50)" 
                  :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td class="px-4 py-3">
                    <UBadge 
                      :color="comparison.status === 'new' ? 'success' : 'info'"
                      variant="subtle"
                    >
                      {{ comparison.status === 'new' ? 'NEW' : 'UPDATE' }}
                    </UBadge>
                  </td>
                  <td class="px-4 py-3 font-medium">
                    {{ comparison.csvData.name }}
                  </td>
                  <td class="px-4 py-3">
                    <span v-if="comparison.dbData" class="text-gray-600">
                      {{ comparison.dbData.title_romaji }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span :class="comparison.changes.episodes ? 'text-orange-600 font-semibold' : ''">
                        {{ comparison.csvData.episodes || '-' }}
                      </span>
                      <span v-if="comparison.dbData && comparison.changes.episodes" class="text-gray-400 line-through text-xs">
                        {{ comparison.dbData.episodes }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span :class="comparison.changes.score ? 'text-orange-600 font-semibold' : ''">
                        {{ comparison.csvData.score || '-' }}
                      </span>
                      <span v-if="comparison.dbData && comparison.changes.score" class="text-gray-400 line-through text-xs">
                        {{ comparison.dbData.mean_score }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div v-if="comparison.status === 'existing'" class="flex flex-wrap gap-1">
                      <template v-for="(changed, field) in comparison.changes" :key="field">
                        <UBadge 
                          v-if="changed"
                          color="warning" 
                          variant="subtle"
                          size="xs"
                        >
                          {{ field }}
                        </UBadge>
                      </template>
                      <span v-if="Object.values(comparison.changes).every(v => !v)" class="text-xs text-gray-400">
                        No changes
                      </span>
                    </div>
                    <span v-else class="text-xs text-gray-400">New entry</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredComparisons.length > 50" class="bg-gray-50 dark:bg-gray-900 px-4 py-3 text-center text-sm text-gray-500">
            Menampilkan 50 dari {{ filteredComparisons.length }} records
          </div>
        </div> -->
      </div>

      <!-- STEP 4: Import Progress -->
      <div v-if="currentStep === 4" class="space-y-6">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">
            Import Progress
          </h3>
          <p class="text-sm text-gray-500">
            Sedang memproses data ke database...
          </p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">
                {{ stats.total }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Total Records
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ stats.processed }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Processed
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-red-600">
                {{ stats.failed }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Failed
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">
                {{ stats.progress }}%
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Progress
              </div>
            </div>
          </UCard>
        </div>

        <!-- Progress Bar -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Import Progress</span>
            <span class="text-sm text-gray-500">{{ stats.processed }} / {{ stats.total }}</span>
          </div>
          <UProgress :value="stats.progress" :max="100" size="lg" />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 justify-center">
          <UButton
            v-if="isImporting"
            color="error"
            size="lg"
            variant="soft"
            @click="stopImport"
          >
            <UIcon name="i-heroicons-stop" class="mr-2" />
            Stop Import
          </UButton>

          <UButton
            v-if="!isImporting && stats.progress === 100"
            color="primary"
            size="lg"
            @click="resetAll"
          >
            <UIcon name="i-heroicons-arrow-path" class="mr-2" />
            Import New File
          </UButton>
        </div>

        <!-- Import Logs -->
        <div v-if="logs.length > 0" class="space-y-2">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">
              Import Logs
            </h3>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              @click="clearLogs"
            >
              Clear Logs
            </UButton>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="flex items-start gap-2 text-sm"
            >
              <UIcon
                :name="log.type === 'error' ? 'i-heroicons-x-circle' : log.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-information-circle'"
                :class="{
                  'text-red-500': log.type === 'error',
                  'text-green-500': log.type === 'success',
                  'text-blue-500': log.type === 'info'
                }"
                class="mt-0.5 flex-shrink-0"
              />
              <div class="flex-1">
                <span class="text-gray-600 dark:text-gray-400">
                  {{ log.time }}
                </span>
                <span class="ml-2">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Details -->
        <UCard v-if="errors.length > 0" class="bg-red-50 dark:bg-red-950">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-red-700 dark:text-red-300">
                Errors ({{ errors.length }})
              </h3>
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                @click="clearErrors"
              >
                Clear Errors
              </UButton>
            </div>
          </template>
          
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="text-sm p-2 bg-white dark:bg-gray-800 rounded"
            >
              <div class="font-medium text-red-700 dark:text-red-400">
                {{ error.anime }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-xs mt-1">
                {{ error.error }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
import type { AnimeDetails } from '~/types/anime'

interface CSVRow {
  [key: string]: string
}

interface Comparison {
  status: 'new' | 'existing'
  csvData: CSVRow
  dbData: AnimeDetails | null
  changes: {
    title?: boolean
    episodes?: boolean
    score?: boolean
    description?: boolean
    [key: string]: boolean | undefined
  }
}

interface ImportResponse {
  success: boolean
  message?: string
  processed?: number
  failed?: number
  total?: number
  currentOffset?: number
  nextOffset?: number
  hasMore?: boolean
  errors?: ErrorDetail[]
  progress?: number
  error?: string
}

interface LogMessage {
  time: string
  type: 'info' | 'success' | 'error'
  message: string
}

interface ErrorDetail {
  anime: string
  error: string
}

// Step management
const currentStep = ref(1)

const items = ref<TimelineItem[]>([
  {
    title: 'Upload CSV',
    icon: 'i-lucide-upload'
  },
  {
    title: 'Preview Data',
    icon: 'i-lucide-eye'
  },
  {
    title: 'Compare',
    icon: 'i-lucide-shuffle'
  },
  {
    title: 'Import',
    icon: 'i-lucide-database'
  }
])

const stepColor = computed(() => {
  if (currentStep.value === 4 && isImporting.value) return 'primary'
  if (currentStep.value === 4 && stats.progress === 100) return 'success'
  return 'primary'
})

// File upload
const newUploadedFile = ref<File | null>(null)
const isProcessing = ref(false)

// CSV Data
const csvData = ref<CSVRow[]>([])

// Comparison
const isComparing = ref(false)
const comparisonData = ref<Comparison[]>([])
const comparisonFilter = ref<'all' | 'new' | 'existing'>('all')

const comparisonResult = computed(() => {
  const newRecords = comparisonData.value.filter(c => c.status === 'new').length
  const existingRecords = comparisonData.value.filter(c => c.status === 'existing').length
  return { newRecords, existingRecords }
})

// const filteredComparisons = computed(() => {
//   if (comparisonFilter.value === 'all') return comparisonData.value
//   return comparisonData.value.filter(c => c.status === comparisonFilter.value)
// })

// Import
const isImporting = ref(false)
const shouldStop = ref(false)
const batchSize = ref(50)
const currentOffset = ref(0)
const existingAnimeData = ref<AnimeDetails[]>([])
const newAnimeData = ref<AnimeDetails[]>([])

const stats = reactive({
  total: 0,
  processed: 0,
  failed: 0,
  progress: 0
})

const logs = ref<LogMessage[]>([])
const errors = ref<ErrorDetail[]>([])

// Methods
const parseCSV = async () => {
  if (!newUploadedFile.value) return
  
  isProcessing.value = true
  
  try {
    const text = await newUploadedFile.value.text()
    const data = await useParseCSV(text)

    newAnimeData.value = (data!.slice(0, 50) ?? []) as unknown as AnimeDetails[] // Store sample new anime data
    csvData.value = (data!.slice(0, 50) ?? []) as CSVRow[] // Limit to first 1000 rows for preview
    currentStep.value = 2
  } catch (error) {
    console.error('Error parsing CSV:', error)
    alert('Error parsing CSV file')
  } finally {
    isProcessing.value = false
  }
}

const compareWithDatabase = async () => {
  isComparing.value = true
  
  try {
    const slugs = csvData.value.map(row =>
      // (row.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      useText2Slug(row.title_romaji || '', row.type || '', row.premiered?.split(' ')[1] || '')
    )
    
    const response = await $fetch('/api/admin/check-anime-exists', {
      method: 'POST',
      body: { slugs }
    })

    existingAnimeData.value = (response as unknown as { data?: AnimeDetails[] }).data || []
    
    comparisonData.value = csvData.value.map((csvRow) => {
      const slug = useText2Slug(csvRow.title_romaji || '', csvRow.type || '', csvRow.premiered?.split(' ')[1] || '')
      const dbData = existingAnimeData.value.find((a: AnimeDetails) => a.slug === slug)
      
      const changes: Comparison['changes'] = {}
      
      if (dbData) {
        if (dbData.title_romaji !== csvRow.name) changes.title = true
        if (dbData.episodes?.toString() !== csvRow.episodes) changes.episodes = true
        if (dbData.mean_score?.toString() !== csvRow.score) changes.score = true
        if (dbData.description !== csvRow.synopsis) changes.description = true
      }
      
      return {
        status: dbData ? 'existing' : 'new',
        csvData: csvRow,
        dbData: dbData || null,
        changes
      }
    })
    
    currentStep.value = 3
  } catch (error) {
    console.error('Error comparing with database:', error)
    alert('Error comparing with database')
  } finally {
    isComparing.value = false
  }
}

const startImport = async () => {
  currentStep.value = 4
  isImporting.value = true
  shouldStop.value = false
  
  stats.total = csvData.value.length
  stats.processed = 0
  stats.failed = 0
  stats.progress = 0
  
  addLog('info', 'Starting bulk import...')

  try {
    while (!shouldStop.value) {
      const batch = csvData.value.slice(currentOffset.value, currentOffset.value + batchSize.value)
      
      if (batch.length === 0) break
      
      // @ts-expect-error - Bypass TypeScript excessive stack depth error
      const response: ImportResponse = await $fetch('/api/admin/bulk-import-anime-from-upload', {
        method: 'POST',
        body: {
          csvData: batch,
          batchSize: batchSize.value,
          offset: currentOffset.value
        }
      })

      if (!response.success) {
        addLog('error', `Import failed: ${response.error || 'Unknown error'}`)
        break
      }

      stats.processed += response.processed || 0
      stats.failed += response.failed || 0
      stats.progress = Math.round((stats.processed / stats.total) * 100)

      addLog('success', `Batch completed: +${response.processed} anime (offset: ${currentOffset.value})`)

      if (response.errors && response.errors.length > 0) {
        errors.value.push(...response.errors)
        addLog('error', `${response.errors.length} errors in this batch`)
      }

      currentOffset.value += batchSize.value

      if (currentOffset.value >= csvData.value.length) {
        addLog('success', `✅ Import completed! Total: ${stats.processed} anime`)
        break
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    if (shouldStop.value) {
      addLog('info', 'Import stopped by user')
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    addLog('error', `Fatal error: ${errorMessage}`)
    console.error('Import error:', error)
  } finally {
    isImporting.value = false
  }
}

const stopImport = () => {
  shouldStop.value = true
  addLog('info', 'Stopping import...')
}

const addLog = (type: LogMessage['type'], message: string) => {
  const time = new Date().toLocaleTimeString('id-ID')
  logs.value.unshift({ time, type, message })
  
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const clearLogs = () => {
  logs.value = []
}

const clearErrors = () => {
  errors.value = []
}

const resetAll = () => {
  currentStep.value = 1
  newUploadedFile.value = null
  csvData.value = []
  comparisonData.value = []
  currentOffset.value = 0
  stats.processed = 0
  stats.failed = 0
  stats.progress = 0
  clearLogs()
  clearErrors()
}

definePageMeta({
  layout: 'dashboard'
})
</script>
