import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { MapPin, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// Mock checkout data
const deliveryAddress = {
  address: 'Jl. Sudirman No. 25, Jakarta Pusat, 10220',
  phone: '0812-3456-7890',
}

const cartItems = [
  {
    id: 1,
    restaurantName: 'Burger Bang',
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
]

const paymentMethods = [
  { id: 'bni', name: 'Bank Negara Indonesia', logo: '🏦' },
  { id: 'bri', name: 'Bank Rakyat Indonesia', logo: '🏦' },
  { id: 'bca', name: 'Bank Central Asia', logo: '🏦' },
  { id: 'mandiri', name: 'Mandiri', logo: '🏦' },
]

function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState('bni')

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const itemsTotal = cartItems.reduce(
    (sum, restaurant) =>
      sum +
      restaurant.items.reduce(
        (itemSum, item) => itemSum + item.price * item.quantity,
        0
      ),
    0
  )

  const deliveryFee = 10000
  const serviceFee = 1000
  const total = itemsTotal + deliveryFee + serviceFee

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

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
                      {deliveryAddress.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deliveryAddress.phone}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          {cartItems.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">BB</span>
                    </div>
                    <span className="font-semibold">
                      {restaurant.restaurantName}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/cart">Add Item</Link>
                  </Button>
                </div>

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
                        <p className="text-sm text-muted-foreground">
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
              </CardContent>
            </Card>
          ))}
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
                    Price (2 items)
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
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_app/checkout')({
  component: CheckoutPage,
})
