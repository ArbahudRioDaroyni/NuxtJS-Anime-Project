<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const toast = useToast()
const isLoading = ref(false)

const fields: AuthFormField[] = [{
  name: 'name',
  type: 'text',
  label: 'Name',
  placeholder: 'Enter your name',
  required: true
}, {
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password (min. 8 characters)',
  required: true
}, {
  name: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm your password',
  required: true
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Sign up with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Sign up with GitHub' })
  }
}]

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  
  try {
    const response = await $fetch<{ user: { id: string, email: string, name: string | null } }>('/api/auth/signup', {
      method: 'POST',
      body: {
        name: payload.data.name,
        email: payload.data.email,
        password: payload.data.password
      }
    })

    toast.add({
      title: 'Success!',
      description: `Welcome, ${response.user.name || response.user.email}! Your account has been created.`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    // Navigate to login page
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 1500)
    
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong'
    
    if (error && typeof error === 'object' && 'data' in error) {
      const fetchError = error as { data?: { message?: string } }
      errorMessage = fetchError.data?.message || errorMessage
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    toast.add({
      title: 'Signup Failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Sign Up"
        description="Create a new account to get started."
        icon="i-lucide-user-plus"
        :fields="fields"
        :providers="providers"
        :loading="isLoading"
        submit-button="Create Account"
        @submit="onSubmit"
      >
        <template #footer>
          <p class="text-sm text-center text-muted">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary hover:underline font-medium">
              Sign in
            </NuxtLink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
