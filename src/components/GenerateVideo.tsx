import React, { useState, useRef } from 'react';
import { Player } from '@remotion/player';
import { Music, Upload, Video, X, Wand2 } from 'lucide-react';
import { VideoComposition } from './video/VideoComposition';

const GenerateVideo: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index]);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeAudio = () => {
    if (audio) {
      URL.revokeObjectURL(audio);
      setAudio(null);
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setIsGenerating(true);
    try {
      // Video generation logic will go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Generate Video</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left side - Upload controls */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Upload multiple images</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Uploaded ${index + 1}`}
                      className="object-cover w-full h-24 rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={imageInputRef}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400"
              >
                <Upload size={20} />
                Upload Images
              </button>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Upload Audio</h3>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={audioInputRef}
                onChange={handleAudioUpload}
              />
              {audio ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Music size={20} className="text-indigo-600" />
                    <span className="text-sm text-gray-600">Audio uploaded</span>
                  </div>
                  <button
                    onClick={removeAudio}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => audioInputRef.current?.click()}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400"
                >
                  <Music size={20} />
                  Upload Audio
                </button>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                max="60"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={images.length === 0 || isGenerating}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-md transition-colors ${
                images.length === 0 || isGenerating
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Wand2 size={20} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </button>
          </div>

          {/* Right side - Preview */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-gray-700">Preview</h3>
            {images.length > 0 && audio ? (
              <div className="overflow-hidden bg-black rounded-lg aspect-video">
                <Player
                  component={VideoComposition}
                  durationInFrames={duration * 30}
                  fps={30}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  controls
                  inputProps={{
                    images,
                    audio,
                    duration,
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg aspect-video bg-gray-50">
                <div className="text-center text-gray-500">
                  <Video size={40} className="mx-auto mb-2" />
                  <p>Upload images and audio to preview video</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateVideo; 