import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { Property } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
}

export default function PropertyCard({ property, showActions = true }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const authState = authManager.getState();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const userId = authState.user?.id;
      if (!userId) throw new Error("User not authenticated");

      if (isLiked) {
        await apiRequest("DELETE", `/api/properties/${property.id}/like`, { userId });
      } else {
        await apiRequest("POST", `/api/properties/${property.id}/like`, { userId });
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: isLiked ? "Property unliked" : "Property liked",
        description: isLiked ? "Removed from your favorites" : "Added to your favorites",
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

  const viewMutation = useMutation({
    mutationFn: async () => {
      const userId = authState.user?.id;
      await apiRequest("POST", `/api/properties/${property.id}/view`, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
  });

  const handleView = () => {
    if (authState.user?.role === "user") {
      viewMutation.mutate();
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authState.isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like properties",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
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

  // Use placeholder image if no images available
  const imageUrl = property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";

  return (
    <div 
      className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border cursor-pointer"
      onClick={handleView}
      data-testid={`card-property-${property.id}`}
    >
      <img 
        src={imageUrl}
        alt={property.title}
        className="w-full h-48 object-cover"
        data-testid={`img-property-${property.id}`}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-foreground" data-testid={`text-property-title-${property.id}`}>
            {property.title}
          </h3>
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              data-testid={`button-like-${property.id}`}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
                }`} 
              />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mb-3" data-testid={`text-property-details-${property.id}`}>
          {property.bedrooms} bed • {property.bathrooms} bath • {property.squareFeet.toLocaleString()} sq ft
        </p>
        <p className="text-sm text-muted-foreground mb-4 flex items-center" data-testid={`text-property-address-${property.id}`}>
          <MapPin className="mr-1 h-4 w-4" />
          {property.address}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary" data-testid={`text-property-price-${property.id}`}>
            ${property.monthlyRent}/mo
          </span>
          <Badge className={getStatusColor(property.status || "available")}>
            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1) || "Available"}
          </Badge>
        </div>
        {property.views !== undefined && property.likes !== undefined && (
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span data-testid={`text-property-views-${property.id}`}>
              {property.views} views
            </span>
            <span data-testid={`text-property-likes-${property.id}`}>
              {property.likes} likes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
