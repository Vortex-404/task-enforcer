import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import CasualHeader from "@/components/CasualHeader";
import Dashboard from "@/components/Dashboard";
import TaskList from "@/components/TaskList";
import TaskCreator from "@/components/TaskCreator";
import CasualTaskCreator from "@/components/CasualTaskCreator";
import FocusMode from "@/components/FocusMode";
import CalendarView from "@/components/CalendarView";
import ModeToggle from "@/components/ModeToggle";
import ChatBot from "@/components/ChatBot";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Task } from "@/types";
import { isSameDay } from "date-fns";

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
  const [isCeoMode, setIsCeoMode] = useState(true);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  const [showChat, setShowChat] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const stats = getTaskStats();
  const completedToday = tasks.filter(t => 
    t.status === 'completed' && isSameDay(t.completedAt || new Date(), new Date())
  ).length;

  // Apply theme based on mode
  useEffect(() => {
    const root = document.documentElement;
    if (isCeoMode) {
      root.removeAttribute('data-mode');
    } else {
      root.setAttribute('data-mode', 'casual');
    }
  }, [isCeoMode]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => {
    createTask(taskData);
    setShowTaskCreator(false);
    setCurrentTab(isCeoMode ? "missions" : "tasks");
  };

  const handleCreateTaskForDate = (date: Date) => {
    setSelectedCalendarDate(date);
    setShowTaskCreator(true);
    setCurrentTab(isCeoMode ? "missions" : "tasks");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedCalendarDate(date);
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
      {/* Dynamic Header based on mode */}
      {isCeoMode ? (
        <Header 
          currentMode="ceo" 
          focusStreak={7} 
          isInFocus={!!activeFocusTask} 
        />
      ) : (
        <CasualHeader 
          focusStreak={7} 
          isInFocus={!!activeFocusTask}
          completedToday={completedToday}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <ModeToggle isCeoMode={isCeoMode} onModeChange={setIsCeoMode} />
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border">
              {isCeoMode ? (
                <>
                  <TabsTrigger value="dashboard">Command Center</TabsTrigger>
                  <TabsTrigger value="missions">Active Missions</TabsTrigger>
                  <TabsTrigger value="calendar">Mission Calendar</TabsTrigger>
                  <TabsTrigger value="analytics">Intel Reports</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="dashboard">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">My Tasks</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="analytics">Progress</TabsTrigger>
                </>
              )}
            </TabsList>

            <div className="flex items-center space-x-2">
              {!showTaskCreator && (
                <Button 
                  onClick={() => setShowTaskCreator(true)}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elite"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCeoMode ? 'Deploy Mission' : 'Add Task'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowChat(!showChat);
                  setIsChatMinimized(false);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value={isCeoMode ? "missions" : "tasks"} className="space-y-6">
            {showTaskCreator ? (
              isCeoMode ? (
                <TaskCreator
                  onCreateTask={handleCreateTask}
                  onCancel={() => setShowTaskCreator(false)}
                />
              ) : (
                <CasualTaskCreator
                  onCreateTask={(task) => {
                    console.log('Task created:', task);
                    setShowTaskCreator(false);
                  }}
                  onCancel={() => setShowTaskCreator(false)}
                />
              )
            ) : (
              <TaskList
                tasks={tasks}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
                onEditTask={(taskId) => console.log("Edit task:", taskId)}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView
              tasks={tasks}
              onDateSelect={handleDateSelect}
              onCreateTask={handleCreateTaskForDate}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                {isCeoMode ? 'Advanced Analytics' : 'Your Progress'}
              </h3>
              <p className="text-muted-foreground">
                {isCeoMode 
                  ? 'Elite performance reports and productivity insights coming soon.'
                  : 'Detailed insights and celebration of your achievements coming soon.'
                }
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chatbot */}
      {showChat && (
        <ChatBot
          isCeoMode={isCeoMode}
          isMinimized={isChatMinimized}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default Index;
