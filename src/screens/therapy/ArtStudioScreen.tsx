import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';

interface ArtStudioScreenProps {
  navigation: any;
  route?: {
    params?: {
      mood?: string;
      therapy?: any;
    };
  };
}

const ArtStudioScreen: React.FC<ArtStudioScreenProps> = ({ navigation, route }) => {
  const [feelingText, setFeelingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const [showPostCreation, setShowPostCreation] = useState(false);

  const { mood, therapy } = route?.params || {};

  const handleSuggestPrompt = () => {
    HapticService.light();
    const prompts = [
      "A peaceful garden where I can find solace",
      "The storm inside me that needs to be released",
      "My inner child playing freely without worry",
      "The colors of my emotions today",
      "A safe space where I feel completely myself",
      "The journey from darkness to light",
      "My dreams taking flight like birds",
      "The warmth of hope in a cold world"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setFeelingText(randomPrompt);
  };

  const handleCreateArt = () => {
    if (!feelingText.trim()) {
      Alert.alert('Empty Description', 'Please describe the feeling you want to express before creating art.');
      return;
    }
    
    HapticService.medium();
    setIsGenerating(true);
    
    // Simulate art generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedArt('art-generated');
      setShowPostCreation(true);
    }, 3000);
  };

  const handleSaveToGallery = () => {
    HapticService.light();
    Alert.alert('Saved!', 'Your artwork has been saved to your healing gallery.');
  };

  const handleTransform = () => {
    HapticService.light();
    Alert.alert('Transform', 'This will create a new variation of your artwork.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <Text variant="bold" size="xl" color={COLORS.primaryText} style={styles.title}>
            Creative Studio
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text variant="regular" size="lg" color={COLORS.secondaryText} style={styles.description}>
              Express your feelings through art. Describe what you want to create, and we'll bring it to life.
            </Text>
          </View>

          {/* Text Area */}
          <View style={styles.textAreaContainer}>
            <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.textAreaLabel}>
              Describe the feeling you want to express
            </Text>
            <TextInput
              style={styles.textArea}
              value={feelingText}
              onChangeText={setFeelingText}
              placeholder="e.g., A peaceful garden where I can find solace, or The storm inside me that needs to be released..."
              placeholderTextColor={COLORS.lightText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            {/* Suggest Prompt Button */}
            <TouchableOpacity onPress={handleSuggestPrompt} style={styles.suggestButton}>
              <Ionicons name="bulb-outline" size={16} color={COLORS.pink} />
              <Text variant="medium" size="sm" color={COLORS.pink} style={styles.suggestButtonText}>
                Suggest a Prompt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Create Art Button */}
          <TouchableOpacity
            style={[styles.createButton, { opacity: feelingText.trim() ? 1 : 0.5 }]}
            onPress={handleCreateArt}
            disabled={!feelingText.trim() || isGenerating}
            activeOpacity={0.8}
          >
            <Ionicons name="brush" size={24} color={COLORS.cardBackground} />
            <Text variant="bold" size="lg" color={COLORS.cardBackground} style={styles.createButtonText}>
              {isGenerating ? 'Creating Art...' : 'Create Art'}
            </Text>
          </TouchableOpacity>

          {/* Image Display Area */}
          {isGenerating && (
            <View style={styles.imageContainer}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.pink} />
                <Text variant="regular" size="md" color={COLORS.secondaryText} style={styles.loadingText}>
                  Creating your artwork...
                </Text>
              </View>
            </View>
          )}

          {generatedArt && !isGenerating && (
            <View style={styles.imageContainer}>
              <View style={styles.artDisplay}>
                <Ionicons name="image" size={80} color={COLORS.pink} />
                <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.artText}>
                  Your artwork has been created!
                </Text>
              </View>
            </View>
          )}

          {/* Post-Creation Buttons */}
          {showPostCreation && (
            <View style={styles.postCreationContainer}>
              <TouchableOpacity onPress={handleSaveToGallery} style={styles.postButton}>
                <Ionicons name="save" size={20} color={COLORS.cardBackground} />
                <Text variant="semibold" size="md" color={COLORS.cardBackground} style={styles.postButtonText}>
                  Save to Gallery
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleTransform} style={[styles.postButton, styles.transformButton]}>
                <Ionicons name="refresh" size={20} color={COLORS.pink} />
                <Text variant="semibold" size="md" color={COLORS.pink} style={styles.transformButtonText}>
                  Transform
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: SPACING.xl,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  textAreaContainer: {
    marginBottom: SPACING.xl,
  },
  textAreaLabel: {
    marginBottom: SPACING.md,
  },
  textArea: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    color: COLORS.primaryText,
    minHeight: 120,
    textAlignVertical: 'top',
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  suggestButtonText: {
    marginLeft: SPACING.xs,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pink,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  createButtonText: {
    marginLeft: SPACING.sm,
  },
  imageContainer: {
    marginBottom: SPACING.xl,
  },
  loadingContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  loadingText: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  artDisplay: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  artText: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  postCreationContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  postButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pink,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.sm,
  },
  postButtonText: {
    marginLeft: SPACING.sm,
  },
  transformButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.pink,
  },
  transformButtonText: {
    color: COLORS.pink,
  },
});

export default ArtStudioScreen;