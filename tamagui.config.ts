import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
import { createInterFont } from '@tamagui/font-inter'

// Create Nunito font (similar to Inter for now, you can replace with actual Nunito)
const nunitoFont = createInterFont()

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    heading: nunitoFont,
    body: nunitoFont,
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      // Design System Colors
      background: '#F8F9FA', // $offwhite
      backgroundHover: '#E9ECEF',
      backgroundPress: '#DEE2E6',
      backgroundFocus: '#CED4DA',
      backgroundStrong: '#FFFFFF',
      backgroundTransparent: 'transparent',
      
      // Primary Colors
      color: '#2C3E50', // $darkblue
      colorHover: '#34495E',
      colorPress: '#1A252F',
      colorFocus: '#1A252F',
      colorTransparent: 'transparent',
      
      // Accent Colors
      blue10: '#E3F2FD', // Light blue
      blue9: '#BBDEFB',
      blue8: '#90CAF9',
      blue7: '#64B5F6',
      blue6: '#42A5F5',
      blue5: '#2196F3', // Primary blue
      blue4: '#1E88E5',
      blue3: '#1976D2',
      blue2: '#1565C0',
      blue1: '#0D47A1',
      
      // Green for positive states
      green10: '#E8F5E8',
      green9: '#C8E6C9',
      green8: '#A5D6A7',
      green7: '#81C784',
      green6: '#66BB6A',
      green5: '#4CAF50',
      green4: '#43A047',
      green3: '#388E3C',
      green2: '#2E7D32',
      green1: '#1B5E20',
      
      // Red for negative states
      red10: '#FFEBEE',
      red9: '#FFCDD2',
      red8: '#EF9A9A',
      red7: '#E57373',
      red6: '#EF5350',
      red5: '#F44336',
      red4: '#E53935',
      red3: '#D32F2F',
      red2: '#C62828',
      red1: '#B71C1C',
      
      // Gray scale
      gray10: '#F8F9FA',
      gray9: '#E9ECEF',
      gray8: '#DEE2E6',
      gray7: '#CED4DA',
      gray6: '#ADB5BD',
      gray5: '#6C757D',
      gray4: '#495057',
      gray3: '#343A40',
      gray2: '#212529',
      gray1: '#000000',
    },
  },
  tokens: {
    ...config.tokens,
    // Custom spacing
    space: {
      ...config.tokens.space,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 44,
      12: 48,
      13: 52,
      14: 56,
      15: 60,
      16: 64,
    },
    // Custom radius
    radius: {
      ...config.tokens.radius,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
    },
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
