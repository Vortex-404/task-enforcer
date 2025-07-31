import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, Zap } from "lucide-react";

interface HeaderProps {
  currentMode: string;
  focusStreak: number;
  isInFocus: boolean;
}

const Header = ({ currentMode, focusStreak, isInFocus }: HeaderProps) => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  StrictFocus Elite
                </h1>
                <p className="text-xs text-muted-foreground">Military-Grade Productivity</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant={isInFocus ? "destructive" : "secondary"} className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{isInFocus ? "FOCUS ACTIVE" : "STANDBY"}</span>
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-accent" />
              <span>{focusStreak} day streak</span>
            </Badge>

            <Button variant="outline" size="sm">
              {currentMode.toUpperCase()} MODE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;