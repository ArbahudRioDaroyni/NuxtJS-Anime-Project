<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar title="Import">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h1>Import Page</h1>
      <UCard class="max-h-full overflow-auto p-6 space-y-6">
        <!-- Header -->
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

        <div class="flex flex-wrap items-center justify-between gap-y-6">
          <!-- Step Progress -->
          <UTimeline orientation="horizontal" :default-value="currentStep-1" :items="items" class="w-full" />
  
          <!-- STEP 1: Upload CSV -->
          <div v-if="currentStep === 1" class="space-y-6 w-full flex flex-col items-center">
            <UFileUpload
              v-model="uploadedFile"
              layout="list"
              :multiple="false"
              label="Drop your CSV here"
              description="CSV files only (max. 10MB)"
              accept=".csv"
              class="w-96 min-h-48"
              :ui="{
                base: 'min-h-48'
              }"
            />
  
            <UButton
              v-if="uploadedFile"
              color="primary"
              size="lg"
              :loading="isLoading"
              @click="parseCSV"
            >
              <UIcon name="i-heroicons-arrow-right" class="mr-2" />
              Preview Data
            </UButton>
          </div>

          <!-- STEP 2: Preview CSV Data -->
          <div v-if="currentStep === 2" class="space-y-6 w-full flex flex-col">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Preview Data CSV
                </h3>
                <p class="text-sm text-gray-500">
                  Total: {{ csvRecordsCount }} records
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
                  :loading="isLoading"
                  @click="compareWithDatabase"
                >
                  <UIcon name="i-heroicons-arrow-right" class="mr-2" />
                  Compare with Database
                </UButton>
              </div>
            </div>
            <!-- CSV Data Table -->
            <UTable sticky :data="csvRecords.slice(0, 50)" class="flex-1 max-h-[400px]" />
          </div>

          <!-- STEP 3: Compare with Database -->
          <div v-if="currentStep === 3" class="space-y-6 w-full flex flex-col">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Comparison Results
                </h3>
                <p class="text-sm text-gray-500">
                  {{ newAnimesRecordsCount }} new • 
                  {{ existingAnimesRecordsCount }} existing (will be updated)
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
              <UCard class="cursor-pointer hover:bg-gray-50" @click="handleComparisonFilter('new')">
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600">
                    {{ newAnimesRecordsCount }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    New Records
                  </div>
                </div>
              </UCard>
              
              <UCard class="cursor-pointer hover:bg-gray-50" @click="handleComparisonFilter('existing')">
                <div class="text-center">
                  <div class="text-3xl font-bold text-yellow-600">
                    {{ existingAnimesRecordsCount }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    Will Update
                  </div>
                </div>
              </UCard>
              
              <UCard class="cursor-pointer hover:bg-gray-50" @click="handleComparisonFilter('all')">
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600">
                    {{ csvRecordsCount }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    Total to Process
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Filter Options -->
            <!-- <div class="flex gap-2">
              <UButton
                :color="comparisonFilter === 'all' ? 'primary' : 'neutral'"
                :variant="comparisonFilter === 'all' ? 'solid' : 'soft'"
                @click="comparisonFilter = 'all'"
              >
                All ({{ csvRecordsCount }})
              </UButton>
              <UButton
                :color="comparisonFilter === 'new' ? 'primary' : 'neutral'"
                :variant="comparisonFilter === 'new' ? 'solid' : 'soft'"
                @click="comparisonFilter = 'new'"
              >
                New Only ({{ newAnimesRecordsCount }})
              </UButton>
              <UButton
                :color="comparisonFilter === 'existing' ? 'primary' : 'neutral'"
                :variant="comparisonFilter === 'existing' ? 'solid' : 'soft'"
                @click="comparisonFilter = 'existing'"
              >
                Existing ({{ comparisonResult.existingRecords }})
              </UButton>
            </div> -->

            <RekaTableComparison
              :existing-data="tableExistingData"
              :new-data="tableNewData"
            />
          </div>

          <!-- STEP 4: Import Progress -->
          <div v-if="currentStep === 4" class="space-y-6 w-full flex flex-col items-center">
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-2">
                Import Progress
              </h3>
              <p class="text-sm text-gray-500">
                Processing data to database...
              </p>
            </div>

            <pre class="w-full"><code>{{ importResponse }}</code></pre>

            <!-- Stats Overview -->
            <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div> -->

            <!-- Progress Bar -->
            <!-- <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Import Progress</span>
                <span class="text-sm text-gray-500">{{ stats.processed }} / {{ stats.total }}</span>
              </div>
              <UProgress :value="stats.progress" :max="100" size="lg" />
            </div> -->

            <!-- Action Buttons -->
            <!-- <div class="flex gap-3 justify-center">
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
            </div> -->

            <!-- Import Logs -->
            <!-- <div v-if="logs.length > 0" class="space-y-2">
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
            </div> -->

            <!-- Error Details -->
            <!-- <UCard v-if="errors.length > 0" class="bg-red-50 dark:bg-red-950">
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
            </UCard> -->
          </div>
        </div>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
import type { AnimeDetails, AnimeImportCSV } from '~/types/anime'
import type { ResponseType } from '~/types/database'

// interface CSVRow {
//   [key: string]: string
// }

const isLoading = ref(false)
const uploadedFile = ref<File | null>(null)
const currentStep = ref(1)
const stepColor = computed(() => {
  if (currentStep.value === 4) return 'primary'
  if (currentStep.value === 4) return 'success'
  return 'primary'
})
const batchSize = ref(10)
const csvRecords = ref<AnimeImportCSV[]>([])
const csvRecordsCount = computed(() => csvRecords.value.length)
const existingAnimesRecords = ref<AnimeDetails[]>([])
const existingAnimesRecordsCount = computed(() => existingAnimesRecords.value.length)
const newAnimesRecords = ref<AnimeImportCSV[]>([])
const newAnimesRecordsCount = computed(() => newAnimesRecords.value.length)
const tableExistingData = ref<unknown>([])
const tableNewData = ref<unknown>([])
const importResponse = ref<ResponseType | null>(null)
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

const parseCSV = async () => {
  if (!uploadedFile.value) return
  
  isLoading.value = true
  
  try {
    const text = await uploadedFile.value.text()
    const data = await useParseCSV(text)

    csvRecords.value = (data!.slice(0, batchSize.value) ?? []) as unknown as AnimeImportCSV[] // Limit to first 50 rows for preview
    csvRecords.value.forEach((record: AnimeImportCSV) => {
      record.slug = useText2Slug(record.title_romaji || '', record.release_format_name || '', record.year || '')
    })
    currentStep.value = 2
  } catch (error) {
    console.error('Error parsing CSV:', error)
    alert('Error parsing CSV file')
  } finally {
    isLoading.value = false
  }
}

const compareWithDatabase = async () => {
  isLoading.value = true
  
  try {
    const slugs = csvRecords.value.map(record => record.slug)
    
    const response = await $fetch<ResponseType>('/api/admin/check-anime-exists', {
      method: 'POST',
      body: { slugs }
    })

    const animes = response.data as AnimeDetails[] | undefined
    newAnimesRecords.value = csvRecords.value.filter(record => !animes?.some(a => a.slug === record.slug))

    if (Array.isArray(animes)) {
      existingAnimesRecords.value = animes
    } else {
      existingAnimesRecords.value = []
    }

    handleComparisonFilter('existing')
    currentStep.value = 3
  } catch (error) {
    console.error('Error comparing with database:', error)
    alert('Error comparing with database')
  } finally {
    isLoading.value = false
  }
}

const handleComparisonFilter = (filter: 'all' | 'new' | 'existing') => {
  if (filter === 'all') {
    console.log('Filter selected:', filter)
    tableExistingData.value = csvRecords.value
    tableNewData.value = []
  } else if (filter === 'new') {
    console.log('Filter selected:', filter)
    tableExistingData.value = newAnimesRecords.value
    tableNewData.value = []
  } else if (filter === 'existing') {
    console.log('Filter selected:', filter)
    tableExistingData.value = existingAnimesRecords.value
    tableNewData.value = csvRecords.value
  }
}

const startImport = async () => {
  currentStep.value = 4

  const response = await $fetch<ResponseType>('/api/admin/bulk-import-anime', {
    method: 'POST',
    body: {
      records: csvRecords.value
    }
  })

  console.log('Import response:', response)
  importResponse.value = response
}

definePageMeta({
  layout: 'dashboard'
})
</script>