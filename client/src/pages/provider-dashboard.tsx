import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import BookingCard from "@/components/booking-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CalendarCheck, Star, DollarSign, Clock, Edit } from "lucide-react";
import { authManager } from "@/lib/auth";
import { Booking, Service } from "@shared/schema";
import { useLocation } from "wouter";

export default function ProviderDashboard() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setLocation("/");
      return;
    }
    
    if (authState.user?.role !== "provider") {
      setLocation("/");
      return;
    }
  }, [authState, setLocation]);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/provider/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: [`/api/services/provider/${authState.user?.id}`],
    enabled: !!authState.user?.id,
  });

  if (!authState.isAuthenticated || authState.user?.role !== "provider") {
    return null;
  }

  // Calculate statistics
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const totalEarnings = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + parseFloat(b.cost), 0);
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const averageRating = services.length > 0 
    ? services.reduce((sum, s) => sum + parseFloat(s.rating || "0"), 0) / services.length 
    : 0;

  const getServiceIcon = (category: string) => {
    const iconClass = "h-6 w-6";
    switch (category) {
      case "plumbing":
        return <i className={`fas fa-wrench ${iconClass} text-blue-600`}></i>;
      case "electrical":
        return <i className={`fas fa-bolt ${iconClass} text-yellow-600`}></i>;
      case "hospital":
        return <i className={`fas fa-hospital ${iconClass} text-red-600`}></i>;
      case "doctor":
        return <i className={`fas fa-stethoscope ${iconClass} text-green-600`}></i>;
      case "grocery":
        return <i className={`fas fa-shopping-cart ${iconClass} text-purple-600`}></i>;
      case "cab":
        return <i className={`fas fa-taxi ${iconClass} text-orange-600`}></i>;
      default:
        return <i className={`fas fa-tools ${iconClass} text-gray-600`}></i>;
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
                Service Provider Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="text-welcome">
                Manage your services and bookings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white" data-testid="button-add-service">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="bookings" className="space-y-8">
          <TabsList>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              Service Bookings
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              My Services
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-bookings-title">
                Service Bookings
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
                    No bookings yet. Customers will see your services and can book them.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      userRole="provider" 
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-services-title">
                My Services
              </h2>

              <Card>
                <CardContent className="p-6">
                  {servicesLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded w-48"></div>
                              <div className="h-3 bg-muted rounded w-32"></div>
                            </div>
                          </div>
                          <div className="h-8 bg-muted rounded w-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg" data-testid="text-no-services">
                        No services listed yet. Add your first service to start receiving bookings!
                      </p>
                      <Button 
                        className="mt-4 bg-purple-500 hover:bg-purple-600 text-white"
                        data-testid="button-add-first-service"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div 
                          key={service.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                          data-testid={`row-service-${service.id}`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              {getServiceIcon(service.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground" data-testid={`text-service-title-${service.id}`}>
                                {service.title}
                              </h3>
                              <p className="text-sm text-muted-foreground" data-testid={`text-service-description-${service.id}`}>
                                {service.description || `${service.category.charAt(0).toUpperCase() + service.category.slice(1)} services`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold text-foreground" data-testid={`text-service-price-${service.id}`}>
                                {service.priceRange}
                              </p>
                              <p className="text-sm text-green-600" data-testid={`text-service-stats-${service.id}`}>
                                {service.totalBookings || 0} bookings • {service.rating || "0.0"} ★
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              service.availability ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {service.availability ? "Active" : "Inactive"}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:text-primary/80"
                              data-testid={`button-edit-service-${service.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-analytics-title">
                Analytics Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card data-testid="card-stat-completed">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CalendarCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground" data-testid="text-completed-jobs">
                          {completedBookings}
                        </p>
                        <p className="text-sm text-muted-foreground">Completed Jobs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-rating">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground" data-testid="text-average-rating">
                          {averageRating.toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-earnings">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground" data-testid="text-total-earnings">
                          ${totalEarnings.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-pending">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground" data-testid="text-pending-requests">
                          {pendingBookings}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending Requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Analytics Content */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Services:</span>
                      <span className="text-foreground font-medium" data-testid="text-total-services">
                        {services.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Services:</span>
                      <span className="text-foreground font-medium" data-testid="text-active-services">
                        {services.filter(s => s.availability).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Bookings:</span>
                      <span className="text-foreground font-medium" data-testid="text-total-bookings">
                        {bookings.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="text-foreground font-medium" data-testid="text-success-rate">
                        {bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
