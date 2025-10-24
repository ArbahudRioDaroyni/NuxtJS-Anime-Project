<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar title="Animes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <DashboardAnimesAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
        <UInput v-model="search" class="max-w-sm" placeholder="Search..." />

        <div class="flex flex-wrap items-center gap-1.5">
          <DashboardAnimesDeleteModal
            v-if="totalSelectedCount > 0"
            :count="totalSelectedCount" 
            title="anime"
            @confirm="bulkDeleteAnimes(false)"
          >
            <UButton
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
              :loading="isDeleting"
            >
              <template #trailing>
                <UKbd>
                  {{ totalSelectedCount }}
                </UKbd>
              </template>
            </UButton>
          </DashboardAnimesDeleteModal>
          
          <UModal 
            v-if="totalSelectedCount > 0"
            v-model:open="showPermanentDeleteConfirm"
            title="Permanent Delete Confirmation"
            :description="`Are you sure you want to permanently delete ${totalSelectedCount} anime(s)? This action cannot be undone.`"
          >
            <UButton
              label="Delete Permanent"
              color="error"
              variant="solid"
              icon="i-lucide-trash-2"
              :loading="isDeleting"
            >
              <template #trailing>
                <UKbd>
                  {{ totalSelectedCount }}
                </UKbd>
              </template>
            </UButton>
            
            <template #body>
              <div class="flex justify-end gap-2">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="subtle"
                  :disabled="isDeleting"
                  @click="showPermanentDeleteConfirm = false"
                />
                <UButton
                  label="Delete Permanently"
                  color="error"
                  variant="solid"
                  :loading="isDeleting"
                  @click="async () => {
                    await bulkDeleteAnimes(true)
                    showPermanentDeleteConfirm = false
                  }"
                />
              </div>
            </template>
          </UModal>

          <USelect
            v-model="pageSize"
            :items="[
              { label: '5 per page', value: 5 },
              { label: '10 per page', value: 10 },
              { label: '20 per page', value: 20 },
              { label: '50 per page', value: 50 }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Items per page"
            class="min-w-32"
          />

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'TV', value: 'TV' },
              { label: 'OVA', value: 'OVA' },
              { label: 'Special', value: 'Special' },
              { label: 'Movie', value: 'Movie' },
              { label: 'ONA', value: 'ONA' },
              { label: 'Web', value: 'Web' },
              { label: 'Theatrical', value: 'Theatrical' },
              { label: 'TV Short', value: 'TV Short' },
              { label: 'Music', value: 'Music' },
              { label: 'Unknown', value: 'Unknown' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status"
            class="min-w-28"
          />
          <UDropdownMenu
              :items="
                table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide() && column.id !== 'select')
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
              "
              :content="{ align: 'end' }"
            >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:global-filter="globalFilter"
        v-model:row-selection="rowSelection"
        :data="animes"
        :columns="columns"
        :loading="pending"
        :get-row-id="(row: AnimeDetails) => row.id.toString()"
        sticky
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="h-full flex-1"
        @select="onSelect"
      >
        <template #expanded="{ row }">
          <table class="min-w-full text-sm">
            <tbody>
              <tr v-for="(value, key) in row.original" :key="key">
                <th class="text-left pr-4 font-semibold align-top">{{ key }}</th>
                <td class="break-all">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getRowItems(row)" :content="{ align: 'end' }">
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              class="ml-auto"
              aria-label="Actions"
            />
          </UDropdownMenu>
        </template>
      </UTable>

      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <div class="text-sm text-muted">
          {{ totalSelectedCount }} item(s) selected across all pages.
        </div>
  
        <div class="text-sm text-muted">
          Showing {{ ((meta.page - 1) * meta.limit) + 1 }} to {{ Math.min(meta.page * meta.limit, meta.total) }} of {{ meta.total }} results
        </div>
      </div>


      <div class="flex justify-center border-t border-default pt-4">
        <UPagination
          v-model:page="currentPage"
          :total="meta.total"
          :items-per-page="pageSize"
          show-edges
          :sibling-count="2"
        />
      </div>
    </template>

    <!-- Edit Modal -->
    <DashboardAnimesEditModal
      v-if="selectedAnimeForEdit"
      :anime="selectedAnimeForEdit"
      :open="showEditModal"
      @close="handleEditModalClose"
      @updated="handleAnimeUpdated"
    />
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'
import type { ReleaseStatusType, ReleaseFormat } from '~/types/metadata'
import type { Row, Column } from '@tanstack/table-core'
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'

