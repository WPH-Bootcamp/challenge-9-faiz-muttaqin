import axios from 'axios'

const API_BASE_URL =
  'https://restaurant-be-400174736012.asia-southeast2.run.app'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and user data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'))

      // Only redirect to sign-in if on protected pages
      const currentPath = window.location.pathname
      const protectedPaths = ['/profile', '/cart', '/checkout', '/orders']
      const isProtectedPage = protectedPaths.some(path => currentPath.startsWith(path))
      
      if (isProtectedPage && 
          !currentPath.includes('/sign-in') &&
          !currentPath.includes('/sign-up')) {
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

// Types based on swagger API
export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: number
      name: string
      email: string
      phone: string
      avatar?: string
      latitude?: number
      longitude?: number
      createdAt?: string
    }
  }
}

export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
}
