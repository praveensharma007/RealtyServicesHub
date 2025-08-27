import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Lock, 
  Bell, 
  HelpCircle, 
  Shield, 
  LogOut,
  Home,
  Building,
  Wrench
} from "lucide-react";
import { authManager } from "@/lib/auth";
import { useLocation } from "wouter";
import ProfileModal from "./profile-modal";

export default function ProfileDropdown() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState(authManager.getState());
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const user = authState.user;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    authManager.logout();
    setLocation("/");
  };

  const handleDashboard = () => {
    switch (user.role) {
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
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "user":
        return <User className="h-4 w-4" />;
      case "owner":
        return <Building className="h-4 w-4" />;
      case "provider":
        return <Wrench className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case "user":
        return "Service User";
      case "owner":
        return "Property Owner";
      case "provider":
        return "Service Provider";
      default:
        return "User";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full"
            data-testid="button-profile-dropdown"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2" data-testid="profile-info">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none" data-testid="profile-name">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1" data-testid="profile-email">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getRoleIcon()}
                    <span className="text-xs text-muted-foreground" data-testid="profile-role">
                      {getRoleLabel()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDashboard}
            className="cursor-pointer"
            data-testid="menu-dashboard"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setShowProfileModal(true)}
            className="cursor-pointer"
            data-testid="menu-edit-profile"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-change-password">
            <Lock className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notification Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-privacy">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-help">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600"
            data-testid="menu-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}