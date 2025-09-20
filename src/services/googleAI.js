import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_AI_CONFIG } from '../constants/config';
import NetInfo from '@react-native-community/netinfo';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(GOOGLE_AI_CONFIG.API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ 
  model: GOOGLE_AI_CONFIG.MODEL_NAME,
  generationConfig: GOOGLE_AI_CONFIG.GENERATION_CONFIG,
});

// Helper function to check network connectivity
const checkNetworkConnectivity = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected && netInfo.isInternetReachable;
  } catch (error) {
    console.error('Error checking network connectivity:', error);
    return false;
  }
};

// Helper function to retry API calls with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a network error
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
          throw new Error('No internet connection. Please check your network and try again.');
        }
      }
      
      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export class GoogleAIService {
  /**
   * Generate text using Google's Gemini model
   * @param {string} prompt - The input prompt
   * @returns {Promise<string>} - Generated text response
   */
  static async generateText(prompt) {
    try {
      // Validate API key
      if (!GOOGLE_AI_CONFIG.API_KEY || GOOGLE_AI_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Google AI API key is not configured. Please set your API key in the config file.');
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating text:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Google AI API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw new Error('Failed to generate text. Please check your API key and try again.');
      }
    }
  }

  /**
   * Generate text with streaming response
   * @param {string} prompt - The input prompt
   * @param {function} onChunk - Callback function for each chunk
   * @returns {Promise<void>}
   */
  static async generateTextStream(prompt, onChunk) {
    try {
      // Validate API key
      if (!GOOGLE_AI_CONFIG.API_KEY || GOOGLE_AI_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Google AI API key is not configured. Please set your API key in the config file.');
      }

      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('Error generating streaming text:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Google AI API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw new Error('Failed to generate streaming text. Please check your API key and try again.');
      }
    }
  }

  /**
   * Chat with context (conversation history)
   * @param {Array} chatHistory - Array of {role: 'user'|'model', parts: [{text: string}]}
   * @param {string} newMessage - New user message
   * @returns {Promise<string>} - Model response
   */
  static async chatWithHistory(chatHistory, newMessage) {
    // Validate API key first
    if (!GOOGLE_AI_CONFIG.API_KEY || GOOGLE_AI_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('Google AI API key is not configured. Please set your API key in the config file.');
    }

    // Check network connectivity
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    return retryWithBackoff(async () => {
      try {
        const chat = model.startChat({
          history: chatHistory,
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Error in chat:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Network request failed')) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        } else if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your Google AI API key configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else {
          throw new Error('Failed to process chat. Please check your API key and try again.');
        }
      }
    });
  }
}
