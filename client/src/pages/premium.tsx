import { useState } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Shield,
  Clock,
  Users,
  Headphones,
  TrendingUp,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PremiumPage() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for occasional users",
      originalPrice: "$14.99",
      savings: "Save $5",
      features: [
        "Access to verified service providers",
        "Basic property search filters",
        "Email support during business hours",
        "Standard booking management",
        "Basic profile customization",
        "Monthly service reports",
        "Mobile app access"
      ],
      icon: <Star className="h-8 w-8 text-blue-500" />,
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      borderColor: "border-blue-200"
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Most popular for regular users",
      originalPrice: "$29.99",
      savings: "Save $10",
      features: [
        "Everything in Basic plan",
        "Priority customer support 24/7",
        "Advanced property search & filters",
        "Access to premium service providers",
        "Instant booking confirmation",
        "Property viewing scheduler",
        "Multi-property comparison tool",
        "Exclusive deals and discounts",
        "Priority booking queue",
        "Custom service preferences"
      ],
      icon: <Crown className="h-8 w-8 text-purple-500" />,
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      borderColor: "border-purple-300",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$39.99",
      period: "per month",
      description: "For business owners and professionals",
      originalPrice: "$59.99",
      savings: "Save $20",
      features: [
        "Everything in Premium plan",
        "Dedicated account manager",
        "Bulk property management tools",
        "Advanced analytics dashboard",
        "Custom branding options",
        "API access for integrations",
        "White-label solutions",
        "Priority listing placement",
        "Custom reporting tools",
        "Team collaboration features",
        "Advanced security features",
        "Phone support priority"
      ],
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      borderColor: "border-orange-300"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Verified Professionals",
      description: "All service providers undergo rigorous background checks and skill verification"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for urgent issues and queries"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Priority Access",
      description: "Get first access to new properties and premium service providers"
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all premium services and bookings"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Owner",
      plan: "Premium",
      quote: "The premium features have helped me manage my properties more efficiently. The priority support is outstanding!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Service Provider", 
      plan: "Enterprise",
      quote: "Enterprise plan's analytics dashboard gives me insights I never had before. Revenue increased by 40%!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "User",
      plan: "Basic",
      quote: "Even the basic plan offers great value. Found reliable services quickly and easily.",
      rating: 5
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Plan Activated!",
        description: `Your ${plans.find(p => p.id === planId)?.name} plan has been activated successfully.`,
      });
      
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Crown className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6" data-testid="text-premium-hero-title">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-premium-hero-description">
            Get access to exclusive properties, verified professionals, and premium support. 
            Choose the plan that best fits your needs and take your experience to the next level.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              🎉 Limited Time: Save up to $20/month on all plans
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              All plans include our core features with varying levels of access and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? `border-2 ${plan.borderColor} shadow-xl scale-105` : `border ${plan.borderColor}`} bg-gradient-to-br ${plan.bgGradient}`}
                data-testid={`card-plan-${plan.id}`}
              >
                {plan.popular && (
                  <Badge 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1"
                    data-testid="badge-most-popular"
                  >
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold" data-testid={`text-plan-name-${plan.id}`}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-sm" data-testid={`text-plan-description-${plan.id}`}>
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {plan.savings}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-4xl font-bold text-foreground" data-testid={`text-plan-price-${plan.id}`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-3"
                        data-testid={`feature-${plan.id}-${index}`}
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.buttonColor} text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    data-testid={`button-select-plan-${plan.id}`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Choose {plan.name}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              30-day money-back guarantee • Cancel anytime • No setup fees • Secure payment
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg">
                <Headphones className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Premium?</h2>
            <p className="text-lg text-muted-foreground">
              Premium members enjoy exclusive benefits and priority access to our best features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center" data-testid={`benefit-${index}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Real feedback from satisfied premium members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background" data-testid={`testimonial-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <Badge variant="outline">{testimonial.plan}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Can I change my plan anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee instead of a free trial, so you can try any plan risk-free.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}