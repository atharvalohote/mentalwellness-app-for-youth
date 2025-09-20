// Design System Constants for Mindful AI Companion

export const COLORS = {
  // Primary Colors
  offwhite: '#FFF8F0',
  darkblue: '#2D1B69',
  
  // Fun Vibrant Colors
  primaryBlue: '#6C5CE7',
  lightBlue: '#A29BFE',
  successGreen: '#00B894',
  warningRed: '#E17055',
  
  // Fun Accent Colors
  purple: '#6C5CE7',
  pink: '#FD79A8',
  orange: '#FDCB6E',
  teal: '#00CEC9',
  yellow: '#FDCB6E',
  mint: '#00B894',
  
  // Chat Bubbles
  userBubble: '#6C5CE7',
  aiBubble: '#F8F9FA',
  
  // Text Colors
  primaryText: '#2D1B69',
  secondaryText: '#636E72',
  lightText: '#B2BEC3',
  
  // Background Colors
  cardBackground: '#FFFFFF',
  modalBackground: 'rgba(45, 27, 105, 0.3)',
  
  // Fun Gradient Colors
  gradientStart: '#6C5CE7',
  gradientEnd: '#A29BFE',
  
  // Additional Fun Colors
  borderColor: '#E9ECEF',
  shadowColor: '#6C5CE7',
  disabledColor: '#DDD6FE',
} as const

export const TYPOGRAPHY = {
  // Default font family - Nunito will be used everywhere by default
  defaultFontFamily: 'Nunito_400Regular',
  fontFamily: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

// Default text styles that can be used across the app
export const DEFAULT_TEXT_STYLES = {
  regular: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primaryText,
  },
  medium: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primaryText,
  },
  semibold: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primaryText,
  },
  bold: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.primaryText,
  },
} as const

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const

// Layout constraints for consistent spacing and responsive design
export const LAYOUT = {
  // Safe area constraints
  safeAreaHorizontal: SPACING.lg,
  safeAreaVertical: SPACING.lg,
  
  // Content constraints
  maxContentWidth: 400,
  minContentWidth: 280,
  
  // Card constraints
  cardMinHeight: 80,
  cardMaxHeight: 200,
  
  // Button constraints
  buttonMinHeight: 48,
  buttonMaxHeight: 60,
  
  // Input constraints
  inputMinHeight: 48,
  inputMaxHeight: 120,
  
  // Header constraints
  headerHeight: 60,
  tabBarHeight: 80,
  
  // Grid constraints
  gridItemMinWidth: 150,
  gridItemMaxWidth: 200,
  
  // Animation constraints
  animationDuration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Z-index layers
  zIndex: {
    background: 0,
    content: 1,
    header: 10,
    modal: 100,
    toast: 1000,
  },
} as const

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const

// Button Styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primaryBlue,
    color: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    ...SHADOWS.sm,
  },
  secondary: {
    backgroundColor: 'transparent',
    color: COLORS.primaryBlue,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBlue,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  sos: {
    backgroundColor: COLORS.warningRed,
    color: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    ...SHADOWS.sm,
  },
} as const

// Card Styles
export const CARD_STYLES = {
  default: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    ...SHADOWS.sm,
  },
  bouncy: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    ...SHADOWS.sm,
    transform: [{ scale: 1 }],
  },
} as const

// Chat Bubble Styles
export const CHAT_BUBBLE_STYLES = {
  user: {
    backgroundColor: COLORS.userBubble,
    color: '#FFFFFF',
    alignSelf: 'flex-end' as const,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.xs,
    maxWidth: '80%',
    ...SHADOWS.sm,
  },
  ai: {
    backgroundColor: COLORS.aiBubble,
    color: COLORS.primaryText,
    alignSelf: 'flex-start' as const,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.xs,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
} as const
