import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  HelpCircle,
  Edit3,
  Save,
  Eye,
  EyeOff,
  Building,
  Wrench
} from "lucide-react";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { toast } = useToast();
  const [authState, setAuthState] = useState(authManager.getState());
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
    bookingUpdates: true,
    propertyAlerts: true,
    serviceReminders: true,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowReviews: true,
    shareData: false,
  });

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authState.user) {
      setProfileData({
        name: authState.user.name || "",
        email: authState.user.email || "",
        phone: authState.user.phone || "",
      });
    }
  }, [authState.user]);

  const user = authState.user;
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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

  const handleProfileSave = () => {
    // In a real app, this would make an API call to update the profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditingProfile(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would make an API call to change the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Account Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="password" data-testid="tab-password">Password</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy" data-testid="tab-privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl" data-testid="profile-display-name">
                        {user.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {getRoleIcon()}
                        <span data-testid="profile-display-role">{getRoleLabel()}</span>
                      </CardDescription>
                      <Badge variant="secondary" className="mt-2" data-testid="profile-status">
                        Active Account
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    variant={isEditingProfile ? "outline" : "default"}
                    data-testid="button-edit-profile"
                  >
                    {isEditingProfile ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditingProfile ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        data-testid="input-profile-name"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md" data-testid="display-profile-name">
                        {user.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditingProfile ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        data-testid="input-profile-email"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2" data-testid="display-profile-email">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditingProfile ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        data-testid="input-profile-phone"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2" data-testid="display-profile-phone">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {user.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="p-3 bg-muted rounded-md flex items-center gap-2" data-testid="display-account-type">
                      {getRoleIcon()}
                      {getRoleLabel()}
                    </div>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingProfile(false);
                        // Reset form data
                        setProfileData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                        });
                      }}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleProfileSave} data-testid="button-save-profile">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      data-testid="input-current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      data-testid="button-toggle-current-password"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter your new password"
                      data-testid="input-new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      data-testid="button-toggle-new-password"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                    data-testid="input-confirm-password"
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handlePasswordChange} data-testid="button-change-password">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about important updates
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      data-testid="switch-email-notifications"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get text messages for urgent updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      data-testid="switch-sms-notifications"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about your bookings and appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.bookingUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, bookingUpdates: checked })}
                      data-testid="switch-booking-updates"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Property Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        New properties matching your criteria
                      </p>
                    </div>
                    <Switch
                      checked={notifications.propertyAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, propertyAlerts: checked })}
                      data-testid="switch-property-alerts"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Service Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for upcoming service appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.serviceReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, serviceReminders: checked })}
                      data-testid="switch-service-reminders"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Special offers and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      data-testid="switch-marketing-notifications"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                      data-testid="switch-profile-visibility"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your email on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                      data-testid="switch-show-email"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your phone number on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                      data-testid="switch-show-phone"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Reviews</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others leave reviews about your services
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowReviews}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowReviews: checked })}
                      data-testid="switch-allow-reviews"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymous usage data to improve our services
                      </p>
                    </div>
                    <Switch
                      checked={privacy.shareData}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, shareData: checked })}
                      data-testid="switch-data-sharing"
                    />
                  </div>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Need help with privacy settings?</p>
                        <p className="text-sm text-muted-foreground">
                          Visit our Help Center or contact support for assistance with your privacy preferences.
                        </p>
                        <Button variant="outline" size="sm" data-testid="button-privacy-help">
                          Get Help
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}