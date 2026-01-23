import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api, type ErrorResponse } from '../api'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  latitude?: number
  longitude?: number
  createdAt?: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: User
  }
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  avatar?: string
  latitude?: number
  longitude?: number
}

// Get user profile
export function useProfile() {
  return useQuery<ProfileResponse, AxiosError<ErrorResponse>>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/api/auth/profile')
      return response.data
    },
  })
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation<ProfileResponse, AxiosError<ErrorResponse>, UpdateProfileRequest>({
    mutationFn: async (data) => {
      const response = await api.put<ProfileResponse>('/api/auth/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(['profile'], data)
      // Update localStorage user data
      if (data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user))
        window.dispatchEvent(new Event('storage'))
      }
    },
  })
}
