import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Building, Wrench } from "lucide-react";
import { useLocation } from "wouter";

interface RoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelector({ isOpen, onClose }: RoleSelectorProps) {
  const [, setLocation] = useLocation();

  const handleRoleSelect = (role: string) => {
    setLocation(`/login?role=${role}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Choose Your Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={() => handleRoleSelect('user')}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-6 h-auto flex items-center space-x-4"
            data-testid="button-role-user"
          >
            <User className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Service User</div>
              <div className="text-sm opacity-90">Book services & browse properties</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleRoleSelect('owner')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-6 h-auto flex items-center space-x-4"
            data-testid="button-role-owner"
          >
            <Building className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Property Owner</div>
              <div className="text-sm opacity-90">List & manage your properties</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleRoleSelect('provider')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-6 h-auto flex items-center space-x-4"
            data-testid="button-role-provider"
          >
            <Wrench className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Service Provider</div>
              <div className="text-sm opacity-90">Offer services to customers</div>
            </div>
          </Button>
        </div>
        <Button variant="secondary" onClick={onClose} className="w-full mt-6">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
