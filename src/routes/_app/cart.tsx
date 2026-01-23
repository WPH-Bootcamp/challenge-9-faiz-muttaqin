import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Mock cart data
const cartItems = [
  {
    restaurantId: 1,
    restaurantName: 'Burger King',
    items: [
      {
        id: 1,
        name: 'Food Name',
        price: 50000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
      },
      {
        id: 2,
        name: 'Food Name',
        price: 50000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
      },
    ],
  },
  {
    restaurantId: 2,
    restaurantName: 'Burger King',
    items: [
      {
        id: 3,
        name: 'Food Name',
        price: 50000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
      },
      {
        id: 4,
        name: 'Food Name',
        price: 50000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
      },
    ],
  },
]

function CartPage() {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const calculateTotal = (items: typeof cartItems[0]['items']) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Cart</h1>

      <div className="space-y-6">
        {cartItems.map((restaurant) => (
          <Card key={restaurant.restaurantId}>
            <CardContent className="p-6 space-y-4">
              {/* Restaurant Header */}
              <Link
                to="/restaurant/$restaurantId"
                params={{ restaurantId: String(restaurant.restaurantId) }}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">BK</span>
                </div>
                <span className="font-semibold">{restaurant.restaurantName}</span>
                <span className="text-muted-foreground">›</span>
              </Link>

              {/* Cart Items */}
              <div className="space-y-4">
                {restaurant.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">
                    {formatPrice(calculateTotal(restaurant.items))}
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_app/cart')({
  component: CartPage,
})
