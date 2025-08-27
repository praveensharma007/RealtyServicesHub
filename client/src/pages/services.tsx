import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import BookServiceModal from "@/components/book-service-modal";
import { 
  Wrench, 
  Zap, 
  Heart, 
  Stethoscope, 
  ShoppingCart, 
  Car,
  Star,
  MapPin,
  Phone,
  Search
} from "lucide-react";
import { useLocation } from "wouter";

interface Service {
  id: string;
  providerId: string;
  category: string;
  title: string;
  description: string | null;
  priceRange: string;
  availability: boolean | null;
  rating: string | null;
  totalBookings: number;
  createdAt: Date;
}

export default function ServicesPage() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const categoryIcons = {
    plumbing: <Wrench className="h-6 w-6" />,
    electrical: <Zap className="h-6 w-6" />,
    hospital: <Heart className="h-6 w-6" />,
    doctor: <Stethoscope className="h-6 w-6" />,
    grocery: <ShoppingCart className="h-6 w-6" />,
    cab: <Car className="h-6 w-6" />,
  };

  const categoryNames = {
    plumbing: "Plumbing Services",
    electrical: "Electrical Services", 
    hospital: "Hospital Services",
    doctor: "Doctor Consultation",
    grocery: "Grocery Delivery",
    cab: "Transportation/Cab",
  };

  const categories = [
    { id: "", name: "All Services" },
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "hospital", name: "Hospital" },
    { id: "doctor", name: "Doctor" },
    { id: "grocery", name: "Grocery" },
    { id: "cab", name: "Transportation" },
  ];

  const filteredServices = services.filter((service: Service) => {
    const matchesCategory = selectedCategory ? service.category === selectedCategory : true;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedService(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-services-title">
            {selectedCategory ? categoryNames[selectedCategory as keyof typeof categoryNames] : "All Services"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Find trusted professionals for all your service needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-services"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
                data-testid={`button-category-${category.id || 'all'}`}
              >
                {category.id && categoryIcons[category.id as keyof typeof categoryIcons]}
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: Service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`card-service-${service.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {categoryIcons[service.category as keyof typeof categoryIcons]}
                    <Badge variant="secondary" className="capitalize">
                      {service.category}
                    </Badge>
                  </div>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg" data-testid={`text-service-title-${service.id}`}>
                  {service.title}
                </CardTitle>
                <CardDescription className="line-clamp-2" data-testid={`text-service-description-${service.id}`}>
                  {service.description || "Professional service available"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price Range:</span>
                    <span className="font-semibold text-primary" data-testid={`text-service-price-${service.id}`}>
                      {service.priceRange}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{service.totalBookings} bookings completed</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge 
                      variant={service.availability ? "default" : "secondary"}
                      className={service.availability ? "bg-green-500" : ""}
                    >
                      {service.availability ? "Available" : "Busy"}
                    </Badge>
                    
                    <Button 
                      onClick={() => handleBookService(service)}
                      disabled={!service.availability}
                      className="bg-blue-500 hover:bg-blue-600"
                      data-testid={`button-book-service-${service.id}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Book Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories
            </p>
          </div>
        )}
      </div>

      {selectedService && (
        <BookServiceModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}