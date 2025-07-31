import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart } from "lucide-react";

interface ModeToggleProps {
  isCeoMode: boolean;
  onModeChange: (isCeoMode: boolean) => void;
}

const ModeToggle = ({ isCeoMode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Heart className={`h-4 w-4 ${!isCeoMode ? 'text-pink-400' : 'text-muted-foreground'}`} />
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          Casual Mode
        </Label>
      </div>
      
      <Switch
        id="mode-toggle"
        checked={isCeoMode}
        onCheckedChange={onModeChange}
        className="data-[state=checked]:bg-primary"
      />
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          CEO Mode
        </Label>
        <Shield className={`h-4 w-4 ${isCeoMode ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      
      <Badge 
        variant={isCeoMode ? "default" : "secondary"}
        className={isCeoMode ? "bg-primary" : "bg-pink-400 text-white"}
      >
        {isCeoMode ? 'MILITARY-GRADE' : 'FRIENDLY'}
      </Badge>
    </div>
  );
};

export default ModeToggle;