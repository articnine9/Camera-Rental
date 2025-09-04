import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Calendar, Menu } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/auth-store';
import { EquipmentManagement } from '@/components/admin/EquipmentManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import { BookingManagement } from '@/components/admin/BookingManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { StoreManagement } from '@/components/admin/StoreManagement';
import { AdminStats } from '@/components/admin/AdminStats';
import { useEquipmentStore } from '@/lib/stores/equipment-store';
import { useBookingStore } from '@/lib/stores/booking-store';
import { AppSidebar } from '@/components/AppSidebar';

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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'equipment':
        return <EquipmentManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'users':
        return <UserManagement />;
      case 'stores':
        return <StoreManagement />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="h-16 border-b border-border/40 flex items-center justify-between px-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
            {pendingBookings.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pendingBookings.length} pending
              </Badge>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}