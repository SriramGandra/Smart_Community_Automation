// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Helper function to get auth token
export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

// Helper function to set auth token
export function setAuthToken(token) {
  localStorage.setItem('auth_token', token)
}

// Helper function to remove auth token
export function removeAuthToken() {
  localStorage.removeItem('auth_token')
}

