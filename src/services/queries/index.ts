import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi, categoriesApi, ordersApi } from '../api';
import { CreateOrderRequest } from '@/types';

// Query Keys
export const QUERY_KEYS = {
  MENU: ['menu'],
  MENU_ITEM: (id: string) => ['menu', id],
  CATEGORIES: ['categories'],
  ORDERS: ['orders'],
  ORDER: (id: string) => ['orders', id],
} as const;

// Menu Queries
export const useMenuQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU,
    queryFn: menuApi.getAll,
  });
};

export const useMenuItemQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEM(id),
    queryFn: () => menuApi.getById(id),
    enabled: !!id,
  });
};

// Categories Query
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: categoriesApi.getAll,
  });
};

// Orders Queries
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: ordersApi.getAll,
  });
};

export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

// Order Mutation
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      ordersApi.create(orderData),
    onSuccess: () => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });
};
