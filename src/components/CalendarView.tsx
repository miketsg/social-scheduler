import React from 'react';
import { Post } from '../types';
import { Plus } from 'lucide-react';

interface CalendarViewProps {
  posts: Post[];
  currentMonth: number;
  currentYear: number;
  onDayClick: (date: string) => void;
  onEventClick: (post: Post) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  posts, 
  currentMonth, 
  currentYear,
  onDayClick,
  onEventClick
}) => {
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create calendar days array
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Add empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  
  // Combine empty cells and calendar days
  const allCells = [...emptyCells, ...calendarDays];
  
  // Function to check if a post should appear on a specific day
  const getPostsForDay = (day: number): Post[] => {
    return posts.filter(post => {
      const postDate = new Date(post.startDate);
      
      // For "once" posts, check if the date matches
      if (post.frequency === 'once') {
        return (
          postDate.getDate() === day &&
          postDate.getMonth() === currentMonth &&
          postDate.getFullYear() === currentYear
        );
      }
      
      // For recurring posts
      const startDate = new Date(post.startDate);
      
      // If the start date is in the future compared to the current calendar month/year, skip
      if (
        startDate.getFullYear() > currentYear ||
        (startDate.getFullYear() === currentYear && startDate.getMonth() > currentMonth)
      ) {
        return false;
      }
      
      // Daily posts appear every day after the start date
      if (post.frequency === 'daily') {
        return true;
      }
      
      // Weekly posts
      if (post.frequency === 'weekly') {
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        return dayOfWeek === startDate.getDay();
      }
      
      // Monthly posts
      if (post.frequency === 'monthly') {
        return day === startDate.getDate();
      }
      
      return false;
    });
  };

  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {allCells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-md"></div>;
          }
          
          const postsForDay = getPostsForDay(day);
          const isToday = 
            day === new Date().getDate() && 
            currentMonth === new Date().getMonth() && 
            currentYear === new Date().getFullYear();
          
          const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
          
          return (
            <div 
              key={`day-${day}`} 
              className={`h-24 border rounded-md p-1 overflow-hidden relative group cursor-pointer
                ${isToday ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                hover:border-indigo-300 hover:shadow-sm transition-all
              `}
              onClick={(e) => {
                // Only trigger new post if clicking empty space
                if ((e.target as HTMLElement).closest('.event-item')) return;
                onDayClick(dateString);
              }}
            >
              <div className={`text-right text-sm mb-1 ${isToday ? 'font-bold' : ''}`}>
                {day}
              </div>
              
              {/* Add post button - shows on hover */}
              <button 
                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDayClick(dateString);
                }}
              >
                <Plus size={16} className="text-indigo-600" />
              </button>

              <div className="overflow-y-auto h-16">
                {postsForDay.map(post => (
                  <div 
                    key={`${post.id}-${day}`} 
                    className="event-item text-xs p-1 mb-1 rounded truncate cursor-pointer hover:opacity-75 transition-opacity"
                    style={{
                      backgroundColor: stringToColor(post.category + post.title, 0.2),
                      color: stringToColor(post.category + post.title, 1)
                    }}
                    title={`${post.title} - ${post.description}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(post);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>{post.postTime}</span>
                      <span className="truncate">{post.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Function to generate a color based on a string
const stringToColor = (str: string, opacity: number = 1): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = hash % 360;
  return `hsla(${h}, 70%, 40%, ${opacity})`;
};

export default CalendarView;