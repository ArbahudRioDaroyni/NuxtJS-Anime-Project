<script setup lang="ts">
// Contoh custom bulk comparison data untuk testing
const customComparisons = ref([
  {
    oldData: {
      id: 2,
      slug: 'attack-on-titan',
      title_romaji: 'Shingeki no Kyojin',
      title_english: 'Attack on Titan',
      title_native: '進撃の巨人',
      release_status_type_id: 1,
      description: 'Humans are nearly exterminated by giant creatures called Titans.',
      episodes: 75,
      popularity: 150000,
      mean_score: 8.9,
      favorites: 50000
    },
    newData: {
      id: 2,
      slug: 'attack-on-titan',
      title_romaji: 'Shingeki no Kyojin',
      title_english: 'Attack on Titan',
      title_native: '進撃の巨人',
      release_status_type_id: 2, // Changed: completed
      description: 'Humans are nearly exterminated by giant creatures called Titans. Updated with final season info.', // Changed
      episodes: 87, // Changed: added final season episodes
      popularity: 180000, // Changed: increased
      mean_score: 9.1, // Changed: updated score
      favorites: 65000 // Changed: more favorites
    }
  },
  {
    oldData: {
      id: 3,
      slug: 'demon-slayer',
      title_romaji: 'Kimetsu no Yaiba',
      title_english: 'Demon Slayer',
      title_native: '鬼滅の刃',
      release_status_type_id: 1,
      episodes: 26,
      popularity: 200000,
      mean_score: 8.7
    },
    newData: {
      id: 3,
      slug: 'demon-slayer',
      title_romaji: 'Kimetsu no Yaiba',
      title_english: 'Demon Slayer',
      title_native: '鬼滅の刃',
      release_status_type_id: 1,
      episodes: 55, // Changed: added new seasons
      popularity: 250000, // Changed
      mean_score: 8.9 // Changed
    }
  },
  {
    oldData: {
      id: 4,
      slug: 'naruto',
      title_romaji: 'Naruto',
      title_english: 'Naruto',
      title_native: 'ナルト',
      release_status_type_id: 2,
      episodes: 220,
      popularity: 300000,
      mean_score: 8.3
    },
    newData: {
      id: 4,
      slug: 'naruto',
      title_romaji: 'Naruto',
      title_english: 'Naruto',
      title_native: 'ナルト',
      release_status_type_id: 2,
      episodes: 220,
      popularity: 310000, // Changed
      mean_score: 8.3
    }
  },
  {
    oldData: {
      id: 5,
      slug: 'my-hero-academia',
      title_romaji: 'Boku no Hero Academia',
      title_english: 'My Hero Academia',
      title_native: '僕のヒーローアカデミア',
      release_status_type_id: 1,
      episodes: 88,
      popularity: 180000,
      mean_score: 8.4
    },
    newData: {
      id: 5,
      slug: 'my-hero-academia',
      title_romaji: 'Boku no Hero Academia',
      title_english: 'My Hero Academia',
      title_native: '僕のヒーローアカデミア',
      release_status_type_id: 1,
      episodes: 88,
      popularity: 185000, // Changed
      mean_score: 8.5 // Changed
    }
  }
])

const useCustomData = ref(false)

useSeoMeta({
  title: 'Bulk Anime Comparison - Playground',
  description: 'Testing bulk anime data comparison table component with tree structure'
})
</script>

<template>
  <div class="min-h-screen p-6 bg-background">
    <UContainer>
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4">
          <div>
            <h1 class="text-3xl font-bold text-highlighted">
              Bulk Anime Comparison Table
            </h1>
            <p class="text-muted mt-2">
              Playground untuk testing komponen tabel komparison bulk anime data dengan tree structure
            </p>
          </div>

          <!-- Toggle data source -->
          <div class="flex items-center gap-3 p-4 bg-elevated border border-default rounded-lg">
            <UCheckbox
              v-model="useCustomData"
              label="Use custom bulk data (4 anime)"
            />
            <UBadge v-if="useCustomData" color="primary" variant="subtle">
              Custom Bulk Data Active (4 Anime)
            </UBadge>
            <UBadge v-else color="neutral" variant="subtle">
              Using Default Dummy Data (3 Anime)
            </UBadge>
          </div>
        </div>

        <!-- Comparison Table Component -->
        <RekaTableComparison
          :comparisons="useCustomData ? customComparisons : undefined"
        />

        <!-- Info Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold">Cara Penggunaan</h3>
            </div>
          </template>

          <div class="space-y-4 text-sm text-muted">
            <div>
              <h4 class="font-medium text-highlighted mb-2">1. Tanpa Props (Default Dummy Data - 3 Anime)</h4>
              <pre class="p-3 bg-background border border-default rounded overflow-x-auto"><code>&lt;RekaTableComparison /&gt;</code></pre>
            </div>

            <div>
              <h4 class="font-medium text-highlighted mb-2">2. Dengan Bulk Comparison Data</h4>
              <pre class="p-3 bg-background border border-default rounded overflow-x-auto"><code>&lt;RekaTableComparison
  :comparisons="bulkAnimeComparisons"
/&gt;</code></pre>
              <p class="text-xs text-muted mt-2">
                Di mana <code class="px-1 py-0.5 bg-background border border-default rounded text-xs">bulkAnimeComparisons</code> adalah array of objects dengan struktur:
              </p>
              <pre class="p-3 bg-background border border-default rounded overflow-x-auto mt-2 text-xs"><code>[
  {
    oldData: { id, slug, title_romaji, ... }, // Anime data lama
    newData: { id, slug, title_romaji, ... }  // Anime data baru
  },
  // ... anime lainnya
]</code></pre>
            </div>

            <div>
              <h4 class="font-medium text-highlighted mb-2">3. Fitur yang Tersedia</h4>
              <ul class="list-disc list-inside space-y-1 ml-2">
                <li>✅ Bulk comparison untuk multiple anime sekaligus</li>
                <li>✅ Tree/expandable rows untuk melihat detail perubahan per anime</li>
                <li>✅ Automatic change detection untuk semua field</li>
                <li>✅ Visual indicators untuk perubahan (Updated/Added/Removed)</li>
                <li>✅ Filter untuk menampilkan hanya anime yang berubah</li>
                <li>✅ Statistik perubahan di header (total anime, total changes)</li>
                <li>✅ Color-coded values berdasarkan status perubahan</li>
                <li>✅ Expandable detail view untuk setiap anime</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>

            <div>
              <h4 class="font-medium text-highlighted mb-2">4. Catatan untuk Implementasi Fetch</h4>
              <p class="text-muted">
                Kedepannya, Anda bisa fetch multiple anime data dari API dan pass sebagai props:
              </p>
              <pre class="p-3 bg-background border border-default rounded overflow-x-auto mt-2"><code>// Fetch old and new data untuk multiple anime
const { data: comparisons } = await useFetch('/api/anime/bulk-comparison', {
  query: { ids: [1, 2, 3, 4, 5] }
})

// Response format:
// [
//   { oldData: {...}, newData: {...} },
//   { oldData: {...}, newData: {...} },
//   ...
// ]

&lt;RekaTableComparison :comparisons="comparisons" /&gt;</code></pre>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
