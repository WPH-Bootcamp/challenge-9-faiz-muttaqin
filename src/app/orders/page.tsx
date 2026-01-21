'use client';

import { useOrdersQuery } from '@/services/queries';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useOrdersQuery();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Failed to load orders"
          description="There was an error loading your order history"
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here once you place your first order"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    order.status === 'completed'
                      ? 'default'
                      : order.status === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.phoneNumber}</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                </div>
                <div className="border-t pt-2 mt-2">
                  <p className="font-semibold">
                    Total: {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
