import type { AxiosError } from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type ErrorResponse } from '../api'

export interface OrderItem {
  id: number
  menuId: number
  quantity: number
  price: number
  menu: {
    id: number
    foodName: string
    price: number
    type: string
    image?: string
  }
}

export interface Order {
  transactionId: string
  userId: number
  paymentMethod: string
  price: number
  serviceFee: number
  deliveryFee: number
  totalPrice: number
  status: 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled'
  createdAt: string
  restaurant: {
    id: number
    name: string
    logo?: string
  }
  items: OrderItem[]
}

export interface OrdersResponse {
  success: boolean
  message: string
  data: {
    orders: Order[]
    pagination: {
      currentPage: number
      totalPages: number
      totalOrders: number
      ordersPerPage: number
    }
  }
}

export interface CreateReviewRequest {
  transactionId: string
  star: number
  comment: string
}

export interface ReviewResponse {
  success: boolean
  message: string
  data: {
    id: number
    userId: number
    restaurantId: number
    transactionId: string
    star: number
    comment: string
    createdAt: string
  }
}

// Get orders with optional status filter
export function useOrders(status?: string, page = 1) {
  const hasAuthToken = !!localStorage.getItem('authToken')

  return useQuery<OrdersResponse, AxiosError<ErrorResponse>>({
    queryKey: ['orders', status, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.append('status', status)
      params.append('page', page.toString())

      const response = await api.get<OrdersResponse>(
        `/api/order/my-order?${params.toString()}`
      )
      return response.data
    },
    enabled: hasAuthToken,
  })
}

// Create review for an order
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation<
    ReviewResponse,
    AxiosError<ErrorResponse>,
    CreateReviewRequest
  >({
    mutationFn: async (data) => {
      const response = await api.post<ReviewResponse>('/api/review', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
