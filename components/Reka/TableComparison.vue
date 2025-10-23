<script setup lang="ts">
import type { AnimeDetails, AnimeImportCSV } from '~/types/anime'
import type { TableColumn } from '@nuxt/ui'

interface Props {
  existingData?: AnimeDetails[]
  newData?: AnimeImportCSV[]
}

const props = withDefaults(defineProps<Props>(), {
  existingData: () => [],
  newData: () => []
})

interface AnimeDetailsDiff extends AnimeImportCSV {
  diff?: Partial<AnimeDetails>
}

const data = computed<AnimeDetailsDiff[]>(() =>
  props.existingData!.map((existing) => {
    const newItem = props.newData!.find((n) => n.slug === existing.slug)
    return {
      ...existing,
      diff: {
        ...newItem
      }
    } as AnimeDetailsDiff
  })
)
// Generate columns dynamically based on keys in existingData
const columns = computed<TableColumn<AnimeDetailsDiff>[]>(() =>
  Object.keys(props.existingData?.[0] || {}).map((key) => {
    return {
      accessorKey: key,
      header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: ({ row }) => {
        if (props.newData.length === 0) {
          return row.getValue(key)
        }
        if (key === 'id') {
          return `#${row.getValue(key)}`
        }
        if (key === 'slug') {
          return row.getValue(key)
        }
        const originalVal = row.original[key as keyof AnimeImportCSV]
        const diffVal = row.original.diff?.[key as keyof AnimeDetails]
        const hasChanged = diffVal !== undefined && diffVal !== null && String(originalVal) !== String(diffVal)
        return h('div', { class: 'flex flex-col gap-3' }, [
          h('span', {
            class: hasChanged ? 'text-highlighted' : ''
          }, diffVal === undefined || diffVal === null ? '' : String(diffVal)),
    
          hasChanged
            ? h('s', {
                class: 'text-sm text-muted-foreground text-yellow-600'
              }, String(originalVal))
            : null
        ])
      }
    }
  }
)
)
</script>

<template>
  <UTable sticky :data="data" :columns="columns" class="flex-1 max-h-[500px]" />
</template>
