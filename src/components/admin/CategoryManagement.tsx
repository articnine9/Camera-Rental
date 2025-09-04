import React, { useState } from 'react';
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
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useCategoryStore, Category } from '@/lib/stores/category-store';
import { useToast } from '@/hooks/use-toast';

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory, getRootCategories } = useCategoryStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId || undefined,
          isActive: formData.isActive
        });
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        setIsEditDialogOpen(false);
      } else {
        await addCategory({
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId || undefined,
          isActive: formData.isActive
        });
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        setIsAddDialogOpen(false);
      }
      resetForm();
      setEditingCategory(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentId: category.parentId || '',
      isActive: category.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      try {
        await deleteCategory(id);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryPath = (category: Category): string => {
    if (!category.parentId) return category.name;
    const parent = categories.find(c => c.id === category.parentId);
    return parent ? `${getCategoryPath(parent)} > ${category.name}` : category.name;
  };

  const CategoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter category description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Category (Optional)</Label>
        <Select 
          value={formData.parentId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Parent (Root Category)</SelectItem>
            {getRootCategories().map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEdit ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Category Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingCategory(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Path</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {getCategoryPath(category)}
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;