import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertBookingSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { z } from "zod";

const formSchema = insertBookingSchema.extend({
  cost: z.string().min(1, "Cost is required"),
  scheduledDate: z.string().min(1, "Date is required"),
});

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookServiceModal({ isOpen, onClose }: BookServiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const authState = authManager.getState();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    enabled: isOpen,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: authState.user?.id || "",
      serviceId: "",
      providerId: "",
      serviceTitle: "",
      serviceCategory: "",
      customerName: authState.user?.name || "",
      customerPhone: authState.user?.phone ?? "",
      customerAddress: "",
      scheduledDate: "",
      scheduledTime: "",
      cost: "",
      notes: "",
    },
  });

  const selectedServiceId = form.watch("serviceId");
  const selectedService = services.find(s => s.id === selectedServiceId);

  const createBookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const bookingData = {
        ...data,
        cost: parseFloat(data.cost),
        scheduledDate: new Date(data.scheduledDate),
      };
      return await apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/user/${authState.user?.id}`] });
      toast({
        title: "Booking created",
        description: "Your service booking has been submitted successfully",
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      form.setValue("serviceId", serviceId);
      form.setValue("providerId", service.providerId);
      form.setValue("serviceTitle", service.title);
      form.setValue("serviceCategory", service.category);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createBookingMutation.mutate(data);
  };

  const serviceCategories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hospital", label: "Hospital" },
    { value: "doctor", label: "Doctor" },
    { value: "grocery", label: "Grocery" },
    { value: "cab", label: "Transportation" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Book a Service</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset service selection when category changes
                        form.setValue("serviceId", "");
                        form.setValue("providerId", "");
                        form.setValue("serviceTitle", "");
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-service-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Services</FormLabel>
                    <Select 
                      onValueChange={handleServiceSelect} 
                      value={field.value}
                      disabled={!form.watch("serviceCategory")}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-service">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services
                          .filter(s => s.category === form.watch("serviceCategory") && s.availability)
                          .map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title} - {service.priceRange}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        {...field} 
                        data-testid="input-customer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="Enter phone number" 
                        {...field} 
                        data-testid="input-customer-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the address where service is needed" 
                      className="min-h-[80px]"
                      {...field}
                      data-testid="textarea-customer-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        min={new Date().toISOString().split('T')[0]}
                        data-testid="input-scheduled-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-scheduled-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Cost ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        data-testid="input-cost"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific requirements or notes" 
                      className="min-h-[80px]"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedService && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Service Details</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>Service:</strong> {selectedService.title}
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>Category:</strong> {selectedService.category.charAt(0).toUpperCase() + selectedService.category.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>Price Range:</strong> {selectedService.priceRange}
                </p>
                {selectedService.description && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Description:</strong> {selectedService.description}
                  </p>
                )}
              </div>
            )}

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createBookingMutation.isPending}
                data-testid="button-book-service"
              >
                {createBookingMutation.isPending ? "Booking..." : "Book Service"}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={handleClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}