import { useState } from 'react';

interface UseImageGeneratorReturn {
  isGenerating: boolean;
  generateImage: (prompt: string) => Promise<string>;
  error: string | null;
}

export const useImageGenerator = (): UseImageGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string): Promise<string> => {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      throw new Error('API key is not configured');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 30,
              guidance_scale: 7.5,
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateImage,
    error
  };
}; 