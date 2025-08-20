import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Search, Eye, Check, X, Clock } from 'lucide-react';
import { useBookingStore, Booking, BookingStatus } from '@/lib/stores/booking-store';
import { useToast } from '@/hooks/use-toast';

export const BookingManagement = () => {
  const { bookings, updateBookingStatus } = useBookingStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = (bookingId: string, status: BookingStatus, notes?: string) => {
    updateBookingStatus(bookingId, status, notes);
    toast({
      title: "Booking updated",
      description: `Booking has been ${status}.`,
    });
    setIsViewModalOpen(false);
    setSelectedBooking(null);
    setNotes('');
  };

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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setNotes(booking.notes || '');
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-xl font-bold">{bookings.filter(b => b.status === 'approved').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-xl font-bold">{bookings.filter(b => b.status === 'rejected').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.equipmentName}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                        <p className="text-muted-foreground">
                          {calculateDays(booking.startDate, booking.endDate)} days
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{booking.storeLocation}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${booking.totalCost}</p>
                        <p className="text-xs text-muted-foreground">+${booking.deposit} deposit</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                    <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                    <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Booking Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Equipment:</strong> {selectedBooking.equipmentName}</p>
                    <p><strong>Location:</strong> {selectedBooking.storeLocation}</p>
                    <p><strong>Duration:</strong> {calculateDays(selectedBooking.startDate, selectedBooking.endDate)} days</p>
                  </div>
                </div>
              </div>

              {/* Dates and Pricing */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Rental Period</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Start:</strong> {formatDate(selectedBooking.startDate)}</p>
                    <p><strong>End:</strong> {formatDate(selectedBooking.endDate)}</p>
                    <p><strong>Created:</strong> {formatDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Total Cost:</strong> ${selectedBooking.totalCost}</p>
                    <p><strong>Deposit:</strong> ${selectedBooking.deposit}</p>
                    <p><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusLabel(selectedBooking.status)}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this booking..."
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    variant="hero"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'approved', notes)}
                  >
                    <Check className="h-4 w-4" />
                    Approve Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected', notes)}
                  >
                    <X className="h-4 w-4" />
                    Reject Booking
                  </Button>
                </div>
              )}
              
              {selectedBooking.status === 'approved' && (
                <div className="flex gap-3">
                  <Button
                    variant="professional"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'completed', notes)}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled', notes)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};