const UAvatar = resolveComponent('UAvatar')
const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const toast = useToast()
const table = useTemplateRef('table')
const search = ref('')
const globalFilter = ref('')
const rowSelection = ref<Record<string, boolean>>({})
const isDeleting = ref(false)
const showPermanentDeleteConfirm = ref(false)

// Edit modal state
const showEditModal = ref(false)
const selectedAnimeForEdit = ref<AnimeDetails | null>(null)

// Debounced search value
const debouncedSearch = ref('')
let searchTimeout: NodeJS.Timeout | null = null

// Server-side pagination state
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref('all')

// Fetch data from API with pagination using useAsyncData
const { data: response, pending, error: _error, refresh: _refresh } = await useAsyncData<ResponseType>(
  'animes',
  () => $fetch('/api/anime', {
    query: {
      page: currentPage.value,
      limit: pageSize.value,
      format: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      search: debouncedSearch.value || undefined
    }
  }),
  {
    watch: [currentPage, pageSize, statusFilter, debouncedSearch]
  }
)

const animes = computed(() => response.value?.data as AnimeDetails[] || [])
const meta = computed(() => ({
  total: response.value?.meta?.total || 0,
  page: response.value?.meta?.page || 1,
  limit: response.value?.meta?.limit || 10,
  totalPages: response.value?.meta?.totalPages || 0,
  hasNext: response.value?.meta?.hasNext || false,
  hasPrev: response.value?.meta?.hasPrev || false,
  nextPage: response.value?.meta?.nextPage || null,
  prevPage: response.value?.meta?.prevPage || null,
  nextLink: response.value?.meta?.nextLink || null,
  prevLink: response.value?.meta?.prevLink || null
}))

// Count total selected items (by ID)
const totalSelectedCount = computed(() => {
  return Object.keys(rowSelection.value).length
})

// Get selected anime IDs
const selectedAnimeIds = computed(() => {
  return Object.keys(rowSelection.value).map(id => parseInt(id))
})

