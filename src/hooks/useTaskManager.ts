import { useState, useEffect } from "react";
import { Task, FocusSession, TaskStatus } from "@/types";

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('strictfocus-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt),
          startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          focusSessions: task.focusSessions.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined
          }))
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('strictfocus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      focusSessions: []
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updates: Partial<Task> = { status };
        
        if (status === 'in_progress' && !task.startedAt) {
          updates.startedAt = new Date();
        } else if (status === 'completed') {
          updates.completedAt = new Date();
        }
        
        return { ...task, ...updates };
      }
      return task;
    }));
  };

  const startFocusSession = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status to in_progress
    updateTaskStatus(taskId, 'in_progress');
    
    // Set as active focus task
    setActiveFocusTask(task);
  };

  const endFocusSession = (taskId: string, completed: boolean = false) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      taskId,
      startTime: new Date(Date.now() - 30000), // Mock 30 seconds ago
      endTime: new Date(),
      duration: 0.5, // Mock duration
      distractionAttempts: 0,
      aiInterventions: [],
      completed
    };

    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            focusSessions: [...t.focusSessions, newSession],
            status: completed ? 'completed' : 'pending'
          }
        : t
    ));

    setActiveFocusTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter(t => 
      new Date() > t.deadline && t.status !== 'completed'
    ).length;

    const totalFocusTime = tasks.reduce((acc, task) => 
      acc + task.focusSessions.reduce((sessionAcc, session) => sessionAcc + session.duration, 0), 0
    );

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalFocusTime,
      completionRate
    };
  };

  return {
    tasks,
    activeFocusTask,
    createTask,
    updateTaskStatus,
    startFocusSession,
    endFocusSession,
    deleteTask,
    getTaskStats
  };
};