import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { MapPin, FileText, LogOut, Edit2,AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useProfile, useUpdateProfile } from '@/lib/hooks/useProfile'
import { useLogout } from '@/lib/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

interface ProfileForm {
  name: string
  email: string
  phone: string
}

function ProfilePage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { data: profileData, isLoading, isError } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const logout = useLogout()

  const handleLogout = () => {
    setShowLogoutDialog(false)
    logout()
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>({
    mode: 'onChange',
  })

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate({ to: '/sign-in' })
    }
  }, [navigate])

  // Update form when data loads
  useEffect(() => {
    if (profileData?.data.user) {
      reset({
        name: profileData.data.user.name,
        email: profileData.data.user.email,
        phone: profileData.data.user.phone,
      })
    }
  }, [profileData, reset])

  const user = profileData?.data.user

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const handleCancel = () => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <aside className="md:col-span-1">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ) : user ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                      </div>
                    ) : null}

                    <Separator />

                    <nav className="space-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent bg-primary/10 text-primary"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">My Orders</span>
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
              <main className="md:col-span-3">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold">Profile</h1>
                      {!isEditing && !isLoading && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    {isError && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Failed to load profile data. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isLoading ? (
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between py-3 border-b">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : user ? (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex justify-center">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-2xl">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* User Info */}
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                {...register('name', { required: 'Name is required' })}
                                className="h-12"
                              />
                              {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                {...register('email', {
                                  required: 'Email is required',
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                  },
                                })}
                                className="h-12"
                              />
                              {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Nomor Handphone</Label>
                              <Input
                                id="phone"
                                type="tel"
                                {...register('phone', {
                                  required: 'Phone number is required',
                                  pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: 'Invalid phone number',
                                  },
                                })}
                                className="h-12"
                              />
                              {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b">
                              <span className="text-muted-foreground">Name</span>
                              <span className="font-medium">{user.name}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b">
                              <span className="text-muted-foreground">Email</span>
                              <span className="font-medium">{user.email}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b">
                              <span className="text-muted-foreground">Nomor Handphone</span>
                              <span className="font-medium">{user.phone}</span>
                            </div>
                          </div>
                        )}

                        {updateProfileMutation.isError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {updateProfileMutation.error?.response?.data?.message ||
                                'Failed to update profile. Please try again.'}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Action Buttons */}
                        {isEditing ? (
                          <div className="flex gap-3">
                            <Button
                              type="submit"
                              className="flex-1 bg-primary hover:bg-primary/90"
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={updateProfileMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : null}
                      </form>
                    ) : null}
                  </CardContent>
                </Card>
              </main>
            </div>
          </div>
        </div>
      </main>

      <Footer />

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
    </div>
  )
}

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
})
