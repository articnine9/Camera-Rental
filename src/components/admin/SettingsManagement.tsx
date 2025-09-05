import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Settings2, 
  Download, 
  Upload, 
  RotateCcw,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useSettingsStore, Setting, SettingType } from '@/lib/stores/settings-store';
import { useToast } from '@/hooks/use-toast';

const SettingsManagement = () => {
  const { 
    settings, 
    categories, 
    addSetting, 
    updateSetting, 
    deleteSetting, 
    getSettingsByCategory,
    updateSettingValue,
    resetToDefaults,
    exportSettings,
    importSettings
  } = useSettingsStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'Application');
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    description: '',
    type: 'text' as SettingType,
    value: '',
    category: 'Application',
    options: '',
    required: false,
    validation: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      pattern: ''
    }
  });

  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      description: '',
      type: 'text',
      value: '',
      category: 'Application',
      options: '',
      required: false,
      validation: {
        min: undefined,
        max: undefined,
        pattern: ''
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingData = {
        key: formData.key,
        label: formData.label,
        description: formData.description,
        type: formData.type,
        value: parseValue(formData.value, formData.type),
        category: formData.category,
        options: formData.options ? formData.options.split(',').map(s => s.trim()) : undefined,
        required: formData.required,
        validation: {
          min: formData.validation.min,
          max: formData.validation.max,
          pattern: formData.validation.pattern || undefined
        }
      };

      if (editingSetting) {
        await updateSetting(editingSetting.id, settingData);
        toast({
          title: "Success",
          description: "Setting updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingSetting(null);
      } else {
        await addSetting(settingData);
        toast({
          title: "Success", 
          description: "Setting added successfully",
        });
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save setting",
        variant: "destructive",
      });
    }
  };

  const parseValue = (value: string, type: SettingType) => {
    switch (type) {
      case 'number':
        return parseFloat(value) || 0;
      case 'boolean':
        return value === 'true';
      default:
        return value;
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setFormData({
      key: setting.key,
      label: setting.label,
      description: setting.description,
      type: setting.type,
      value: setting.value.toString(),
      category: setting.category,
      options: setting.options?.join(', ') || '',
      required: setting.required || false,
      validation: {
        min: setting.validation?.min,
        max: setting.validation?.max,
        pattern: setting.validation?.pattern || ''
      }
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      try {
        await deleteSetting(id);
        toast({
          title: "Success",
          description: "Setting deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete setting",
          variant: "destructive",
        });
      }
    }
  };

  const handleValueUpdate = async (key: string, value: any) => {
    try {
      await updateSettingValue(key, value);
      toast({
        title: "Success",
        description: "Setting value updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting value",
        variant: "destructive",
      });
    }
  };

  const handleResetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This will overwrite all current settings.')) {
      try {
        await resetToDefaults();
        toast({
          title: "Success",
          description: "Settings reset to defaults",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset settings",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    try {
      const settingsJson = exportSettings();
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Settings exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export settings",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const settingsJson = e.target?.result as string;
          await importSettings(settingsJson);
          toast({
            title: "Success",
            description: "Settings imported successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to import settings. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => handleValueUpdate(setting.key, checked)}
          />
        );
      case 'select':
        return (
          <Select 
            value={setting.value} 
            onValueChange={(value) => handleValueUpdate(setting.key, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            value={setting.value}
            onChange={(e) => handleValueUpdate(setting.key, e.target.value)}
            placeholder={`Enter ${setting.label.toLowerCase()}`}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => handleValueUpdate(setting.key, parseFloat(e.target.value) || 0)}
            min={setting.validation?.min}
            max={setting.validation?.max}
          />
        );
      default:
        return (
          <Input
            type={setting.type}
            value={setting.value}
            onChange={(e) => handleValueUpdate(setting.key, e.target.value)}
            placeholder={`Enter ${setting.label.toLowerCase()}`}
          />
        );
    }
  };

  const SettingForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Setting Key</Label>
          <Input
            id="key"
            value={formData.key}
            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
            placeholder="e.g., max_booking_days"
            required
            disabled={isEdit}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">Display Label</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            placeholder="e.g., Maximum Booking Days"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description of this setting"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Setting Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value: SettingType) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="textarea">Textarea</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., Application, Booking"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Default Value</Label>
        {formData.type === 'boolean' ? (
          <Switch
            checked={formData.value === 'true'}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, value: checked.toString() }))}
          />
        ) : formData.type === 'textarea' ? (
          <Textarea
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="Default value"
          />
        ) : (
          <Input
            id="value"
            type={formData.type === 'number' ? 'number' : 'text'}
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="Default value"
            required
          />
        )}
      </div>

      {formData.type === 'select' && (
        <div className="space-y-2">
          <Label htmlFor="options">Options (comma-separated)</Label>
          <Input
            id="options"
            value={formData.options}
            onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
            placeholder="option1, option2, option3"
          />
        </div>
      )}

      {formData.type === 'number' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min">Minimum Value</Label>
            <Input
              id="min"
              type="number"
              value={formData.validation.min || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                validation: { 
                  ...prev.validation, 
                  min: e.target.value ? parseFloat(e.target.value) : undefined 
                } 
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Maximum Value</Label>
            <Input
              id="max"
              type="number"
              value={formData.validation.max || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                validation: { 
                  ...prev.validation, 
                  max: e.target.value ? parseFloat(e.target.value) : undefined 
                } 
              }))}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={formData.required}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
        />
        <Label htmlFor="required">Required Setting</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingSetting(null);
            } else {
              setIsAddDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? 'Update' : 'Create'} Setting
        </Button>
      </div>
    </form>
  );

  const filteredSettings = getSettingsByCategory(activeCategory).filter(setting =>
    setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setting.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Settings Management</h2>
          <p className="text-muted-foreground">Configure application and system settings</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleResetToDefaults}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              id="import-settings"
            />
            <Button
              onClick={() => document.getElementById('import-settings')?.click()}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Settings
            </Button>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Setting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Setting</DialogTitle>
              </DialogHeader>
              <SettingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings by Category */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  {category} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredSettings.length === 0 ? (
                    <div className="text-center py-8">
                      <Settings2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">No Settings Found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'No settings match your search criteria.' : 'No settings in this category yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredSettings.map((setting) => (
                      <div key={setting.id}>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{setting.label}</h4>
                              <Badge variant="outline" className="text-xs">
                                {setting.key}
                              </Badge>
                              {setting.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {setting.description}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {setting.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="min-w-0 flex-1 lg:w-64">
                              {renderSettingInput(setting)}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(setting)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(setting.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Separator className="mt-6" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
          </DialogHeader>
          <SettingForm isEdit />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsManagement;