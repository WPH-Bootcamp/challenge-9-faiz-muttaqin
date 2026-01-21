// MenuItem type
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isAvailable: boolean;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Cart Item type
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

// Order type
export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// Filter state type
export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'rating';
  searchQuery: string;
}

// Checkout form type
export interface CheckoutForm {
  customerName: string;
  phoneNumber: string;
  address: string;
}

// Create Order Request type
export interface CreateOrderRequest extends CheckoutForm {
  items: CartItem[];
}
