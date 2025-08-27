import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";

export default function PremiumPackages() {
  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for occasional users",
      features: [
        "Access to verified service providers",
        "Basic property search",
        "Email support",
        "Standard booking management",
        "Basic profile features"
      ],
      icon: <Star className="h-8 w-8 text-blue-500" />,
      bgGradient: "from-blue-50 to-indigo-50",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Most popular for regular users",
      features: [
        "Everything in Basic",
        "Priority support 24/7",
        "Advanced property filters",
        "Premium service providers",
        "Instant booking confirmation",
        "Property viewing scheduler",
        "Multi-property comparison"
      ],
      icon: <Crown className="h-8 w-8 text-purple-500" />,
      bgGradient: "from-purple-50 to-pink-50",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$39.99",
      period: "per month",
      description: "For business owners and professionals",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Bulk property management",
        "Advanced analytics dashboard",
        "Custom branding options",
        "API access for integration",
        "White-label solutions",
        "Priority listing placement"
      ],
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      bgGradient: "from-orange-50 to-red-50",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-packages-title">
            Choose Your Premium Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-packages-subtitle">
            Unlock exclusive features and get priority access to the best properties and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative ${pkg.popular ? 'border-2 border-purple-500 shadow-xl scale-105' : 'border border-gray-200'} bg-gradient-to-br ${pkg.bgGradient} dark:from-gray-800 dark:to-gray-700`}
              data-testid={`card-package-${pkg.id}`}
            >
              {pkg.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1"
                  data-testid="badge-popular"
                >
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {pkg.icon}
                </div>
                <CardTitle className="text-2xl font-bold" data-testid={`text-package-name-${pkg.id}`}>
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-sm" data-testid={`text-package-description-${pkg.id}`}>
                  {pkg.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground" data-testid={`text-package-price-${pkg.id}`}>
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground ml-2" data-testid={`text-package-period-${pkg.id}`}>
                    {pkg.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-3"
                      data-testid={`feature-${pkg.id}-${index}`}
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${pkg.buttonColor} text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105`}
                  data-testid={`button-select-${pkg.id}`}
                >
                  Choose {pkg.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-guarantee">
            30-day money-back guarantee • Cancel anytime • No setup fees
          </p>
          <Button variant="outline" size="lg" data-testid="button-contact-sales">
            Need a custom plan? Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}