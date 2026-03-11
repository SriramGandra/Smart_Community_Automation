import { apiConfig, getAuthToken, removeAuthToken } from '../config/api'
import { showToast } from '../utils/toast'

class ApiClient {
  constructor() {
    this.baseURL = apiConfig.baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = getAuthToken()

    const config = {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        // Handle 401 Unauthorized (but don't redirect on login page)
        if (response.status === 401) {
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            removeAuthToken()
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
          return Promise.reject(new Error(data.message || data.error || 'Invalid credentials'))
        }

        // Handle 403 Forbidden (wrong role)
        if (response.status === 403) {
          return Promise.reject(new Error(data.message || data.error || 'Invalid role for this user'))
        }

        throw new Error(data.message || data.error || 'An error occurred')
      }

      return data
    } catch (error) {
      // Network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error:', error)
        showToast('Unable to connect to server. Please check your connection.', 'error')
        throw new Error('Network error: Unable to connect to server')
      }
      
      console.error('API Error:', error)
      if (error.message && !error.message.includes('Network error')) {
        showToast(error.message, 'error')
      }
      throw error
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // For file uploads
  async postFormData(endpoint, formData) {
    const token = getAuthToken()
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken()
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(new Error('Unauthorized'))
        }
        
        const error = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.message || 'Upload failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Upload error:', error)
      showToast(error.message || 'Upload failed', 'error')
      throw error
    }
  }
}

export const apiClient = new ApiClient()

