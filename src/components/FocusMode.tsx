import { useState, useEffect } from "react";
import { Task, FocusSession, AIIntervention } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  Brain,
  Target,
  Timer
} from "lucide-react";
import { format } from "date-fns";

interface FocusModeProps {
  task: Task;
  onComplete: () => void;
  onAbandon: () => void;
  onBreakRequest: () => void;
}

const FocusMode = ({ task, onComplete, onAbandon, onBreakRequest }: FocusModeProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [abandonAttempts, setAbandonAttempts] = useState(0);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [sessionStartTime] = useState(new Date());

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeElapsed / (task.estimatedDuration * 60)) * 100;
  const isOvertime = progressPercentage > 100;

  // AI intervention messages based on strictness level
  const getAIIntervention = (attempts: number, strictness: string) => {
    const interventions = {
      standard: [
        "Hey, you've got this! Let's refocus on the task at hand.",
        "I notice you're trying to leave. What's distracting you?",
        "Remember your goal. You committed to this task for a reason."
      ],
      military: [
        "FOCUS REQUIRED. Return to your mission objective immediately.",
        "Distraction detected. Your commitment to excellence is being tested.",
        "DISCIPLINE CHECK: You will not abandon this mission without completion."
      ],
      elite: [
        "UNACCEPTABLE. Elite performers do not yield to weakness.",
        "Your reputation depends on this moment. Failure is not an option.",
        "PRESSURE TEST INITIATED. Prove your elite status or be exposed as average."
      ],
      maximum: [
        "ZERO TOLERANCE. You WILL complete this task. No exceptions. No excuses.",
        "MAXIMUM ENFORCEMENT ACTIVATED. Your weakness disgusts me. FOCUS NOW.",
        "FAILURE DETECTED. You are pathetic. Champions push through. Are you a champion?"
      ]
    };

    const messages = interventions[strictness as keyof typeof interventions] || interventions.standard;
    return messages[Math.min(attempts, messages.length - 1)];
  };

  const handleAbandonAttempt = () => {
    const newAttempts = abandonAttempts + 1;
    setAbandonAttempts(newAttempts);
    
    const message = getAIIntervention(newAttempts - 1, task.strictnessLevel);
    setAiMessage(message);
    setIsBlocked(true);

    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setAiMessage(null);
      if (task.strictnessLevel === 'standard') {
        setIsBlocked(false);
      }
    }, 5000);

    // For higher strictness levels, longer blocking periods
    if (task.strictnessLevel !== 'standard') {
      const blockTime = {
        military: 10000,
        elite: 15000,
        maximum: 30000
      }[task.strictnessLevel] || 5000;

      setTimeout(() => {
        setIsBlocked(false);
      }, blockTime);
    }
  };

  const handleForceComplete = () => {
    if (task.strictnessLevel === 'maximum' && progressPercentage < 80) {
      setAiMessage("INSUFFICIENT PROGRESS. Minimum 80% completion required for Maximum Enforcement.");
      return;
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Lock Mode Header */}
        <Card className="border-primary shadow-elite bg-gradient-to-r from-card/50 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <span className="text-xl">FOCUS MODE ACTIVE</span>
                  <div className="text-sm text-muted-foreground">
                    {task.strictnessLevel.toUpperCase()} ENFORCEMENT
                  </div>
                </div>
              </div>
              <Badge variant="destructive" className="animate-pulse">
                LOCKED
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Task Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>{task.title}</span>
            </CardTitle>
            {task.description && (
              <p className="text-muted-foreground">{task.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Time and Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session Time</span>
                <span className={isOvertime ? "text-warning font-bold" : "text-foreground"}>
                  {formatTime(timeElapsed)} / {task.estimatedDuration}:00
                </span>
              </div>
              <Progress 
                value={Math.min(progressPercentage, 100)} 
                className={`h-3 ${isOvertime ? "bg-warning/20" : ""}`}
              />
              {isOvertime && (
                <p className="text-xs text-warning">
                  ⚡ Overtime mode - Your dedication is being tested
                </p>
              )}
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.floor(timeElapsed / 60)}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{abandonAttempts}</div>
                <div className="text-xs text-muted-foreground">Distractions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{task.focusSessions.length + 1}</div>
                <div className="text-xs text-muted-foreground">Session #</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Intervention */}
        {aiMessage && (
          <Card className="border-warning shadow-lg animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <div className="font-medium text-warning mb-1">AI ENFORCEMENT SYSTEM</div>
                  <p className="text-sm">{aiMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button 
            onClick={handleForceComplete}
            size="lg"
            className="bg-gradient-to-r from-success to-green-600 hover:shadow-lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mission Accomplished
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={onBreakRequest}
              disabled={isBlocked}
              className="border-accent text-accent hover:bg-accent/10"
            >
              <Timer className="h-4 w-4 mr-2" />
              Request Break
            </Button>

            <Button 
              variant="destructive" 
              onClick={handleAbandonAttempt}
              disabled={isBlocked}
              className="bg-gradient-to-r from-destructive to-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              {isBlocked ? 'BLOCKED' : 'Abandon Mission'}
            </Button>
          </div>
        </div>

        {/* Mission Details */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Started: {format(sessionStartTime, 'HH:mm:ss')}</div>
              <div>Deadline: {format(task.deadline, 'MMM dd, HH:mm')}</div>
              <div>Priority: {task.priority.toUpperCase()}</div>
              <div>Enforcement: {task.strictnessLevel.toUpperCase()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <div className="text-center text-xs text-muted-foreground">
          <Eye className="h-3 w-3 inline mr-1" />
          Focus enforcement is active. Your performance is being monitored.
        </div>
      </div>
    </div>
  );
};

export default FocusMode;