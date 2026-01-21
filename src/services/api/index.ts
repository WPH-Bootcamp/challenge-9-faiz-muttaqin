import apiClient from "./axios";
import { MenuItem, Category, Order, CreateOrderRequest } from '@/types';

// Menu API
export const menuApi = {
	getAll: async (): Promise<MenuItem[]> => {
		const response = await apiClient.get("/api/menu");
		return response.data;
	},

	getById: async (id: string): Promise<MenuItem> => {
		const response = await apiClient.get(`/api/menu/${id}`);
		return response.data;
	},
};

// Categories API
export const categoriesApi = {
	getAll: async (): Promise<Category[]> => {
		const response = await apiClient.get("/api/categories");
		return response.data;
	},
};

// Orders API
export const ordersApi = {
	create: async (
		orderData: CreateOrderRequest,
	): Promise<Order> => {
		const response = await apiClient.post("/api/orders", orderData);
		return response.data;
	},

	getAll: async (): Promise<Order[]> => {
		const response = await apiClient.get("/api/orders");
		return response.data;
	},

	getById: async (id: string): Promise<Order> => {
		const response = await apiClient.get(`/api/orders/${id}`);
		return response.data;
	},
};
