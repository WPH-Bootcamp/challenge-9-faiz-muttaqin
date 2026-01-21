'use client';

import { useMenuQuery } from '@/services/queries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { selectFilters, setSearchQuery } from '@/features/filters/filtersSlice';
import MenuItemCard from '@/components/MenuItemCard';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/ui/input';
import { MenuItem } from '@/types';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const { data: menuItems, isLoading, error } = useMenuQuery();

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart(item));
    // TODO: Add toast notification
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Filter menu items based on search query
  const filteredItems = menuItems?.filter((item) =>
    item.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
            <div className="max-w-md">
              <Input
                type="search"
                placeholder="Search menu..."
                value={filters.searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {isLoading && <Loading />}

          {error && (
            <EmptyState
              title="Failed to load menu"
              description="There was an error loading the menu. Please try again later."
            />
          )}

          {!isLoading && !error && filteredItems && filteredItems.length === 0 && (
            <EmptyState
              title="No items found"
              description="Try adjusting your search or filters"
            />
          )}

          {!isLoading && !error && filteredItems && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
