import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Camera, Clock, MapPin, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBookingStore, BookingStatus } from '@/lib/stores/booking-store';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getUserBookings } = useBookingStore();

  const userBookings = user ? getUserBookings(user.id) : [];

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'approved': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-primary-foreground/90">
            Manage your equipment rentals and bookings
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{userBookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Rentals</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userBookings.filter(b => b.status === 'approved').length}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userBookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-card transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userBookings.filter(b => b.status === 'completed').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/catalog">
            <Button variant="hero" size="lg">
              <Plus className="h-5 w-5" />
              New Booking
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="professional" size="lg">
              <Camera className="h-5 w-5" />
              Browse Equipment
            </Button>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-foreground">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No bookings yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by browsing our equipment catalog
                </p>
                <Link to="/catalog">
                  <Button variant="professional">
                    Browse Equipment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-card transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {booking.equipmentName}
                        </h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.storeLocation.charAt(0).toUpperCase() + booking.storeLocation.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${booking.totalCost}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Cost
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}