import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  View, 
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS, LAYOUT } from '../constants/designSystem';
import Text from '../components/ui/Text';
import HapticService from '../services/HapticService';
import AppCard from '../components/ui/AppCard';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import ModernDialog from '../components/dialogs/ModernDialog';
import MoodSelectionGrid from '../components/mood/MoodSelectionGrid';
import MoodContextModal from '../components/mood/MoodContextModal';
import MoodPieChart from '../components/mood/MoodPieChart';
import { MoodDatabase } from '../services/MoodDatabase';
import { MoodOption, MoodEntry } from '../types/mood';

interface SanctuaryDashboardProps {
  navigation: any;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

// Mood types are now imported from types/mood

const SanctuaryDashboard: React.FC<SanctuaryDashboardProps> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streak, setStreak] = useState(7); // Mock data
  const [points, setPoints] = useState(1250); // Mock data
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [moodStreak, setMoodStreak] = useState(0);
  const [weeklyMoodData, setWeeklyMoodData] = useState<any[]>([]);
  const [showMoodContextModal, setShowMoodContextModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [scaleAnimations] = useState(
    Array(6).fill(0).map(() => new Animated.Value(1))
  );

  const loadTodayMood = async () => {
    try {
      const moodEntry = await MoodDatabase.getTodaysMoodEntry();
      setTodayMood(moodEntry);
    } catch (error) {
      console.error('Error loading today\'s mood:', error);
    }
  };

  const loadMoodStreak = async () => {
    try {
      const stats = await MoodDatabase.getMoodStats();
      setMoodStreak(stats.currentStreak);
    } catch (error) {
      console.error('Error loading mood streak:', error);
    }
  };

  const loadWeeklyMoodData = async () => {
    try {
      const weeklyData = await AsyncStorage.getItem('weekly_mood_data');
      const moodData = weeklyData ? JSON.parse(weeklyData) : [];
      
      // Filter to last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentMoodData = moodData.filter((entry: any) => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo;
      });
      
      setWeeklyMoodData(recentMoodData);
    } catch (error) {
      console.error('Error loading weekly mood data:', error);
    }
  };

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    loadTodayMood();
    loadMoodStreak();
    loadWeeklyMoodData();

    return () => clearInterval(timer);
  }, []);

  // Refresh data when screen comes into focus (e.g., returning from mood selection)
  useFocusEffect(
    React.useCallback(() => {
      loadTodayMood();
      loadMoodStreak();
      loadWeeklyMoodData();
    }, [])
  );

  const saveMood = async (mood: MoodOption) => {
    try {
      const moodEntry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        context: '',
        timestamp: new Date(),
        date: new Date().toISOString().split('T')[0],
      };
      
      await MoodDatabase.saveMoodEntry(moodEntry);
      setTodayMood(moodEntry);
      
      // Reload stats to get updated streak and weekly data
      await loadMoodStreak();
      await loadWeeklyMoodData();
      
      HapticService.success();
    } catch (error) {
      console.error('Error saving mood:', error);
      HapticService.error();
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleDailyCheckIn = () => {
    HapticService.light();
    
    if (todayMood) {
      // Already checked in today, show mood stats
      setShowStatsDialog(true);
    } else {
      // Navigate to mood selection screen with callback to refresh data
      navigation.navigate('Therapy', { 
        screen: 'MoodSelection',
        params: {
          onMoodSelected: () => {
            // Refresh data when user returns
            loadTodayMood();
            loadMoodStreak();
            loadWeeklyMoodData();
          }
        }
      });
    }
  };


  // Mood buttons will be handled by the new mood selection system

  const statsButtons = [
    { 
      text: 'View Stats', 
      onPress: () => navigation.navigate('JournalStats'),
      icon: 'bar-chart' as const
    },
    { 
      text: 'OK', 
      style: 'cancel' as const,
      onPress: () => HapticService.light()
    },
  ];

  const emergencyButtons = [
    { 
      text: 'KIRAN (24/7)', 
      organization: 'Ministry of Social Justice & Empowerment',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:9152987821');
        setShowEmergencyDialog(false);
      }
    },
    { 
      text: 'Vandrevala Foundation', 
      organization: 'Vandrevala Foundation',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:1800-599-0019');
        setShowEmergencyDialog(false);
      }
    },
    { 
      text: 'iCall', 
      organization: 'TISS Mumbai',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:1860-2662-345');
        setShowEmergencyDialog(false);
      }
    },
    { 
      text: 'AASRA', 
      organization: 'AASRA Mumbai',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:022-25521111');
        setShowEmergencyDialog(false);
      }
    },
    { 
      text: 'Emergency (911)', 
      organization: 'Emergency Response',
      style: 'emergency' as const,
      onPress: () => {
        HapticService.heavy();
        Linking.openURL('tel:911');
        setShowEmergencyDialog(false);
      }
    },
    { 
      text: 'I\'m Safe', 
      style: 'cancel' as const,
      onPress: () => {
        HapticService.light();
        setShowEmergencyDialog(false);
      }
    },
  ];

  const handleFeaturePress = (index: number, onPress: () => void) => {
    // Haptic feedback
    HapticService.light();
    
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const handleEmergencySupport = () => {
    HapticService.patterns.sosPressed();
    setShowEmergencyDialog(true);
  };

  const handleChat = () => {
    HapticService.medium();
    // Navigate to the Chat tab in the TabNavigator
    // Use the root navigator to navigate to the Chat tab
    navigation.getParent()?.getParent()?.navigate('Chat', {
      mood: undefined,
      therapy: undefined,
      personality: 'general'
    });
  };

  const featureCards: FeatureCard[] = [
    {
      id: 'emergency',
      title: 'Emergency Support',
      description: '24/7 crisis helplines',
      icon: 'call',
      color: COLORS.warningRed,
      onPress: handleEmergencySupport,
    },
    {
      id: 'chat',
      title: 'Talk to Bestie',
      description: 'AI companion for support',
      icon: 'chatbubble',
      color: COLORS.purple,
      onPress: handleChat,
    },
    {
      id: 'journal',
      title: 'View Journal',
      description: 'Reflect on your journey',
      icon: 'book',
      color: COLORS.lightBlue,
      onPress: () => navigation.navigate('Journal'),
    },
    {
      id: 'mindful',
      title: 'Mindful Moment',
      description: 'Guided breathing exercises',
      icon: 'leaf',
      color: COLORS.teal,
      onPress: () => navigation.navigate('Therapy', { screen: 'MindfulMoment' }),
    },
    {
      id: 'art',
      title: 'Express with Art',
      description: 'Create visual art from your emotions',
      icon: 'brush',
      color: COLORS.pink,
      onPress: () => navigation.navigate('Therapy', { screen: 'ArtStudio' }),
    },
    {
      id: 'therapy',
      title: 'Therapy Tools',
      description: 'Mental wellness resources',
      icon: 'bulb',
      color: COLORS.purple,
      onPress: () => navigation.navigate('Therapy'),
    },
  ];

  const renderFeatureCard = (card: FeatureCard, index: number) => (
    <AppCard
      key={card.id}
      variant="elevated"
      color={card.color}
      animated={true}
      size="medium"
      onPress={() => handleFeaturePress(index, card.onPress)}
      style={styles.featureCard}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>
          <Ionicons name={card.icon} size={28} color={COLORS.cardBackground} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text variant="bold" size="md" color={COLORS.cardBackground} style={styles.cardTitle}>
            {card.title}
          </Text>
          <Text variant="regular" size="sm" color={COLORS.cardBackground} style={styles.cardDescription}>
            {card.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.cardBackground} />
      </View>
    </AppCard>
  );

  return (
    <ScreenWrapper>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text variant="bold" size="xxxl" color={COLORS.darkblue} style={styles.greeting}>
            {getTimeBasedGreeting()}
          </Text>
          <Text variant="regular" size="lg" color={COLORS.secondaryText} style={styles.subtitle}>
            Welcome to your sanctuary
          </Text>
        </View>

        {/* Daily Check-in */}
        <TouchableOpacity
          onPress={handleDailyCheckIn}
          activeOpacity={0.8}
          style={styles.dailyCheckInCard}
        >
          <LinearGradient
            colors={['#E8F4FD', '#F0F8FF', '#E6F3FF', '#F5F9FF']}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            style={styles.gradientCard}
          >
            <View style={styles.checkInContent}>
              <View style={styles.checkInIconContainer}>
                <Ionicons name="medical" size={32} color={COLORS.purple} />
              </View>
              <View style={styles.checkInTextContainer}>
                <Text variant="bold" size="xl" color={COLORS.primaryText} style={styles.checkInTitle}>
                  {todayMood ? 'Mood Checked! ✅' : 'Daily Check-in ✨'}
                </Text>
                <Text variant="regular" size="md" color={COLORS.primaryText} style={styles.checkInDescription}>
                  {todayMood 
                    ? `Today: ${todayMood.mood.label} • Streak: ${moodStreak} days`
                    : 'How are you feeling today? Let\'s track your mood!'
                  }
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={24} color={COLORS.purple} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 7-Day Mood Overview */}
        {weeklyMoodData.length > 0 && (
          <View style={styles.moodOverviewSection}>
            <AppCard style={styles.moodOverviewCard} variant="outlined">
              <MoodPieChart moodData={weeklyMoodData} />
            </AppCard>
          </View>
        )}

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text variant="semibold" size="lg" color={COLORS.primaryText} style={styles.featuresTitle}>
            Explore Your Tools
          </Text>
          <View style={styles.featuresGrid}>
            {featureCards.map((card, index) => renderFeatureCard(card, index))}
          </View>
        </View>

        {/* Gamification Snapshot */}
        <View style={styles.gamificationSection}>
          <View style={styles.gamificationCard}>
            <View style={styles.gamificationItem}>
              <Ionicons name="flame" size={20} color={COLORS.warningRed} />
              <Text variant="medium" size="sm" color={COLORS.primaryText} style={styles.gamificationText}>
                {streak} day streak
              </Text>
            </View>
            <View style={styles.gamificationItem}>
              <Ionicons name="star" size={20} color={COLORS.yellow} />
              <Text variant="medium" size="sm" color={COLORS.primaryText} style={styles.gamificationText}>
                {points} points
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Dialog */}
        <ModernDialog
          visible={showStatsDialog}
          title="Already Checked In! 🎉"
          message={`Today's mood: ${todayMood ? todayMood.mood.label : 'Unknown'}\n\nMood streak: ${moodStreak} days\n\nKeep up the great work!`}
          buttons={statsButtons}
          onClose={() => setShowStatsDialog(false)}
          type="success"
        />

        {/* Professional Emergency Support Dialog */}
        <ModernDialog
          visible={showEmergencyDialog}
          title="Emergency Support"
          message="Professional mental health helplines are available 24/7. Choose a service below to call directly. All services are confidential and staffed by trained professionals."
          buttons={emergencyButtons}
          onClose={() => setShowEmergencyDialog(false)}
          type="warning"
          isEmergency={true}
        />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  dailyCheckInCard: {
    marginBottom: SPACING.xl,
    borderRadius: RADIUS.xl,
    ...SHADOWS.lg,
    elevation: 8,
  },
  gradientCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    minHeight: 100,
  },
  checkInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkInIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkInTextContainer: {
    flex: 1,
  },
  arrowContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInTitle: {
    marginBottom: SPACING.xs,
  },
  checkInDescription: {
    opacity: 0.7,
  },
  featuresSection: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: SPACING.md,
  },
  featureCard: {
    marginBottom: SPACING.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    opacity: 0.9,
  },
  gamificationSection: {
    alignItems: 'center',
  },
  gamificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  gamificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  gamificationText: {
    marginLeft: SPACING.sm,
  },
  moodOverviewSection: {
    marginTop: SPACING.lg,
  },
  moodOverviewCard: {
    padding: SPACING.lg,
  },
});

export default SanctuaryDashboard;

