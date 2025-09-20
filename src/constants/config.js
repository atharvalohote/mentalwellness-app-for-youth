// Google Gen AI Configuration
export const GOOGLE_AI_CONFIG = {
  // Replace with your actual Google AI API key
  API_KEY: 'AIzaSyD15cCs8Dlm1eBciuJR8BuMR8ZXOL--0VM',
  // Gemini model configuration
  MODEL_NAME: 'gemini-2.5-flash',
  // Generation configuration optimized for Gemini 2.5 Flash
  GENERATION_CONFIG: {
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'SanityAI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Google Gen AI Exchange Hackathon Project',
};
