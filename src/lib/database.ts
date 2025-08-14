// StrictFocus Elite Database Layer
// IndexedDB-based local storage with sync capabilities

import Dexie, { Table } from 'dexie';
import { Task, FocusSession, AIIntervention } from '@/types';

export interface DBTask {
  id: string;
  title: string;
  description?: string;
  priority: import('@/types').Priority;
  strictnessLevel: import('@/types').StrictnessLevel;
  deadline: number; // Unix timestamp
  estimatedDuration: number;
  status: import('@/types').TaskStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  tags?: string[];
  lastModified: number;
  syncStatus: 'pending' | 'synced' | 'conflict';
}

export interface DBFocusSession {
  id: string;
  taskId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  distractionAttempts: number;
  completed: boolean;
  lastModified: number;
  syncStatus: 'pending' | 'synced' | 'conflict';
}

export interface Streak {
  id: string;
  type: 'focus' | 'completion' | 'consistency';
  currentCount: number;
  bestCount: number;
  lastActivityDate: number;
  aiValidated: boolean;
  validationQuestions?: string[];
  validationAnswers?: string[];
  validationScore?: number;
  createdAt: number;
  lastModified: number;
}

export interface SyncMetadata {
  id: string;
  lastSyncTime: number;
  conflictCount: number;
  pendingChanges: number;
}

class StrictFocusDB extends Dexie {
  tasks!: Table<DBTask>;
  focusSessions!: Table<DBFocusSession>;
  interventions!: Table<AIIntervention>;
  streaks!: Table<Streak>;
  syncMetadata!: Table<SyncMetadata>;

  constructor() {
    super('StrictFocusEliteDB');
    
    this.version(1).stores({
      tasks: '++id, status, priority, deadline, lastModified, syncStatus',
      focusSessions: '++id, taskId, startTime, lastModified, syncStatus',
      interventions: '++id, sessionId, timestamp, trigger, severity',
      streaks: '++id, type, lastActivityDate, aiValidated',
      syncMetadata: '++id, lastSyncTime'
    });
  }

  // Convert DB Task to App Task
  toAppTask(dbTask: DBTask): Task {
    return {
      ...dbTask,
      deadline: new Date(dbTask.deadline),
      createdAt: new Date(dbTask.createdAt),
      startedAt: dbTask.startedAt ? new Date(dbTask.startedAt) : undefined,
      completedAt: dbTask.completedAt ? new Date(dbTask.completedAt) : undefined,
      focusSessions: [] // Will be populated separately
    };
  }

  // Convert App Task to DB Task
  toDBTask(task: Omit<Task, 'focusSessions'>): Omit<DBTask, 'id'> {
    return {
      title: task.title,
      description: task.description,
      priority: task.priority,
      strictnessLevel: task.strictnessLevel,
      status: task.status,
      tags: task.tags,
      estimatedDuration: task.estimatedDuration,
      deadline: task.deadline.getTime(),
      createdAt: task.createdAt.getTime(),
      startedAt: task.startedAt?.getTime(),
      completedAt: task.completedAt?.getTime(),
      lastModified: Date.now(),
      syncStatus: 'pending'
    };
  }

  // Convert DB Focus Session to App Focus Session
  toAppFocusSession(dbSession: DBFocusSession): FocusSession {
    return {
      ...dbSession,
      startTime: new Date(dbSession.startTime),
      endTime: dbSession.endTime ? new Date(dbSession.endTime) : undefined,
      aiInterventions: [] // Will be populated separately
    };
  }

  // Convert App Focus Session to DB Focus Session
  toDBFocusSession(session: Omit<FocusSession, 'aiInterventions'>): Omit<DBFocusSession, 'id'> {
    return {
      taskId: session.taskId,
      duration: session.duration,
      completed: session.completed,
      distractionAttempts: session.distractionAttempts,
      startTime: session.startTime.getTime(),
      endTime: session.endTime?.getTime(),
      lastModified: Date.now(),
      syncStatus: 'pending'
    };
  }

