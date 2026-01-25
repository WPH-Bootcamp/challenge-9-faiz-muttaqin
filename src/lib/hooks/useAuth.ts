import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api, type RegisterRequest, type LoginRequest, type AuthResponse, type ErrorResponse } from '../api'

export function useRegister() {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, RegisterRequest>({
    mutationFn: async (data) => {
      const response = await api.post<AuthResponse>('/api/auth/register', data)
      return response.data
    },
    onSuccess: (data) => {
      // Save token and user data from the response
      if (data.success && data.data) {
        localStorage.setItem('authToken', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))
        // Reload to update auth state
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
    },
  })
}

export function useLogin() {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, LoginRequest>({
    mutationFn: async (data) => {
      const response = await api.post<AuthResponse>('/api/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      // Save token and user data from the response
      if (data.success && data.data) {
        localStorage.setItem('authToken', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))
        // Reload to update auth state
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
    },
  })
}

export function useLogout() {
  return () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'))
    if (window.location.href !== '/'){
        window.location.href = '/sign-in'
    }
  }
}
