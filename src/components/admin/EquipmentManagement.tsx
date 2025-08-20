import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Camera, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useEquipmentStore, Equipment } from '@/lib/stores/equipment-store';
import { useToast } from '@/hooks/use-toast';

export const EquipmentManagement = () => {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useEquipmentStore();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'camera' as Equipment['category'],
    description: '',
    image: '/placeholder.svg',
    dailyRate: '',
    deposit: '',
    storeLocation: 'downtown' as Equipment['storeLocation'],
    available: true,
    specifications: {} as Record<string, string>
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: 'camera',
      description: '',
      image: '/placeholder.svg',
      dailyRate: '',
      deposit: '',
      storeLocation: 'downtown',
      available: true,
      specifications: {}
    });
    setSpecKey('');
    setSpecValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const equipmentData = {
      ...formData,
      dailyRate: parseFloat(formData.dailyRate),
      deposit: parseFloat(formData.deposit)
    };

    if (editingEquipment) {
      updateEquipment(editingEquipment.id, equipmentData);
      toast({
        title: "Equipment updated",
        description: "Equipment has been successfully updated.",
      });
      setIsEditModalOpen(false);
      setEditingEquipment(null);
    } else {
      addEquipment(equipmentData);
      toast({
        title: "Equipment added",
        description: "New equipment has been successfully added.",
      });
      setIsAddModalOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      brand: equipment.brand,
      category: equipment.category,
      description: equipment.description,
      image: equipment.image,
      dailyRate: equipment.dailyRate.toString(),
      deposit: equipment.deposit.toString(),
      storeLocation: equipment.storeLocation,
      available: equipment.available,
      specifications: equipment.specifications
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id);
      toast({
        title: "Equipment deleted",
        description: "Equipment has been successfully deleted.",
      });
    }
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: Object.fromEntries(
        Object.entries(prev.specifications).filter(([k]) => k !== key)
      )
    }));
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const EquipmentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: Equipment['category']) => 
            setFormData(prev => ({ ...prev, category: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camera">Camera</SelectItem>
              <SelectItem value="lens">Lens</SelectItem>
              <SelectItem value="accessory">Accessory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeLocation">Store Location</Label>
          <Select value={formData.storeLocation} onValueChange={(value: Equipment['storeLocation']) => 
            setFormData(prev => ({ ...prev, storeLocation: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="midtown">Midtown</SelectItem>
              <SelectItem value="uptown">Uptown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyRate">Daily Rate ($)</Label>
          <Input
            id="dailyRate"
            type="number"
            step="0.01"
            value={formData.dailyRate}
            onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deposit">Deposit ($)</Label>
          <Input
            id="deposit"
            type="number"
            step="0.01"
            value={formData.deposit}
            onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-2">
        <Label>Specifications</Label>
        <div className="space-y-2">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="font-medium">{key}:</span>
              <span>{value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpecification(key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Specification name"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
            />
            <Input
              placeholder="Value"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
            />
            <Button type="button" onClick={addSpecification} variant="outline">
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
        />
        <Label htmlFor="available">Available for rent</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (editingEquipment) {
              setIsEditModalOpen(false);
              setEditingEquipment(null);
            } else {
              setIsAddModalOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
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
              <Camera className="h-5 w-5" />
              Equipment Management
            </CardTitle>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="h-4 w-4" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                <EquipmentForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="camera">Cameras</SelectItem>
                <SelectItem value="lens">Lenses</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rate/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        item.category === 'camera' ? 'bg-primary/10 text-primary' :
                        item.category === 'lens' ? 'bg-accent/10 text-accent' :
                        'bg-secondary/10 text-secondary-foreground'
                      }>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{item.storeLocation}</TableCell>
                    <TableCell>${item.dailyRate}</TableCell>
                    <TableCell>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Rented"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          <EquipmentForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};