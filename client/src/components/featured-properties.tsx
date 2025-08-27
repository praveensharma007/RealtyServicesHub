import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./property-card";
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";

export default function FeaturedProperties() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-lg text-muted-foreground">Discover premium properties from verified owners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm border border-border p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredProperties = properties.slice(0, 6);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-featured-title">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-featured-subtitle">
            Discover premium properties from verified owners
          </p>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg" data-testid="text-no-properties">
              No properties available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                data-testid="button-view-all-properties"
              >
                View All Properties
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
