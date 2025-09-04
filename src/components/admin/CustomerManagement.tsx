import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, User, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useCustomerStore, Customer } from '@/lib/stores/customer-store';
import { useBookingStore } from '@/lib/stores/booking-store';
import { useToast } from '@/hooks/use-toast';

const CustomerManagement = () => {
  const { 
    customers, 
    searchQuery, 
    filterStatus, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    searchCustomers,
    setSearchQuery,
    setFilterStatus
  } = useCustomerStore();
  
  const { bookings } = useBookingStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    companyName: '',
    taxId: '',
    dateOfBirth: '',
    identificationNumber: '',
    identificationType: 'license' as 'passport' | 'license' | 'nationalId',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    membershipLevel: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum',
    isActive: true,
    notes: ''
  });

  useEffect(() => {
    setFilteredCustomers(searchCustomers(searchQuery));
  }, [searchQuery, filterStatus, customers, searchCustomers]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      companyName: '',
      taxId: '',
      dateOfBirth: '',
      identificationNumber: '',
      identificationType: 'license',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      membershipLevel: 'bronze',
      isActive: true,
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
        setIsEditDialogOpen(false);
      } else {
        await addCustomer(formData);
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
        setIsAddDialogOpen(false);
      }
      resetForm();
      setEditingCustomer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      companyName: customer.companyName || '',
      taxId: customer.taxId || '',
      dateOfBirth: customer.dateOfBirth || '',
      identificationNumber: customer.identificationNumber,
      identificationType: customer.identificationType,
      emergencyContact: customer.emergencyContact,
      membershipLevel: customer.membershipLevel,
      isActive: customer.isActive,
      notes: customer.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const customerBookings = bookings.filter(booking => booking.userId === id);
    if (customerBookings.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "Customer has existing bookings. Please handle bookings first.",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        });
      }
    }
  };

  const getMembershipBadgeColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(booking => booking.userId === customerId);
  };

  const CustomerForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value }
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value }
                }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, zipCode: e.target.value }
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, country: e.target.value }
                }))}
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identificationNumber">ID Number *</Label>
              <Input
                id="identificationNumber"
                value={formData.identificationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, identificationNumber: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificationType">ID Type *</Label>
              <Select 
                value={formData.identificationType} 
                onValueChange={(value: 'passport' | 'license' | 'nationalId') => 
                  setFormData(prev => ({ ...prev, identificationType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="nationalId">National ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Emergency Contact</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Contact Name *"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                required
              />
              <Input
                placeholder="Contact Phone *"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                required
              />
            </div>
            <Input
              placeholder="Relationship *"
              value={formData.emergencyContact.relationship}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipLevel">Membership Level</Label>
              <Select 
                value={formData.membershipLevel} 
                onValueChange={(value: 'bronze' | 'silver' | 'gold' | 'platinum') => 
                  setFormData(prev => ({ ...prev, membershipLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active Customer</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEdit ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );

  const CustomerDetailsView = ({ customer }: { customer: Customer }) => {
    const customerBookings = getCustomerBookings(customer.id);
    
    return (
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Customer Details</TabsTrigger>
          <TabsTrigger value="bookings">Booking History ({customerBookings.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <Badge className={getMembershipBadgeColor(customer.membershipLevel)}>
                      {customer.membershipLevel.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{customer.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{customer.phone}</p>
              </div>
              
              {customer.companyName && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{customer.companyName}</p>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{customer.address.street}</p>
                  <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                  <p>{customer.address.country}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Statistics</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">Total Bookings: <span className="font-medium">{customer.totalBookings}</span></p>
                  <p className="text-sm">Total Spent: <span className="font-medium">${customer.totalSpent.toFixed(2)}</span></p>
                  <p className="text-sm">Status: <Badge variant={customer.isActive ? "default" : "secondary"}>{customer.isActive ? 'Active' : 'Inactive'}</Badge></p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">Emergency Contact</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">{customer.emergencyContact.name}</p>
                  <p className="text-sm">{customer.emergencyContact.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer.emergencyContact.relationship}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">Identification</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">{customer.identificationType.toUpperCase()}: {customer.identificationNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
          {customer.notes && (
            <div className="pt-4 border-t">
              <p className="font-medium">Notes</p>
              <p className="text-sm text-muted-foreground mt-2">{customer.notes}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          <div className="space-y-4">
            {customerBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.equipmentName}</TableCell>
                      <TableCell>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${booking.totalCost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No bookings found for this customer.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customer Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingCustomer(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <CustomerForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.companyName || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getMembershipBadgeColor(customer.membershipLevel)}>
                      {customer.membershipLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? "default" : "secondary"}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(customer)}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm isEdit />
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {viewingCustomer && <CustomerDetailsView customer={viewingCustomer} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerManagement;