import React, { useState, useEffect } from 'react';
import { Download, Wand2 } from 'lucide-react';
import { useImageGenerator } from '../hooks/useImageGenerator';

const GenerateImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { isGenerating, generateImage, error } = useImageGenerator();

  // Cleanup object URL when component unmounts or new image is generated
  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      return;
    }

    try {
      const imageUrl = await generateImage(prompt);
      // Cleanup previous object URL if it exists
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Generate Image</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left side - Prompt input */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <form onSubmit={handleGenerateImage}>
              <div className="mb-4">
                <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-700">
                  Enter your prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={6}
                  placeholder="Describe the image you want to generate..."
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white transition-colors ${
                  isGenerating
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Wand2 size={20} />
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>

              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </form>
          </div>

          {/* Right side - Generated image */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col h-full">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Generated Image</h3>
              
              {generatedImage ? (
                <>
                  <div className="relative flex-1 mb-4">
                    <img
                      src={generatedImage}
                      alt="Generated content"
                      className="object-contain w-full h-full rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors bg-gray-800 rounded-md hover:bg-gray-900"
                  >
                    <Download size={20} />
                    Download Image
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                   Image generation might take 30s - 1 minute
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImage;