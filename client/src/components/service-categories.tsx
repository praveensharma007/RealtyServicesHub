import { Wrench, Zap, Building2, Stethoscope, ShoppingCart, Car } from "lucide-react";

const serviceCategories = [
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Professional plumbers",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Certified electricians",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Building2,
    title: "Hospital",
    description: "Medical facilities",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Stethoscope,
    title: "Doctor",
    description: "Healthcare professionals",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: ShoppingCart,
    title: "Grocery",
    description: "Fresh delivery",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Car,
    title: "Cab",
    description: "Premium transport",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function ServiceCategories() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-services-title">
            Premium Services
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-services-subtitle">
            Professional services at your fingertips
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
                data-testid={`card-service-${category.title.toLowerCase()}`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${category.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-service-${category.title.toLowerCase()}-title`}>
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2" data-testid={`text-service-${category.title.toLowerCase()}-description`}>
                    {category.description}
                  </p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Premium
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
