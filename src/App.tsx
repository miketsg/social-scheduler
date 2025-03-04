import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Trash2, Edit, Check } from 'lucide-react';
import PostForm from './components/PostForm';
import CalendarView from './components/CalendarView';
import { Post } from './types';
import Sidebar from './components/Sidebar';
import GenerateImage from './components/GenerateImage';

function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? post : p));
      setEditingPost(null);
    } else {
      setPosts([...posts, { 
        ...post, 
        id: Date.now().toString(),
        platforms: post.platforms || [],
        postTime: post.postTime || '12:00'
      }]);
    }
    setIsFormOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (date: string) => {
    setEditingPost(null);
    setIsFormOpen(true);
    // Pre-fill the date in the form
    const defaultPost: Partial<Post> = {
      startDate: date,
      postTime: '12:00',
      platforms: [],
      frequency: 'once'
    };
    setEditingPost(defaultPost as Post);
  };

  const handleEventClick = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="ml-64 flex-1">
        <header className="bg-white border-b p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'schedule' && 'Content Calendar'}
              {activeTab === 'image' && 'Generate Image'}
              {activeTab === 'video' && 'Generate Video'}
            </h1>
            {activeTab === 'schedule' && (
              <button
                onClick={() => {
                  setEditingPost(null);
                  setIsFormOpen(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} className="mr-1" /> New Post
              </button>
            )}
          </div>
        </header>

        <main className="p-6">
          {isFormOpen ? (
            <PostForm 
              onSubmit={handleAddPost} 
              onCancel={() => {
                setIsFormOpen(false);
                setEditingPost(null);
              }}
              initialData={editingPost}
            />
          ) : activeTab === 'schedule' ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Content Plan</h2>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    &lt;
                  </button>
                  <h3 className="text-lg font-medium">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No posts planned yet</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first content plan</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center font-medium hover:bg-indigo-700 transition-colors mx-auto"
                  >
                    <Plus size={18} className="mr-1" /> Add Your First Post
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <CalendarView 
                      posts={posts} 
                      currentMonth={currentMonth} 
                      currentYear={currentYear}
                      onDayClick={handleDayClick}
                      onEventClick={handleEventClick}
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium mb-4">All Planned Content</h3>
                    <div className="space-y-3">
                      {posts.map(post => (
                        <div key={post.id} className="border rounded-md p-4 flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{post.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{post.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {post.frequency === 'once' 
                                  ? new Date(post.startDate).toLocaleDateString() 
                                  : `Every ${post.frequency} starting ${new Date(post.startDate).toLocaleDateString()}`}
                              </span>
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditPost(post)}
                              className="text-gray-500 hover:text-indigo-600 p-1"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-gray-500 hover:text-red-600 p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : activeTab === 'image' ? (
            <GenerateImage />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Video Generation</h2>
              <p className="text-gray-600">Video generation feature coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;