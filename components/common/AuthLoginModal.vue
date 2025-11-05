<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

const authStore = useAuthStore()
const toast = useToast()

const isOpen = computed({
  get: () => props.open ?? false,
  set: (value) => emit('update:open', value)
})

const isLoading = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  remember: false
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await authStore.login(event.data.email, event.data.password)

    toast.add({
      title: 'Welcome back!',
      description: `Logged in as ${authStore.user?.name || authStore.user?.email}`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    isOpen.value = false
    emit('success')

    // Wait a bit for the toast to show
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Hard redirect to ensure navigation works
    window.location.href = '/dashboard/animes'
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong'
    
    if (error && typeof error === 'object' && 'data' in error) {
      const fetchError = error as { data?: { message?: string } }
      errorMessage = fetchError.data?.message || errorMessage
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    toast.add({
      title: 'Login Failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    
    isLoading.value = false
  }
}

function handleClose() {
  if (!isLoading.value) {
    isOpen.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :prevent-close="isLoading"
    @close="handleClose"
  >
    <UPageCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">
            Login to Dashboard
          </h3>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="isLoading"
            @click="handleClose"
          />
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="email"
          label="Email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email"
            icon="i-lucide-mail"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField
          name="password"
          label="Password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            icon="i-lucide-lock"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField name="remember">
          <UCheckbox
            v-model="state.remember"
            label="Remember me"
            :disabled="isLoading"
          />
        </UFormField>

        <div class="flex gap-2 justify-end">
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="ghost"
            :disabled="isLoading"
            @click="handleClose"
          />
          <UButton
            type="submit"
            label="Sign In"
            icon="i-lucide-log-in"
            :loading="isLoading"
          />
        </div>
      </UForm>

      <template #footer>
        <p class="text-sm text-center text-muted">
          Don't have an account?
          <UButton
            variant="link"
            :padded="false"
            @click="() => {
              isOpen = false
              $router.push('/auth/signup')
            }"
          >
            Sign up
          </UButton>
        </p>
      </template>
    </UPageCard>
  </UModal>
</template>
