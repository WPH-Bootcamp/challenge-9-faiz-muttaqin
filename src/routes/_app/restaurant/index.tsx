import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Star, MapPin, AlertCircle, Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRestaurants, useNearbyRestaurants, type Restaurant } from '@/lib/hooks/useRestaurants'

interface RestaurantSearch {
  q?: string
}

export const Route = createFileRoute('/_app/restaurant/')({
  component: RestaurantListPage,
  validateSearch: (search: Record<string, unknown>): RestaurantSearch => {
    return {
      q: search.q as string | undefined,
    }
  },
})

function RestaurantListPage() {
  const navigate = useNavigate()
  const { q } = Route.useSearch()
  const [searchQuery, setSearchQuery] = useState(q || '')
  const [selectedDistance, setSelectedDistance] = useState<string>('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  // Update search input when URL changes
  // useEffect(() => {
  //   setSearchQuery(q || '')
  // }, [q])

  // Use nearby API when "Nearby" is selected
  const useNearby = selectedDistance === 'nearby'
  
  // Fetch restaurants with filters
  const { data: regularData, isLoading: isLoadingRegular, isError: isErrorRegular } = useRestaurants({
    search: q,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    rating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
  }, { enabled: !useNearby })

  const { data: nearbyData, isLoading: isLoadingNearby, isError: isErrorNearby } = useNearbyRestaurants()

  // Use appropriate data based on distance selection
  const data = useNearby ? nearbyData : regularData
  const isLoading = useNearby ? isLoadingNearby : isLoadingRegular
  const isError = useNearby ? isErrorNearby : isErrorRegular

  // Get restaurants array from response
  const getRestaurants = (): Restaurant[] => {
    if (!data?.data) return []
    if (Array.isArray(data.data)) return data.data
    return data.data.restaurants || data.data.recommendations || []
  }

  const restaurants = getRestaurants()

  // Apply additional client-side filters
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Additional text search filter (case-insensitive)
    if (q && !restaurant.name.toLowerCase().includes(q.toLowerCase())) {
      return false
    }

    // Client-side price filter for nearby results (API doesn't support price filter)
    if (useNearby && minPrice && restaurant.sampleMenus) {
      const minMenuPrice = Math.min(...restaurant.sampleMenus.map((m) => m.price))
      if (minMenuPrice < Number(minPrice)) return false
    }
    if (useNearby && maxPrice && restaurant.sampleMenus) {
      const maxMenuPrice = Math.max(...restaurant.sampleMenus.map((m) => m.price))
      if (maxMenuPrice > Number(maxPrice)) return false
    }

    // Client-side rating filter for nearby results
    if (useNearby && selectedRatings.length > 0) {
      const matchesRating = selectedRatings.some((rating) => {
        return Math.floor(restaurant.star) === rating
      })
      if (!matchesRating) return false
    }

    return true
  })

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ 
        to: '/restaurant', 
        search: { q: searchQuery.trim() },
        replace: true
      })
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    navigate({ 
      to: '/restaurant',
      replace: true
    })
  }

  return (
    <main className="flex-1 bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-4">FILTER</h3>

              {/* Distance Filter */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold">Distance</h4>
                <div className="space-y-2">
                  {[
                    { id: 'nearby', label: 'Nearby' },
                    { id: '1km', label: 'Within 1 km' },
                    { id: '3km', label: 'Within 3 km' },
                    { id: '5km', label: 'Within 5 km' },
                  ].map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedDistance === option.id}
                        onCheckedChange={() => 
                          setSelectedDistance(selectedDistance === option.id ? 'all' : option.id)
                        }
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold">Price</h4>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="minPrice" className="text-sm text-muted-foreground">
                      Minimum Price
                    </Label>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Rp</span>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-sm text-muted-foreground">
                      Maximum Price
                    </Label>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Rp</span>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <h4 className="font-semibold">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={() => handleRatingToggle(rating)}
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="text-sm font-normal cursor-pointer flex items-center gap-1"
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {rating}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Restaurant Grid */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">
                {q || selectedRatings.length > 0 || minPrice || maxPrice || selectedDistance !== 'all' 
                  ? 'Restaurants' 
                  : 'All Restaurant'}
              </h1>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full md:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {q && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing results for: <span className="font-semibold text-foreground">"{q}"</span>
                </p>
              </div>
            )}

            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load restaurants. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-20 h-20 bg-muted animate-pulse rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No restaurants found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRestaurants.map((restaurant) => (
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
                            <h3 className="font-semibold text-base mb-1 truncate">
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {restaurant.star.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
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
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
