import { Link, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, MapPin } from 'lucide-react'
import { BiLogInCircle } from 'react-icons/bi'  
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useLogout } from '@/lib/hooks/useAuth'
import { useCart } from '@/lib/hooks/useCart'
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

interface User {
    id: number
    name: string
    email: string
    phone: string
    avatar?: string
}

export function Navbar() {
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    })
    const [user, setUser] = useState<User | null>(() => {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    })
    const [isScrolled, setIsScrolled] = useState(pathname !== '/')
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const logout = useLogout()

    // Fetch cart data to get count (only when user is logged in)
    const { data: cartData } = useCart({ enabled: !!user })
    
    // Calculate total cart count
    const cartItems = Array.isArray(cartData?.data?.cart) ? cartData.data.cart : []
    const cartCount = cartItems.reduce((total, cartRestaurant) => {
        return total + cartRestaurant.items.reduce((sum, item) => sum + item.quantity, 0)
    }, 0)


    const handleLogout = () => {
        setShowLogoutDialog(false)
        logout()
    }

    // Listen for storage changes to update user state
    useEffect(() => {
        const handleStorageChange = () => {
            const userStr = localStorage.getItem('user')
            setUser(userStr ? JSON.parse(userStr) : null)
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])
    useEffect(() => {
        const handleScroll = () => {
            if (pathname === '/') {
                setIsScrolled(window.scrollY > 10)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled
                ? 'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-border'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-primary" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M22.5 0H19.5V13.2832L14.524 0.967222L11.7425 2.09104L16.8474 14.726L7.21142 5.09009L5.09011 7.21142L14.3257 16.447L2.35706 11.2178L1.15596 13.9669L13.8202 19.5H0V22.5H13.8202L1.15597 28.0331L2.35706 30.7822L14.3257 25.553L5.09011 34.7886L7.21142 36.9098L16.8474 27.274L11.7425 39.909L14.524 41.0327L19.5 28.7169V42H22.5V28.7169L27.476 41.0327L30.2574 39.909L25.1528 27.274L34.7886 36.9098L36.9098 34.7886L27.6742 25.553L39.643 30.7822L40.8439 28.0331L28.1799 22.5H42V19.5H28.1797L40.8439 13.9669L39.643 11.2178L27.6742 16.447L36.9098 7.2114L34.7886 5.09009L25.1528 14.726L30.2574 2.09104L27.476 0.967222L22.5 13.2832V0Z" fill="currentColor" />
                        </svg>
                        <span className={`text-xl font-bold ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                            Foody
                        </span>
                    </Link>

                    {/* Auth Buttons / User Menu */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link to="/sign-in">
                                    <Button
                                        variant="outline"
                                        className={`rounded-full bg-transparent ${!isScrolled && 'border-white text-white hover:bg-white/10'}`}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/sign-up">
                                    <Button className="rounded-full bg-primary hover:bg-primary/90">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Cart Icon */}
                                <Link to="/cart">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`p-0 relative ${!isScrolled && 'text-white hover:bg-white/10'}`}
                                    >
                                        <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                            <path d="M6.66699 7.66667V6.33333C6.66699 4.91885 7.2289 3.56229 8.22909 2.5621C9.22928 1.5619 10.5858 1 12.0003 1C13.4148 1 14.7714 1.5619 15.7716 2.5621C16.7718 3.56229 17.3337 4.91885 17.3337 6.33333V7.66667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0.781333 7.11434C-7.94729e-08 7.89567 0 9.15167 0 11.6663V15.6663C0 20.6943 -1.58946e-07 23.209 1.56267 24.7703C3.12533 26.3317 5.63867 26.333 10.6667 26.333H13.3333C18.3613 26.333 20.876 26.333 22.4373 24.7703C23.9987 23.2077 24 20.6943 24 15.6663V11.6663C24 9.15167 24 7.89567 23.2187 7.11434C22.4373 6.33301 21.1813 6.33301 18.6667 6.33301H5.33333C2.81867 6.33301 1.56267 6.33301 0.781333 7.11434ZM9.33333 12.9997C9.33333 12.6461 9.19286 12.3069 8.94281 12.0569C8.69276 11.8068 8.35362 11.6663 8 11.6663C7.64638 11.6663 7.30724 11.8068 7.05719 12.0569C6.80714 12.3069 6.66667 12.6461 6.66667 12.9997V15.6663C6.66667 16.02 6.80714 16.3591 7.05719 16.6091C7.30724 16.8592 7.64638 16.9997 8 16.9997C8.35362 16.9997 8.69276 16.8592 8.94281 16.6091C9.19286 16.3591 9.33333 16.02 9.33333 15.6663V12.9997ZM17.3333 12.9997C17.3333 12.6461 17.1929 12.3069 16.9428 12.0569C16.6928 11.8068 16.3536 11.6663 16 11.6663C15.6464 11.6663 15.3072 11.8068 15.0572 12.0569C14.8071 12.3069 14.6667 12.6461 14.6667 12.9997V15.6663C14.6667 16.02 14.8071 16.3591 15.0572 16.6091C15.3072 16.8592 15.6464 16.9997 16 16.9997C16.3536 16.9997 16.6928 16.8592 16.9428 16.6091C17.1929 16.3591 17.3333 16.02 17.3333 15.6663V12.9997Z" fill="currentColor"/>
                                        </svg>
                                        {cartCount > 0 && (
                                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                                                {cartCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <div className="flex items-center gap-2 p-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <FileText className="h-4 w-4" />
                                                Delivery Address
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to="/orders">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <MapPin className="h-4 w-4" />
                                                My Orders
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                            onClick={() => setShowLogoutDialog(true)}
                                        >
                                            <BiLogInCircle className="scale-x-[-1]" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <h3 className="hidden md:block">{user.name}</h3>
                            </>
                        )}
                    </div>
                </div>
            </div>

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
        </nav>
    )
}
