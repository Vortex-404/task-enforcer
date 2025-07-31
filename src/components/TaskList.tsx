import { Task, Priority, StrictnessLevel } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Target,
  Calendar,
  Timer
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
}

const priorityConfig = {
  low: { label: "Low", color: "bg-blue-500", textColor: "text-blue-400" },
  medium: { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" },
  high: { label: "High", color: "bg-orange-500", textColor: "text-orange-400" },
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-400" }
};

const strictnessConfig = {
  standard: { label: "Standard", color: "text-blue-400" },
  military: { label: "Military", color: "text-yellow-400" },
  elite: { label: "Elite", color: "text-orange-400" },
  maximum: { label: "Maximum", color: "text-red-400" }
};

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  failed: { label: "Failed", color: "bg-red-500" },
  abandoned: { label: "Abandoned", color: "bg-gray-400" }
};

const TaskCard = ({ task, onStartTask, onCompleteTask }: { 
  task: Task; 
  onStartTask: (id: string) => void; 
  onCompleteTask: (id: string) => void; 
}) => {
  const isOverdue = new Date() > task.deadline && task.status !== 'completed';
  const timeUntilDeadline = formatDistanceToNow(task.deadline, { addSuffix: true });
  const totalFocusTime = task.focusSessions.reduce((acc, session) => acc + session.duration, 0);
  const progressPercentage = Math.min((totalFocusTime / task.estimatedDuration) * 100, 100);

  return (
    <Card className={`border transition-all hover:shadow-lg ${
      task.status === 'in_progress' ? 'border-primary shadow-elite' : 
      isOverdue ? 'border-destructive/50' : 'border-border'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${priorityConfig[task.priority].color}`} />
                <span className="text-xs">{priorityConfig[task.priority].label}</span>
              </Badge>
              
              <Badge variant="outline" className={`text-xs ${strictnessConfig[task.strictnessLevel].color}`}>
                {strictnessConfig[task.strictnessLevel].label}
              </Badge>
              
              <Badge className={`text-xs ${statusConfig[task.status].color}`}>
                {statusConfig[task.status].label}
              </Badge>
            </div>
          </div>

          <div className="text-right ml-4">
            <div className={`text-sm ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              <Calendar className="h-3 w-3 inline mr-1" />
              {format(task.deadline, 'MMM dd, HH:mm')}
            </div>
            <div className={`text-xs ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
              {isOverdue ? 'OVERDUE' : timeUntilDeadline}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% ({totalFocusTime}m / {task.estimatedDuration}m)</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{task.focusSessions.length} sessions</span>
            {task.focusSessions.length > 0 && (
              <>
                <span>•</span>
                <span>{task.focusSessions.reduce((acc, s) => acc + s.distractionAttempts, 0)} distractions</span>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            {task.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={() => onStartTask(task.id)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elite"
              >
                <Play className="h-3 w-3 mr-1" />
                Start Mission
              </Button>
            )}
            
            {task.status === 'in_progress' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCompleteTask(task.id)}
                className="border-success text-success hover:bg-success/10"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Button>
            )}

            {task.status === 'completed' && (
              <Badge variant="outline" className="text-success border-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Mission Accomplished
              </Badge>
            )}
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TaskList = ({ tasks, onStartTask, onCompleteTask, onEditTask }: TaskListProps) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by status first (in_progress, pending, completed)
    const statusOrder = { in_progress: 0, pending: 1, completed: 2, failed: 3, abandoned: 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Then by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Active Missions</h3>
          <p className="text-sm text-muted-foreground/75 text-center max-w-md">
            Deploy your first mission to begin elite-level task enforcement. 
            Every achievement starts with a single objective.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStartTask={onStartTask}
          onCompleteTask={onCompleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;