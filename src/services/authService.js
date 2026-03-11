import { apiClient } from './apiClient'
import { setAuthToken, removeAuthToken } from '../config/api'

const STORAGE_KEY = 'user'

export const authService = {
  async login(email, password, role) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        role
      })
      
      // Store token
      if (response.token) {
        setAuthToken(response.token)
      }
      
      // Store user info
      const user = response.user || response
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      
      return user
    } catch (error) {
      // No fallback - require valid authentication
      // Re-throw the error so the UI can handle it
      throw error
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      removeAuthToken()
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh')
      if (response.token) {
        setAuthToken(response.token)
      }
      return response.token
    } catch (error) {
      this.logout()
      throw error
    }
  }
}

