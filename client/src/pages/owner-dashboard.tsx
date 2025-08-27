import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import AddPropertyModal from "@/components/add-property-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building, Eye, Heart, DollarSign, Edit, Trash2 } from "lucide-react";
import { authManager } from "@/lib/auth";
import { Property } from "@shared/schema";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState(authManager.getState());
  const [showAddProperty, setShowAddProperty] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setLocation("/");
      return;
    }
    
    if (authState.user?.role !== "owner") {
      setLocation("/");
      return;
    }
  }, [authState, setLocation]);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/owner/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/owner/${authState.user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Property deleted",
        description: "Property has been removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!authState.isAuthenticated || authState.user?.role !== "owner") {
    return null;
  }

  // Calculate statistics
  const totalProperties = properties.length;
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = properties.reduce((sum, p) => sum + (p.likes || 0), 0);
  const monthlyRevenue = properties.reduce((sum, p) => sum + parseFloat(p.monthlyRent), 0);

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "rented":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                Property Owner Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="text-welcome">
                Manage your property listings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddProperty(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-add-property"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-stat-properties">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-properties">
                    {totalProperties}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-views">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-views">
                    {totalViews}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-likes">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-likes">
                    {totalLikes}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-revenue">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-monthly-revenue">
                    ${monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Listings */}
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-properties-title">
              My Properties
            </h2>
          </div>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-16 bg-muted rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg" data-testid="text-no-properties">
                  No properties listed yet. Add your first property to get started!
                </p>
                <Button 
                  onClick={() => setShowAddProperty(true)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-add-first-property"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Property
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => {
                  const imageUrl = property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80";
                  
                  return (
                    <div 
                      key={property.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      data-testid={`row-property-${property.id}`}
                    >
                      <div className="flex items-center space-x-4">
                        <img 
                          src={imageUrl}
                          alt={property.title}
                          className="w-20 h-16 object-cover rounded"
                          data-testid={`img-property-${property.id}`}
                        />
                        <div>
                          <h3 className="font-semibold text-foreground" data-testid={`text-property-title-${property.id}`}>
                            {property.title}
                          </h3>
                          <p className="text-sm text-muted-foreground" data-testid={`text-property-details-${property.id}`}>
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.address}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-property-date-${property.id}`}>
                            Listed {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground" data-testid={`text-property-price-${property.id}`}>
                            ${property.monthlyRent}/mo
                          </p>
                          <p className="text-sm text-green-600" data-testid={`text-property-stats-${property.id}`}>
                            {property.views || 0} views • {property.likes || 0} likes
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(property.status || "available")}`}>
                          {property.status?.charAt(0).toUpperCase() + property.status?.slice(1) || "Available"}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary/80"
                            data-testid={`button-edit-${property.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletePropertyMutation.isPending}
                            data-testid={`button-delete-${property.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddPropertyModal 
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
      />
    </div>
  );
}
