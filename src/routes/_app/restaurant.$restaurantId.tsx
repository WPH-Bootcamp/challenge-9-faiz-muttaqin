import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Star, Share2, MapPin, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data
const restaurant = {
  id: 1,
  name: 'Burger King',
  rating: 4.9,
  location: 'Jakarta Selatan',
  distance: '2.4 km',
  images: [
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
  ],
}

const menuItems = [
  {
    id: 1,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  },
  {
    id: 2,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80',
  },
  {
    id: 3,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80',
  },
  {
    id: 4,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  },
  {
    id: 5,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80',
  },
  {
    id: 6,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&q=80',
  },
  {
    id: 7,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1562749097-d2f56fc9c08e?w=400&q=80',
  },
  {
    id: 8,
    name: 'Food Name',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80',
  },
]

const reviews = [
  {
    id: 1,
    author: 'Michael Brown',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      'What a fantastic place! The food was delicious, and the ambiance was delightful. A must-visit for anyone looking for a great time!',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    author: 'Sarah Davis',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      "I can't say enough good things! The service was exceptional, and the menu had so many great options. Definitely a five-star experience!",
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    author: 'David Wilson',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      "This place exceeded my expectations! The staff were welcoming, and the vibe was just right. I'll be returning soon!",
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    author: 'Emily Johnson',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      "Absolutely loved my visit! The staff were friendly and attentive, making sure everything was just right. Can't wait to come back!",
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    author: 'Jessica Taylor',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      'A wonderful experience overall! The food was exquisite, and the service was impeccable. Highly recommend for a special night out!',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    author: 'Alex Smith',
    date: '25 August 2025, 13:38',
    rating: 5,
    comment:
      'I had an amazing experience! The service was top-notch, and the atmosphere was perfect for a relaxing evening. Highly recommend!',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
]

function RestaurantDetailPage() {
  const { restaurantId } = Route.useParams()
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const updateQuantity = (itemId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }))
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`
  }

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-[4/3] rounded-lg overflow-hidden">
          <img
            src={restaurant.images[0]}
            alt="Restaurant main"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {restaurant.images.slice(1, 4).map((image, index) => (
            <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
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
              <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">BK</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {restaurant.location} · {restaurant.distance}
                    </span>
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
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="menu"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
          >
            Food
          </TabsTrigger>
          <TabsTrigger
            value="drink"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
          >
            Drink
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full border-red-600 text-red-600"
              >
                All Menu
              </Button>
              <Button variant="outline" className="rounded-full">
                Food
              </Button>
              <Button variant="outline" className="rounded-full">
                Drink
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm font-semibold mb-3">
                    {formatPrice(item.price)}
                  </p>
                  {quantities[item.id] > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{quantities[item.id]}</span>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      Add
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">Show More</Button>
          </div>
        </TabsContent>

        <TabsContent value="food" className="mt-6">
          <p className="text-muted-foreground text-center py-8">
            Food items will be displayed here
          </p>
        </TabsContent>

        <TabsContent value="drink" className="mt-6">
          <p className="text-muted-foreground text-center py-8">
            Drink items will be displayed here
          </p>
        </TabsContent>
      </Tabs>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Review</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {restaurant.rating} (24 Ulasan)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
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

        <div className="text-center">
          <Button variant="outline">Show More</Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_app/restaurant/$restaurantId')({
  component: RestaurantDetailPage,
})
