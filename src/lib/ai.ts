// AI Integration for Task and Streak Validation
// Handles AI-powered validation, coaching, and interventions

export interface AIValidationQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'scale';
  options?: string[];
  expectedAnswer?: string;
  weight: number; // 0-1, importance of this question
}

export interface AIValidationResult {
  validated: boolean;
  score: number; // 0-1
  feedback: string;
  recommendations: string[];
  followUpQuestions?: AIValidationQuestion[];
}

export interface AICoachingMessage {
  id: string;
  type: 'motivation' | 'warning' | 'intervention' | 'celebration';
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  actions?: string[];
  timestamp: Date;
}

// Since we don't have API keys set up yet, we'll use a local AI simulation
// In production, this would integrate with OpenAI, Anthropic, or similar
export class AIValidation {
  private static readonly TASK_VALIDATION_QUESTIONS = {
    completion: [
      {
        id: 'completion_quality',
        question: 'Rate the quality of your task completion (1-5)',
        type: 'scale' as const,
        weight: 0.4
      },
      {
        id: 'completion_evidence',
        question: 'Describe what you accomplished:',
        type: 'text' as const,
        weight: 0.3
      },
      {
        id: 'time_accuracy',
        question: 'Did you complete the task within the estimated time?',
        type: 'multiple_choice' as const,
        options: ['Yes, on time', 'Early', 'Slightly over', 'Significantly over'],
        weight: 0.2
      },
      {
        id: 'distraction_level',
        question: 'How focused were you during this task?',
        type: 'multiple_choice' as const,
        options: ['Completely focused', 'Mostly focused', 'Some distractions', 'Highly distracted'],
        weight: 0.1
      }
    ],
    
    streak: [
      {
        id: 'streak_evidence',
        question: 'Provide evidence of your streak activity today:',
        type: 'text' as const,
        weight: 0.5
      },
      {
        id: 'streak_quality',
        question: 'Rate the quality of your focus/productivity today (1-5)',
        type: 'scale' as const,
        weight: 0.3
      },
      {
        id: 'streak_consistency',
        question: 'Did you maintain your usual productivity standards?',
        type: 'multiple_choice' as const,
        options: ['Exceeded standards', 'Met standards', 'Below standards', 'Significantly below'],
        weight: 0.2
      }
    ]
  };

  private static readonly COACHING_TEMPLATES = {
    motivation: [
      "Elite operatives don't make excuses. Focus and execute.",
      "Your mission parameters are clear. Maintain discipline.",
      "Excellence is not negotiable. Push through the resistance.",
      "Every elite warrior faces moments of doubt. This is yours to overcome."
    ],
    warning: [
      "Attention: Your focus metrics are declining. Immediate correction required.",
      "Warning: Distraction patterns detected. Realign with mission objectives.",
      "Alert: Performance below elite standards. Implement countermeasures now.",
      "Notice: Your commitment is being tested. Prove your elite status."
    ],
    intervention: [
      "INTERVENTION REQUIRED: Stop current activity. Return to mission immediately.",
      "FOCUS BREACH DETECTED: You are off-mission. Explain your deviation.",
      "ELITE STATUS COMPROMISED: Immediate return to task or face mission failure.",
      "MAXIMUM ENFORCEMENT: All distractions will be neutralized. Comply immediately."
    ],
    celebration: [
      "Mission accomplished with elite precision. Outstanding work, operative.",
      "Exceptional performance detected. Your elite status is confirmed.",
      "Target eliminated with surgical efficiency. Preparing next deployment.",
      "Victory achieved through superior discipline. You've earned this recognition."
    ]
  };

  // Simulate AI-powered validation (replace with real AI in production)
  public static async validateTaskCompletion(
    taskTitle: string,
    answers: Record<string, string>
  ): Promise<AIValidationResult> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const questions = this.TASK_VALIDATION_QUESTIONS.completion;
    let totalScore = 0;
    let weightSum = 0;

    // Simple scoring algorithm (replace with AI analysis)
    for (const question of questions) {
      const answer = answers[question.id];
      let questionScore = 0;

      switch (question.type) {
        case 'scale':
          const scaleValue = parseInt(answer) || 3;
          questionScore = scaleValue / 5;
          break;
        case 'text':
          // Simple text analysis (replace with NLP)
          questionScore = answer && answer.length > 10 ? 0.8 : 0.3;
          break;
        case 'multiple_choice':
          const optionIndex = question.options?.indexOf(answer) || 2;
          questionScore = Math.max(0, (question.options!.length - optionIndex) / question.options!.length);
          break;
      }

      totalScore += questionScore * question.weight;
      weightSum += question.weight;
    }

    const finalScore = totalScore / weightSum;
    const validated = finalScore >= 0.7;

    const feedback = this.generateFeedback(finalScore, 'task');
    const recommendations = this.generateRecommendations(finalScore, answers);

