import { TherapyCategory, Therapy, AIPersonality } from '../types/therapy';
import { COLORS } from '../constants/designSystem';

export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah Chen',
    description: 'Licensed therapist specializing in CBT and mindfulness',
    tone: 'professional',
    expertise: ['CBT', 'Mindfulness', 'Anxiety', 'Depression'],
    greeting: 'Hello! I\'m Dr. Sarah, your cognitive behavioral therapy guide. How can I help you today?',
    color: COLORS.teal,
    avatar: '👩‍⚕️',
  },
  {
    id: 'maya',
    name: 'Maya',
    description: 'Warm and empathetic counselor for emotional support',
    tone: 'empathetic',
    expertise: ['Emotional Support', 'Trauma', 'Relationships', 'Self-Care'],
    greeting: 'Hi there! I\'m Maya, and I\'m here to listen and support you through whatever you\'re experiencing.',
    color: COLORS.pink,
    avatar: '🤗',
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Motivational coach for personal growth and development',
    tone: 'motivational',
    expertise: ['Goal Setting', 'Motivation', 'Habits', 'Personal Growth'],
    greeting: 'Hey! I\'m Alex, your personal growth coach. Ready to unlock your potential?',
    color: COLORS.purple,
    avatar: '💪',
  },
  {
    id: 'zen-master',
    name: 'Zen Master Li',
    description: 'Meditation and mindfulness teacher',
    tone: 'warm',
    expertise: ['Meditation', 'Mindfulness', 'Stress Relief', 'Spiritual Growth'],
    greeting: 'Welcome, seeker. I am Master Li, your guide to inner peace and mindfulness.',
    color: COLORS.lightBlue,
    avatar: '🧘‍♂️',
  },
  {
    id: 'art-therapist',
    name: 'Luna',
    description: 'Creative arts therapist for expressive healing',
    tone: 'playful',
    expertise: ['Art Therapy', 'Creative Expression', 'Emotional Processing', 'Self-Discovery'],
    greeting: 'Hello, creative soul! I\'m Luna, your art therapy companion. Let\'s explore your inner world through creativity.',
    color: COLORS.yellow,
    avatar: '🎨',
  },
];

export const THERAPY_CATEGORIES: TherapyCategory[] = [
  {
    id: 'cognitive',
    name: 'Cognitive Therapy (CBT)',
    description: 'Healing by changing unhelpful thought patterns',
    icon: 'construct',
    color: COLORS.teal,
    therapies: [
      {
        id: 'cbt-basics',
        name: 'Challenge a Negative Thought',
        description: 'Structured process to interrupt spiraling thoughts and build mental resilience',
        duration: 15,
        difficulty: 'Beginner',
        category: 'cognitive',
        icon: 'refresh-circle',
        color: COLORS.teal,
        benefits: ['Stop spiraling thoughts', 'Fight perfectionism', 'Build mental resilience'],
        sessionType: 'cbt-challenge',
        aiPersonality: 'dr-sarah',
        estimatedSessions: 1,
        tags: ['CBT', 'Thought Challenge', 'Resilience'],
      },
      {
        id: 'anxiety-management',
        name: 'Anxiety Management',
        description: 'Tools and techniques to manage anxiety and worry',
        duration: 25,
        difficulty: 'Intermediate',
        category: 'cognitive',
        icon: 'shield-checkmark',
        color: COLORS.lightBlue,
        benefits: ['Reduce anxiety symptoms', 'Learn coping strategies', 'Build confidence'],
        sessionType: 'interactive',
        aiPersonality: 'dr-sarah',
        estimatedSessions: 6,
        tags: ['Anxiety', 'Coping Strategies', 'Relaxation'],
      },
    ],
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Meditation (MBSR)',
    description: 'Healing by grounding yourself in the present moment',
    icon: 'leaf',
    color: COLORS.lightBlue,
    therapies: [
      {
        id: 'mindfulness-basics',
        name: '1-Minute Breathing Exercise',
        description: 'Full-screen visualizer with animated breathing circle for immediate calm',
        duration: 1,
        difficulty: 'Beginner',
        category: 'mindfulness',
        icon: 'radio-button-on',
        color: COLORS.lightBlue,
        benefits: ['Immediate anxiety relief', 'Pre-event calm', 'Better sleep'],
        sessionType: 'breathing',
        aiPersonality: 'zen-master',
        estimatedSessions: 1,
        tags: ['Mindfulness', 'Anxiety Relief', 'Focus'],
      },
      {
        id: 'meditation-journey',
        name: 'Meditation Journey',
        description: 'Progressive meditation practices for inner peace',
        duration: 20,
        difficulty: 'Intermediate',
        category: 'mindfulness',
        icon: 'flower',
        color: COLORS.teal,
        benefits: ['Deep relaxation', 'Mental clarity', 'Emotional balance'],
        sessionType: 'guided',
        aiPersonality: 'zen-master',
        estimatedSessions: 7,
        tags: ['Meditation', 'Relaxation', 'Inner Peace'],
      },
    ],
  },
  {
    id: 'creative',
    name: 'Creative Therapy (Art & Narrative)',
    description: 'Healing by expressing complex emotions non-verbally',
    icon: 'brush',
    color: COLORS.pink,
    therapies: [
      {
        id: 'art-therapy',
        name: 'Express with Art',
        description: 'Give voice to unspeakable feelings through visual expression',
        duration: 30,
        difficulty: 'Beginner',
        category: 'creative',
        icon: 'brush',
        color: COLORS.pink,
        benefits: ['Voice unspeakable feelings', 'Understand yourself better', 'Create healing record'],
        sessionType: 'art',
        aiPersonality: 'art-therapist',
        estimatedSessions: 6,
        tags: ['Art', 'Emotional Expression', 'Healing Gallery'],
      },
      {
        id: 'journal-therapy',
        name: 'Journal Therapy',
        description: 'Therapeutic writing for self-reflection and healing',
        duration: 20,
        difficulty: 'Beginner',
        category: 'creative',
        icon: 'book',
        color: COLORS.lightBlue,
        benefits: ['Self-reflection', 'Emotional processing', 'Personal growth'],
        sessionType: 'interactive',
        aiPersonality: 'maya',
        estimatedSessions: 8,
        tags: ['Writing', 'Reflection', 'Self-Discovery'],
      },
    ],
  },
  {
    id: 'behavioral',
    name: 'Behavioral Therapy',
    description: 'Change behaviors and build positive habits',
    icon: 'trending-up',
    color: COLORS.purple,
    therapies: [
      {
        id: 'habit-building',
        name: 'Habit Building',
        description: 'Science-based approach to building positive habits',
        duration: 15,
        difficulty: 'Beginner',
        category: 'behavioral',
        icon: 'checkmark-circle',
        color: COLORS.purple,
        benefits: ['Build positive habits', 'Break bad habits', 'Achieve goals'],
        sessionType: 'interactive',
        aiPersonality: 'alex',
        estimatedSessions: 6,
        tags: ['Habits', 'Goals', 'Behavior Change'],
      },
      {
        id: 'stress-management',
        name: 'Stress Management',
        description: 'Comprehensive stress reduction techniques',
        duration: 20,
        difficulty: 'Intermediate',
        category: 'behavioral',
        icon: 'shield',
        color: COLORS.teal,
        benefits: ['Reduce stress', 'Improve resilience', 'Better coping'],
        sessionType: 'guided',
        aiPersonality: 'dr-sarah',
        estimatedSessions: 7,
        tags: ['Stress', 'Resilience', 'Coping'],
      },
    ],
  },
];

