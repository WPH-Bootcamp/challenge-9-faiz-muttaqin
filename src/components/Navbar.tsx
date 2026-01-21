import Link from 'next/link';
import { ROUTES } from '@/config/constants';

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={ROUTES.HOME} className="text-xl font-bold">
            Restaurant App
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href={ROUTES.HOME} className="hover:text-primary">
              Menu
            </Link>
            <Link href={ROUTES.ORDERS} className="hover:text-primary">
              Orders
            </Link>
            <Link href={ROUTES.CART} className="hover:text-primary">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
