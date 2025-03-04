import React from 'react';
import { Calendar, Image, Video, ChevronLeft, LayoutDashboard, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const mainMenuItems = [
    { id: 'schedule', icon: Calendar, label: 'Content Calendar' },
  ];

  const toolsMenuItems = [
    { id: 'image', icon: Image, label: 'Image Generator' },
    { id: 'video', icon: Video, label: 'Video Generator' },
  ];

  const renderMenuItem = (item: { id: string; icon: any; label: string }) => (
    <button
      key={item.id}
      onClick={() => onTabChange(item.id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
        activeTab === item.id
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <item.icon size={20} className={activeTab === item.id ? "text-indigo-600" : "text-gray-400"} />
      {item.label}
    </button>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-20 left-0 bottom-0 z-40 w-64 bg-white border-r transition-transform duration-300 lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute p-2 rounded-lg top-4 right-4 hover:bg-gray-100 lg:hidden"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* User section */}
          <div className="px-4 py-6 border-b">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                <span className="text-lg font-semibold text-indigo-600">SM</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">SM Manager</h3>
                <p className="text-xs text-gray-500">socialmedia@brandco.com</p>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            {/* Main menu section */}
            <div className="mb-8">
              <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Main Menu
              </h2>
              <div className="space-y-1">
                {mainMenuItems.map(renderMenuItem)}
              </div>
            </div>

            {/* Tools section */}
            <div className="mb-8">
              <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
               Content creation
              </h2>
              <div className="space-y-1">
                {toolsMenuItems.map(renderMenuItem)}
              </div>
            </div>


          </div>

          {/* Footer actions */}
          <div className="p-4 border-t">
            <div className="space-y-1">

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <HelpCircle size={20} className="text-gray-400" />
                Help & Support
              </button>

            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;