<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar title="Animes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput v-model="filters" class="max-w-sm" placeholder="Filter..." />

        <div class="flex flex-wrap items-center gap-1.5">
          <!-- <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"> -->
            <UButton
              v-if="totalSelectedCount > 0"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ totalSelectedCount }}
                </UKbd>
              </template>
            </UButton>
          <!-- </CustomersDeleteModal> -->

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
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' }
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
        v-model:global-filter="filters"
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
          <pre>{{ row.original }}</pre>
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

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const statusFilter = ref('all')
const toast = useToast()
const table = useTemplateRef('table')
const rowSelection = ref<Record<string, boolean>>({})

const filters = ref('')

// Server-side pagination state
const currentPage = ref(1)
const pageSize = ref(10)

// Fetch data from API with pagination using useAsyncData
const { data: response, pending, error: _error, refresh: _refresh } = await useAsyncData<ResponseType>(
  'animes',
  () => $fetch('/api/anime', {
    query: {
      page: currentPage.value,
      limit: pageSize.value
    }
  }),
  {
    watch: [currentPage, pageSize]
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
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'ID', 'left'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => row.getValue('slug')
  },
  {
    accessorKey: 'title_romaji',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Title Romaji',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.getValue('title_romaji'),
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
    id: 'actions',
    header: () => h('div', { class: 'text-gray-500' }, 'Actions'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

function getRowItems(row: Row<AnimeDetails>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy customer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Customer ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View customer details',
      icon: 'i-lucide-list'
    },
    {
      label: 'View customer payments',
      icon: 'i-lucide-wallet'
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete customer',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Customer deleted',
          description: 'The customer has been deleted.'
        })
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
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('id')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

// Reset to page 1 when pageSize changes
watch(() => pageSize.value, () => {
  currentPage.value = 1
})

definePageMeta({
  layout: 'dashboard'
})
</script>