import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Star, Search, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useRecommendedRestaurants, useBestSellerRestaurants } from '@/lib/hooks/useRestaurants'
import { Alert, AlertDescription } from '@/components/ui/alert'

const heroImages = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80',
]

const categories = [
  { id: 'all', name: 'All Restaurant', icon: '/icon-all-food.png', color: 'bg-red-50' },
  { id: 'nearby', name: 'Nearby', icon: '/icon-location.png', color: 'bg-blue-50' },
  { id: 'discount', name: 'Discount', icon: '/icon-discount.png', color: 'bg-green-50' },
  { id: 'best-seller', name: 'Best Seller', icon: '/icon-best-seller.png', color: 'bg-yellow-50' },
  { id: 'delivery', name: 'Delivery', icon: '/icon-delivery.png', color: 'bg-purple-50' },
  { id: 'lunch', name: 'Lunch', icon: '/icon-lunch.png', color: 'bg-pink-50' },
]

function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(12)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      setIsAuthenticated(!!token)
    }
    
    // Initial check
    checkAuth()
    
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])
  
  // Only fetch recommendations when authenticated
  const { data: recommendedData, isLoading: isLoadingRecommended, isError: isErrorRecommended } = useRecommendedRestaurants({
    enabled: isAuthenticated,
  })

  // Fetch best sellers when not authenticated
  const { data: bestSellerData, isLoading: isLoadingBestSeller, isError: isErrorBestSeller } = useBestSellerRestaurants(20)

  // Use the appropriate data based on auth status
  const data = isAuthenticated ? recommendedData : bestSellerData
  const isLoading = isAuthenticated ? isLoadingRecommended : isLoadingBestSeller
  const isError = isAuthenticated ? isErrorRecommended : isErrorBestSeller

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 10000) // 10 seconds

    return () => clearInterval(timer)
  }, [])

  // Access the recommendations array from the nested data structure
  // Handle both formats: data.recommendations or data.restaurants (best-seller)
  const getRestaurants = () => {
    if (!data?.data) return []
    if (Array.isArray(data.data)) return data.data
    return data.data.recommendations || data.data.restaurants || []
  }
  
  const restaurants = getRestaurants()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ 
        to: '/restaurant', 
        search: { q: searchQuery.trim() } 
      })
    }
  }

  // Ensure restaurants is always an array
  const restaurantList = Array.isArray(restaurants) ? restaurants : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
            Explore <span className="text-primary">Culinary</span> Experiences
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
            Search and refine your choice to discover the perfect restaurant.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search restaurants, food and drink"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base bg-white text-foreground rounded-full"
              />
            </div>
          </form>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Categories */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/"
                className="flex flex-col items-center gap-2 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className={`h-[100px] w-full rounded-lg shadow-xl flex items-center justify-center `}>
                  <img 
                    src={category.icon} 
                    alt={category.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </Link>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended</h2>
              {isAuthenticated && (
                <Link to="/restaurant" className="text-primary hover:underline font-medium">
                  See All
                </Link>
              )}
            </div>

            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load recommendations. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantList.slice(0, visibleCount).map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to="/restaurant/$restaurantId"
                      params={{ restaurantId: String(restaurant.id) }}
                    >
                      <Card className="overflow-hidden p-0 m-0 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="flex items-center gap-4 p-4">
                            {/* Restaurant Logo */}
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={restaurant.logo || restaurant.images[0]}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Restaurant Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base mb-1 truncate">{restaurant.name}</h3>
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{restaurant.star.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="truncate">{restaurant.place}</span>
                                <span>•</span>
                                <span className="whitespace-nowrap">2.4 km</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Show More Button */}
                {restaurantList.length > visibleCount && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8"
                    >
                      Show More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
