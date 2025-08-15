import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskNLP } from "@/lib/nlp";
import { Sparkles, Calendar, Clock } from "lucide-react";
import { Task } from "@/types";

interface EnhancedTaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => void;
  onCancel: () => void;
}

const EnhancedTaskCreator = ({ onCreateTask, onCancel }: EnhancedTaskCreatorProps) => {
  const [input, setInput] = useState("");
  const [parsedTask, setParsedTask] = useState<ReturnType<typeof TaskNLP.parseTask> | null>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.length > 3) {
      const parsed = TaskNLP.parseTask(value);
      setParsedTask(parsed);
    } else {
      setParsedTask(null);
    }
  };

  const handleSubmit = () => {
    if (parsedTask) {
      onCreateTask({
        title: parsedTask.title,
        description: parsedTask.description,
        priority: parsedTask.priority,
        strictnessLevel: parsedTask.strictnessLevel,
        deadline: parsedTask.deadline,
        estimatedDuration: parsedTask.estimatedDuration,
        status: 'pending',
        tags: parsedTask.tags
      });
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI-Powered Mission Deployment</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Call Sarah tomorrow at 2pm about the urgent project - 1 hour"
          className="text-lg"
        />

        {parsedTask && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{parsedTask.title}</h3>
              <Badge variant={parsedTask.confidence > 0.7 ? "default" : "secondary"}>
                {Math.round(parsedTask.confidence * 100)}% confidence
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{parsedTask.deadline.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{parsedTask.estimatedDuration}m</span>
              </div>
              <Badge variant="outline">{parsedTask.priority}</Badge>
            </div>

            {parsedTask.tags.length > 0 && (
              <div className="flex gap-1">
                {parsedTask.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          <Button 
            onClick={handleSubmit} 
            disabled={!parsedTask || parsedTask.confidence < 0.3}
            className="flex-1"
          >
            Deploy Mission
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskCreator;