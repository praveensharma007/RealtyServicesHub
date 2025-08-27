import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Zap, Building2, Stethoscope, ShoppingCart, Car } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  userRole: "user" | "provider";
}

const serviceIcons = {
  plumbing: Wrench,
  electrical: Zap,
  hospital: Building2,
  doctor: Stethoscope,
  grocery: ShoppingCart,
  cab: Car,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const IconComponent = serviceIcons[booking.serviceCategory as keyof typeof serviceIcons] || Wrench;

  const updateBookingMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await apiRequest("PUT", `/api/bookings/${booking.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking updated",
        description: "Booking status has been updated successfully",
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

  const handleStatusChange = (newStatus: string) => {
    updateBookingMutation.mutate(newStatus);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6" data-testid={`card-booking-${booking.id}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground" data-testid={`text-booking-title-${booking.id}`}>
              {booking.serviceTitle}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-booking-category-${booking.id}`}>
              {booking.serviceCategory.charAt(0).toUpperCase() + booking.serviceCategory.slice(1)} Service
            </p>
          </div>
        </div>
        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {userRole === "user" ? "Provider:" : "Customer:"}
          </span>
          <span className="text-foreground" data-testid={`text-booking-contact-${booking.id}`}>
            {userRole === "user" ? "Service Provider" : booking.customerName}
          </span>
        </div>
        {userRole === "provider" && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="text-foreground" data-testid={`text-booking-phone-${booking.id}`}>
                {booking.customerPhone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-foreground" data-testid={`text-booking-address-${booking.id}`}>
                {booking.customerAddress}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span className="text-foreground" data-testid={`text-booking-date-${booking.id}`}>
            {formatDate(booking.scheduledDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time:</span>
          <span className="text-foreground" data-testid={`text-booking-time-${booking.id}`}>
            {booking.scheduledTime}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cost:</span>
          <span className="text-foreground font-semibold" data-testid={`text-booking-cost-${booking.id}`}>
            ${booking.cost}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        {userRole === "user" ? (
          <>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid={`button-contact-provider-${booking.id}`}
            >
              Contact Provider
            </Button>
            {booking.status === "confirmed" && (
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => handleStatusChange("cancelled")}
                disabled={updateBookingMutation.isPending}
                data-testid={`button-cancel-booking-${booking.id}`}
              >
                Cancel
              </Button>
            )}
          </>
        ) : (
          <>
            {booking.status === "pending" && (
              <>
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleStatusChange("confirmed")}
                  disabled={updateBookingMutation.isPending}
                  data-testid={`button-accept-booking-${booking.id}`}
                >
                  Accept
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={updateBookingMutation.isPending}
                  data-testid={`button-decline-booking-${booking.id}`}
                >
                  Decline
                </Button>
              </>
            )}
            {booking.status === "confirmed" && (
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleStatusChange("completed")}
                disabled={updateBookingMutation.isPending}
                data-testid={`button-complete-booking-${booking.id}`}
              >
                Mark Complete
              </Button>
            )}
            {(booking.status === "confirmed" || booking.status === "completed") && (
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid={`button-contact-customer-${booking.id}`}
              >
                Contact Customer
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