export const getTherapyById = (id: string): Therapy | undefined => {
  for (const category of THERAPY_CATEGORIES) {
    const therapy = category.therapies.find(t => t.id === id);
    if (therapy) return therapy;
  }
  return undefined;
};

export const getAIPersonalityById = (id: string): AIPersonality | undefined => {
  return AI_PERSONALITIES.find(p => p.id === id);
};

export const getTherapiesByCategory = (categoryId: string): Therapy[] => {
  const category = THERAPY_CATEGORIES.find(c => c.id === categoryId);
  return category ? category.therapies : [];
};

export const getRecommendedTherapies = (mood: string, experience: string = 'beginner'): Therapy[] => {
  const allTherapies = THERAPY_CATEGORIES.flatMap(category => category.therapies);
  
  // Filter by experience level
  const filteredTherapies = allTherapies.filter(therapy => {
    if (experience === 'beginner') {
      return therapy.difficulty === 'Beginner';
    } else if (experience === 'intermediate') {
      return therapy.difficulty === 'Beginner' || therapy.difficulty === 'Intermediate';
    }
    return true; // Advanced users can access all therapies
  });

  // Mood-based recommendations
  const moodRecommendations: { [key: string]: string[] } = {
    anxious: ['cbt-basics', 'mindfulness-basics', 'stress-management'],
    sad: ['art-therapy', 'journal-therapy'],
    stressed: ['stress-management', 'meditation-journey'],
    angry: ['art-therapy', 'mindfulness-basics', 'stress-management'],
    tired: ['meditation-journey', 'mindfulness-basics'],
    happy: ['habit-building', 'art-therapy', 'journal-therapy'],
    calm: ['journal-therapy', 'art-therapy', 'mindfulness-basics', 'meditation-journey'],
    excited: ['habit-building', 'art-therapy', 'journal-therapy'],
  };

  const recommendedIds = moodRecommendations[mood] || [];
  const recommended = filteredTherapies.filter(therapy => recommendedIds.includes(therapy.id));
  
  // Add some general recommendations if not enough mood-specific ones
  if (recommended.length < 3) {
    const general = filteredTherapies.filter(therapy => !recommendedIds.includes(therapy.id));
    recommended.push(...general.slice(0, 3 - recommended.length));
  }

  return recommended;
};
