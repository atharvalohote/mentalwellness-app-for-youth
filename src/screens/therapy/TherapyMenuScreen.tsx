import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';
import { TherapyCategory, Therapy } from '../../types/therapy';
import { THERAPY_CATEGORIES, getRecommendedTherapies } from '../../data/therapyData';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import ModernDialog from '../../components/dialogs/ModernDialog';

interface TherapyMenuScreenProps {
  navigation: any;
  route?: {
    params?: {
      mood?: string;
      recommended?: boolean;
    };
  };
}

const TherapyMenuScreen: React.FC<TherapyMenuScreenProps> = ({ navigation, route }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);

  const { mood, recommended } = route?.params || {};

  // Memoize recommended therapies to avoid recalculation
  const recommendedTherapies = useMemo(() => {
    if (recommended && mood) {
      return getRecommendedTherapies(mood);
    }
    return [];
  }, [recommended, mood]);

  useEffect(() => {
    if (recommended && mood) {
      setShowRecommendations(true);
    }
  }, [recommended, mood]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    HapticService.light();
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  // Navigation mapping for cleaner code
  const navigationMap = useMemo(() => ({
    'chat': (therapy: Therapy) => navigation.getParent()?.navigate('Chat', {
      therapy,
      aiPersonality: therapy.aiPersonality,
      mode: 'therapy'
    }),
    'breathing': (therapy: Therapy) => navigation.navigate('MindfulMoment', { therapy }),
    'art': (therapy: Therapy) => navigation.navigate('ArtStudio', { therapy }),
    'guided': null, // Will show coming soon dialog
    'interactive': null, // Will show coming soon dialog
    'meditation': (therapy: Therapy) => navigation.navigate('MindfulMoment', { therapy }),
    'cbt-challenge': (therapy: Therapy) => navigation.navigate('CbtChallenge', { therapy }),
  }), [navigation]);

  const handleStartTherapy = useCallback((category: TherapyCategory) => {
    HapticService.medium();
    
    const defaultTherapy = category.therapies[0];
    if (!defaultTherapy) {
      setShowComingSoonDialog(true);
      return;
    }
    
    const navigate = navigationMap[defaultTherapy.sessionType];
    if (navigate) {
      navigate(defaultTherapy);
    } else {
      setShowComingSoonDialog(true);
    }
  }, [navigationMap]);


  const renderCategoryCard = useCallback((category: TherapyCategory) => {
    const isSelected = selectedCategory === category.id;
    
    return (
      <View key={category.id} style={styles.categoryCard}>
        <TouchableOpacity
          style={[
            styles.categoryContent,
            {
              backgroundColor: isSelected ? category.color : COLORS.cardBackground,
              borderColor: category.color,
              borderWidth: isSelected ? 3 : 1,
            },
          ]}
          onPress={() => handleCategoryPress(category.id)}
          activeOpacity={0.8}
        >
          <View style={styles.categoryHeader}>
            <View style={[
              styles.categoryIcon,
              { backgroundColor: isSelected ? COLORS.cardBackground : category.color }
            ]}>
              <Ionicons 
                name={category.icon as any} 
                size={24} 
                color={isSelected ? category.color : COLORS.cardBackground} 
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text 
                variant="bold" 
                size="lg" 
                color={isSelected ? COLORS.cardBackground : COLORS.primaryText}
                style={styles.categoryName}
              >
                {category.name}
              </Text>
              <Text 
                variant="regular" 
                size="sm" 
                color={isSelected ? COLORS.cardBackground : COLORS.secondaryText}
                style={styles.categoryDescription}
              >
                {category.description}
              </Text>
            </View>
            <Ionicons 
              name={isSelected ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={isSelected ? COLORS.cardBackground : COLORS.lightText} 
            />
          </View>
        </TouchableOpacity>

        {/* Category Introduction */}
        {isSelected && (
          <View style={styles.categoryIntroContainer}>
            <View style={styles.categoryIntroContent}>

              <View style={styles.categoryStats}>
                <View style={styles.statItem}>
                  <Text variant="bold" size="lg" color={category.color} style={styles.statNumber}>
                    {Math.round(category.therapies.reduce((acc, t) => acc + t.duration, 0) / category.therapies.length)}
                  </Text>
                  <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.statLabel}>
                    Avg Duration
                  </Text>
                </View>
              </View>

              <View style={styles.categoryBenefits}>
                <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.benefitsTitle}>
                  What You'll Get:
                </Text>
                <View style={styles.benefitsGrid}>
                  <View style={styles.benefitCard}>
                    <View style={[styles.benefitIcon, { backgroundColor: category.color }]}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.cardBackground} />
                    </View>
                    <Text variant="medium" size="xs" color={COLORS.primaryText} style={styles.benefitCardText}>
                      Evidence-based techniques
                    </Text>
                  </View>
                  <View style={styles.benefitCard}>
                    <View style={[styles.benefitIcon, { backgroundColor: category.color }]}>
                      <Ionicons name="time" size={16} color={COLORS.cardBackground} />
                    </View>
                    <Text variant="medium" size="xs" color={COLORS.primaryText} style={styles.benefitCardText}>
                      Flexible duration
                    </Text>
                  </View>
                  <View style={styles.benefitCard}>
                    <View style={[styles.benefitIcon, { backgroundColor: category.color }]}>
                      <Ionicons name="person" size={16} color={COLORS.cardBackground} />
                    </View>
                    <Text variant="medium" size="xs" color={COLORS.primaryText} style={styles.benefitCardText}>
                      Personalized approach
                    </Text>
                  </View>
                  <View style={styles.benefitCard}>
                    <View style={[styles.benefitIcon, { backgroundColor: category.color }]}>
                      <Ionicons name="trending-up" size={16} color={COLORS.cardBackground} />
                    </View>
                    <Text variant="medium" size="xs" color={COLORS.primaryText} style={styles.benefitCardText}>
                      Track progress
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.startTherapyContainer}>
                <TouchableOpacity
                  style={[styles.startTherapyButton, { backgroundColor: category.color }]}
                  onPress={() => handleStartTherapy(category)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play-circle" size={24} color={COLORS.cardBackground} />
                  <Text variant="bold" size="lg" color={COLORS.cardBackground} style={styles.startTherapyText}>
                    Start Therapy
                  </Text>
                </TouchableOpacity>
                <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.startTherapySubtext}>
                  Begin your therapeutic journey
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }, [selectedCategory, handleCategoryPress, handleStartTherapy]);

  // Memoize category lookup to avoid repeated searches
  const categoryLookup = useMemo(() => {
    const lookup: { [therapyId: string]: TherapyCategory } = {};
    THERAPY_CATEGORIES.forEach(category => {
      category.therapies.forEach(therapy => {
        lookup[therapy.id] = category;
      });
    });
    return lookup;
  }, []);

  const renderRecommendationCard = useCallback((therapy: Therapy) => (
    <View
      key={therapy.id}
      style={[styles.recommendationCard, { borderLeftColor: therapy.color }]}
    >
      <View style={styles.recommendationHeader}>
        <View style={[styles.recommendationIcon, { backgroundColor: therapy.color }]}>
          <Ionicons name={therapy.icon as any} size={20} color={COLORS.cardBackground} />
        </View>
        <View style={styles.recommendationInfo}>
          <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.recommendationName}>
            {therapy.name}
          </Text>
          <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.recommendationDescription}>
            {therapy.description}
          </Text>
        </View>
        <View style={styles.recommendationBadge}>
          <Ionicons name="star" size={16} color={COLORS.yellow} />
        </View>
      </View>
      <View style={styles.recommendationMeta}>
        <View style={[styles.difficultyBadge, { backgroundColor: therapy.color }]}>
          <Text variant="medium" size="xs" color={COLORS.cardBackground} style={styles.difficultyText}>
            {therapy.difficulty}
          </Text>
        </View>
        <Text variant="regular" size="xs" color={COLORS.lightText} style={styles.durationText}>
          {therapy.duration} min
        </Text>
        <Text variant="regular" size="xs" color={COLORS.teal} style={styles.recommendedText}>
          Recommended for you
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.recommendationStartButton, { backgroundColor: therapy.color }]}
        onPress={() => {
          const category = categoryLookup[therapy.id];
          if (category) {
            handleStartTherapy(category);
          }
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={16} color={COLORS.cardBackground} />
        <Text variant="semibold" size="sm" color={COLORS.cardBackground} style={styles.recommendationStartText}>
          Start Therapy
        </Text>
      </TouchableOpacity>
    </View>
  ), [categoryLookup, handleStartTherapy]);

  return (
    <ScreenWrapper title="Therapy Menu" canGoBack={true}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recommendations Section */}
        {showRecommendations && recommendedTherapies.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text variant="semibold" size="lg" color={COLORS.primaryText}>
              Recommended for You
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText}>
              Based on your current mood: {mood}
            </Text>
            <View style={styles.recommendationsList}>
              {recommendedTherapies.map(renderRecommendationCard)}
            </View>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesList}>
            {THERAPY_CATEGORIES.map(renderCategoryCard)}
          </View>
        </View>
      </ScrollView>

      {/* Coming Soon Dialog */}
      <ModernDialog
        visible={showComingSoonDialog}
        title="Coming Soon"
        message="This therapy type is currently in development. We're working hard to bring you the best therapeutic experience. Stay tuned!"
        buttons={[
          {
            text: 'Got it',
            onPress: () => {
              HapticService.light();
              setShowComingSoonDialog(false);
            },
            style: 'success'
          }
        ]}
        onClose={() => setShowComingSoonDialog(false)}
        type="info"
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  recommendationsSection: {
    marginBottom: SPACING.xl,
  },
  categoriesSection: {
    marginBottom: SPACING.xl,
  },
  recommendationsList: {
    gap: SPACING.md,
  },
  categoriesList: {
    gap: SPACING.md,
  },
  categoryCard: {
    marginBottom: SPACING.sm,
  },
  categoryContent: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    marginBottom: SPACING.xs,
  },
  categoryDescription: {
    opacity: 0.8,
  },
  categoryIntroContainer: {
    backgroundColor: COLORS.offwhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  categoryIntroContent: {
    padding: SPACING.xl,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: SPACING.xs,
  },
  statLabel: {
    opacity: 0.8,
  },
  categoryBenefits: {
    marginBottom: SPACING.lg,
  },
  benefitsTitle: {
    marginBottom: SPACING.md,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
    minWidth: '45%',
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  benefitCardText: {
    flex: 1,
  },
  startTherapyContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  startTherapyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    ...SHADOWS.lg,
    minWidth: 250,
    marginBottom: SPACING.sm,
  },
  startTherapyText: {
    marginLeft: SPACING.sm,
  },
  startTherapySubtext: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  recommendationCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.yellow,
    borderLeftWidth: 4,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    marginBottom: SPACING.xs,
  },
  recommendationDescription: {
    opacity: 0.8,
  },
  recommendationBadge: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.yellow}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  difficultyText: {
    textAlign: 'center',
  },
  durationText: {
    opacity: 0.7,
    marginRight: SPACING.sm,
  },
  recommendedText: {
    fontWeight: '600',
  },
  recommendationStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  recommendationStartText: {
    marginLeft: SPACING.xs,
  },
});

export default TherapyMenuScreen;
