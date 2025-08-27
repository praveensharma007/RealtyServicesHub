import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import BookingCard from "@/components/booking-card";
import PropertyCard from "@/components/property-card";
import BookServiceModal from "@/components/book-service-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { authManager } from "@/lib/auth";
import { Booking, Property } from "@shared/schema";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState(authManager.getState());
  const [showBookService, setShowBookService] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setLocation("/");
      return;
    }
    
    if (authState.user?.role !== "user") {
      setLocation("/");
      return;
    }
  }, [authState, setLocation]);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/user/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  const { data: likedProperties = [], isLoading: likedLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/liked/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  const { data: viewedProperties = [], isLoading: viewedLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/viewed/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  if (!authState.isAuthenticated || authState.user?.role !== "user") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                User Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="text-welcome">
                Welcome back, {authState.user?.name}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowBookService(true)}
                className="bg-green-500 hover:bg-green-600 text-white" 
                data-testid="button-book-service"
              >
                <Plus className="mr-2 h-4 w-4" />
                Book Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="bookings" className="space-y-8">
          <TabsList>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="viewed" data-testid="tab-viewed">
              Viewed Properties
            </TabsTrigger>
            <TabsTrigger value="liked" data-testid="tab-liked">
              Liked Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-bookings-title">
                My Service Bookings
              </h2>
              
              {bookingsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg" data-testid="text-no-bookings">
                    No bookings yet. Book your first service to get started!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      userRole="user" 
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="viewed">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-viewed-title">
                Recently Viewed Properties
              </h2>
              
              {viewedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                      <div className="w-full h-48 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-6 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : viewedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg" data-testid="text-no-viewed">
                    No properties viewed yet. Start browsing to see them here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {viewedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="liked">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-liked-title">
                Liked Properties
              </h2>
              
              {likedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                      <div className="w-full h-48 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-6 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : likedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg" data-testid="text-no-liked">
                    No liked properties yet. Like properties to add them to your favorites!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BookServiceModal 
        isOpen={showBookService}
        onClose={() => setShowBookService(false)}
      />
    </div>
  );
}
