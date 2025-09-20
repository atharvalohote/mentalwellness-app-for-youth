import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry, MoodStats, MoodOption, MoodInsight } from '../types/mood';

const MOOD_ENTRIES_KEY = 'mood_entries';
const MOOD_STATS_KEY = 'mood_stats';

export class MoodDatabase {
  /**
   * Save a mood entry to local storage
   */
  static async saveMoodEntry(entry: MoodEntry): Promise<void> {
    try {
      const existingEntries = await this.getAllMoodEntries();
      const updatedEntries = [...existingEntries, entry];
      
      await AsyncStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(updatedEntries));
      
      // Update stats
      await this.updateMoodStats();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw new Error('Failed to save mood entry');
    }
  }

  /**
   * Get all mood entries
   */
  static async getAllMoodEntries(): Promise<MoodEntry[]> {
    try {
      const entries = await AsyncStorage.getItem(MOOD_ENTRIES_KEY);
      if (!entries) return [];
      
      const parsedEntries = JSON.parse(entries);
      return parsedEntries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  /**
   * Get mood entries for a specific date range
   */
  static async getMoodEntriesForDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    try {
      const allEntries = await this.getAllMoodEntries();
      return allEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting mood entries for date range:', error);
      return [];
    }
  }

  /**
   * Get today's mood entry
   */
  static async getTodaysMoodEntry(): Promise<MoodEntry | null> {
    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      const allEntries = await this.getAllMoodEntries();
      return allEntries.find(entry => entry.date === todayString) || null;
    } catch (error) {
      console.error('Error getting today\'s mood entry:', error);
      return null;
    }
  }

  /**
   * Get mood statistics
   */
  static async getMoodStats(): Promise<MoodStats> {
    try {
      const allEntries = await this.getAllMoodEntries();
      
      if (allEntries.length === 0) {
        return {
          totalEntries: 0,
          currentStreak: 0,
          averageMood: '😐',
          mostFrequentMood: null,
          weeklyData: this.generateEmptyWeeklyData(),
        };
      }

      // Calculate current streak
      const currentStreak = this.calculateCurrentStreak(allEntries);
      
      // Calculate most frequent mood
      const mostFrequentMood = this.calculateMostFrequentMood(allEntries);
      
      // Generate weekly data
      const weeklyData = this.generateWeeklyData(allEntries);
      
      // Calculate average mood (simplified - using most frequent)
      const averageMood = mostFrequentMood?.emoji || '😐';

      return {
        totalEntries: allEntries.length,
        currentStreak,
        averageMood,
        mostFrequentMood,
        weeklyData,
      };
    } catch (error) {
      console.error('Error getting mood stats:', error);
      return {
        totalEntries: 0,
        currentStreak: 0,
        averageMood: '😐',
        mostFrequentMood: null,
        weeklyData: this.generateEmptyWeeklyData(),
      };
    }
  }

  /**
   * Calculate current streak of consecutive days with mood entries
   */
  private static calculateCurrentStreak(entries: MoodEntry[]): number {
    if (entries.length === 0) return 0;

    // Sort entries by date (newest first)
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate the most frequent mood
   */
  private static calculateMostFrequentMood(entries: MoodEntry[]): MoodOption | null {
    if (entries.length === 0) return null;

    const moodCounts: { [key: string]: { count: number; mood: MoodOption } } = {};
    
    entries.forEach(entry => {
      const moodId = entry.mood.id;
      if (moodCounts[moodId]) {
        moodCounts[moodId].count++;
      } else {
        moodCounts[moodId] = { count: 1, mood: entry.mood };
      }
    });

    let mostFrequent = null;
    let maxCount = 0;

    Object.values(moodCounts).forEach(({ count, mood }) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = mood;
      }
    });

    return mostFrequent;
  }

  /**
   * Generate weekly data for the last 7 days
   */
  private static generateWeeklyData(entries: MoodEntry[]): { date: string; mood: MoodOption | null }[] {
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find mood entry for this date
      const entry = entries.find(e => e.date === dateString);
      
      weeklyData.push({
        date: dateString,
        mood: entry?.mood || null,
      });
    }
    
    return weeklyData;
  }

  /**
   * Generate empty weekly data
   */
  private static generateEmptyWeeklyData(): { date: string; mood: MoodOption | null }[] {
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      weeklyData.push({
        date: dateString,
        mood: null,
      });
    }
    
    return weeklyData;
  }

  /**
   * Generate mood insights
   */
  static async generateMoodInsight(): Promise<MoodInsight> {
    try {
      const stats = await this.getMoodStats();
      
      if (stats.totalEntries === 0) {
        return {
          type: 'encouraging',
          message: 'Start your mood tracking journey today!',
          emoji: '🌟',
        };
      }

      if (stats.currentStreak >= 7) {
        return {
          type: 'positive',
          message: `Amazing! You've tracked your mood for ${stats.currentStreak} days in a row!`,
          emoji: '🔥',
        };
      }

      if (stats.mostFrequentMood) {
        const moodLabel = stats.mostFrequentMood.label;
        return {
          type: 'positive',
          message: `You've felt '${moodLabel}' most often this week!`,
          emoji: stats.mostFrequentMood.emoji,
        };
      }

      return {
        type: 'encouraging',
        message: 'Keep tracking your mood to discover patterns!',
        emoji: '📊',
      };
    } catch (error) {
      console.error('Error generating mood insight:', error);
      return {
        type: 'encouraging',
        message: 'Start your mood tracking journey today!',
        emoji: '🌟',
      };
    }
  }

  /**
   * Update mood statistics (called after saving entries)
   */
  private static async updateMoodStats(): Promise<void> {
    try {
      const stats = await this.getMoodStats();
      await AsyncStorage.setItem(MOOD_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating mood stats:', error);
    }
  }

  /**
   * Clear all mood data (for testing/reset)
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOOD_ENTRIES_KEY);
      await AsyncStorage.removeItem(MOOD_STATS_KEY);
    } catch (error) {
      console.error('Error clearing mood data:', error);
      throw new Error('Failed to clear mood data');
    }
  }
}
