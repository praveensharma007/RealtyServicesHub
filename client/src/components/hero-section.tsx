import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", { searchTerm, category });
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-hero-title">
            Premium Real Estate &<br />
            <span className="text-primary">Service Solutions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Find your perfect property and access premium services from verified professionals. 
            Everything you need for modern living in one platform.
          </p>
          <div className="bg-card rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search properties or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 h-12"
                  data-testid="input-search"
                />
              </div>
              <div className="flex-shrink-0">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full md:w-auto h-12 p-4" data-testid="select-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 h-12"
                data-testid="button-search"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
