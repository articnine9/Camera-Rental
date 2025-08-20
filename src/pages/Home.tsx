import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Zap, Shield, MapPin, Star, ArrowRight } from 'lucide-react';
import { useEquipmentStore } from '@/lib/stores/equipment-store';
import heroImage from '@/assets/hero-camera.jpg';

export default function Home() {
  const { featuredEquipment } = useEquipmentStore();

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Professional Equipment",
      description: "Access to the latest cameras, lenses, and accessories from top brands"
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Quick Booking",
      description: "Easy online booking with instant availability checking"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Insured & Protected",
      description: "All equipment is fully insured and regularly maintained"
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "3 Convenient Locations",
      description: "Pick up and return at Downtown, Midtown, or Uptown stores"
    }
  ];

  const stores = [
    {
      name: "Downtown Studio",
      address: "123 Main St, Downtown",
      hours: "Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM"
    },
    {
      name: "Midtown Hub",
      address: "456 Creative Ave, Midtown",
      hours: "Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM"
    },
    {
      name: "Uptown Gallery",
      address: "789 Photo Blvd, Uptown",
      hours: "Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-6PM"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                Rent Professional
                <span className="block text-accent-glow">Camera Gear</span>
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-lg">
                Access the latest photography and videography equipment from top brands. 
                Professional quality, affordable rates, convenient locations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/catalog">
                  <Button variant="accent" size="xl" className="min-w-[200px]">
                    Browse Equipment
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/locations">
                  <Button variant="premium" size="xl" className="min-w-[200px]">
                    Find Stores
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="animate-float">
                <img 
                  src={heroImage} 
                  alt="Professional camera equipment"
                  className="w-full h-auto rounded-2xl shadow-glow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose CameraRent?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make professional photography equipment accessible to creators everywhere
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Equipment
            </h2>
            <p className="text-xl text-muted-foreground">
              Popular cameras and accessories available for rent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredEquipment.map((item) => (
              <Card key={item.id} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${item.dailyRate}/day
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-accent mr-1" />
                      4.9
                    </div>
                  </div>
                  <Link to={`/equipment/${item.id}`}>
                    <Button variant="professional" className="w-full group-hover:bg-primary-glow">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/catalog">
              <Button variant="hero" size="lg">
                View All Equipment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Store Locations
            </h2>
            <p className="text-xl text-muted-foreground">
              Convenient pickup and return locations across the city
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <Card key={index} className="bg-gradient-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {store.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {store.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {store.hours}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of photographers and filmmakers who trust CameraRent for their equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button variant="accent" size="xl">
                Browse Equipment
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="premium" size="xl">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}