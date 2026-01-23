import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Star, FileText, MapPin, LogOut, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { useOrders, useCreateReview } from '@/lib/hooks/useOrders'
import { useProfile } from '@/lib/hooks/useProfile'
import { useLogout } from '@/lib/hooks/useAuth'

interface ReviewDialogProps {
    transactionId: string
    restaurantName: string
    onSuccess: () => void
}

function ReviewDialog({ transactionId, restaurantName, onSuccess }: ReviewDialogProps) {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [open, setOpen] = useState(false)
    const createReview = useCreateReview()

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating')
            return
        }

        createReview.mutate(
            {
                transactionId,
                star: rating,
                comment: review,
            },
            {
                onSuccess: () => {
                    setOpen(false)
                    setRating(0)
                    setReview('')
                    onSuccess()
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">Give Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review {restaurantName}</DialogTitle>
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
                                    type="button"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= rating
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
                    {createReview.isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Failed to submit review. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={createReview.isPending || rating === 0}
                        className="w-full bg-red-600 hover:bg-red-700"
                    >
                        {createReview.isPending ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function OrdersPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('done')
    const [searchQuery, setSearchQuery] = useState('')
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    
    // Map UI tab values to API status values
    const getApiStatus = (tabValue: string) => {
        if (tabValue === 'all') return undefined
        return tabValue
    }
    
    const { data: profileData } = useProfile()
    const { data: ordersData, isLoading, isError, refetch } = useOrders(getApiStatus(activeTab))
    const logout = useLogout()

    const user = profileData?.data

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            navigate({ to: '/sign-in' })
        }
    }, [navigate])

    const handleLogout = () => {
        setShowLogoutDialog(false)
        logout()
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const formatPrice = (price: number) => {
        return `Rp${price.toLocaleString('id-ID')}`
    }

    const orders = ordersData?.data?.orders || []
    const filteredOrders = orders.filter((order) =>
        searchQuery === '' || order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <main className="flex-1 bg-background pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Sidebar */}
                            <aside className="md:col-span-1">
                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        {user ? (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <Skeleton className="h-12 w-full" />
                                        )}

                                        <Separator />

                                        <nav className="space-y-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
                                            >
                                                <FileText className="h-4 w-4" />
                                                <span className="text-sm">Profile</span>
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent bg-primary/10 text-primary"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm font-medium">My Orders</span>
                                            </Link>
                                            <button
                                                onClick={() => setShowLogoutDialog(true)}
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent w-full text-left"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span className="text-sm">Logout</span>
                                            </button>
                                        </nav>
                                    </CardContent>
                                </Card>
                            </aside>

                            {/* Main Content */}
                            <div className="md:col-span-3">
                                <Card>
                                    <CardContent className="p-8">
                                        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                                        {/* Search */}
                                        <div className="relative mb-6">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>

                                        {/* Status Tabs */}
                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                                            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1">
                                                <TabsTrigger value="all">All</TabsTrigger>
                                                <TabsTrigger value="preparing">Preparing</TabsTrigger>
                                                <TabsTrigger value="on_the_way">On the Way</TabsTrigger>
                                                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                                                <TabsTrigger value="done">Done</TabsTrigger>
                                                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                                            </TabsList>
                                        </Tabs>

                                        {/* Error State */}
                                        {isError && (
                                            <Alert variant="destructive" className="mb-6">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Failed to load orders. Please try again later.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Loading State */}
                                        {isLoading ? (
                                            <div className="space-y-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <Card key={i}>
                                                        <CardContent className="p-6 space-y-4">
                                                            <Skeleton className="h-6 w-32" />
                                                            <Skeleton className="h-20 w-full" />
                                                            <Skeleton className="h-10 w-full" />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : filteredOrders.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-muted-foreground">No orders found</p>
                                            </div>
                                        ) : (
                                            /* Orders List */
                                            <div className="space-y-4">
                                                {filteredOrders.map((order) => (
                                                    <Card key={order.transactionId}>
                                                        <CardContent className="p-6 space-y-4">
                                                            {/* Restaurant Header */}
                                                            <Link
                                                                to="/restaurant/$restaurantId"
                                                                params={{ restaurantId: String(order.restaurant.id) }}
                                                                className="flex items-center gap-2 hover:opacity-80"
                                                            >
                                                                {order.restaurant.logo ? (
                                                                    <img
                                                                        src={order.restaurant.logo}
                                                                        alt={order.restaurant.name}
                                                                        className="w-8 h-8 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                                                        <span className="text-white font-bold text-xs">
                                                                            {order.restaurant.name.slice(0, 2).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <span className="font-semibold">{order.restaurant.name}</span>
                                                            </Link>

                                                            {/* Order Items */}
                                                            {order.items.map((item) => (
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
                                                                            {item.quantity} x {formatPrice(item.price)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Total and Action */}
                                                            <div className="flex items-center justify-between pt-4 border-t">
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Total</p>
                                                                    <p className="text-xl font-bold">{formatPrice(order.totalPrice)}</p>
                                                                </div>
                                                                {order.status === 'done' && (
                                                                    <ReviewDialog
                                                                        transactionId={order.transactionId}
                                                                        restaurantName={order.restaurant.name}
                                                                        onSuccess={() => refetch()}
                                                                    />
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be signed out of your account and redirected to the sign-in page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export const Route = createFileRoute('/_app/orders')({
    component: OrdersPage,
})
