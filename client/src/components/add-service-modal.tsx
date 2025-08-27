import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertServiceSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const authState = authManager.getState();

  type ServiceFormData = z.infer<typeof insertServiceSchema>;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      category: "plumbing" as const,
      title: "",
      description: "",
      priceRange: "",
      availability: true,
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertServiceSchema>) => {
      const serviceData = {
        ...data,
        providerId: authState.user?.id,
      };
      return await apiRequest("POST", "/api/services", serviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.invalidateQueries({ queryKey: [`/api/services/provider/${authState.user?.id}`] });
      toast({
        title: "Service added",
        description: "Your service has been listed successfully",
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

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: ServiceFormData) => {
    createServiceMutation.mutate(data);
  };

  const serviceCategories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hospital", label: "Hospital Services" },
    { value: "doctor", label: "Doctor Consultation" },
    { value: "grocery", label: "Grocery Delivery" },
    { value: "cab", label: "Transportation/Cab" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Add New Service</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Emergency Plumbing" 
                        {...field} 
                        data-testid="input-service-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service in detail" 
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="textarea-service-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., $50-100/hour" 
                        {...field}
                        data-testid="input-price-range"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Service Available</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Toggle to make service visible to customers
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        data-testid="switch-availability"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Service Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Provide accurate pricing information</li>
                <li>• Include detailed service descriptions</li>
                <li>• Respond promptly to booking requests</li>
                <li>• Maintain professional service quality</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createServiceMutation.isPending}
                data-testid="button-add-service"
              >
                {createServiceMutation.isPending ? "Adding..." : "Add Service"}
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