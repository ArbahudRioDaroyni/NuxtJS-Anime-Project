export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side
  if (import.meta.server) return

  const authStore = useAuthStore()
  
  // Restore auth from localStorage
  authStore.restoreAuth()

  // Protected routes (dashboard)
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))

  // Auth routes (login, signup)
  const authRoutes = ['/auth/login', '/auth/signup']
  const isAuthRoute = authRoutes.some(route => to.path.startsWith(route))

  // If accessing auth routes while logged in, redirect to dashboard
  if (isAuthRoute && authStore.isLoggedIn) {
    return navigateTo('/dashboard/animes')
  }

  // If accessing protected routes while not logged in
  if (isProtectedRoute && !authStore.isLoggedIn) {
    // Try to fetch user first
    try {
      await authStore.fetchUser()
    } catch {
      // If fetch fails, redirect to login
      return navigateTo('/auth/login')
    }
  }
})
