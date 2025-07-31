import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import TaskList from "@/components/TaskList";
import TaskCreator from "@/components/TaskCreator";
import FocusMode from "@/components/FocusMode";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Task } from "@/types";

const Index = () => {
  const {
    tasks,
    activeFocusTask,
    createTask,
    startFocusSession,
    endFocusSession,
    updateTaskStatus,
    getTaskStats
  } = useTaskManager();

  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");

  const stats = getTaskStats();

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => {
    createTask(taskData);
    setShowTaskCreator(false);
    setCurrentTab("missions");
  };

  const handleStartTask = (taskId: string) => {
    startFocusSession(taskId);
  };

  const handleCompleteTask = (taskId: string) => {
    updateTaskStatus(taskId, 'completed');
    endFocusSession(taskId, true);
  };

  const handleAbandonTask = () => {
    if (activeFocusTask) {
      updateTaskStatus(activeFocusTask.id, 'pending');
      endFocusSession(activeFocusTask.id, false);
    }
  };

  // If in focus mode, show only the focus interface
  if (activeFocusTask) {
    return (
      <FocusMode
        task={activeFocusTask}
        onComplete={() => handleCompleteTask(activeFocusTask.id)}
        onAbandon={handleAbandonTask}
        onBreakRequest={() => {
          // Handle break request - for now just continue
          console.log("Break requested");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentMode="ceo" 
        focusStreak={7} 
        isInFocus={!!activeFocusTask} 
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="dashboard">Command Center</TabsTrigger>
              <TabsTrigger value="missions">Active Missions</TabsTrigger>
              <TabsTrigger value="analytics">Intel Reports</TabsTrigger>
            </TabsList>

            {!showTaskCreator && (
              <Button 
                onClick={() => setShowTaskCreator(true)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elite"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deploy Mission
              </Button>
            )}
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value="missions" className="space-y-6">
            {showTaskCreator ? (
              <TaskCreator
                onCreateTask={handleCreateTask}
                onCancel={() => setShowTaskCreator(false)}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
                onEditTask={(taskId) => console.log("Edit task:", taskId)}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Elite performance reports and productivity insights coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