// Delete single anime
async function deleteAnime(id: number, force = false) {
  isDeleting.value = true
  
  try {
    const response = await $fetch<ResponseType>(`/api/anime/${id}`, {
      method: 'DELETE',
      query: { force: force.toString() }
    })
    
    if (response.success) {
      toast.add({
        title: 'Success',
        description: force ? 'Anime permanently deleted' : 'Anime deleted successfully',
        color: 'success'
      })
      
      // Refresh data
      await refreshNuxtData('animes')
      
      // Clear selection if deleted
      // if (rowSelection.value[id.toString()]) {
      //   delete rowSelection.value[id.toString()]
      // }
    } else {
      toast.add({
        title: 'Error',
        description: response.message || 'Failed to delete anime',
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
    isDeleting.value = false
  }
}

// Bulk delete selected animes
async function bulkDeleteAnimes(force = false) {
  isDeleting.value = true
  
  try {
    const deletePromises = selectedAnimeIds.value.map(id => 
      $fetch<ResponseType>(`/api/anime/${id}`, {
        method: 'DELETE',
        query: { force: force.toString() }
      })
    )
    
    const results = await Promise.allSettled(deletePromises)
    
    const successCount = results.filter(r => r.status === 'fulfilled' && (r.value as ResponseType).success).length
    const failCount = results.length - successCount
    
    if (successCount > 0) {
      toast.add({
        title: 'Success',
        description: `${successCount} anime(s) deleted successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        color: successCount === results.length ? 'success' : 'warning'
      })
      
      // Refresh data
      await refreshNuxtData('animes')
      
      // Clear selection
      rowSelection.value = {}
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to delete selected animes',
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
    isDeleting.value = false
  }
}

const columns: TableColumn<AnimeDetails>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'ID', 'left'),
    cell: ({ row }) => `#${row.original.id.toString()}`
  },
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        size: 'xl',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-300 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Title',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.thumbnail_image_url || row.original.medium_cover_image_url || row.original.large_cover_image_url || undefined,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.title_romaji || row.original.title_english || row.original.title_native || 'Unknown Title'),
          h('p', { class: '' }, `/${row.original.slug}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'status_type',
    header: 'Status',
    cell: ({ row }) => {
      const statusType = row.getValue('status_type') as ReleaseStatusType
      const statusName = (statusType?.name || 'UNKNOWN') as 'FINISHED' | 'CANCELLED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'UNKNOWN'

      const color = {
        FINISHED: 'success' as const,
        CANCELLED: 'error' as const,
        RELEASING: 'info' as const,
        NOT_YET_RELEASED: 'warning' as const,
        UNKNOWN: 'neutral' as const
      }[statusName] || 'neutral'

      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color 
      }, () => statusName)
    },
    meta: {
      class: {
        th: 'text-center font-semibold',
        td: 'text-center font-mono'
      }
    }
  },
  {
    accessorKey: 'release_format',
    header: 'Release Format',
    cell: ({ row }) => {
      const statusType = row.getValue('release_format') as ReleaseFormat
      const statusName = (statusType?.name || 'Unknown') as 'TV' | 'OVA' | 'Special' | 'Movie' | 'ONA' | 'Web' | 'Theatrical' | 'TV Short' | 'Music' | 'Unknown'

      const color = {
        TV: 'primary' as const,
        OVA: 'secondary' as const,
        Special: 'neutral' as const,
        Movie: 'error' as const,
        ONA: 'success' as const,
        Web: 'warning' as const,
        Theatrical: 'info' as const,
        'TV Short': 'neutral' as const,
        Music: 'warning' as const,
        Unknown: 'neutral' as const
      }[statusName] || 'neutral'
      
      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color 
      }, () => statusName)
    },
    meta: {
      class: {
        th: 'text-center font-semibold',
        td: 'text-center font-mono'
      }
    }
  },
  {
    id: 'actions'
  }
]

function getRowItems(row: Row<AnimeDetails>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy anime ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Anime ID copied to clipboard',
          color: 'success'
        })
      }
    },
    {
      label: 'View anime',
      icon: 'i-lucide-eye',
      onSelect() {
        window.open(`/${row.original.slug}`, '_blank')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit anime',
      icon: 'i-lucide-pencil',
      onSelect() {
        selectedAnimeForEdit.value = row.original
        showEditModal.value = true
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete anime (soft)',
      icon: 'i-lucide-trash',
      color: 'warning',
      onSelect() {
        deleteAnime(row.original.id, false)
      }
    },
    {
      label: 'Delete anime (permanent)',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect() {
        if (window.confirm(`Are you sure you want to permanently delete "${row.original.title_english || row.original.title_romaji}"? This action cannot be undone.`)) {
          deleteAnime(row.original.id, true)
        }
      }
    }
  ]
}

function onSelect(row: TableRow<AnimeDetails>, e?: Event) {
  row.toggleSelected(!row.getIsSelected())

  console.log(e)
}

function getHeader(column: Column<AnimeDetails>, label: string, position: 'left' | 'right') {
  const isPinned = column.getIsPinned()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isPinned ? 'i-lucide-pin-off' : 'i-lucide-pin',
    class: '-mx-2.5',
    onClick() {
      column.pin(isPinned === position ? false : position)
    }
  })
}

watch(() => statusFilter.value, (newVal) => {
  // Reset to page 1 when filter changes
  if (newVal !== 'all') {
    currentPage.value = 1
  }
})

// Reset to page 1 when search changes
watch(() => search.value, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal
    currentPage.value = 1
  }, 500) // Wait 500ms after user stops typing
})

// Reset to page 1 when pageSize changes
watch(() => pageSize.value, () => {
  currentPage.value = 1
})

// Handle edit modal actions
function handleEditModalClose() {
  showEditModal.value = false
  selectedAnimeForEdit.value = null
}

function handleAnimeUpdated() {
  showEditModal.value = false
  selectedAnimeForEdit.value = null
  // Data will be refreshed automatically via the EditModal component
}

definePageMeta({
  layout: 'dashboard'
})
</script>