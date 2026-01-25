import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api, type ErrorResponse } from '../api'

export interface CheckoutItem {
  menuId: number
  quantity: number
}

export interface CheckoutRestaurant {
  restaurantId: number
  items: CheckoutItem[]
}

export interface CheckoutRequest {
  restaurants: CheckoutRestaurant[]
  deliveryAddress: string
  phone: string
  paymentMethod: string
  notes?: string
}

export interface CheckoutResponse {
  success: boolean
  message: string
  data: {
    transactionId: string
    userId: number
    paymentMethod: string
    price: number
    serviceFee: number
    deliveryFee: number
    totalPrice: number
    status: string
    createdAt: string
  }
}

// Create order from checkout
export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation<CheckoutResponse, AxiosError<ErrorResponse>, CheckoutRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CheckoutResponse>('/api/order/checkout', data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate cart and orders queries
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
