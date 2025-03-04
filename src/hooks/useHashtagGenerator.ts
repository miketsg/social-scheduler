import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UseHashtagGeneratorReturn {
  isGenerating: boolean;
  generateHashtags: (description: string) => Promise<string>;
  error: string | null;
}

export const useHashtagGenerator = (): UseHashtagGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHashtags = async (description: string): Promise<string> => {
    if (!description) {
      throw new Error('Description is required');
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('API key is not configured');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Generate hashtags
      const prompt = `Generate 5-10 relevant hashtags for the following social media post. Return only the hashtags, separated by spaces, without any additional text or explanation:\n\n${description}`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],

      });

      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Failed to generate hashtags');
      }

      return text.trim();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate hashtags';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateHashtags,
    error
  };
}; 