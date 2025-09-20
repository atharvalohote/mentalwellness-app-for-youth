import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS, LAYOUT } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';
import AppCard from '../../components/ui/AppCard';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { databaseService, JournalEntry as RealmJournalEntry } from '../../db/RealmConfig';

interface JournalScreenProps {
  navigation: any;
}

const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {
  const [entries, setEntries] = useState<RealmJournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<RealmJournalEntry | null>(null);
  const [scaleAnimations] = useState(
    Array(5).fill(0).map(() => new Animated.Value(1))
  );

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const journalEntries = await databaseService.getJournalEntries(20); // Load last 20 entries
      setEntries(journalEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleEntryPress = (entry: RealmJournalEntry, index: number) => {
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

    setSelectedEntry(entry);
  };

  const handleNewEntry = () => {
    HapticService.medium();
    navigation.navigate('Therapy', { screen: 'JournalEntry' });
  };

  const handleGalleryPress = () => {
    HapticService.medium();
    Alert.alert(
      'Healing Gallery',
      'This feature is coming soon! You\'ll be able to view all your created art.',
      [
        { text: 'OK', onPress: () => HapticService.light() }
      ]
    );
  };

  const getSentimentEmoji = (sentiment?: string) => {
    const sentimentEmojis: { [key: string]: string } = {
      positive: '😊',
      negative: '😔',
      neutral: '😐',
    };
    return sentimentEmojis[sentiment || 'neutral'] || '😐';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderJournalEntry = (entry: RealmJournalEntry, index: number) => (
    <AppCard
      key={entry._id.toString()}
      onPress={() => handleEntryPress(entry, index)}
      animated={true}
      style={styles.entryCard}
    >
      <View style={styles.entryHeader}>
        <View style={styles.entryMeta}>
          <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.entryTitle}>
            {entry.title}
          </Text>
          <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.entryDate}>
            {formatDate(entry.timestamp)}
          </Text>
        </View>
        <View style={styles.moodContainer}>
          <Text style={styles.moodEmoji}>{getSentimentEmoji(entry.sentiment)}</Text>
        </View>
      </View>
      <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.entryPreview}>
        {entry.content.length > 100 
          ? `${entry.content.substring(0, 100)}...` 
          : entry.content}
      </Text>
      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {entry.tags.slice(0, 3).map((tag, tagIndex) => (
            <View key={tagIndex} style={styles.tag}>
              <Text variant="regular" size="xs" color={COLORS.teal} style={styles.tagText}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </AppCard>
  );

  return (
    <ScreenWrapper title="Journal & Gallery" canGoBack={true}>
      {/* Progress Section - Moved to Top */}
      <View style={styles.progressSection}>
        <Text variant="semibold" size="lg" color={COLORS.primaryText} style={styles.sectionTitle}>
          Your Progress
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text variant="bold" size="xxl" color={COLORS.purple} style={styles.statNumber}>
              {entries.length}
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.statLabel}>
              Journal Entries
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="bold" size="xxl" color={COLORS.teal} style={styles.statNumber}>
              7
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.statLabel}>
              Day Streak
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="bold" size="xxl" color={COLORS.pink} style={styles.statNumber}>
              12
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.statLabel}>
              Art Pieces
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={handleNewEntry}
          activeOpacity={0.8}
        >
          <View style={styles.newEntryContent}>
            <View style={styles.newEntryIconContainer}>
              <Ionicons name="add" size={24} color={COLORS.cardBackground} />
            </View>
            <Text variant="bold" size="lg" color={COLORS.cardBackground} style={styles.newEntryText}>
              New Journal Entry
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Journal Entries */}
      <View style={styles.entriesSection}>
        <Text variant="semibold" size="lg" color={COLORS.primaryText} style={styles.sectionTitle}>
          Recent Entries
        </Text>
        <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.sectionSubtitle}>
          Your thoughts and reflections
        </Text>
        <View style={styles.entriesList}>
          {entries.map((entry, index) => renderJournalEntry(entry, index))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  quickActions: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  newEntryButton: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.xl,
    ...SHADOWS.md,
    transform: [{ skewX: '-2deg' }],
  },
  newEntryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  newEntryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  newEntryText: {
    textAlign: 'center',
  },
  entriesSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  entriesList: {
    gap: SPACING.md,
  },
  entryCard: {
    marginBottom: SPACING.sm,
  },
  entryContent: {
    // Content styling handled by AppCard
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  entryMeta: {
    flex: 1,
  },
  entryTitle: {
    marginBottom: SPACING.xs,
  },
  entryDate: {
    opacity: 0.7,
  },
  moodContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.teal}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 20,
  },
  entryPreview: {
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: `${COLORS.teal}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  tagText: {
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statNumber: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default JournalScreen;