    return {
      validated,
      score: finalScore,
      feedback,
      recommendations
    };
  }

  public static async validateStreak(
    streakType: 'focus' | 'completion' | 'consistency',
    answers: Record<string, string>
  ): Promise<AIValidationResult> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const questions = this.TASK_VALIDATION_QUESTIONS.streak;
    let totalScore = 0;
    let weightSum = 0;

    for (const question of questions) {
      const answer = answers[question.id];
      let questionScore = 0;

      switch (question.type) {
        case 'scale':
          const scaleValue = parseInt(answer) || 3;
          questionScore = scaleValue / 5;
          break;
        case 'text':
          questionScore = answer && answer.length > 20 ? 0.9 : 0.4;
          break;
        case 'multiple_choice':
          const optionIndex = question.options?.indexOf(answer) || 2;
          questionScore = Math.max(0, (question.options!.length - optionIndex) / question.options!.length);
          break;
      }

      totalScore += questionScore * question.weight;
      weightSum += question.weight;
    }

    const finalScore = totalScore / weightSum;
    const validated = finalScore >= 0.6; // Slightly lower threshold for streaks

    const feedback = this.generateFeedback(finalScore, 'streak');
    const recommendations = this.generateRecommendations(finalScore, answers);

    return {
      validated,
      score: finalScore,
      feedback,
      recommendations
    };
  }

  private static generateFeedback(score: number, type: 'task' | 'streak'): string {
    if (score >= 0.9) {
      return type === 'task' 
        ? "Elite-level execution. Mission accomplished with exceptional precision."
        : "Outstanding streak maintenance. Your discipline is exemplary.";
    } else if (score >= 0.7) {
      return type === 'task'
        ? "Solid performance. Mission parameters met with good execution."
        : "Good streak consistency. Continue maintaining this standard.";
    } else if (score >= 0.5) {
      return type === 'task'
        ? "Acceptable completion but improvement needed. Review your approach."
        : "Streak maintained but quality concerns detected. Refocus your efforts.";
    } else {
      return type === 'task'
        ? "Performance below standards. Mission objectives not fully met."
        : "Streak compromised. Immediate corrective action required.";
    }
  }

  private static generateRecommendations(score: number, answers: Record<string, string>): string[] {
    const recommendations: string[] = [];

    if (score < 0.7) {
      recommendations.push("Focus on single-tasking to improve completion quality");
      recommendations.push("Use time-blocking techniques for better time estimation");
    }

    if (score < 0.5) {
      recommendations.push("Consider increasing task strictness level");
      recommendations.push("Implement distraction elimination protocols");
      recommendations.push("Schedule focused work sessions during peak energy hours");
    }

    if (answers.distraction_level === 'Highly distracted' || answers.distraction_level === 'Some distractions') {
      recommendations.push("Create a distraction-free environment before starting tasks");
      recommendations.push("Use website blockers and phone airplane mode");
    }

    return recommendations;
  }

  // Generate coaching messages based on context
  public static generateCoachingMessage(
    type: 'motivation' | 'warning' | 'intervention' | 'celebration',
    context?: {
      taskTitle?: string;
      streakCount?: number;
      performanceScore?: number;
    }
  ): AICoachingMessage {
    const templates = this.COACHING_TEMPLATES[type];
    const baseMessage = templates[Math.floor(Math.random() * templates.length)];
    
    let message = baseMessage;
    let severity: 'info' | 'warning' | 'error' | 'success' = 'info';
    let actions: string[] = [];

    switch (type) {
      case 'motivation':
        severity = 'info';
        if (context?.taskTitle) {
          message += ` Focus on: ${context.taskTitle}`;
        }
        actions = ['Continue Task', 'Take Break'];
        break;
      case 'warning':
        severity = 'warning';
        actions = ['Refocus Now', 'Adjust Task'];
        break;
      case 'intervention':
        severity = 'error';
        actions = ['Return to Task', 'End Session'];
        break;
      case 'celebration':
        severity = 'success';
        if (context?.streakCount) {
          message += ` Streak: ${context.streakCount} days.`;
        }
        actions = ['Next Mission', 'View Progress'];
        break;
    }

    return {
      id: crypto.randomUUID(),
      type,
      severity,
      message,
      actions,
      timestamp: new Date()
    };
  }

  // Get validation questions for UI
  public static getValidationQuestions(type: 'completion' | 'streak'): AIValidationQuestion[] {
    return this.TASK_VALIDATION_QUESTIONS[type];
  }

  // Analyze focus session for interventions
  public static analyzeFocusSession(
    sessionDuration: number,
    distractionAttempts: number,
    currentTask: string
  ): AICoachingMessage | null {
    const distractionRate = distractionAttempts / (sessionDuration / 60); // per minute

    if (distractionRate > 2) {
      return this.generateCoachingMessage('intervention', { taskTitle: currentTask });
    } else if (distractionRate > 1) {
      return this.generateCoachingMessage('warning', { taskTitle: currentTask });
    } else if (sessionDuration > 25 && distractionRate < 0.5) {
      return this.generateCoachingMessage('celebration');
    }

    return null;
  }
}

export default AIValidation;