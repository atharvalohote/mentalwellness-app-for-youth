import * as Haptics from 'expo-haptics';

/**
 * HapticService - Centralized haptic feedback management
 * Provides consistent haptic feedback across the app for enhanced UX
 */
export class HapticService {
  /**
   * Light haptic feedback for subtle interactions
   * Use for: Button taps, toggles, small selections
   */
  static light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  /**
   * Medium haptic feedback for standard interactions
   * Use for: Primary button presses, confirmations, navigation
   */
  static medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  /**
   * Heavy haptic feedback for important interactions
   * Use for: Major actions, completions, errors
   */
  static heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  /**
   * Success haptic feedback
   * Use for: Successful actions, completions, achievements
   */
  static success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * Warning haptic feedback
   * Use for: Warnings, important notices, attention-grabbing events
   */
  static warning() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  /**
   * Error haptic feedback
   * Use for: Errors, failures, invalid actions
   */
  static error() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  /**
   * Selection haptic feedback
   * Use for: Picker selections, menu items, list selections
   */
  static selection() {
    Haptics.selectionAsync();
  }

  /**
   * Custom haptic patterns for specific app features
   */
  static patterns = {
    /**
     * Breathing exercise pattern - gentle pulses
     */
    breathing: {
      inhale: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      exhale: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      hold: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },

    /**
     * Mood selection pattern - different intensities for different moods
     */
    moodSelection: {
      positive: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      neutral: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
      negative: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    },

    /**
     * Message sending pattern
     */
    messageSent: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
    },

    /**
     * AI response received pattern
     */
    aiResponse: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
    },

    /**
     * Art creation pattern
     */
    artCreated: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);
    },

    /**
     * Daily check-in completion
     */
    checkInComplete: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
    },

    /**
     * Streak achievement
     */
    streakAchievement: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 600);
    },

    /**
     * SOS button press - urgent pattern
     */
    sosPressed: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 150);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
    },

    /**
     * PIN input pattern
     */
    pinInput: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    /**
     * PIN completion
     */
    pinComplete: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    /**
     * PIN error
     */
    pinError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  };

  /**
   * Check if haptics are available on the device
   */
  static async isAvailable(): Promise<boolean> {
    try {
      // Try to trigger a light haptic to test availability
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return true;
    } catch (error) {
      console.log('Haptics not available on this device');
      return false;
    }
  }

  /**
   * Enable or disable haptic feedback based on user preferences
   */
  static setEnabled(enabled: boolean) {
    // This would typically be stored in user preferences
    // For now, we'll just log the preference
    console.log(`Haptic feedback ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export default HapticService;
