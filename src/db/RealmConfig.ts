import AsyncStorage from '@react-native-async-storage/async-storage';

// Define interfaces for our data models
export interface Message {
  _id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sessionId: string;
}

export interface UserSession {
  _id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
}

export interface MoodEntry {
  _id: string;
  mood: string;
  timestamp: Date;
  reason?: string;
}

export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  timestamp: Date;
  sentiment?: string; // AI-generated sentiment: positive, negative, neutral
  tags?: string[]; // AI-generated tags
  mood?: string; // Optional mood from mood tracking
  isAnalyzed: boolean; // Whether AI analysis has been completed
}

// Database service using AsyncStorage
class DatabaseService {
  private static instance: DatabaseService;
  
  private constructor() {}
  
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Message operations
  async saveMessage(text: string, isUser: boolean, sessionId: string): Promise<Message> {
    const message: Message = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
      sessionId,
    };

    const messages = await this.getMessages();
    messages.push(message);
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
    
    return message;
  }

  async getMessages(): Promise<Message[]> {
    try {
      const messagesJson = await AsyncStorage.getItem('messages');
      if (messagesJson) {
        const messages = JSON.parse(messagesJson);
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async clearMessages(): Promise<void> {
    await AsyncStorage.removeItem('messages');
  }

  // User session operations
  async createUserSession(): Promise<UserSession> {
    const session: UserSession = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      messages: [],
    };

    const sessions = await this.getUserSessions();
    sessions.push(session);
    await AsyncStorage.setItem('userSessions', JSON.stringify(sessions));
    
    return session;
  }

  async getUserSessions(): Promise<UserSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem('userSessions');
      if (sessionsJson) {
        const sessions = JSON.parse(sessionsJson);
        return sessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  async endUserSession(sessionId: string): Promise<void> {
    const sessions = await this.getUserSessions();
    const sessionIndex = sessions.findIndex(s => s._id === sessionId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].endTime = new Date();
      await AsyncStorage.setItem('userSessions', JSON.stringify(sessions));
    }
  }

  // Mood operations
  async saveMoodEntry(mood: string, reason?: string): Promise<MoodEntry> {
    const moodEntry: MoodEntry = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      mood,
      timestamp: new Date(),
      reason,
    };

    const moodEntries = await this.getMoodEntries();
    moodEntries.push(moodEntry);
    await AsyncStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    
    return moodEntry;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    try {
      const moodEntriesJson = await AsyncStorage.getItem('moodEntries');
      if (moodEntriesJson) {
        const moodEntries = JSON.parse(moodEntriesJson);
        return moodEntries.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  async getMoodEntriesByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    const allEntries = await this.getMoodEntries();
    return allEntries.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  }

  async deleteMoodEntry(entryId: string): Promise<void> {
    const moodEntries = await this.getMoodEntries();
    const filteredEntries = moodEntries.filter(entry => entry._id !== entryId);
    await AsyncStorage.setItem('moodEntries', JSON.stringify(filteredEntries));
  }

  // Journal operations
  async saveJournalEntry(title: string, content: string, mood?: string): Promise<JournalEntry> {
    const entry: JournalEntry = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      content,
      timestamp: new Date(),
      mood,
      isAnalyzed: false,
    };

    const entries = await this.getJournalEntries();
    entries.push(entry);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
    
    return entry;
  }

  async updateJournalEntryAnalysis(entryId: string, sentiment: string, tags: string[]): Promise<void> {
    const entries = await this.getJournalEntries();
    const entryIndex = entries.findIndex(entry => entry._id === entryId);
    if (entryIndex !== -1) {
      entries[entryIndex].sentiment = sentiment;
      entries[entryIndex].tags = tags;
      entries[entryIndex].isAnalyzed = true;
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
    }
  }

  async getJournalEntries(limit?: number): Promise<JournalEntry[]> {
    try {
      const entriesJson = await AsyncStorage.getItem('journalEntries');
      if (entriesJson) {
        const entries = JSON.parse(entriesJson);
        const sortedEntries = entries
          .map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
          .sort((a: JournalEntry, b: JournalEntry) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          );
        
        return limit ? sortedEntries.slice(0, limit) : sortedEntries;
      }
      return [];
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  async getJournalEntryById(entryId: string): Promise<JournalEntry | null> {
    const entries = await this.getJournalEntries();
    return entries.find(entry => entry._id === entryId) || null;
  }

  async deleteJournalEntry(entryId: string): Promise<void> {
    const entries = await this.getJournalEntries();
    const filteredEntries = entries.filter(entry => entry._id !== entryId);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(filteredEntries));
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      'messages',
      'userSessions', 
      'moodEntries',
      'journalEntries'
    ]);
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();

// Types are already exported above as interfaces