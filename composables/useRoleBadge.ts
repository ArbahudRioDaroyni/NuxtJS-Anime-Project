import { ROLE_LABELS } from '~/types/auth'

export function useRoleBadge() {
  const authStore = useAuthStore()
  
  const roleColor = computed(() => {
    switch (authStore.userRole) {
      case 'SUPER_USER': return 'red'
      case 'ADMIN': return 'blue'
      case 'MEMBER': return 'green'
      case 'USER': return 'gray'
      default: return 'gray'
    }
  })
  
  const roleIcon = computed(() => {
    switch (authStore.userRole) {
      case 'SUPER_USER': return 'i-heroicons-star'
      case 'ADMIN': return 'i-heroicons-shield-check'
      case 'MEMBER': return 'i-heroicons-user-circle'
      case 'USER': return 'i-heroicons-user'
      default: return 'i-heroicons-user'
    }
  })
  
  const roleLabel = computed(() => 
    authStore.userRole ? ROLE_LABELS[authStore.userRole] : 'User'
  )
  
  return { 
    roleColor, 
    roleIcon, 
    roleLabel 
  }
}
