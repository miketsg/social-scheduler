import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Trash2, Edit, Check, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PostForm from './components/PostForm';
import CalendarView from './components/CalendarView';
import { Post } from './types';
import Sidebar from './components/Sidebar';
import GenerateImage from './components/GenerateImage';
import GenerateVideo from './components/GenerateVideo';
import { DashboardLayout } from './components/layout/DashboardLayout';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState<string>('');

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
    setDefaultDate(date);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsFormOpen(true);
    setDefaultDate(new Date().toISOString().split('T')[0]);
  };

  const handleEventClick = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleTabChange = (newTab: string) => {
    setIsFormOpen(false);
    setEditingPost(null);
    setActiveTab(newTab);
  };

  return (
    <DashboardLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      activeTab={activeTab}
    >
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 lg:ml-64">
        <main className="p-6">
          <div className="max-w-[1600px] mx-auto">
            {isFormOpen && activeTab === 'schedule' ? (
              <PostForm 
                onSubmit={handleAddPost} 
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingPost(null);
                  setDefaultDate('');
                }}
                initialData={editingPost}
                defaultDate={defaultDate}
              />
            ) : activeTab === 'schedule' ? (
              <>

                  <div className="space-y-6">
                    <div className="p-6 bg-white shadow-sm rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={handlePrevMonth}
                            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                          >
                            <ChevronLeft size={20} className="text-gray-600" />
                          </button>
                          <h3 className="text-lg font-medium text-gray-900">
                            {new Date(currentYear, currentMonth).toLocaleString('default', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </h3>
                          <button 
                            onClick={handleNextMonth}
                            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                          >
                            <ChevronRight size={20} className="text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={handleNewPost}
                          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                          <Plus size={20} />
                          <span>New Post</span>
                        </button>
                      </div>

                      <CalendarView 
                        posts={posts} 
                        currentMonth={currentMonth} 
                        currentYear={currentYear}
                        onDayClick={handleDayClick}
                        onEventClick={handleEventClick}
                      />
                    </div>
                    
                    <div className="p-6 bg-white shadow-sm rounded-xl">
                      <h3 className="mb-4 text-lg font-medium">Upcoming Posts</h3>
                      <div className="divide-y">
                        {posts.map(post => (
                          <div key={post.id} className="flex items-start justify-between py-4 group">
                            <div>
                              <h4 className="font-medium text-gray-800">{post.title}</h4>
                              <p className="mt-1 text-sm text-gray-500">{post.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">
                                  {post.frequency === 'once' 
                                    ? new Date(post.startDate).toLocaleDateString()
                                    : `Every ${post.frequency} starting ${new Date(post.startDate).toLocaleDateString()}`}
                                </span>

                              </div>
                            </div>
                            <div className="flex space-x-2 transition-opacity opacity-0 group-hover:opacity-100">
                              <button 
                                onClick={() => handleEditPost(post)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-indigo-600 hover:bg-indigo-50"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

              </>
            ) : activeTab === 'image' ? (
              <GenerateImage />
            ) : activeTab === 'video' ? (
              <GenerateVideo />
            ) : null}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}

export default App;