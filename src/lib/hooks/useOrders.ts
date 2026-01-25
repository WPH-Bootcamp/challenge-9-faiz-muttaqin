import type { AxiosError } from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type ErrorResponse } from '../api'

export interface OrderItem {
  menuId: number
  menuName: string
  price: number
  image?: string
  quantity: number
  itemTotal: number
}

export interface OrderRestaurant {
  restaurant: {
    id: number
    name: string
    logo?: string
  }
  items: OrderItem[]
  subtotal: number
}

export interface Order {
  id: number
  transactionId: string
  status: 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled'
  paymentMethod: string
  deliveryAddress: string
  phone: string
  pricing: {
    subtotal: number
    serviceFee: number
    deliveryFee: number
    totalPrice: number
  }
  restaurants: OrderRestaurant[]
  createdAt: string
  updatedAt: string
}

export interface OrdersResponse {
  success: boolean
  message: string
  data: {
    orders: Order[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    filter?: {
      status?: string
    }
  }
}

export interface CreateReviewRequest {
  transactionId: string
  restaurantId: number
  star: number
  comment: string
  menuIds?: number[]
}

export interface UpdateReviewRequest {
  star?: number
  comment?: string
}

export interface MyReview {
  id: number
  userId: number
  restaurantId: number
  transactionId: string
  star: number
  comment: string
  createdAt: string
  restaurant: {
    id: number
    name: string
    logo?: string
  }
}

export interface MyReviewsResponse {
  success: boolean
  message: string
  data: {
    reviews: MyReview[]
  }
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

// Get user's reviews
export function useMyReviews() {
  const hasAuthToken = !!localStorage.getItem('authToken')

  return useQuery<MyReviewsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const response = await api.get<MyReviewsResponse>('/api/review/my-reviews')
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
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
    },
  })
}

// Update existing review
export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation<
    ReviewResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateReviewRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ReviewResponse>(`/api/review/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
    },
  })
}

// Delete review
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean; message: string },
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/review/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
    },
  })
}
