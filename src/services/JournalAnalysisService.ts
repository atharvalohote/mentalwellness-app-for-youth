import { GoogleAIService } from './googleAI';

export interface JournalAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
}

export class JournalAnalysisService {
  private static instance: JournalAnalysisService;
  private googleAI: GoogleAIService;

  private constructor() {
    this.googleAI = new GoogleAIService();
  }

  public static getInstance(): JournalAnalysisService {
    if (!JournalAnalysisService.instance) {
      JournalAnalysisService.instance = new JournalAnalysisService();
    }
    return JournalAnalysisService.instance;
  }

  /**
   * Analyze a journal entry to extract sentiment and relevant tags
   */
  async analyzeJournalEntry(content: string): Promise<JournalAnalysis> {
    try {
      const prompt = `Analyze the following journal entry. Determine the primary sentiment (positive, negative, or neutral) and extract up to 3 relevant tags that summarize the main topics. Return this as a JSON object with the keys 'sentiment' and 'tags'.

Journal entry: "${content}"

Please respond with only a valid JSON object in this exact format:
{
  "sentiment": "positive|negative|neutral",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const response = await GoogleAIService.generateText(prompt);
      
      // Parse the JSON response
      const analysis = JSON.parse(response);
      
      // Validate the response structure
      if (!analysis.sentiment || !analysis.tags || !Array.isArray(analysis.tags)) {
        throw new Error('Invalid analysis response format');
      }

      // Ensure sentiment is one of the expected values
      if (!['positive', 'negative', 'neutral'].includes(analysis.sentiment)) {
        analysis.sentiment = 'neutral';
      }

      // Ensure tags is an array of strings and limit to 3
      analysis.tags = analysis.tags
        .filter((tag: any) => typeof tag === 'string' && tag.trim().length > 0)
        .slice(0, 3)
        .map((tag: string) => tag.toLowerCase().trim());

      return analysis as JournalAnalysis;
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      
      // Return default analysis on error
      return {
        sentiment: 'neutral',
        tags: ['journal', 'entry']
      };
    }
  }

  /**
   * Get sentiment emoji based on analysis
   */
  getSentimentEmoji(sentiment: string): string {
    const sentimentEmojis: { [key: string]: string } = {
      positive: '😊',
      negative: '😔',
      neutral: '😐',
    };
    return sentimentEmojis[sentiment] || '😐';
  }

  /**
   * Get sentiment color based on analysis
   */
  getSentimentColor(sentiment: string): string {
    const sentimentColors: { [key: string]: string } = {
      positive: '#4CAF50', // Green
      negative: '#F44336', // Red
      neutral: '#9E9E9E', // Gray
    };
    return sentimentColors[sentiment] || '#9E9E9E';
  }
}

export default JournalAnalysisService;
