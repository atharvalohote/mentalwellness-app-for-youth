import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ModernDialog from '../../components/dialogs/ModernDialog';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS, LAYOUT } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';
import UnifiedLayout from '../../components/ui/UnifiedLayout';
import UnifiedHeader from '../../components/ui/UnifiedHeader';
import AppCard from '../../components/ui/AppCard';
import { databaseService } from '../../db/RealmConfig';
import JournalAnalysisService from '../../services/JournalAnalysisService';

interface JournalEntryScreenProps {
  navigation: any;
  route?: {
    params?: {
      mood?: string;
      therapy?: any;
    };
  };
}

interface JournalPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Write about what you\'re grateful for today',
    prompt: 'What are three things you\'re grateful for today? How do they make you feel?',
    icon: 'heart',
    color: COLORS.pink,
  },
  {
    id: 'reflection',
    title: 'Daily Reflection',
    description: 'Reflect on your day and experiences',
    prompt: 'How was your day? What were the highlights and challenges? What did you learn?',
    icon: 'book',
    color: COLORS.lightBlue,
  },
  {
    id: 'emotions',
    title: 'Emotional Check-in',
    description: 'Explore your current emotions',
    prompt: 'How are you feeling right now? What emotions are present? What might be causing them?',
    icon: 'happy',
    color: COLORS.yellow,
  },
  {
    id: 'goals',
    title: 'Goal Setting',
    description: 'Set and review your personal goals',
    prompt: 'What goals are you working towards? What progress have you made? What\'s next?',
    icon: 'flag',
    color: COLORS.purple,
  },
  {
    id: 'challenges',
    title: 'Challenge Processing',
    description: 'Work through difficult situations',
    prompt: 'What challenges are you facing? How can you approach them differently? What support do you need?',
    icon: 'bulb',
    color: COLORS.teal,
  },
  {
    id: 'free-write',
    title: 'Free Writing',
    description: 'Write whatever comes to mind',
    prompt: 'Let your thoughts flow freely. Write whatever comes to mind without judgment.',
    icon: 'pencil',
    color: COLORS.mint,
  },
];

