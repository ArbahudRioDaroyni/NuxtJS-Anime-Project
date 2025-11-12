<script setup lang="ts">
import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const isLoading = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const deletePassword = ref('')

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<PasswordSchema>) {
  isLoading.value = true
  
  try {
    const { data, error } = await useFetch<{
      success: boolean
      message: string
    }>('/api/user/password', {
      method: 'PUT',
      body: {
        currentPassword: event.data.current,
        newPassword: event.data.new
      }
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to update password')
    }

    toast.add({
      title: 'Success',
      description: data.value?.message || 'Password updated successfully',
      icon: 'i-lucide-check',
      color: 'success'
    })

    // Clear form
    password.current = undefined
    password.new = undefined
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update password',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

function openDeleteModal() {
  deletePassword.value = ''
  isDeleteModalOpen.value = true
}

async function confirmDeleteAccount() {
  if (!deletePassword.value || deletePassword.value.length < 8) {
    toast.add({
      title: 'Error',
      description: 'Please enter your password',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  isDeleting.value = true
  
  try {
    const { data, error } = await useFetch<{
      success: boolean
      message: string
    }>('/api/user/account', {
      method: 'DELETE',
      body: {
        password: deletePassword.value
      }
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to delete account')
    }

    toast.add({
      title: 'Success',
      description: data.value?.message || 'Account deleted successfully',
      icon: 'i-lucide-check',
      color: 'success'
    })

    // Redirect to home page after a short delay
    setTimeout(() => {
      navigateTo('/')
    }, 1500)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to delete account',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
    isDeleteModalOpen.value = false
  }
}
</script>

<template>
  <UDashboardPanel>
    <UPageCard
      title="Password"
      description="Confirm your current password before setting a new one."
      variant="subtle"
    >
      <UForm
        :schema="passwordSchema"
        :state="password"
        :validate="validate"
        class="flex flex-col gap-4 max-w-xs"
        @submit="onSubmit"
      >
        <UFormField name="current">
          <UInput
            v-model="password.current"
            type="password"
            placeholder="Current password"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>
  
        <UFormField name="new">
          <UInput
            v-model="password.new"
            type="password"
            placeholder="New password"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>
  
        <UButton 
          label="Update" 
          class="w-fit" 
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </UForm>
    </UPageCard>
  
    <UPageCard
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      class="bg-gradient-to-tl from-error/10 from-5% to-default"
    >
      <template #footer>
        <UButton 
          label="Delete account" 
          color="error"
          @click="openDeleteModal"
        />
      </template>
    </UPageCard>

    <!-- Delete Account Confirmation Modal -->
    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Delete Account</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              @click="isDeleteModalOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            title="Warning"
            description="This action cannot be undone. All your data will be permanently deleted."
            icon="i-lucide-alert-triangle"
          />

          <div>
            <label class="block text-sm font-medium mb-2">
              Enter your password to confirm
            </label>
            <UInput
              v-model="deletePassword"
              type="password"
              placeholder="Your password"
              :disabled="isDeleting"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              :disabled="isDeleting"
              @click="isDeleteModalOpen = false"
            />
            <UButton
              label="Delete Account"
              color="error"
              :loading="isDeleting"
              :disabled="isDeleting || !deletePassword || deletePassword.length < 8"
              @click="confirmDeleteAccount"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>