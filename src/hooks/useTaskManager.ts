import { useState, useEffect } from "react";
import { Task, FocusSession, TaskStatus } from "@/types";
import { db } from "@/lib/database";
import AIValidation from "@/lib/ai";

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from IndexedDB on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const dbTasks = await db.getAllTasks();
      setTasks(dbTasks);
    } catch (error) {
      console.error('Failed to load tasks from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>) => {
    try {
      const newTask = await db.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      // Update focus streak if applicable
      if (taskData.priority === 'critical' || taskData.priority === 'high') {
        await db.updateStreak('focus', true);
      }
      
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus, aiValidated: boolean = false) => {
    try {
      const updates: Partial<Task> = { status };
      
      if (status === 'in_progress' && !tasks.find(t => t.id === taskId)?.startedAt) {
        updates.startedAt = new Date();
      } else if (status === 'completed') {
        updates.completedAt = new Date();
        
        // Update completion streak
        await db.updateStreak('completion', true);
        
        // If AI validated, also update consistency streak
        if (aiValidated) {
          await db.updateStreak('consistency', true);
        }
      }
      
      await db.updateTask(taskId, updates);
      
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      }));
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  };

  const startFocusSession = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update task status to in_progress
      await updateTaskStatus(taskId, 'in_progress');
      
      // Set as active focus task
      setActiveFocusTask(task);
    } catch (error) {
      console.error('Failed to start focus session:', error);
    }
  };

  const endFocusSession = async (taskId: string, completed: boolean = false, sessionData?: Partial<FocusSession>) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const duration = sessionData?.duration || 30; // Default 30 minutes
      const newSession = await db.createFocusSession({
        taskId,
        startTime: new Date(Date.now() - (duration * 60 * 1000)),
        endTime: new Date(),
        duration,
        distractionAttempts: sessionData?.distractionAttempts || 0,
        completed
      });

      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              focusSessions: [...t.focusSessions, newSession],
              status: completed ? 'completed' : 'pending'
            }
          : t
      ));

      // Update focus streak
      await db.updateStreak('focus', true);

      setActiveFocusTask(null);
    } catch (error) {
      console.error('Failed to end focus session:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await db.tasks.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      if (activeFocusTask?.id === taskId) {
        setActiveFocusTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
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

  // AI validation functions
  const validateTaskCompletion = async (taskId: string, answers: Record<string, string>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const result = await AIValidation.validateTaskCompletion(task.title, answers);
    
    if (result.validated) {
      await updateTaskStatus(taskId, 'completed', true);
    }
    
    return result;
  };

  const validateStreak = async (streakType: 'focus' | 'completion' | 'consistency', answers: Record<string, string>) => {
    return await AIValidation.validateStreak(streakType, answers);
  };

  return {
    tasks,
    activeFocusTask,
    isLoading,
    createTask,
    updateTaskStatus,
    startFocusSession,
    endFocusSession,
    deleteTask,
    getTaskStats,
    validateTaskCompletion,
    validateStreak,
    loadTasks
  };
};