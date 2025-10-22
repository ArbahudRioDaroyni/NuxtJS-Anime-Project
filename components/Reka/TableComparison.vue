<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import type { TableColumn } from '@nuxt/ui'

interface Props {
  existingData?: AnimeDetails[]
  newData?: AnimeDetails[]
}

const props = withDefaults(defineProps<Props>(), {
  existingData: () => [],
  newData: () => []
})

interface AnimeDetailsDiff extends AnimeDetails {
  diff?: Partial<AnimeDetails>
}

const data = ref<AnimeDetailsDiff[]>(
  props.existingData!.map((oldItem) => {
    const newItem = props.newData!.find((n) => useNewText2Slug(n.title_romaji || '', n.type || '', n.premiered?.split(' ')[1] || '') === oldItem.slug)
    const diff: Partial<AnimeDetails> = {...newItem}

    return {
      ...oldItem,
      diff
    }
  })
)

// Generate columns dynamically based on keys in existingData
const columns: TableColumn<AnimeDetailsDiff>[] = Object.keys(props.existingData?.[0] || {}).map((key) => {
  return {
    accessorKey: key,
    header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    cell: ({ row }) => {
      if (key === 'id') {
        return `#${row.getValue(key)}`
      }
      if (key === 'slug') {
        return row.getValue(key)
      }
      const hasChanged = row.original[key as keyof AnimeDetails] !== row.original.diff?.[key as keyof AnimeDetails] && row.original.diff?.[key as keyof AnimeDetails] !== undefined
      return h('div', { class: 'flex flex-col gap-3' }, [
        h('span', {
          class: hasChanged ? 'text-highlighted' : ''
        }, String(row.original.diff?.[key as keyof AnimeDetails])),

        hasChanged
          ? h('s', {
              class: 'text-sm text-muted-foreground text-yellow-600'
            }, String(row.original[key as keyof AnimeDetails]))
          : null
      ])
    }
  }
})
</script>

<template>
  <UTable :data="data" :columns="columns" class="flex-1" />
</template>
