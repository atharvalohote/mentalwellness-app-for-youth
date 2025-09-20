export interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodOption;
  context?: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD format for easy querying
}

export interface MoodStats {
  totalEntries: number;
  currentStreak: number;
  averageMood: string;
  mostFrequentMood: MoodOption | null;
  weeklyData: {
    date: string;
    mood: MoodOption | null;
  }[];
}

export interface MoodInsight {
  type: 'positive' | 'neutral' | 'encouraging';
  message: string;
  emoji: string;
}
