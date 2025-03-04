import React, { ReactNode } from 'react';
import { Menu, Bell, Settings, User, Search } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  isSidebarOpen,
  toggleSidebar,
  activeTab,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-gray-800">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
            >
              <Menu size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">🎉 Social scheduler  </span>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 hidden max-w-xl mx-12 md:block">
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">

            <div className="w-px h-8 mx-2 bg-gray-600"></div>
            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-lg">
                <User size={20} className="text-gray-300" />
              </div>
              <span className="hidden text-sm font-medium text-gray-300 md:block">SM Manager</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex pt-20">
        {children}
      </div>
    </div>
  );
};