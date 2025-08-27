import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { authManager } from "@/lib/auth";
import RoleSelector from "./role-selector";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const authState = authManager.getState();

  const handleSignOut = () => {
    authManager.logout();
    window.location.href = "/";
  };

  if (authState.isAuthenticated && location !== "/") {
    return (
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">PropServe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                Welcome, {authState.user?.name}
              </span>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                data-testid="button-signout"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="link-home">
                    PropServe
                  </h1>
                </Link>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-8">
                  <Link href="/">
                    <a className="text-foreground hover:text-primary transition-colors" data-testid="link-properties">
                      Properties
                    </a>
                  </Link>
                  <Link href="/">
                    <a className="text-foreground hover:text-primary transition-colors" data-testid="link-services">
                      Services
                    </a>
                  </Link>
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    About
                  </a>
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowRoleSelector(true)}
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowRoleSelector(true)}
                  data-testid="button-register"
                >
                  Register
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                data-testid="button-menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/">
                  <a className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                    Properties
                  </a>
                </Link>
                <Link href="/">
                  <a className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                    Services
                  </a>
                </Link>
                <a href="#" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                  About
                </a>
                <a href="#" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
                <div className="pt-4 pb-3 border-t border-border">
                  <Button 
                    className="w-full mb-2" 
                    onClick={() => setShowRoleSelector(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={() => setShowRoleSelector(true)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <RoleSelector 
        isOpen={showRoleSelector}
        onClose={() => setShowRoleSelector(false)}
      />
    </>
  );
}
