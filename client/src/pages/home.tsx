import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceCategories from "@/components/service-categories";
import FeaturedProperties from "@/components/featured-properties";
import PremiumPackages from "@/components/premium-packages";
import Footer from "@/components/footer";
import { Shield, Clock, Star } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  // Removed auto-redirect logic to allow all users to view home page

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <HeroSection />
      
      <ServiceCategories />
      
      <FeaturedProperties />
      
      <PremiumPackages />

      {/* Premium Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-premium-title">
              Why Choose PropServe Premium?
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-premium-subtitle">
              Exclusive benefits for our premium members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="feature-verified">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Verified Professionals</h3>
              <p className="text-muted-foreground">
                All service providers are thoroughly vetted and verified for quality assurance.
              </p>
            </div>

            <div className="text-center" data-testid="feature-support">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock customer support for all your queries and bookings.
              </p>
            </div>

            <div className="text-center" data-testid="feature-quality">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Premium Quality</h3>
              <p className="text-muted-foreground">
                Access to top-rated properties and premium service providers only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
