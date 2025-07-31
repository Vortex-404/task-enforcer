import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Star, Sun } from "lucide-react";

interface CasualHeaderProps {
  focusStreak: number;
  isInFocus: boolean;
  completedToday: number;
}

const CasualHeader = ({ focusStreak, isInFocus, completedToday }: CasualHeaderProps) => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  FocusFriend
                </h1>
                <p className="text-xs text-muted-foreground">Your Gentle Productivity Companion</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant={isInFocus ? "default" : "secondary"} className="flex items-center space-x-1">
              <Sun className="h-3 w-3" />
              <span>{isInFocus ? "FOCUSING" : "READY"}</span>
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>{completedToday} done today</span>
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-accent" />
              <span>{focusStreak} day streak</span>
            </Badge>

            <Button variant="outline" size="sm" className="bg-gradient-to-r from-primary/10 to-primary-glow/10">
              CASUAL MODE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasualHeader;