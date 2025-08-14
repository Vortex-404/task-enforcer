// Natural Language Processing for Task Creation
// Parses natural language input into structured task data

import * as chrono from 'chrono-node';
import { Priority, StrictnessLevel } from '@/types';

export interface ParsedTaskData {
  title: string;
  description?: string;
  priority: Priority;
  strictnessLevel: StrictnessLevel;
  deadline: Date;
  estimatedDuration: number;
  tags: string[];
  confidence: number; // 0-1 confidence score
}

// Priority keywords mapping
const PRIORITY_KEYWORDS = {
  critical: ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'now', 'crisis'],
  high: ['important', 'high', 'priority', 'soon', 'today', 'deadline'],
  medium: ['medium', 'normal', 'regular', 'standard'],
  low: ['low', 'later', 'eventually', 'minor', 'optional', 'nice to have']
};

// Strictness level keywords
const STRICTNESS_KEYWORDS = {
  maximum: ['maximum', 'extreme', 'hardcore', 'no mercy', 'brutal', 'ruthless'],
  elite: ['elite', 'aggressive', 'strict', 'harsh', 'intense', 'demanding'],
  military: ['military', 'firm', 'discipline', 'structure', 'focused'],
  standard: ['standard', 'normal', 'basic', 'gentle', 'regular']
};

// Duration extraction patterns
const DURATION_PATTERNS = [
  { pattern: /(\d+)\s*h(?:our)?s?/i, multiplier: 60 },
  { pattern: /(\d+)\s*m(?:in)?(?:ute)?s?/i, multiplier: 1 },
  { pattern: /(\d+)\s*hrs?/i, multiplier: 60 },
  { pattern: /(\d+)h(\d+)m/i, custom: (match: RegExpMatchArray) => parseInt(match[1]) * 60 + parseInt(match[2]) }
];

// Common task type durations (in minutes)
const TASK_TYPE_DURATIONS = {
  'call': 30,
  'meeting': 60,
  'email': 15,
  'review': 45,
  'coding': 120,
  'writing': 90,
  'reading': 60,
  'exercise': 45,
  'break': 15,
  'lunch': 60,
  'planning': 30,
  'research': 90
};

// Tag extraction keywords
const TAG_KEYWORDS = {
  work: ['work', 'job', 'office', 'business', 'project', 'task'],
  personal: ['personal', 'home', 'family', 'self'],
  health: ['health', 'fitness', 'exercise', 'gym', 'workout', 'medical'],
  learning: ['study', 'learn', 'course', 'tutorial', 'research', 'reading'],
  creative: ['design', 'creative', 'art', 'writing', 'music'],
  communication: ['call', 'email', 'message', 'meeting', 'discuss'],
  urgent: ['urgent', 'asap', 'emergency', 'critical']
};

