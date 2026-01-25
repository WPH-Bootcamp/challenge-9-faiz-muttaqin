import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface InvoiceData {
  transactionId: string
  userId: number
  paymentMethod: string
  price: number
  serviceFee: number
  deliveryFee: number
  totalPrice: number
  status: string
  createdAt: string
  restaurant: {
    id: number
    name: string
    logo?: string
  }
  items: {
    menuId: number
    menuName: string
    price: number
    image?: string
    quantity: number
    itemTotal: number
  }[]
}

export const Route = createFileRoute('/invoices')({
  component: InvoiceComponent,
})

function InvoiceComponent() {
  const navigate = useNavigate()
  const [invoiceData] = useState<InvoiceData | null>(() => {
    const savedData = localStorage.getItem('invoiceData')
    return savedData ? JSON.parse(savedData) : null
  })

  useEffect(() => {
    if (!invoiceData) {
      navigate({ to: '/orders' })
    }
  }, [invoiceData, navigate])

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!invoiceData) {
    return null
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg className="w-10 h-10 text-primary" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M22.5 0H19.5V13.2832L14.524 0.967222L11.7425 2.09104L16.8474 14.726L7.21142 5.09009L5.09011 7.21142L14.3257 16.447L2.35706 11.2178L1.15596 13.9669L13.8202 19.5H0V22.5H13.8202L1.15597 28.0331L2.35706 30.7822L14.3257 25.553L5.09011 34.7886L7.21142 36.9098L16.8474 27.274L11.7425 39.909L14.524 41.0327L19.5 28.7169V42H22.5V28.7169L27.476 41.0327L30.2574 39.909L25.1528 27.274L34.7886 36.9098L36.9098 34.7886L27.6742 25.553L39.643 30.7822L40.8439 28.0331L28.1799 22.5H42V19.5H28.1797L40.8439 13.9669L39.643 11.2178L27.6742 16.447L36.9098 7.2114L34.7886 5.09009L25.1528 14.726L30.2574 2.09104L27.476 0.967222L22.5 13.2832V0Z" fill="currentColor" />
          </svg>
          <span className="text-2xl font-bold">Foody</span>
        </div>

        {/* Invoice Card */}
        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Payment Success</h2>
              <p className="text-sm text-muted-foreground">
                Your payment has been successfully processed.
              </p>
            </div>

            {/* Restaurant and Items */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b">
                {invoiceData.restaurant.logo && (
                  <img
                    src={invoiceData.restaurant.logo}
                    alt={invoiceData.restaurant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{invoiceData.restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground">{invoiceData.items.length} items</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.menuName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.menuName}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.itemTotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-3 border-y py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(invoiceData.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{invoiceData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({invoiceData.items.length} items)</span>
                <span className="font-medium">{formatPrice(invoiceData.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">{formatPrice(invoiceData.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium">{formatPrice(invoiceData.serviceFee)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatPrice(invoiceData.totalPrice)}</span>
            </div>

            {/* See My Orders Button */}
            <Button
              asChild
              className="w-full bg-red-600 hover:bg-red-700 h-12"
            >
              <Link to="/orders">See My Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
