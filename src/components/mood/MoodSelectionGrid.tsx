import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/designSystem';
import Text from '../ui/Text';
import HapticService from '../../services/HapticService';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

interface MoodSelectionGridProps {
  onMoodSelect: (mood: MoodOption) => void;
  disabled?: boolean;
}

const MoodSelectionGrid: React.FC<MoodSelectionGridProps> = ({ onMoodSelect, disabled = false }) => {
  const moodOptions: MoodOption[] = [
    {
      id: 'ecstatic',
      emoji: '🤩',
      label: 'Ecstatic',
      color: '#FF6B6B',
      description: 'Over the moon!'
    },
    {
      id: 'happy',
      emoji: '😊',
      label: 'Happy',
      color: '#4ECDC4',
      description: 'Feeling great!'
    },
    {
      id: 'content',
      emoji: '😌',
      label: 'Content',
      color: '#45B7D1',
      description: 'Peaceful and calm'
    },
    {
      id: 'neutral',
      emoji: '😐',
      label: 'Neutral',
      color: '#96CEB4',
      description: 'Just okay'
    },
    {
      id: 'worried',
      emoji: '😟',
      label: 'Worried',
      color: '#FECA57',
      description: 'A bit concerned'
    },
    {
      id: 'sad',
      emoji: '😔',
      label: 'Sad',
      color: '#FF9FF3',
      description: 'Feeling down'
    },
    {
      id: 'anxious',
      emoji: '😰',
      label: 'Anxious',
      color: '#A8E6CF',
      description: 'Feeling anxious'
    },
    {
      id: 'overwhelmed',
      emoji: '😵',
      label: 'Overwhelmed',
      color: '#FFB3BA',
      description: 'Too much going on'
    },
  ];

  const handleMoodPress = (mood: MoodOption) => {
    if (disabled) return;
    
    HapticService.medium();
    onMoodSelect(mood);
  };

  const renderMoodButton = (mood: MoodOption, index: number) => (
    <TouchableOpacity
      key={mood.id}
      style={[
        styles.moodButton,
        { backgroundColor: mood.color },
        disabled && styles.disabledButton
      ]}
      onPress={() => handleMoodPress(mood)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.moodButtonContent}>
        <Text variant="bold" size="xxl" style={styles.moodEmoji}>
          {mood.emoji}
        </Text>
        <Text variant="semibold" size="sm" color={COLORS.cardBackground} style={styles.moodLabel}>
          {mood.label}
        </Text>
        <Text variant="regular" size="xs" color={COLORS.cardBackground} style={styles.moodDescription}>
          {mood.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text variant="semibold" size="lg" color={COLORS.primaryText} style={styles.title}>
        How are you feeling right now, friend?
      </Text>
      <View style={styles.grid}>
        {moodOptions.map((mood, index) => renderMoodButton(mood, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  moodButton: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  moodButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  moodLabel: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  moodDescription: {
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 10,
  },
});

export default MoodSelectionGrid;
