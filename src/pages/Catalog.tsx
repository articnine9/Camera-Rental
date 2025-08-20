import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Filter, Star, MapPin } from 'lucide-react';
import { useEquipmentStore, Equipment } from '@/lib/stores/equipment-store';

export default function Catalog() {
  const { equipment } = useEquipmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || item.storeLocation === locationFilter;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'camera', label: 'Cameras' },
    { value: 'lens', label: 'Lenses' },
    { value: 'accessory', label: 'Accessories' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown' },
    { value: 'midtown', label: 'Midtown' },
    { value: 'uptown', label: 'Uptown' }
  ];

  const getCategoryColor = (category: Equipment['category']) => {
    switch (category) {
      case 'camera': return 'bg-primary text-primary-foreground';
      case 'lens': return 'bg-accent text-accent-foreground';
      case 'accessory': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Equipment Catalog
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Browse our extensive collection of professional photography and videography equipment
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredEquipment.length} of {equipment.length} items
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Equipment Image */}
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>

                {/* Equipment Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${item.dailyRate}
                      </span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-accent mr-1" />
                      4.8
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.storeLocation.charAt(0).toUpperCase() + item.storeLocation.slice(1)}
                    </div>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Available" : "Rented"}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link to={`/equipment/${item.id}`} className="flex-1">
                      <Button variant="professional" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {item.available && (
                      <Link to={`/book/${item.id}`}>
                        <Button variant="accent" size="sm">
                          Book Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No equipment found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="professional" 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setLocationFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}