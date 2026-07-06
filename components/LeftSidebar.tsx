import React, { useState, useEffect, useRef } from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  ChecklistIcon, 
  UsersIcon, 
  FolderIcon, 
  BookOpenIcon, 
  RssIcon, 
  GraduationCapIcon, 
  XIcon, 
  ClipboardListIcon, 
  WorkflowIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BellIcon,
  SearchIcon
} from './icons';
import { View, User } from '../types';
import { useLanguage } from './LanguageContext';
import UserMenu from './UserMenu';
import { initialFileSystem } from './DriveView';
import { initialContacts } from './ContactsView';
import { mockTaskLists } from './TasklistView';
import { mockEvents } from './CalendarView';
import { mockMessages } from './ChatView';
import GlobalSearchResults from './GlobalSearchResults';

interface LeftSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  activeView: View;
  onNavigate: (view: View, section?: string) => void;
  user: User;
  onLogout: () => void;
  unreadCount?: number;
  onNotificationClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view?: View;
}

interface SearchResults {
  articles?: unknown[];
  files?: unknown[];
  contacts?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  messages?: unknown[];
  empty?: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onClose, 
  activeView, 
  onNavigate, 
  user,
  onLogout,
  unreadCount = 0,
  onNotificationClick
}) => {
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const performSearch = (query: string) => {
      if (!query) {
          setSearchResults(null);
          return;
      }
      const lowerQuery = query.toLowerCase();
      
      const results = {
          articles: [],
          files: initialFileSystem.filter(f => f.name.toLowerCase().includes(lowerQuery) && f.type !== 'folder'),
          contacts: initialContacts.filter(c => c.name.toLowerCase().includes(lowerQuery)),
          tasks: mockTaskLists.flatMap(list => list.tasks.filter(t => !t.completed && t.text.toLowerCase().includes(lowerQuery))),
          events: mockEvents.filter(e => e.title.toLowerCase().includes(lowerQuery)),
          messages: mockMessages.filter(m => m.content.toLowerCase().includes(lowerQuery)),
      };

      const hasResults = Object.values(results).some(arr => arr.length > 0);
      setSearchResults(hasResults ? results : { empty: true });
  };
  
  // Debounce search
  useEffect(() => {
      const handler = setTimeout(() => {
          performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setSearchResults(null);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: t('dashboard') || 'Trang chủ',
      icon: <HomeIcon className="w-5 h-5 text-indigo-500" />,
      view: 'dashboard'
    },
    {
      id: 'projects',
      label: 'Dự án',
      icon: <ChecklistIcon className="w-5 h-5 text-teal-600" />,
      view: 'projects'
    },
    {
      id: 'process',
      label: 'Quy trình',
      icon: <WorkflowIcon className="w-5 h-5 text-fuchsia-500" />,
      view: 'process'
    },
    {
      id: 'drive',
      label: t('drive') || 'Lưu trữ',
      icon: <FolderIcon className="w-5 h-5 text-yellow-500" />,
      view: 'drive'
    },
    {
      id: 'blog',
      label: t('blog') || 'Bài viết',
      icon: <BookOpenIcon className="w-5 h-5 text-emerald-500" />,
      view: 'blog'
    },
    {
      id: 'calendar',
      label: t('calendar') || 'Lịch hẹn',
      icon: <CalendarIcon className="w-5 h-5 text-red-500" />,
      view: 'calendar'
    },
    {
      id: 'contacts',
      label: t('contacts') || 'Danh bạ',
      icon: <UsersIcon className="w-5 h-5 text-cyan-500" />,
      view: 'contacts'
    },
    {
      id: 'newsfeed',
      label: t('newsfeed') || 'Bảng tin',
      icon: <RssIcon className="w-5 h-5 text-orange-500" />,
      view: 'newsfeed'
    },
    {
      id: 'training',
      label: t('training') || 'Đào tạo',
      icon: <GraduationCapIcon className="w-5 h-5 text-violet-500" />,
      view: 'training'
    },
    {
      id: 'requests',
      label: 'Yêu cầu',
      icon: <ClipboardListIcon className="w-5 h-5 text-rose-500" />,
      view: 'requests'
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.view) {
      onNavigate(item.view);
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-40 md:relative md:z-20 shrink-0 transition-all duration-300 ease-in-out md:transform-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <aside 
        style={{ 
          backgroundColor: 'rgba(var(--color-card-bg-rgb, 255, 255, 255), var(--sidebar-opacity, 1))',
          backdropFilter: 'blur(12px)'
        }}
        className={`relative flex flex-col p-4 h-full border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Toggle Button */}
        <button 
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hidden md:flex items-center justify-center shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all z-50 group"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-500 transition-transform" />
          ) : (
            <ChevronLeftIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-500 transition-transform" />
          )}
        </button>

        {/* Mobile close button */}
        <div className="flex items-center justify-end mb-4 md:hidden">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
            <XIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* TOP: Company Logo and Name */}
        <div className="flex flex-col items-center justify-center py-2 mb-4 border-b border-gray-100 dark:border-gray-800/50 w-full shrink-0">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center justify-center hover:opacity-95 active:scale-98 transition-all ${isCollapsed ? 'w-10 h-10' : 'w-full gap-3 px-2'}`}
          >
            <img 
              src="https://i.ibb.co/VcwGhfRp/Logo-mau-xanh-Lark-CV-Nguyen-H-ng-Th-i.png" 
              alt="Power Service" 
              className="w-10 h-10 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            {!isCollapsed && (
              <div className="flex flex-col text-left min-w-0">
                <span className="font-extrabold text-[13px] text-[#474DD3] dark:text-[#474DD3] tracking-tight uppercase whitespace-nowrap">
                  Power Service
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold text-[9px] leading-none tracking-wider uppercase mt-1">
                  SDP Platform
                </span>
              </div>
            )}
          </button>
        </div>

        {/* SEARCH BOX: only visible when sidebar is expanded */}
        {!isCollapsed && (
          <div ref={searchRef} className="w-full px-2 mb-4 relative shrink-0">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-[--color-text-subtle]" />
              </div>
              <input
                type="search"
                placeholder={t('searchAllPlaceholder') || "Tìm kiếm..."}
                className="w-full bg-[--color-surface-secondary] border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-[--color-accent-400] focus:ring-0 focus:outline-none placeholder:text-[--color-text-subtle] text-[--color-text-primary] rounded-xl py-2 pl-9 pr-3 transition-all duration-300 text-xs font-medium"
                aria-label={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            {isSearchFocused && searchQuery && (
               <div className="absolute left-2 right-2 top-full mt-1 z-[9999]">
                 <GlobalSearchResults
                    results={searchResults}
                    onNavigate={(view) => {
                      onNavigate(view);
                      handleCloseSearch();
                    }}
                    onClose={handleCloseSearch}
                 />
               </div>
            )}
          </div>
        )}

        {/* CENTER: Main Centered Navigation Items */}
        <nav className="flex-1 flex flex-col justify-start items-center gap-1.5 w-full overflow-y-auto scrollbar-none pr-1">
          {menuItems.map((item) => {
            const isActive = activeView === item.view;

            return (
              <div key={item.id} className="relative w-full flex items-center justify-center">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center transition-all duration-200 ${
                    isCollapsed 
                      ? 'w-12 h-12 justify-center rounded-xl animate-fade-in' 
                      : 'w-full gap-3.5 px-4 py-2.5 rounded-xl'
                  } ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100/50 dark:border-indigo-900/50' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-semibold truncate text-left leading-none">
                      {item.label}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* BOTTOM: Notifications, Settings, Profile */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-3.5 w-full items-center shrink-0">
          
          {/* Notifications Button */}
          <div className="w-full flex justify-center">
            <button
              onClick={onNotificationClick}
              className={`relative flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                isCollapsed 
                  ? 'w-11 h-11 justify-center rounded-xl' 
                  : 'w-full gap-3 px-4 py-2.5 rounded-xl'
              }`}
              title={isCollapsed ? "Thông báo" : undefined}
            >
              <div className="relative">
                <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Thông báo
                </span>
              )}
            </button>
          </div>


          {/* Profile Section (User Menu) */}
          <div className="w-full flex justify-center pt-1">
            <div className={`flex items-center w-full transition-all ${isCollapsed ? 'justify-center' : 'gap-3 px-2 py-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100/50 dark:border-gray-800/40'}`}>
              <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} direction="up" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate font-semibold uppercase tracking-wider mt-0.5">
                    {user.role || 'Thành viên'}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default LeftSidebar;
