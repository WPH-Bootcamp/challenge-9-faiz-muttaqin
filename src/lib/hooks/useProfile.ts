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
  data: User
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  avatar?: File
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
      // If avatar file is included, use FormData
      if (data.avatar instanceof File) {
        const formData = new FormData()
        if (data.name) formData.append('name', data.name)
        if (data.email) formData.append('email', data.email)
        if (data.phone) formData.append('phone', data.phone)
        formData.append('avatar', data.avatar)
        if (data.latitude) formData.append('latitude', data.latitude.toString())
        if (data.longitude) formData.append('longitude', data.longitude.toString())
        
        const response = await api.put<ProfileResponse>('/api/auth/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      }
      
      // Otherwise use JSON
      const response = await api.put<ProfileResponse>('/api/auth/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(['profile'], data)
      // Update localStorage user data
      if (data.data) {
        localStorage.setItem('user', JSON.stringify(data.data))
        window.dispatchEvent(new Event('storage'))
      }
    },
  })
}
