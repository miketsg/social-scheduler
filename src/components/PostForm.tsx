import React, { useState, useEffect, useRef } from 'react';
import { X, Facebook, Twitter, Instagram, Linkedin, Wand2, Upload } from 'lucide-react';
import { Post } from '../types';
import { useHashtagGenerator } from '../hooks/useHashtagGenerator';

interface PostFormProps {
  onSubmit: (post: Post) => void;
  onCancel: () => void;
  initialData: Post | null;
  defaultDate?: string;
}

interface Platform {
  id: string;
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onCancel, initialData, defaultDate }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>(initialData?.frequency || 'once');
  const [startDate, setStartDate] = useState(initialData?.startDate || defaultDate || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData?.platforms || []);
  const [postTime, setPostTime] = useState(initialData?.postTime || '12:00');
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  ];

  const { isGenerating, generateHashtags, error } = useHashtagGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startDate || !postTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if at least one platform is selected
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one social media platform');
      return;
    }
    
    const post: Post = {
      id: initialData?.id || Date.now().toString(),
      title,
      description,
      frequency,
      startDate,
      platforms: selectedPlatforms,
      postTime,
    };

    try {
      onSubmit(post);
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleGenerateHashtags = async () => {
    if (!description) {
      alert('Please enter a description first');
      return;
    }

    try {
      const generatedHashtags = await generateHashtags(description);
      setDescription(prev => `${prev}\n\n${generatedHashtags}`);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
      setImage(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="pb-4 mb-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Post' : 'Schedule a Post'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to schedule your social media post
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left section - Image preview or upload */}
        <div className="order-last lg:order-first">
          {image ? (
            <div className="relative aspect-video group">
              <img
                src={image}
                alt="Upload preview"
                className="object-cover w-full h-full rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute p-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-4 right-4 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={imageInputRef}
                onChange={handleImageUpload}
              />
        <button 
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-6 text-gray-500 transition-colors hover:text-gray-600"
              >
                <Upload size={40} />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload an image</p>
                  <p className="text-xs">PNG, JPG up to 10MB</p>
                </div>
        </button>
            </div>
          )}
      </div>
      
        {/* Right section - Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Content
          </label>
              <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
                  rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
          />
        </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'once' | 'daily' | 'weekly' | 'monthly')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Captions
                </label>
                <button
                  type="button"
                  onClick={handleGenerateHashtags}
                  disabled={isGenerating}
                  className={`w-full px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                    isGenerating 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Wand2 size={16} />
                  {isGenerating ? 'Generating...' : 'Generate hashtags'}
                </button>
        </div>
        
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Post Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Post Time
                </label>
                <input
                  type="time"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatforms(prev =>
                        prev.includes(platform.id)
                          ? prev.filter(id => id !== platform.id)
                          : [...prev, platform.id]
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <platform.icon size={20} className={
                      selectedPlatforms.includes(platform.id) ? 'text-indigo-600' : 'text-gray-500'
                    } />
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
                className="w-full px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
                className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;