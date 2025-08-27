import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginSchema, insertUserSchema } from "@shared/schema";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, Building, Wrench } from "lucide-react";
import { z } from "zod";

const registerSchema = insertUserSchema;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [authState, setAuthState] = useState(authManager.getState());

  // Get role from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role && ["user", "owner", "provider"].includes(role)) {
      setSelectedRole(role);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      switch (authState.user.role) {
        case "user":
          setLocation("/user-dashboard");
          break;
        case "owner":
          setLocation("/owner-dashboard");
          break;
        case "provider":
          setLocation("/provider-dashboard");
          break;
      }
    }
  }, [authState, setLocation]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: selectedRole as "user" | "owner" | "provider",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: selectedRole as "user" | "owner" | "provider",
      name: "",
      phone: "",
    },
  });

  // Update form role when selectedRole changes
  useEffect(() => {
    loginForm.setValue("role", selectedRole as "user" | "owner" | "provider");
    registerForm.setValue("role", selectedRole as "user" | "owner" | "provider");
  }, [selectedRole, loginForm, registerForm]);

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await authManager.login(data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      await authManager.register(data);
      toast({
        title: "Registration successful",
        description: "Please sign in with your new account",
      });
      // Switch to login tab after successful registration
      document.querySelector('[data-state="active"]')?.parentElement?.querySelector('[value="login"]')?.click();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "user":
        return {
          title: "Service User",
          description: "Book services & browse properties",
          icon: User,
          color: "bg-green-500 hover:bg-green-600",
        };
      case "owner":
        return {
          title: "Property Owner",
          description: "List & manage your properties",
          icon: Building,
          color: "bg-orange-500 hover:bg-orange-600",
        };
      case "provider":
        return {
          title: "Service Provider",
          description: "Offer services to customers",
          icon: Wrench,
          color: "bg-purple-500 hover:bg-purple-600",
        };
      default:
        return {
          title: "Service User",
          description: "Book services & browse properties",
          icon: User,
          color: "bg-green-500 hover:bg-green-600",
        };
    }
  };

  const roleConfig = getRoleConfig(selectedRole);
  const IconComponent = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {["user", "owner", "provider"].map((role) => {
                const config = getRoleConfig(role);
                const Icon = config.icon;
                const isSelected = selectedRole === role;
                
                return (
                  <Button
                    key={role}
                    variant={isSelected ? "default" : "outline"}
                    className={`flex flex-col h-auto p-4 ${isSelected ? config.color : ""}`}
                    onClick={() => setSelectedRole(role)}
                    data-testid={`button-select-role-${role}`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium">{config.title}</span>
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <IconComponent className="h-5 w-5" />
                <span className="font-semibold">{roleConfig.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{roleConfig.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Login/Register Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Welcome to PropServe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              data-testid="input-login-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                              data-testid="input-login-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className={`w-full ${roleConfig.color}`}
                      disabled={loginForm.formState.isSubmitting}
                      data-testid="button-login"
                    >
                      {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              data-testid="input-register-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              data-testid="input-register-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter your phone number"
                              {...field}
                              data-testid="input-register-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a password"
                              {...field}
                              data-testid="input-register-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className={`w-full ${roleConfig.color}`}
                      disabled={registerForm.formState.isSubmitting}
                      data-testid="button-register"
                    >
                      {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                Back to Home
              </Button>
              <Button variant="link" className="text-primary">
                Forgot password?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
