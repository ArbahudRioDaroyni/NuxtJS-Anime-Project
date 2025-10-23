<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
  title?: string
  description?: string
}>(), {
  count: 0,
  title: 'modal',
  description: 'Are you sure, this action cannot be undone.'
})

const open = ref(false)

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} ${title + (count > 1 ? 's' : '')}`"
    :description="description"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>