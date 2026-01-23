import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export interface Restaurant {
  id: number
  name: string
  star: number
  place: string
  lat: number
  long: number
  logo: string
  images: string[]
  category?: string
  reviewCount?: number
  sampleMenus?: Array<{
    id: number
    foodName: string
    price: number
    type: string
    image: string
  }>
  isFrequentlyOrdered?: boolean
}

export interface RestaurantsResponse {
  data: {
    recommendations?: Restaurant[]
    restaurants?: Restaurant[]
  } | Restaurant[]
}

export interface RestaurantParams {
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  limit?: number
}

// Get recommended restaurants
export function useRecommendedRestaurants(options?: { enabled?: boolean }) {
  return useQuery<RestaurantsResponse>({
    queryKey: ['restaurants', 'recommended'],
    queryFn: async () => {
      const response = await api.get<RestaurantsResponse>(
        '/api/resto/recommended'
      )
      return response.data
    },
    enabled: options?.enabled !== undefined ? options.enabled : true,
  })
}

// Get nearby restaurants
export function useNearbyRestaurants() {
  return useQuery<RestaurantsResponse>({
    queryKey: ['restaurants', 'nearby'],
    queryFn: async () => {
      const response = await api.get<RestaurantsResponse>('/api/resto/nearby')
      return response.data
    },
  })
}

// Get best seller restaurants
export function useBestSellerRestaurants(limit?: number) {
  return useQuery<RestaurantsResponse>({
    queryKey: ['restaurants', 'best-seller', limit],
    queryFn: async () => {
      const response = await api.get<RestaurantsResponse>(
        '/api/resto/best-seller',
        {
          params: { limit },
        }
      )
      return response.data
    },
  })
}

// Search restaurants
export function useSearchRestaurants(params: RestaurantParams) {
  return useQuery<RestaurantsResponse>({
    queryKey: ['restaurants', 'search', params],
    queryFn: async () => {
      const response = await api.get<RestaurantsResponse>('/api/resto/search', {
        params,
      })
      return response.data
    },
    enabled: !!params.search,
  })
}

// Get all restaurants with filters
export function useRestaurants(params?: RestaurantParams) {
  return useQuery<RestaurantsResponse>({
    queryKey: ['restaurants', params],
    queryFn: async () => {
      const response = await api.get<RestaurantsResponse>('/api/resto', {
        params,
      })
      return response.data
    },
  })
}
