import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Plus, Minus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart, useUpdateCartItem, useDeleteCartItem } from '@/lib/hooks/useCart'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

function CartPage() {
  const navigate = useNavigate()
  const { data: cartData, isLoading, isError } = useCart()
  const updateCartItem = useUpdateCartItem()
  const deleteCartItem = useDeleteCartItem()

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      deleteCartItem.mutate(itemId)
    } else {
      updateCartItem.mutate({ id: itemId, quantity: newQuantity })
    }
  }

  const handleDeleteItem = (itemId: number) => {
    deleteCartItem.mutate(itemId)
  }

  const calculateTotal = (items: Array<{ menu: { price: number }; quantity: number }>) => {
    return items.reduce((sum, item) => sum + item.menu.price * item.quantity, 0)
  }

  const cartItems = Array.isArray(cartData?.data?.cart) ? cartData.data.cart : []

  const handleCheckout = (restaurantCart: typeof cartItems[0]) => {
    // Save checkout data to localStorage
    localStorage.setItem('checkoutData', JSON.stringify({
      restaurant: restaurantCart.restaurant,
      items: restaurantCart.items,
      subtotal: restaurantCart.subtotal
    }))
    navigate({ to: '/checkout' })
  }

  return (
    <main className="flex-1 bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">My Cart</h1>

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load cart. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button asChild>
                  <Link to="/">Browse Restaurants</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {cartItems.map((cartRestaurant) => (
                <Card key={cartRestaurant.restaurant.id}>
                  <CardContent className="p-6 space-y-4">
                    {/* Restaurant Header */}
                    <Link
                      to="/restaurant/$restaurantId"
                      params={{ restaurantId: String(cartRestaurant.restaurant.id) }}
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      {cartRestaurant.restaurant.logo && (
                        <img
                          src={cartRestaurant.restaurant.logo}
                          alt={cartRestaurant.restaurant.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="font-semibold">{cartRestaurant.restaurant.name}</span>
                      <span className="text-muted-foreground">›</span>
                    </Link>

                    {/* Cart Items */}
                    <div className="space-y-4">
                      {cartRestaurant.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.menu.image && (
                            <img
                              src={item.menu.image}
                              alt={item.menu.foodName}
                              className="w-20 h-20 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.menu.foodName}</h3>
                            <p className="text-sm font-semibold text-muted-foreground">
                              {formatPrice(item.menu.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updateCartItem.isPending || deleteCartItem.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateCartItem.isPending || deleteCartItem.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={deleteCartItem.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
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
                          {formatPrice(calculateTotal(cartRestaurant.items))}
                        </p>
                      </div>
                      <Button 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleCheckout(cartRestaurant)}
                      >
                        Checkout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_app/cart')({
  component: CartPage,
})
