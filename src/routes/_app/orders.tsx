import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// Mock orders data
const orders = [
    {
        id: 1,
        restaurantName: 'Burger King',
        items: [
            {
                name: 'Food Name',
                quantity: 2,
                price: 50000,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
            },
        ],
        total: 100000,
        status: 'done' as const,
    },
    {
        id: 2,
        restaurantName: 'Burger King',
        items: [
            {
                name: 'Food Name',
                quantity: 2,
                price: 50000,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
            },
        ],
        total: 100000,
        status: 'done' as const,
    },
]

function ReviewDialog({ orderId: _orderId }: { orderId: number }) {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">Give Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Give Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-2">Give Rating</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Please share your thoughts about our service!"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                    />
                    <Button className="w-full bg-red-600 hover:bg-red-700">Send</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function OrdersPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const formatPrice = (price: number) => {
        return `Rp${price.toLocaleString('id-ID')}`
    }

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'all') return true
        if (activeTab === 'preparing') return order.status === 'preparing'
        if (activeTab === 'on-the-way') return order.status === 'on-the-way'
        if (activeTab === 'delivered') return order.status === 'delivered'
        if (activeTab === 'done') return order.status === 'done'
        if (activeTab === 'canceled') return order.status === 'canceled'
        return true
    })

    return (
        <main className="flex-1 bg-background pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">My Orders</h1>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Status Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1">
                    <TabsTrigger value="all">Status</TabsTrigger>
                    <TabsTrigger value="preparing">Preparing</TabsTrigger>
                    <TabsTrigger value="on-the-way">On the Way</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="done" className="border-b-2 border-red-600">
                        Done
                    </TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <Card key={order.id}>
                        <CardContent className="p-6 space-y-4">
                            {/* Restaurant Header */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">BK</span>
                                </div>
                                <span className="font-semibold">{order.restaurantName}</span>
                            </div>

                            {/* Order Items */}
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x {formatPrice(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Total and Action */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                                </div>
                                {order.status === 'done' && <ReviewDialog orderId={order.id} />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            </div>
        </div>
        </main>
    )
}

export const Route = createFileRoute('/_app/orders')({
    component: OrdersPage,
})
