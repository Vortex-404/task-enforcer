import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Shield, AlertTriangle } from "lucide-react";
import { Task, Priority, StrictnessLevel } from "@/types";

interface TaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => void;
  onCancel: () => void;
}

const priorityConfig = {
  low: { label: "Low", color: "bg-blue-500", icon: "●" },
  medium: { label: "Medium", color: "bg-yellow-500", icon: "●" },
  high: { label: "High", color: "bg-orange-500", icon: "●" },
  critical: { label: "Critical", color: "bg-red-500", icon: "●" }
};

const strictnessConfig = {
  standard: { 
    label: "Standard", 
    description: "Basic focus mode with gentle reminders",
    color: "text-blue-400",
    intensity: "Low"
  },
  military: { 
    label: "Military", 
    description: "Firm accountability with structured pressure",
    color: "text-yellow-400",
    intensity: "Medium"
  },
  elite: { 
    label: "Elite", 
    description: "Aggressive enforcement with psychological pressure",
    color: "text-orange-400",
    intensity: "High"
  },
  maximum: { 
    label: "Maximum", 
    description: "Unrelenting enforcement - no excuses tolerated",
    color: "text-red-400",
    intensity: "Extreme"
  }
};

const TaskCreator = ({ onCreateTask, onCancel }: TaskCreatorProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    strictnessLevel: "military" as StrictnessLevel,
    deadline: "",
    estimatedDuration: 60,
    tags: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const task = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      strictnessLevel: formData.strictnessLevel,
      deadline: new Date(formData.deadline),
      estimatedDuration: formData.estimatedDuration,
      status: "pending" as const,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    };

    onCreateTask(task);
  };

  const selectedStrictness = strictnessConfig[formData.strictnessLevel];

  return (
    <Card className="border-primary/20 shadow-intense">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Deploy New Mission</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Mission Objective</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Define your mission objective..."
              className="bg-input/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Mission Details</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed mission parameters and requirements..."
              className="bg-input/50 min-h-[80px]"
            />
          </div>

          {/* Priority and Strictness Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Enforcement Level</Label>
              <Select value={formData.strictnessLevel} onValueChange={(value: StrictnessLevel) => setFormData(prev => ({ ...prev, strictnessLevel: value }))}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(strictnessConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <span className={config.color}>{config.label}</span>
                        <Badge variant="outline" className="text-xs">{config.intensity}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strictness Warning */}
          <div className={`p-3 rounded-md border-l-4 border-l-orange-500 bg-card/50`}>
            <div className="flex items-start space-x-2">
              <AlertTriangle className={`h-4 w-4 mt-0.5 ${selectedStrictness.color}`} />
              <div>
                <p className="text-sm font-medium">{selectedStrictness.label} Enforcement</p>
                <p className="text-xs text-muted-foreground">{selectedStrictness.description}</p>
              </div>
            </div>
          </div>

          {/* Deadline and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3" />
                <span>Mission Deadline</span>
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="bg-input/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Duration (minutes)</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="480"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                className="bg-input/50"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">Mission Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="work, coding, strategy (comma-separated)"
              className="bg-input/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-elite transition-all">
              Deploy Mission
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="px-6">
              Abort
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskCreator;