import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  View, 
  ScrollView,
  Modal,
  Dimensions,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS, LAYOUT } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import AppCard from '../../components/ui/AppCard';
import UnifiedLayout from '../../components/ui/UnifiedLayout';
import UnifiedHeader from '../../components/ui/UnifiedHeader';
import HapticService from '../../services/HapticService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Mood {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

interface MoodSelectionScreenProps {
  navigation: any;
  route?: {
    params?: {
      onMoodSelected?: (mood: Mood) => void;
    };
  };
}

const MOODS: Mood[] = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: COLORS.yellow },
  { emoji: '😔', label: 'Sad', value: 'sad', color: COLORS.lightBlue },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: COLORS.pink },
  { emoji: '😴', label: 'Tired', value: 'tired', color: COLORS.teal },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: COLORS.warningRed },
  { emoji: '😌', label: 'Calm', value: 'calm', color: COLORS.mint },
  { emoji: '🤩', label: 'Excited', value: 'excited', color: COLORS.orange },
  { emoji: '🙏', label: 'Grateful', value: 'grateful', color: COLORS.successGreen },
];

const MoodSelectionScreen: React.FC<MoodSelectionScreenProps> = ({ navigation, route }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodReason, setMoodReason] = useState<string>('');
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [scaleAnimations] = useState(
    MOODS.map(() => new Animated.Value(1))
  );
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(50));
  const [reasonAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMoodSelect = async (mood: Mood) => {
    // Haptic feedback
    HapticService.medium();
    
    // Animate selection
    const index = MOODS.findIndex(m => m.value === mood.value);
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedMood(mood);
    setShowReasonInput(true);
    
    // Animate reason input appearance
    Animated.timing(reasonAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSaveMood = async () => {
    if (!selectedMood || !moodReason.trim()) {
      HapticService.light();
      return;
    }

    HapticService.medium();
    
    // Save mood data with reason
    await saveMoodData(selectedMood, moodReason.trim());
    
    // Call callback if provided
    if (route?.params?.onMoodSelected) {
      route.params.onMoodSelected(selectedMood);
    }
    
    // Navigate back with success
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const saveMoodData = async (mood: Mood, reason: string) => {
    try {
      const today = new Date().toDateString();
      const moodData = {
        mood: mood.value,
        emoji: mood.emoji,
        label: mood.label,
        color: mood.color,
        reason: reason,
        timestamp: new Date().toISOString(),
        date: today,
      };

      // Save today's mood
      await AsyncStorage.setItem(`mood_${today}`, JSON.stringify(moodData));
      
      // Save to weekly data
      const weeklyData = await AsyncStorage.getItem('weekly_mood_data');
      const weeklyMoods = weeklyData ? JSON.parse(weeklyData) : [];
      
      // Remove existing entry for today if it exists
      const filteredMoods = weeklyMoods.filter((item: any) => item.date !== today);
      
      // Add new entry
      filteredMoods.push(moodData);
      
      // Keep only last 7 days
      const last7Days = filteredMoods.slice(-7);
      
      await AsyncStorage.setItem('weekly_mood_data', JSON.stringify(last7Days));
      
      // Update streak
      await updateStreak();
      
      console.log('Mood data saved successfully');
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const weeklyData = await AsyncStorage.getItem('weekly_mood_data');
      const weeklyMoods = weeklyData ? JSON.parse(weeklyData) : [];
      
      // Calculate current streak
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateString = checkDate.toDateString();
        
        const hasEntry = weeklyMoods.some((mood: any) => mood.date === dateString);
        if (hasEntry) {
          streak++;
        } else {
          break;
        }
      }
      
      await AsyncStorage.setItem('mood_streak', streak.toString());
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const renderMoodCard = (mood: Mood, index: number) => (
    <Animated.View
      key={mood.value}
      style={[
        styles.moodCardContainer,
        {
          transform: [{ scale: scaleAnimations[index] }],
        },
      ]}
    >
      <AppCard
        onPress={() => handleMoodSelect(mood)}
        animated={true}
        style={[
          styles.moodCard,
          { backgroundColor: mood.color },
          selectedMood?.value === mood.value && styles.selectedMoodCard,
        ]}
      >
        <View style={styles.moodCardContent}>
          <Text variant="bold" size="xxl" color={COLORS.cardBackground} style={styles.moodEmoji}>
            {mood.emoji}
          </Text>
          <Text variant="semibold" size="sm" color={COLORS.cardBackground} style={styles.moodLabel}>
            {mood.label}
          </Text>
        </View>
      </AppCard>
    </Animated.View>
  );

  return (
    <UnifiedLayout>
      {/* Header */}
      <UnifiedHeader
        title="Daily Check-in"
        subtitle="How are you feeling today?"
        onBack={() => navigation.goBack()}
        showBackButton={true}
      />

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Mood Grid */}
            <View style={styles.moodGrid}>
              {MOODS.map((mood, index) => renderMoodCard(mood, index))}
            </View>

            {/* Reason Input Section */}
            {showReasonInput && selectedMood && (
              <Animated.View
                style={[
                  styles.reasonSection,
                  {
                    opacity: reasonAnimation,
                    transform: [
                      {
                        translateY: reasonAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <AppCard style={styles.reasonCard} variant="outlined">
                  <View style={styles.reasonHeader}>
                    <View style={[styles.selectedMoodDisplay, { backgroundColor: selectedMood.color }]}>
                      <Text variant="bold" size="lg" color={COLORS.cardBackground}>
                        {selectedMood.emoji}
                      </Text>
                    </View>
                    <View style={styles.reasonHeaderText}>
                      <Text variant="semibold" size="md" color={COLORS.primaryText}>
                        {selectedMood.label}
                      </Text>
                      <Text variant="regular" size="sm" color={COLORS.secondaryText}>
                        What's making you feel this way?
                      </Text>
                    </View>
                  </View>
                  
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="Share what's on your mind..."
                    placeholderTextColor={COLORS.secondaryText}
                    value={moodReason}
                    onChangeText={setMoodReason}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { 
                        backgroundColor: moodReason.trim() ? selectedMood.color : COLORS.borderColor,
                        opacity: moodReason.trim() ? 1 : 0.5,
                      }
                    ]}
                    onPress={handleSaveMood}
                    disabled={!moodReason.trim()}
                  >
                    <Text variant="semibold" size="md" color={COLORS.cardBackground}>
                      Save Mood
                    </Text>
                  </TouchableOpacity>
                </AppCard>
              </Animated.View>
            )}

            {/* Additional Info */}
            <View style={styles.infoSection}>
              <AppCard style={styles.infoCard} variant="outlined">
                <View style={styles.infoContent}>
                  <Ionicons name="information-circle" size={24} color={COLORS.purple} />
                  <View style={styles.infoText}>
                    <Text variant="regular" size="sm" color={COLORS.secondaryText}>
                      Your mood data helps us provide better support and track your emotional well-being over time.
                    </Text>
                  </View>
                </View>
              </AppCard>
            </View>
          </ScrollView>
        </Animated.View>
    </UnifiedLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.safeAreaHorizontal,
    paddingTop: SPACING.lg,
    paddingBottom: LAYOUT.tabBarHeight + 40,
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  moodCardContainer: {
    width: (screenWidth - LAYOUT.safeAreaHorizontal * 2 - SPACING.md * 3) / 2,
    maxWidth: 160,
  },
  moodCard: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedMoodCard: {
    elevation: 8,
    shadowOpacity: 0.2,
    transform: [{ scale: 1.05 }],
  },
  moodCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  moodLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
  infoSection: {
    marginTop: SPACING.lg,
  },
  infoCard: {
    padding: SPACING.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  reasonSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  reasonCard: {
    padding: SPACING.lg,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  selectedMoodDisplay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  reasonHeaderText: {
    flex: 1,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.primaryText,
    backgroundColor: COLORS.cardBackground,
    minHeight: 80,
    marginBottom: SPACING.md,
  },
  saveButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MoodSelectionScreen;
