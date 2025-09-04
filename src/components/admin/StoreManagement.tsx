import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Plus, Pencil, Trash2, Clock, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: string;
  name: string;
  location: 'downtown' | 'midtown' | 'uptown';
  address: string;
  phone: string;
  email: string;
  hours: string;
  manager: string;
  status: 'active' | 'maintenance' | 'closed';
  equipmentCount: number;
  description: string;
  longitude: number;
  latitude: number;
}

// Sample stores data
const sampleStores: Store[] = [
  {
    id: '1',
    name: 'Downtown Studio',
    location: 'downtown',
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'downtown@camerarent.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM',
    manager: 'Alex Johnson',
    status: 'active',
    equipmentCount: 45,
    description: 'Our flagship store with the largest equipment selection.',
    longitude: -74.0060,
    latitude: 40.7128
  },
  {
    id: '2',
    name: 'Midtown Hub',
    location: 'midtown',
    address: '456 Creative Ave, Midtown',
    phone: '+1 (555) 234-5678',
    email: 'midtown@camerarent.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM',
    manager: 'Sarah Chen',
    status: 'active',
    equipmentCount: 38,
    description: 'Convenient location for film and video professionals.',
    longitude: -73.9857,
    latitude: 40.7614
  },
  {
    id: '3',
    name: 'Uptown Gallery',
    location: 'uptown',
    address: '789 Photo Blvd, Uptown',
    phone: '+1 (555) 345-6789',
    email: 'uptown@camerarent.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM',
    manager: 'Mike Rodriguez',
    status: 'maintenance',
    equipmentCount: 32,
    description: 'Specialized in photography equipment and studio gear.',
    longitude: -73.9442,
    latitude: 40.7831
  }
];

export const StoreManagement = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>(sampleStores);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: 'downtown' as Store['location'],
    address: '',
    phone: '',
    email: '',
    hours: '',
    manager: '',
    status: 'active' as Store['status'],
    equipmentCount: 0,
    description: '',
    longitude: 0,
    latitude: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: 'downtown',
      address: '',
      phone: '',
      email: '',
      hours: '',
      manager: '',
      status: 'active',
      equipmentCount: 0,
      description: '',
      longitude: 0,
      latitude: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storeData: Store = {
      ...formData,
      id: editingStore?.id || Date.now().toString()
    };

    if (editingStore) {
      setStores(prev => prev.map(store => store.id === editingStore.id ? storeData : store));
      toast({
        title: "Store updated",
        description: "Store information has been successfully updated.",
      });
      setIsEditModalOpen(false);
      setEditingStore(null);
    } else {
      setStores(prev => [...prev, storeData]);
      toast({
        title: "Store added",
        description: "New store has been successfully added.",
      });
      setIsAddModalOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData(store);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      setStores(prev => prev.filter(store => store.id !== id));
      toast({
        title: "Store deleted",
        description: "Store has been successfully deleted.",
      });
    }
  };

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-700';
      case 'closed': return 'bg-red-500/10 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const StoreForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Store Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <select 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as Store['location'] }))}
          >
            <option value="downtown">Downtown</option>
            <option value="midtown">Midtown</option>
            <option value="uptown">Uptown</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
            placeholder="e.g., -74.0060"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
            placeholder="e.g., 40.7128"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="manager">Manager</Label>
          <Input
            id="manager"
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Store['status'] }))}
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Operating Hours</Label>
        <Input
          id="hours"
          value={formData.hours}
          onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
          placeholder="e.g., Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipmentCount">Equipment Count</Label>
        <Input
          id="equipmentCount"
          type="number"
          value={formData.equipmentCount}
          onChange={(e) => setFormData(prev => ({ ...prev, equipmentCount: parseInt(e.target.value) || 0 }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the store..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (editingStore) {
              setIsEditModalOpen(false);
              setEditingStore(null);
            } else {
              setIsAddModalOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {editingStore ? 'Update Store' : 'Add Store'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Store Management
            </CardTitle>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="h-4 w-4" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                </DialogHeader>
                <StoreForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Stores</p>
                  <p className="text-xl font-bold">{stores.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{stores.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-xl font-bold">{stores.filter(s => s.status === 'maintenance').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Closed</p>
                  <p className="text-xl font-bold">{stores.filter(s => s.status === 'closed').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stores Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="bg-background hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <Badge className={getStatusColor(store.status)}>
                      {store.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {store.location}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{store.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{store.hours}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Manager:</span>
                      <span className="text-sm font-medium">{store.manager}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Equipment:</span>
                      <span className="text-sm font-medium">{store.equipmentCount} items</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{store.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(store)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(store.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
          </DialogHeader>
          <StoreForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};