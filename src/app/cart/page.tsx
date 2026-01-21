'use client';

import { useAppSelector } from '@/features/hooks';
import { selectCartItems, selectCartTotal } from '@/features/cart/cartSlice';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/config/constants';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Your cart is empty"
          description="Start adding items to your cart to see them here"
          action={
            <Link href={ROUTES.HOME}>
              <Button>Browse Menu</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart items will be implemented here */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <h3>{item.menuItem.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>{formatCurrency(item.menuItem.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Link href={ROUTES.CHECKOUT}>
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
