import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api, type ErrorResponse } from '../api'

export interface CartItem {
  id: number
  user_id: number
  resto_id: number
  menu_id: number
  quantity: number
  menu: {
    id: number
    food_name: string
    price: number
    type: string
    resto_id: number
    image?: string
  }
}

export interface CartRestaurant {
  resto_id: number
  resto_name: string
  resto_logo?: string
  items: CartItem[]
}

export interface CartResponse {
  success: boolean
  message: string
  data: CartRestaurant[]
}

export interface AddToCartRequest {
  resto_id: number
  menu_id: number
  quantity: number
}

export interface UpdateCartRequest {
  quantity: number
}

// Get cart items
export function useCart(options?: { enabled?: boolean }) {
  const hasAuthToken = !!localStorage.getItem('authToken')
  
  return useQuery<CartResponse, AxiosError<ErrorResponse>>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get<CartResponse>('/api/cart')
      return response.data
    },
    enabled: options?.enabled !== undefined ? options.enabled : hasAuthToken,
    placeholderData: {
      success: true,
      message: 'No cart data',
      data: []
    }
  })
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, AxiosError<ErrorResponse>, AddToCartRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CartResponse>('/api/cart', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation<
    CartResponse,
    AxiosError<ErrorResponse>,
    { id: number; quantity: number }
  >({
    mutationFn: async ({ id, quantity }) => {
      const response = await api.put<CartResponse>(`/api/cart/${id}`, {
        quantity,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Delete cart item
export function useDeleteCartItem() {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, AxiosError<ErrorResponse>, number>({
    mutationFn: async (id) => {
      const response = await api.delete<CartResponse>(`/api/cart/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Clear entire cart
export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, AxiosError<ErrorResponse>>({
    mutationFn: async () => {
      const response = await api.delete<CartResponse>('/api/cart')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