  // Enhanced task management with conflict resolution
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'focusSessions'>): Promise<Task> {
    const dbTask: DBTask = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      strictnessLevel: task.strictnessLevel,
      status: task.status,
      tags: task.tags,
      estimatedDuration: task.estimatedDuration,
      deadline: task.deadline.getTime(),
      createdAt: Date.now(),
      lastModified: Date.now(),
      syncStatus: 'pending'
    };

    await this.tasks.add(dbTask);
    return this.toAppTask(dbTask);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const updateData: Partial<DBTask> = {
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      strictnessLevel: updates.strictnessLevel,
      status: updates.status,
      tags: updates.tags,
      estimatedDuration: updates.estimatedDuration,
      deadline: updates.deadline?.getTime(),
      startedAt: updates.startedAt?.getTime(),
      completedAt: updates.completedAt?.getTime(),
      lastModified: Date.now(),
      syncStatus: 'pending'
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof DBTask] === undefined) {
        delete updateData[key as keyof DBTask];
      }
    });

    await this.tasks.update(taskId, updateData);
  }

  async getAllTasks(): Promise<Task[]> {
    const dbTasks = await this.tasks.orderBy('deadline').toArray();
    const tasks: Task[] = [];

    for (const dbTask of dbTasks) {
      const focusSessions = await this.getFocusSessionsForTask(dbTask.id);
      const task = this.toAppTask(dbTask);
      task.focusSessions = focusSessions;
      tasks.push(task);
    }

    return tasks;
  }

  async getFocusSessionsForTask(taskId: string): Promise<FocusSession[]> {
    const dbSessions = await this.focusSessions.where('taskId').equals(taskId).toArray();
    const sessions: FocusSession[] = [];

    for (const dbSession of dbSessions) {
      const interventions = await this.interventions.where('sessionId').equals(dbSession.id).toArray();
      const session = this.toAppFocusSession(dbSession);
      session.aiInterventions = interventions;
      sessions.push(session);
    }

    return sessions;
  }

  async createFocusSession(session: Omit<FocusSession, 'id' | 'aiInterventions'>): Promise<FocusSession> {
    const dbSession: DBFocusSession = {
      id: crypto.randomUUID(),
      taskId: session.taskId,
      duration: session.duration,
      completed: session.completed,
      distractionAttempts: session.distractionAttempts,
      startTime: session.startTime.getTime(),
      endTime: session.endTime?.getTime(),
      lastModified: Date.now(),
      syncStatus: 'pending'
    };

    await this.focusSessions.add(dbSession);
    return this.toAppFocusSession(dbSession);
  }

  // Streak management
  async updateStreak(type: 'focus' | 'completion' | 'consistency', increment: boolean = true): Promise<Streak> {
    const existing = await this.streaks.where('type').equals(type).first();
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);

    if (existing) {
      const lastActivityDay = new Date(existing.lastActivityDate).setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivityDay) / (1000 * 60 * 60 * 24));

      let newCount = existing.currentCount;
      
      if (increment) {
        if (daysDiff === 0) {
          // Same day, maintain streak
          newCount = existing.currentCount;
        } else if (daysDiff === 1) {
          // Next day, increment streak
          newCount = existing.currentCount + 1;
        } else {
          // Gap in days, reset streak
          newCount = 1;
        }
      } else {
        // Reset streak
        newCount = 0;
      }

      const updatedStreak: Partial<Streak> = {
        currentCount: newCount,
        bestCount: Math.max(existing.bestCount, newCount),
        lastActivityDate: now,
        aiValidated: false, // Reset validation when streak changes
        lastModified: now
      };

      await this.streaks.update(existing.id, updatedStreak);
      return { ...existing, ...updatedStreak } as Streak;
    } else {
      const newStreak: Streak = {
        id: crypto.randomUUID(),
        type,
        currentCount: increment ? 1 : 0,
        bestCount: increment ? 1 : 0,
        lastActivityDate: now,
        aiValidated: false,
        createdAt: now,
        lastModified: now
      };

      await this.streaks.add(newStreak);
      return newStreak;
    }
  }

  async getStreaks(): Promise<Streak[]> {
    return await this.streaks.toArray();
  }

  async getStreak(type: 'focus' | 'completion' | 'consistency'): Promise<Streak | undefined> {
    return await this.streaks.where('type').equals(type).first();
  }

  // Sync management
  async markForSync(): Promise<void> {
    await this.transaction('rw', this.tasks, this.focusSessions, this.syncMetadata, async () => {
      await this.tasks.where('syncStatus').notEqual('synced').modify({ syncStatus: 'pending' });
      await this.focusSessions.where('syncStatus').notEqual('synced').modify({ syncStatus: 'pending' });
      
      const metadata = await this.syncMetadata.get('main');
      if (metadata) {
        await this.syncMetadata.update('main', { 
          pendingChanges: await this.tasks.where('syncStatus').equals('pending').count() +
                          await this.focusSessions.where('syncStatus').equals('pending').count()
        });
      } else {
        await this.syncMetadata.add({
          id: 'main',
          lastSyncTime: 0,
          conflictCount: 0,
          pendingChanges: await this.tasks.where('syncStatus').equals('pending').count()
        });
      }
    });
  }

  async getPendingSync(): Promise<{ tasks: DBTask[], sessions: DBFocusSession[] }> {
    const tasks = await this.tasks.where('syncStatus').equals('pending').toArray();
    const sessions = await this.focusSessions.where('syncStatus').equals('pending').toArray();
    return { tasks, sessions };
  }

  // Migration from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    const savedTasks = localStorage.getItem('strictfocus-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        
        for (const task of tasks) {
          const dbTask: DBTask = {
            ...task,
            deadline: new Date(task.deadline).getTime(),
            createdAt: new Date(task.createdAt).getTime(),
            startedAt: task.startedAt ? new Date(task.startedAt).getTime() : undefined,
            completedAt: task.completedAt ? new Date(task.completedAt).getTime() : undefined,
            lastModified: Date.now(),
            syncStatus: 'synced' // Mark as synced since it's existing data
          };

          await this.tasks.add(dbTask);

          // Migrate focus sessions
          for (const session of task.focusSessions || []) {
            const dbSession: DBFocusSession = {
              ...session,
              startTime: new Date(session.startTime).getTime(),
              endTime: session.endTime ? new Date(session.endTime).getTime() : undefined,
              lastModified: Date.now(),
              syncStatus: 'synced'
            };

            await this.focusSessions.add(dbSession);

            // Migrate interventions
            for (const intervention of session.aiInterventions || []) {
              await this.interventions.add({
                ...intervention,
                timestamp: new Date(intervention.timestamp)
              });
            }
          }
        }

        // Clear localStorage after successful migration
        localStorage.removeItem('strictfocus-tasks');
        console.log('Successfully migrated data from localStorage to IndexedDB');
      } catch (error) {
        console.error('Failed to migrate from localStorage:', error);
      }
    }
  }
}

export const db = new StrictFocusDB();

// Initialize database and perform migration
db.open().then(async () => {
  await db.migrateFromLocalStorage();
});

export default db;