const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({ navigation, route }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  const [journalText, setJournalText] = useState('');
  const [title, setTitle] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [showEmptyEntryDialog, setShowEmptyEntryDialog] = useState(false);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { mood, therapy } = route?.params || {};

  const handlePromptSelect = (prompt: JournalPrompt) => {
    HapticService.light();
    setSelectedPrompt(prompt);
    setJournalText(prompt.prompt + '\n\n');
    setIsWriting(true);
  };

  const handleSaveEntry = async () => {
    if (!journalText.trim()) {
      HapticService.error();
      setShowEmptyEntryDialog(true);
      return;
    }

    if (!title.trim()) {
      HapticService.error();
      Alert.alert('Title Required', 'Please enter a title for your journal entry.');
      return;
    }

    setIsSaving(true);
    HapticService.medium();

    try {
      // Save the journal entry to database
      const entry = await databaseService.saveJournalEntry(
        title.trim(),
        journalText.trim(),
        mood
      );

      // Start AI analysis
      setIsAnalyzing(true);
      const analysisService = JournalAnalysisService.getInstance();
      const analysis = await analysisService.analyzeJournalEntry(journalText.trim());

      // Update the entry with AI analysis
      await databaseService.updateJournalEntryAnalysis(
        entry._id,
        analysis.sentiment,
        analysis.tags
      );

      HapticService.patterns.checkInComplete();
      setShowSaveSuccessDialog(true);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      HapticService.error();
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  const handleDiscardEntry = () => {
    HapticService.warning();
    setShowDiscardDialog(true);
  };

  const renderPrompt = (prompt: JournalPrompt) => (
    <AppCard
      key={prompt.id}
      onPress={() => handlePromptSelect(prompt)}
      animated={true}
      style={[
        styles.promptCard,
        { backgroundColor: prompt.color },
      ]}
    >
      <View style={styles.promptContent}>
        <View style={styles.promptIconContainer}>
          <Ionicons name={prompt.icon} size={24} color={COLORS.cardBackground} />
        </View>
        <View style={styles.promptTextContainer}>
          <Text variant="bold" size="md" color={COLORS.cardBackground} style={styles.promptTitle}>
            {prompt.title}
          </Text>
          <Text variant="regular" size="sm" color={COLORS.cardBackground} style={styles.promptDescription}>
            {prompt.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.cardBackground} />
      </View>
    </AppCard>
  );

  if (isWriting) {
    return (
      <UnifiedLayout scrollable={false}>
        <UnifiedHeader
          title="Writing"
          subtitle="Express your thoughts"
          onBack={() => {
            if (journalText.trim()) {
              handleDiscardEntry();
            } else {
              setIsWriting(false);
              setSelectedPrompt(null);
            }
          }}
          onRightPress={handleSaveEntry}
          rightText={isAnalyzing ? "Analyzing..." : isSaving ? "Saving..." : "Save"}
          showBackButton={true}
          showRightButton={true}
          rightButtonDisabled={isSaving || isAnalyzing}
        />
        <View style={styles.writingContainer}>
          <View style={styles.writingHeader}>
            <Text variant="bold" size="lg" color={COLORS.primaryText} style={styles.writingTitle}>
              {selectedPrompt?.title}
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.writingSubtitle}>
              {selectedPrompt?.description}
            </Text>
          </View>
          
          {/* Title Input */}
          <AppCard style={styles.titleInputCard}>
            <TextInput
              style={styles.titleInput}
              placeholder="Entry title..."
              placeholderTextColor={COLORS.lightText}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </AppCard>
          
          <AppCard style={styles.textInputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Start writing..."
              placeholderTextColor={COLORS.lightText}
              value={journalText}
              onChangeText={setJournalText}
              multiline
              textAlignVertical="top"
              autoFocus={true}
              maxLength={2000}
            />
          </AppCard>
          
          <View style={styles.writingFooter}>
            <Text variant="regular" size="xs" color={COLORS.lightText} style={styles.characterCount}>
              {journalText.length}/2000 characters
            </Text>
          </View>
        </View>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout>
      <UnifiedHeader
        title="Journal Entry"
        subtitle="Choose a prompt to get started"
        onBack={() => navigation.goBack()}
        showBackButton={true}
      />
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text variant="regular" size="lg" color={COLORS.secondaryText} style={styles.description}>
            Choose a journaling prompt to guide your writing
          </Text>
          {mood && (
            <Text variant="medium" size="md" color={COLORS.primaryText} style={styles.moodContext}>
              Current mood: {mood}
            </Text>
          )}
        </View>

        {/* Journal Prompts */}
        <View style={styles.promptsContainer}>
          {JOURNAL_PROMPTS.map((prompt) => renderPrompt(prompt))}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text variant="semibold" size="md" color={COLORS.secondaryText} style={styles.benefitsTitle}>
            Journaling Benefits
          </Text>
          <Text variant="regular" size="sm" color={COLORS.lightText} style={styles.benefitsDescription}>
            • Improves emotional well-being{'\n'}
            • Enhances self-awareness{'\n'}
            • Reduces stress and anxiety{'\n'}
            • Helps process difficult emotions
          </Text>
        </View>
    </UnifiedLayout>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  moodContext: {
    textAlign: 'center',
    opacity: 0.8,
  },
  promptsContainer: {
    gap: SPACING.md,
  },
  promptCard: {
    marginBottom: SPACING.sm,
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptIconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  promptTextContainer: {
    flex: 1,
  },
  promptTitle: {
    marginBottom: SPACING.xs,
  },
  promptDescription: {
    opacity: 0.9,
  },
  benefitsSection: {
    marginTop: SPACING.xxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  benefitsTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  benefitsDescription: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  writingContainer: {
    flex: 1,
    paddingHorizontal: LAYOUT.safeAreaHorizontal,
    paddingTop: SPACING.lg,
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  writingHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  writingTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  writingSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  titleInputCard: {
    marginBottom: SPACING.md,
  },
  titleInput: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.primaryText,
    paddingVertical: SPACING.sm,
  },
  textInputCard: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  textInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.primaryText,
    lineHeight: 24,
    minHeight: 300,
  },
  writingFooter: {
    alignItems: 'center',
  },
  characterCount: {
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default JournalEntryScreen;
