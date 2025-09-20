export interface TherapyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  therapies: Therapy[];
}

export interface Therapy {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  icon: string;
  color: string;
  benefits: string[];
  prerequisites?: string[];
  sessionType: 'guided' | 'interactive' | 'chat' | 'art' | 'breathing' | 'meditation' | 'cbt-challenge';
  aiPersonality?: string;
  estimatedSessions?: number;
  tags: string[];
}

export interface TherapySession {
  id: string;
  therapyId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  completed: boolean;
  notes?: string;
  moodBefore?: string;
  moodAfter?: string;
  rating?: number;
  progress?: number; // 0-100
}

export interface TherapyProgress {
  therapyId: string;
  totalSessions: number;
  completedSessions: number;
  totalTime: number; // in minutes
  lastSession?: Date;
  streak: number;
  averageRating: number;
  currentLevel: number;
  achievements: string[];
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  tone: 'warm' | 'professional' | 'playful' | 'empathetic' | 'motivational';
  expertise: string[];
  greeting: string;
  color: string;
  avatar: string;
}
