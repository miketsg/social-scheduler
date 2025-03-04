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
  icon: React.FC<{ size?: number; className?: string }>;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>(initialData?.frequency || 'once');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData?.platforms || []);
  const [postTime, setPostTime] = useState(initialData?.postTime || '12:00');

  const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  ];

  const { isGenerating, generateHashtags, error } = useHashtagGenerator();

  useEffect(() => {
    if (!initialData) {
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !startDate || !postTime) {
      alert('Please fill in all required fields');
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
            Description
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-2">
            <div className="flex-1">
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

            {/* <div className="pt-8">
              <button
                type="button"
                onClick={handleGenerateHashtags}
                disabled={isGenerating}
                className="p-2 text-gray-500 transition-colors border border-gray-300 rounded-md hover:text-indigo-600 hover:border-indigo-600"
                title="Generate hashtags"
              >
                <Wand2 size={20} className={isGenerating ? 'animate-spin' : ''} />
              </button>
            </div> */}





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