import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Users, Calendar, MapPin, Plus, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { EquipmentManagement } from '@/components/admin/EquipmentManagement';
import { BookingManagement } from '@/components/admin/BookingManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { StoreManagement } from '@/components/admin/StoreManagement';
import { AdminStats } from '@/components/admin/AdminStats';
import { useEquipmentStore } from '@/lib/stores/equipment-store';
import { useBookingStore } from '@/lib/stores/booking-store';

export default function Admin() {
  const { user } = useAuthStore();
  const { equipment } = useEquipmentStore();
  const { bookings, getPendingBookings } = useBookingStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingBookings = getPendingBookings();
  const availableEquipment = equipment.filter(item => item.available).length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-primary-foreground/90">
                Manage equipment, bookings, and users
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80">Welcome back,</p>
              <p className="text-xl font-semibold text-primary-foreground">{user.name}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
              {pendingBookings.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Stores</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
            
            {/* Quick Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Equipment</p>
                      <p className="text-2xl font-bold text-foreground">{equipment.length}</p>
                    </div>
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold text-foreground">{availableEquipment}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
                      <p className="text-2xl font-bold text-foreground">{pendingBookings.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">${totalRevenue}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-accent"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                        <div>
                          <p className="font-medium text-foreground">{booking.equipmentName}</p>
                          <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                        </div>
                        <Badge className={
                          booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-700' :
                          booking.status === 'approved' ? 'bg-green-500/10 text-green-700' :
                          'bg-red-500/10 text-red-700'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Equipment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {equipment.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.storeLocation}</p>
                        </div>
                        <Badge variant={item.available ? "default" : "secondary"}>
                          {item.available ? "Available" : "Rented"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Equipment Management */}
          <TabsContent value="equipment">
            <EquipmentManagement />
          </TabsContent>

          {/* Booking Management */}
          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Store Management */}
          <TabsContent value="stores">
            <StoreManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}