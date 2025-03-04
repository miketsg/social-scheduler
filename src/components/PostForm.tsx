import React, { useState, useEffect } from 'react';
import { X, Facebook, Twitter, Instagram, Linkedin, Wand2 } from 'lucide-react';
import { Post } from '../types';
import { useHashtagGenerator } from '../hooks/useHashtagGenerator';

interface PostFormProps {
  onSubmit: (post: Post) => void;
  onCancel: () => void;
  initialData: Post | null;
}

interface Platform {
  id: string;
  name: string;
  icon: React.FC<{ size?: number }>;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [startDate, setStartDate] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postTime, setPostTime] = useState('12:00');

  const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  ];

  const { isGenerating, generateHashtags, error } = useHashtagGenerator();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setFrequency(initialData.frequency);
      setStartDate(initialData.startDate);
    } else {
      // Set default date to today
      const today = new Date();
      setStartDate(today.toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startDate) return;
    
    onSubmit({
      id: initialData?.id || '',
      title,
      description,
      category,
      frequency,
      startDate,
      postTime,
      platforms: selectedPlatforms,
    });
  };

  const handleGenerateHashtags = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!description) {
      alert('Please add a description first');
      return;
    }

    try {
      const hashtags = await generateHashtags(description);
      setDescription(prev => `${prev}\n\n${hashtags}`);
    } catch (error) {
      alert('Failed to generate hashtags. Please try again.');
    }
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? 'Edit Post' : 'Create New Post'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
      <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Social Media Platforms
          </label>
          <div className="flex space-x-4">
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
                className={`p-3 rounded-lg border ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <platform.icon size={24} className={
                  selectedPlatforms.includes(platform.id) ? 'text-indigo-600' : 'text-gray-500'
                } />
              </button>
            ))}
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">

          
          <div>
            <label htmlFor="frequency" className="block mb-1 text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
          <label htmlFor="frequency" className="block mb-1 text-sm font-medium text-gray-700">
              Captions
            </label>
          <button
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
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          </div>
        </div>
        

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="postTime" className="block mb-1 text-sm font-medium text-gray-700">
              Time *
            </label>
            <input
              type="time"
              id="postTime"
              value={postTime}
              onChange={(e) => setPostTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;