export type StrictnessLevel = 'standard' | 'military' | 'elite' | 'maximum';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'abandoned';

export type UserMode = 'ceo' | 'founder' | 'student' | 'executive' | 'custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  strictnessLevel: StrictnessLevel;
  deadline: Date;
  estimatedDuration: number; // in minutes
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  focusSessions: FocusSession[];
  tags?: string[];
}

export interface FocusSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  distractionAttempts: number;
  aiInterventions: AIIntervention[];
  completed: boolean;
}

export interface AIIntervention {
  id: string;
  sessionId: string;
  timestamp: Date;
  trigger: 'abandon_attempt' | 'procrastination' | 'break_request' | 'distraction';
  message: string;
  userResponse?: string;
  severity: 'warning' | 'firm' | 'aggressive' | 'maximum';
}

export interface UserProfile {
  id: string;
  mode: UserMode;
  strictnessPreference: StrictnessLevel;
  aiPersonality: 'supportive' | 'firm' | 'aggressive' | 'military';
  focusGoals: {
    dailyFocusMinutes: number;
    weeklyTasks: number;
    completionRate: number;
  };
  settings: {
    enableAI: boolean;
    enableLockMode: boolean;
    enableNotifications: boolean;
    darkMode: boolean;
  };
}

export interface FocusAnalytics {
  totalFocusTime: number;
  tasksCompleted: number;
  averageSessionLength: number;
  distractionRate: number;
  completionRate: number;
  streakDays: number;
  weeklyData: {
    date: string;
    focusMinutes: number;
    tasksCompleted: number;
  }[];
}