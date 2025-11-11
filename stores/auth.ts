import { defineStore } from 'pinia'
import type { UserRole, User as AuthUser } from '~/types/auth'
import { hasRole, isAdmin, isSuperUser, canAccessDashboard, parseUserRole } from '~/types/auth'

type User = AuthUser

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    userRole: (state): UserRole | null => state.user?.role || null,
    
    // Role checking getters
    isAdminUser: (state) => state.user ? isAdmin(state.user.role) : false,
    isSuperUserRole: (state) => state.user ? isSuperUser(state.user.role) : false,
    canViewDashboard: (state) => state.user ? canAccessDashboard(state.user.role) : false,
    
    // General role checker
    hasMinimumRole: (state) => {
      return (requiredRole: UserRole) => {
        return state.user ? hasRole(state.user.role, requiredRole) : false
      }
    }
  },

  actions: {
    async fetchUser() {
      this.isLoading = true
      try {
        const response = await $fetch<{ user: User }>('/api/auth/me')
        const user = {
          ...response.user,
          role: parseUserRole(response.user.role)
        }
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const response = await $fetch<{ user: User }>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        const user = {
          ...response.user,
          role: parseUserRole(response.user.role)
        }
        this.user = user
        this.isAuthenticated = true
        
        // Force persistence
        if (import.meta.client) {
          localStorage.setItem('auth_state', JSON.stringify({
            user,
            isAuthenticated: true
          }))
        }
        
        return user
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.isAuthenticated = false
        
        // Clear localStorage
        if (import.meta.client) {
          localStorage.removeItem('auth_state')
        }
      }
    },

    // Restore auth state from localStorage
    restoreAuth() {
      if (import.meta.client) {
        const stored = localStorage.getItem('auth_state')
        if (stored) {
          try {
            const { user, isAuthenticated } = JSON.parse(stored)
            this.user = user
            this.isAuthenticated = isAuthenticated
          } catch {
            localStorage.removeItem('auth_state')
          }
        }
      }
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
    }
  }
})
