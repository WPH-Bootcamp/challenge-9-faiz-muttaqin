export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const API_ENDPOINTS = {
  MENU: '/api/menu',
  CATEGORIES: '/api/categories',
  ORDERS: '/api/orders',
} as const;

export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
} as const;
