import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { MapPin, Plus, Minus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProfile } from '@/lib/hooks/useProfile'
import { useCheckout } from '@/lib/hooks/useCheckout'
import { useUpdateCartItem } from '@/lib/hooks/useCart'

interface CheckoutCartItem {
  id: number
  menu: {
    id: number
    foodName: string
    price: number
    type: string
    image?: string
  }
  quantity: number
  itemTotal: number
}

interface CheckoutData {
  restaurant: {
    id: number
    name: string
    logo?: string
  }
  items: CheckoutCartItem[]
  subtotal: number
}

const paymentMethods = [
  { id: 'BNI Bank Negara Indonesia', name: 'Bank Negara Indonesia', logo: '🏦' },
  { id: 'BRI Bank Rakyat Indonesia', name: 'Bank Rakyat Indonesia', logo: '🏦' },
  { id: 'BCA Bank Central Asia', name: 'Bank Central Asia', logo: '🏦' },
  { id: 'Mandiri', name: 'Mandiri', logo: '🏦' },
]

function CheckoutPage() {
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState('BNI Bank Negara Indonesia')
  const [notes, setNotes] = useState('')
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  
  const { data: profileData } = useProfile()
  const checkout = useCheckout()
  const updateCartItem = useUpdateCartItem()

  const user = profileData?.data

  // Load checkout data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutData')
    if (savedData) {
      setCheckoutData(JSON.parse(savedData))
    } else {
      // Redirect back to cart if no data
      navigate({ to: '/cart' })
    }
  }, [navigate])

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1 || !checkoutData) return
    
    // Update in cart via API
    updateCartItem.mutate({ id: itemId, quantity: newQuantity }, {
      onSuccess: () => {
        // Update local checkout data
        setCheckoutData({
          ...checkoutData,
          items: checkoutData.items.map(item =>
            item.id === itemId
              ? { ...item, quantity: newQuantity, itemTotal: item.menu.price * newQuantity }
              : item
          )
        })
      }
    })
  }

  const handleBuy = () => {
    if (!checkoutData || !user) return

    const orderData = {
      restaurants: [{
        restaurantId: checkoutData.restaurant.id,
        items: checkoutData.items.map(item => ({
          menuId: item.menu.id,
          quantity: item.quantity
        }))
      }],
      deliveryAddress: user.name, // Use user's profile data or allow custom input
      phone: user.phone,
      paymentMethod: selectedPayment,
      notes: notes || undefined
    }

    checkout.mutate(orderData, {
      onSuccess: () => {
        // Clear checkout data from localStorage
        localStorage.removeItem('checkoutData')
        // Navigate to orders page
        navigate({ to: '/orders' })
      }
    })
  }

  if (!checkoutData) {
    return null
  }

  const itemsTotal = checkoutData.items.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  )

  const deliveryFee = 10000
  const serviceFee = 1000
  const total = itemsTotal + deliveryFee + serviceFee

  return (
    <main className="flex-1 bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {checkout.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to process checkout. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Address & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Delivery Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.name || 'Not available'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.phone || 'Not available'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">Change</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {checkoutData.restaurant.logo ? (
                    <img
                      src={checkoutData.restaurant.logo}
                      alt={checkoutData.restaurant.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {checkoutData.restaurant.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-semibold">
                    {checkoutData.restaurant.name}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/cart">Add Item</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {checkoutData.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.menu.image ? (
                      <img
                        src={item.menu.image}
                        alt={item.menu.foodName}
                        className="w-20 h-20 rounded object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.menu.foodName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.menu.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updateCartItem.isPending}
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
                        disabled={updateCartItem.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Order Notes (Optional)</h3>
              <Textarea
                placeholder="Add any special instructions for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment & Summary */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 border rounded-lg p-3"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="text-2xl">{method.logo}</span>
                        <span className="text-sm">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Payment Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Price ({checkoutData.items.length} items)
                  </span>
                  <span className="font-medium">{formatPrice(itemsTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">{formatPrice(serviceFee)}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(total)}</span>
                </div>
                <Button 
                  onClick={handleBuy}
                  disabled={checkout.isPending}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {checkout.isPending ? 'Processing...' : 'Buy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_app/checkout')({
  component: CheckoutPage,
})
