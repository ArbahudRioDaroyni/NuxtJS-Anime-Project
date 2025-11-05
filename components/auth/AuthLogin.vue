<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  
  try {
    await authStore.login(payload.data.email, payload.data.password)

    toast.add({
      title: 'Welcome back!',
      description: `Logged in as ${authStore.user?.name || authStore.user?.email}`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

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
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        :loading="isLoading"
        submit-button="Sign In"
        @submit="onSubmit"
      >
        <template #footer>
          <p class="text-sm text-center text-muted">
            Don't have an account?
            <NuxtLink to="/auth/signup" class="text-primary hover:underline font-medium">
              Sign up
            </NuxtLink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
