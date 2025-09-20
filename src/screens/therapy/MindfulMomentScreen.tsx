import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';

interface MindfulMomentScreenProps {
  navigation: any;
}

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  color: string;
}

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'calm',
    name: '1-Minute Breathing Exercise',
    description: 'Full-screen visualizer with animated breathing circle',
    duration: 60,
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 6,
    color: COLORS.lightBlue,
  },
  {
    id: 'focus',
    name: '3-Minute Focus',
    description: 'Deep breathing for concentration',
    duration: 180,
    inhaleTime: 5,
    holdTime: 3,
    exhaleTime: 7,
    color: COLORS.teal,
  },
  {
    id: 'energy',
    name: '2-Minute Energy',
    description: 'Energizing breath work',
    duration: 120,
    inhaleTime: 3,
    holdTime: 1,
    exhaleTime: 4,
    color: COLORS.yellow,
  },
];

type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

const MindfulMomentScreen: React.FC<MindfulMomentScreenProps> = ({ navigation }) => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  
  // Animation values
  const [circleScale] = useState(new Animated.Value(1));
  const [circleOpacity] = useState(new Animated.Value(0.7));
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Refs for timers
  const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      if (mainTimerRef.current) clearInterval(mainTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const startBreathingExercise = (exercise: BreathingExercise) => {
    HapticService.medium();
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setIsActive(true);
    setCurrentPhase('inhale');
    setPhaseTimeRemaining(exercise.inhaleTime);
    
    // Start the breathing cycle
    startBreathingCycle(exercise);
    
    // Start main timer
    mainTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopBreathingExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreathingCycle = (exercise: BreathingExercise) => {
    const cycle = () => {
      if (!isActive) return;
      
      // Inhale phase
      setCurrentPhase('inhale');
      setPhaseTimeRemaining(exercise.inhaleTime);
      HapticService.patterns.breathing.inhale();
      animateInhale();
      
      phaseTimerRef.current = setTimeout(() => {
        if (!isActive) return;
        
        // Hold phase
        setCurrentPhase('hold');
        setPhaseTimeRemaining(exercise.holdTime);
        HapticService.patterns.breathing.hold();
        animateHold();
        
        phaseTimerRef.current = setTimeout(() => {
          if (!isActive) return;
          
          // Exhale phase
          setCurrentPhase('exhale');
          setPhaseTimeRemaining(exercise.exhaleTime);
          HapticService.patterns.breathing.exhale();
          animateExhale();
          
          phaseTimerRef.current = setTimeout(() => {
            if (isActive) {
              cycle(); // Repeat the cycle
            }
          }, exercise.exhaleTime * 1000);
        }, exercise.holdTime * 1000);
      }, exercise.inhaleTime * 1000);
    };
    
    cycle();
  };

  const animateInhale = () => {
    Animated.parallel([
      Animated.timing(circleScale, {
        toValue: 1.3,
        duration: selectedExercise?.inhaleTime ? selectedExercise.inhaleTime * 1000 : 4000,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: 1,
        duration: selectedExercise?.inhaleTime ? selectedExercise.inhaleTime * 1000 : 4000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateHold = () => {
    // Keep the circle at current scale and opacity
    Animated.timing(circleOpacity, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateExhale = () => {
    Animated.parallel([
      Animated.timing(circleScale, {
        toValue: 1,
        duration: selectedExercise?.exhaleTime ? selectedExercise.exhaleTime * 1000 : 6000,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: 0.7,
        duration: selectedExercise?.exhaleTime ? selectedExercise.exhaleTime * 1000 : 6000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const stopBreathingExercise = () => {
    HapticService.success();
    setIsActive(false);
    setCurrentPhase('idle');
    setSelectedExercise(null);
    setTimeRemaining(0);
    setPhaseTimeRemaining(0);
    
    // Clear timers
    if (mainTimerRef.current) {
      clearInterval(mainTimerRef.current);
      mainTimerRef.current = null;
    }
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    
    // Reset animations
    Animated.parallel([
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBack = () => {
    if (isActive) {
      Alert.alert(
        'Stop Exercise',
        'Are you sure you want to stop the breathing exercise?',
        [
          { text: 'Continue', style: 'cancel', onPress: () => HapticService.light() },
          { text: 'Stop', style: 'destructive', onPress: () => {
            HapticService.medium();
            stopBreathingExercise();
          }},
        ]
      );
    } else {
      HapticService.light();
      navigation.goBack();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe out...';
      default:
        return 'Ready to begin';
    }
  };

  const getPhaseColor = () => {
    if (!selectedExercise) return COLORS.teal;
    return selectedExercise.color;
  };

  if (isActive && selectedExercise) {
    return (
      <View style={styles.fullScreenVisualizer}>
        {/* Close Button - Top Right */}
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.cardBackground} />
        </TouchableOpacity>

        {/* Central Animated Breathing Circle */}
        <View style={styles.breathingContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                backgroundColor: getPhaseColor(),
                transform: [{ scale: circleScale }],
                opacity: circleOpacity,
              },
            ]}
          >
            {/* Breathing Instructions */}
            <Text variant="bold" size="xxl" color={COLORS.cardBackground} style={styles.phaseText}>
              {getPhaseText()}
            </Text>
          </Animated.View>
        </View>

        {/* Circular Progress Timer - Around the circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text variant="semibold" size="lg" color={COLORS.cardBackground} style={styles.timerText}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <Text variant="bold" size="xl" color={COLORS.primaryText} style={styles.title}>
            Mindful Moment
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text variant="regular" size="lg" color={COLORS.secondaryText} style={styles.description}>
            Choose a breathing exercise to help you find calm and focus
          </Text>
        </View>

        {/* Exercise Cards */}
        <View style={styles.exercisesContainer}>
          {BREATHING_EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={[styles.exerciseCard, { borderColor: exercise.color }]}
              onPress={() => startBreathingExercise(exercise)}
              activeOpacity={0.8}
            >
              <View style={styles.exerciseHeader}>
                <View style={[styles.exerciseIcon, { backgroundColor: exercise.color }]}>
                  <Ionicons name="leaf" size={24} color={COLORS.cardBackground} />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text variant="bold" size="lg" color={COLORS.primaryText} style={styles.exerciseName}>
                    {exercise.name}
                  </Text>
                  <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
                <View style={styles.exerciseDuration}>
                  <Text variant="semibold" size="md" color={exercise.color} style={styles.durationText}>
                    {formatTime(exercise.duration)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Full-Screen Visualizer Styles
  fullScreenVisualizer: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  exercisesContainer: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    ...SHADOWS.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    marginBottom: SPACING.xs,
  },
  exerciseDescription: {
    opacity: 0.8,
  },
  exerciseDuration: {
    alignItems: 'center',
  },
  durationText: {
    textAlign: 'center',
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  breathingCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  phaseText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  phaseTime: {
    textAlign: 'center',
    opacity: 0.9,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  timerText: {
    textAlign: 'center',
  },
  timerLabel: {
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  stopButton: {
    backgroundColor: COLORS.warningRed,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  stopButtonText: {
    textAlign: 'center',
  },
});

export default MindfulMomentScreen;