export class TaskNLP {
  private static extractPriority(text: string): Priority {
    const lowerText = text.toLowerCase();
    
    for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return priority as Priority;
      }
    }
    
    return 'medium'; // Default priority
  }

  private static extractStrictnessLevel(text: string): StrictnessLevel {
    const lowerText = text.toLowerCase();
    
    for (const [level, keywords] of Object.entries(STRICTNESS_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return level as StrictnessLevel;
      }
    }
    
    return 'military'; // Default strictness for StrictFocus Elite
  }

  private static extractDuration(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Check for explicit duration patterns
    for (const { pattern, multiplier, custom } of DURATION_PATTERNS) {
      const match = lowerText.match(pattern);
      if (match) {
        if (custom) {
          return custom(match);
        }
        return parseInt(match[1]) * multiplier;
      }
    }
    
    // Check for task type keywords
    for (const [taskType, duration] of Object.entries(TASK_TYPE_DURATIONS)) {
      if (lowerText.includes(taskType)) {
        return duration;
      }
    }
    
    // Default duration based on priority
    const priority = this.extractPriority(text);
    const defaultDurations = {
      critical: 30,
      high: 60,
      medium: 90,
      low: 120
    };
    
    return defaultDurations[priority];
  }

  private static extractTags(text: string): string[] {
    const lowerText = text.toLowerCase();
    const extractedTags: string[] = [];
    
    for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        extractedTags.push(tag);
      }
    }
    
    return extractedTags;
  }

  private static cleanTitle(originalText: string, parsedDate?: Date): string {
    let title = originalText;
    
    // Remove common time/date expressions
    const timePatterns = [
      /\b(?:today|tomorrow|yesterday)\b/gi,
      /\b(?:at|by)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi,
      /\b(?:on|by)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
      /\b(?:in|after)\s+\d+\s*(?:minutes?|hours?|days?|weeks?)\b/gi,
      /\b(?:next|this)\s+(?:week|month|year)\b/gi
    ];
    
    timePatterns.forEach(pattern => {
      title = title.replace(pattern, '');
    });
    
    // Remove duration patterns
    DURATION_PATTERNS.forEach(({ pattern }) => {
      title = title.replace(pattern, '');
    });
    
    // Clean up extra spaces and punctuation
    title = title.replace(/\s+/g, ' ').trim();
    title = title.replace(/^[,.\-]\s*/, '');
    title = title.replace(/\s*[,.\-]$/, '');
    
    return title || originalText; // Fallback to original if nothing left
  }

  private static calculateConfidence(
    text: string, 
    parsedDate: Date | null, 
    extractedPriority: Priority,
    extractedDuration: number
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for successful date parsing
    if (parsedDate) {
      confidence += 0.3;
    }
    
    // Boost for explicit priority keywords
    const lowerText = text.toLowerCase();
    const hasPriorityKeywords = Object.values(PRIORITY_KEYWORDS).flat()
      .some(keyword => lowerText.includes(keyword));
    if (hasPriorityKeywords) {
      confidence += 0.2;
    }
    
    // Boost for explicit duration
    const hasDurationPattern = DURATION_PATTERNS.some(({ pattern }) => pattern.test(lowerText));
    if (hasDurationPattern) {
      confidence += 0.2;
    }
    
    // Boost for task type recognition
    const hasTaskType = Object.keys(TASK_TYPE_DURATIONS).some(type => lowerText.includes(type));
    if (hasTaskType) {
      confidence += 0.1;
    }
    
    // Penalty for very short input
    if (text.length < 10) {
      confidence -= 0.2;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }

  public static parseTask(input: string): ParsedTaskData {
    // Use chrono-node for date/time parsing
    const parsedDates = chrono.parse(input);
    let deadline = new Date();
    
    // Default to 1 hour from now if no date specified
    deadline.setHours(deadline.getHours() + 1);
    
    if (parsedDates.length > 0) {
      deadline = parsedDates[0].start.date();
    }
    
    // Extract other components
    const priority = this.extractPriority(input);
    const strictnessLevel = this.extractStrictnessLevel(input);
    const estimatedDuration = this.extractDuration(input);
    const tags = this.extractTags(input);
    const title = this.cleanTitle(input, parsedDates.length > 0 ? deadline : null);
    const confidence = this.calculateConfidence(input, parsedDates.length > 0 ? deadline : null, priority, estimatedDuration);
    
    return {
      title,
      priority,
      strictnessLevel,
      deadline,
      estimatedDuration,
      tags,
      confidence
    };
  }

  // Suggest improvements for low-confidence parses
  public static suggestImprovements(input: string, confidence: number): string[] {
    const suggestions: string[] = [];
    
    if (confidence < 0.7) {
      const lowerInput = input.toLowerCase();
      
      if (!chrono.parse(input).length) {
        suggestions.push("Try adding a specific time like 'tomorrow at 2pm' or 'in 2 hours'");
      }
      
      const hasPriority = Object.values(PRIORITY_KEYWORDS).flat()
        .some(keyword => lowerInput.includes(keyword));
      if (!hasPriority) {
        suggestions.push("Add priority keywords like 'urgent', 'important', or 'low priority'");
      }
      
      const hasDuration = DURATION_PATTERNS.some(({ pattern }) => pattern.test(lowerInput));
      if (!hasDuration) {
        suggestions.push("Include estimated duration like '30 minutes' or '2 hours'");
      }
      
      if (input.length < 10) {
        suggestions.push("Provide more details about what you need to accomplish");
      }
    }
    
    return suggestions;
  }

  // Example inputs for testing
  public static getExamples(): string[] {
    return [
      "Call Sarah tomorrow at 10am about the project",
      "Review urgent proposal by end of day - 2 hours",
      "Gym workout in 1 hour - high intensity",
      "Weekly team meeting on Monday 2pm",
      "Email client about deadline extension asap",
      "Finish coding the authentication module by Friday",
      "Personal: Schedule doctor appointment this week",
      "Critical: Fix production bug immediately - 30 minutes"
    ];
  }
}

export default TaskNLP;