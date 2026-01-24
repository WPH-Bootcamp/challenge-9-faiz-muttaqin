import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Star, MapPin, Plus, Minus, Share2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRestaurantDetail } from '@/lib/hooks/useRestaurants'
import { useCart, useAddToCart, useUpdateCartItem, useDeleteCartItem } from '@/lib/hooks/useCart'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

function RestaurantDetailPage() {
  const { restaurantId } = Route.useParams()
  const [activeTab, setActiveTab] = useState('all')
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<number, number>>({})

  // Fetch restaurant details
  const { data: restaurantData, isLoading, isError } = useRestaurantDetail(restaurantId)
  
  // Fetch cart to get actual quantities
  const { data: cartData } = useCart()
  
  // Cart mutations
  const addToCart = useAddToCart()
  const updateCartItem = useUpdateCartItem()
  const deleteCartItem = useDeleteCartItem()

  const restaurant = restaurantData?.data

  // Get actual cart quantities and item IDs for this restaurant
  const cartQuantities = useMemo(() => {
    const quantities: Record<number, number> = {}
    if (cartData?.data?.cart && Array.isArray(cartData.data.cart) && restaurant) {
      const restaurantCart = cartData.data.cart.find(r => r.restaurant.id === restaurant.id)
      if (restaurantCart) {
        restaurantCart.items.forEach(item => {
          quantities[item.menu.id] = item.quantity
        })
      }
    }
    return quantities
  }, [cartData, restaurant])

  // Get cart item IDs by menu ID
  const cartItemIds = useMemo(() => {
    const ids: Record<number, number> = {}
    if (cartData?.data?.cart && Array.isArray(cartData.data.cart) && restaurant) {
      const restaurantCart = cartData.data.cart.find(r => r.restaurant.id === restaurant.id)
      if (restaurantCart) {
        restaurantCart.items.forEach(item => {
          ids[item.menu.id] = item.id
        })
      }
    }
    return ids
  }, [cartData, restaurant])

  // Get display quantity (optimistic or actual)
  const getQuantity = (menuId: number) => {
    // Use optimistic if it exists and differs from cart, otherwise use cart value
    if (menuId in optimisticQuantities) {
      return optimisticQuantities[menuId]
    }
    return cartQuantities[menuId] || 0
  }

  // Handle add to cart with optimistic update
  const handleAddToCart = (menuId: number) => {
    if (!restaurant) return
    
    const currentQty = getQuantity(menuId)
    const newQty = currentQty + 1
    
    // Optimistic update
    setOptimisticQuantities(prev => ({
      ...prev,
      [menuId]: newQty
    }))
    
    // API call
    addToCart.mutate({
      restaurantId: restaurant.id,
      menuId: menuId,
      quantity: 1
    }, {
      onSuccess: () => {
        // Clear optimistic state once API confirms
        setOptimisticQuantities(prev => {
          const updated = { ...prev }
          delete updated[menuId]
          return updated
        })
      }
    })
  }

  // Handle quantity decrease with optimistic update
  const handleDecreaseQuantity = (menuId: number) => {
    const currentQty = getQuantity(menuId)
    if (currentQty <= 0) return
    
    const newQty = currentQty - 1
    const itemId = cartItemIds[menuId]
    
    if (!itemId) return
    
    // Optimistic update
    setOptimisticQuantities(prev => ({
      ...prev,
      [menuId]: newQty
    }))
    
    // API call - delete if quantity is 0, otherwise update
    if (newQty === 0) {
      deleteCartItem.mutate(itemId, {
        onSuccess: () => {
          setOptimisticQuantities(prev => {
            const updated = { ...prev }
            delete updated[menuId]
            return updated
          })
        }
      })
    } else {
      updateCartItem.mutate({ id: itemId, quantity: newQty }, {
        onSuccess: () => {
          setOptimisticQuantities(prev => {
            const updated = { ...prev }
            delete updated[menuId]
            return updated
          })
        }
      })
    }
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter menus by type
  const filteredMenus = useMemo(() => {
    if (!restaurant?.menus) return []
    if (activeTab === 'all') return restaurant.menus
    return restaurant.menus.filter(menu => menu.type.toLowerCase() === activeTab.toLowerCase())
  }, [restaurant, activeTab])

  if (isLoading) {
    return (
      <main className="flex-1 bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Image Gallery Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="aspect-4/3 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 rounded-lg" />
                ))}
              </div>
            </div>
            
            {/* Restaurant Info Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !restaurant) {
    return (
      <main className="flex-1 bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load restaurant details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-4/3 rounded-lg overflow-hidden">
              <img
                src={restaurant.images[0]}
                alt="Restaurant main"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {restaurant.images.slice(1, 4).map((image, index) => (
                <div key={index} className="aspect-4/3 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Restaurant ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.star.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.place}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menu & Review Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="all"
                className="rounded-full m-2 border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-primary/10 data-[state=active]:text-primary "
              >
                All Menu
              </TabsTrigger>
              <TabsTrigger
                value="food"
                className="rounded-full m-2 border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-primary/10 data-[state=active]:text-primary "
              >
                Food
              </TabsTrigger>
              <TabsTrigger
                value="drink"
                className="rounded-full m-2 border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-primary/10 data-[state=active]:text-primary "
              >
                Drink
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredMenus.map((item) => {
                  const quantity = getQuantity(item.id)
                  
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.food_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 truncate">{item.food_name}</h3>
                        <p className="text-sm font-semibold mb-3">
                          {formatPrice(item.price)}
                        </p>
                        {quantity > 0 ? (
                          <div className="flex items-center justify-between">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleDecreaseQuantity(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold">{quantity}</span>
                            <Button
                              size="icon"
                              className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                              onClick={() => handleAddToCart(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => handleAddToCart(item.id)}
                          >
                            Add
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredMenus.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No {activeTab === 'all' ? 'menu items' : activeTab} available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Review</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {restaurant.star.toFixed(1)} ({restaurant.reviews.length} Reviews)
                </span>
              </div>
            </div>

            {restaurant.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.user.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.star
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_app/restaurant/$restaurantId')({
  component: RestaurantDetailPage,
})
