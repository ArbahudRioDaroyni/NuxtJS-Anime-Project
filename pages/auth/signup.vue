<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const authStore = useAuthStore()
const router = useRouter()

// Redirect jika sudah login
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <AuthSignup />
  </div>
</template>
