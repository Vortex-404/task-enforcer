import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Heart, Sparkles } from "lucide-react";
import { Task, Priority, StrictnessLevel } from "@/types";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pdrpkbtfphqwtvbaluhb.supabase.co', // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcnBrYnRmcGhxd3R2YmFsdWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMDcwNDcsImV4cCI6MjA2OTU4MzA0N30.oobW5fHwLyM10PKUvPMqdA-v42_6G9buoCT0K5jdogU' // API Key
);

interface CasualTaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => void;
  onCancel: () => void;
}

const priorityConfig = {
  low: { label: "Low", color: "bg-blue-400", icon: "●" },
  medium: { label: "Medium", color: "bg-yellow-400", icon: "●" },
  high: { label: "High", color: "bg-orange-400", icon: "●" },
  critical: { label: "Urgent", color: "bg-red-400", icon: "●" }
};

const casualStrictnessConfig = {
  standard: { 
    label: "Gentle", 
    description: "Soft reminders and encouragement",
    color: "text-blue-400",
    intensity: "Relaxed"
  },
  military: { 
    label: "Focused", 
    description: "Helpful nudges when you get distracted",
    color: "text-green-400",
    intensity: "Moderate"
  },
  elite: { 
    label: "Determined", 
    description: "Firm but kind accountability",
    color: "text-purple-400",
    intensity: "Strong"
  },
  maximum: { 
    label: "Committed", 
    description: "Persistent support to reach your goals",
    color: "text-pink-400",
    intensity: "Dedicated"
  }
};

const CasualTaskCreator = ({ onCreateTask, onCancel }: CasualTaskCreatorProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    strictnessLevel: "standard" as StrictnessLevel,
    deadline: "",
    estimatedDuration: 30,
    tags: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

    const { data, error } = await supabase.from('tasks').insert([task]);

    if (error) {
      console.error('Error creating task:', error);
      return;
    }

    console.log('Task created successfully:', data);
    onCreateTask(task);
  };

  const selectedStrictness = casualStrictnessConfig[formData.strictnessLevel];

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>Create a New Task</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">What would you like to accomplish?</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Write a blog post, organize my desk..."
              className="bg-input/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Any additional details?</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional notes about this task..."
              className="bg-input/50 min-h-[80px]"
            />
          </div>

          {/* Priority and Support Level Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">How important is this?</Label>
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
              <Label className="text-sm font-medium">How much support do you need?</Label>
              <Select value={formData.strictnessLevel} onValueChange={(value: StrictnessLevel) => setFormData(prev => ({ ...prev, strictnessLevel: value }))}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(casualStrictnessConfig).map(([key, config]) => (
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

          {/* Support Level Info */}
          <div className={`p-3 rounded-md border-l-4 border-l-primary bg-card/50`}>
            <div className="flex items-start space-x-2">
              <Sparkles className={`h-4 w-4 mt-0.5 ${selectedStrictness.color}`} />
              <div>
                <p className="text-sm font-medium">{selectedStrictness.label} Support</p>
                <p className="text-xs text-muted-foreground">{selectedStrictness.description}</p>
              </div>
            </div>
          </div>

          {/* Deadline and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3" />
                <span>When would you like to finish?</span>
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
                <span>How long will this take?</span>
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
            <Label htmlFor="tags" className="text-sm font-medium">Tags (optional)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="personal, work, creative (comma-separated)"
              className="bg-input/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all">
              Create Task ✨
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="px-6">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CasualTaskCreator;