<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const fileRef = ref<HTMLInputElement>()
const toast = useToast()
const isLoading = ref(false)
const isUploading = ref(false)

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email')
})

type ProfileSchema = z.output<typeof profileSchema>

interface UserProfile {
  name?: string
  email?: string
  avatar?: string | null
}

const profile = reactive<UserProfile>({
  name: '',
  email: '',
  avatar: null
})

// Fetch user profile data
const { data: userData, error: userError } = await useFetch<{
  success: boolean
  data: {
    id: string
    name: string | null
    email: string
    avatar: string | null
    role: string
  }
}>('/api/user/profile')

if (userError.value) {
  toast.add({
    title: 'Error',
    description: 'Failed to load profile data',
    icon: 'i-lucide-alert-circle',
    color: 'error'
  })
} else if (userData.value?.data) {
  profile.name = userData.value.data.name || ''
  profile.email = userData.value.data.email || ''
  profile.avatar = userData.value.data.avatar || null
}

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  isLoading.value = true
  
  try {
    const { data, error } = await useFetch<{
      success: boolean
      message: string
      data: {
        id: string
        name: string | null
        email: string
        avatar: string | null
        role: string
      }
    }>('/api/user/profile', {
      method: 'PUT',
      body: {
        name: event.data.name,
        email: event.data.email,
        avatar: profile.avatar
      }
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to update profile')
    }

    if (data.value?.data) {
      profile.name = data.value.data.name || ''
      profile.email = data.value.data.email || ''
      profile.avatar = data.value.data.avatar || null
    }

    toast.add({
      title: 'Success',
      description: 'Your settings have been updated.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update profile',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  const file = input.files[0]!
  
  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    toast.add({
      title: 'Error',
      description: 'File size too large. Maximum size is 2MB.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    toast.add({
      title: 'Error',
      description: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const { data, error } = await useFetch<{
      success: boolean
      message: string
      data: {
        url: string
        filename: string
        type: string
        size: number
      }
    }>('/api/user/avatar', {
      method: 'POST',
      body: formData
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to upload avatar')
    }

    if (data.value?.data) {
      profile.avatar = data.value.data.url
      
      toast.add({
        title: 'Success',
        description: 'Avatar uploaded successfully',
        icon: 'i-lucide-check',
        color: 'success'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to upload avatar',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    isUploading.value = false
  }
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="These informations will be displayed publicly."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Will appear on receipts, invoices, and other communication."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.name"
          autocomplete="off"
          :disabled="isLoading"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Used to sign in, for email receipts and product updates."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
          :disabled="isLoading"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, PNG, WebP or GIF. 2MB Max."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="profile.avatar || undefined"
            :alt="profile.name"
            size="lg"
          />
          <UButton
            label="Choose"
            color="neutral"
            :loading="isUploading"
            :disabled="isUploading || isLoading"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            @change="onFileChange"
          >
        </div>
      </UFormField>
    </UPageCard>
  </UForm>
</template>