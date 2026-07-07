import React, { useRef } from 'react';
import { 
  
  
} from 'lucide-react';
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
  WorkflowIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SearchIcon,
  TargetIcon,
  
  
} from './icons';
import { View, User } from '../types';
import { useLanguage } from './LanguageContext';
import UserMenu from './UserMenu';

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
  onSearchClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view?: View;
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
  onNotificationClick,
  onSearchClick
}) => {
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: 'erp', label: 'Quản trị', icon: <WorkflowIcon className="w-5 h-5 text-indigo-600" />, view: 'erp' },
    { id: 'objectives', label: 'Mục tiêu', icon: <TargetIcon className="w-5 h-5 text-red-500" />, view: 'objectives' },
    { id: 'projects', label: 'Dự án', icon: <ChecklistIcon className="w-5 h-5 text-teal-600" />, view: 'projects' },
    { id: 'process', label: 'Quy trình', icon: <WorkflowIcon className="w-5 h-5 text-fuchsia-500" />, view: 'process' },
    { id: 'drive', label: t('drive') || 'Lưu trữ', icon: <FolderIcon className="w-5 h-5 text-yellow-500" />, view: 'drive' },
    { id: 'calendar', label: 'Lịch hẹn', icon: <CalendarIcon className="w-5 h-5 text-red-500" />, view: 'calendar' },
    { id: 'contacts', label: t('contacts') || 'Danh bạ', icon: <UsersIcon className="w-5 h-5 text-cyan-500" />, view: 'contacts' },
    { id: 'newsfeed', label: t('newsfeed') || 'Bảng tin', icon: <RssIcon className="w-5 h-5 text-orange-500" />, view: 'newsfeed' },
    { id: 'blog', label: t('blog') || 'Bài viết', icon: <BookOpenIcon className="w-5 h-5 text-emerald-500" />, view: 'blog' },
    
    
    
    
    { id: 'training', label: 'Đào tạo', icon: <GraduationCapIcon className="w-5 h-5 text-violet-500" />, view: 'training' },
    { id: 'personnel', label: 'Nhân sự', icon: <UsersIcon className="w-5 h-5 text-blue-500" />, view: 'personnel' },
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
          backgroundColor: 'rgba(var(--color-card-bg-rgb, 255, 255, 255), var(--sidebar-opacity, 0.9))',
          backdropFilter: 'blur(12px)'
        }}
        className={`relative flex flex-col p-3 h-full border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-16' : 'w-[200px]'}`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end mb-4 md:hidden">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
            <XIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* PART 1: TOP (Company Logo and Name + Search trigger) */}
        <div className="flex flex-col items-center justify-center py-2 gap-3 mb-2 border-b border-gray-100 dark:border-gray-800/50 w-full shrink-0">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center hover:opacity-95 active:scale-98 transition-all ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full gap-3 px-4 justify-start'}`}
          >
            <img 
              src="https://i.ibb.co/VcwGhfRp/Logo-mau-xanh-Lark-CV-Nguyen-H-ng-Th-i.png" 
              alt="Power Service" 
              className="w-10 h-10 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            {!isCollapsed && (
              <div className="flex flex-col text-left min-w-0 animate-fade-in">
                <span className="font-extrabold text-[13px] text-[#474DD3] dark:text-[#474DD3] tracking-tight uppercase whitespace-nowrap">
                  Power Service
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold text-[9px] leading-none tracking-wider uppercase mt-1">
                  SDP Platform
                </span>
              </div>
            )}
          </button>

          {/* Search trigger icon + text layout */}
          <div className="w-full px-1">
            <button
              onClick={onSearchClick}
              className={`flex items-center transition-all duration-200 hover:scale-[1.02] ${
                isCollapsed 
                  ? 'w-10 h-10 mx-auto justify-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 shadow-sm' 
                  : 'w-[150px] gap-3 px-4 py-2.5 justify-start rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 shadow-sm'
              } text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800`}
              title="Tìm kiếm (Ctrl+K)"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <SearchIcon className="w-5 h-5 text-indigo-500" />
              </div>
              {!isCollapsed && (
                 <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate leading-none animate-fade-in">
                  Tìm kiếm
                 </span>
              )}
            </button>
          </div>
        </div>

        {/* PART 2: CENTER (Main Navigation Items) */}
        <nav className={`flex-1 flex flex-col gap-1 w-full overflow-y-auto scrollbar-none py-4 ${isCollapsed ? 'items-center justify-start' : 'justify-start items-stretch'}`}>
          {/* Standalone Dashboard (Trang chủ) at the top of list */}
          {isCollapsed ? (
            <div className="relative w-full flex justify-center mb-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-[1.05] ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100/50 dark:border-indigo-900/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title={t('dashboard') || 'Trang chủ'}
              >
                <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                  <HomeIcon className="w-5.5 h-5.5 text-indigo-500" />
                </div>
              </button>
            </div>
          ) : (
            <div className="relative w-full flex items-center justify-start animate-fade-in mb-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center w-full gap-3 px-4 py-2.5 justify-start rounded-xl transition-all duration-200 ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100/50 dark:border-indigo-900/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <HomeIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="text-sm font-semibold truncate text-left leading-none">
                  {t('dashboard') || 'Trang chủ'}
                </span>
              </button>
            </div>
          )}

          {menuItems.map((item) => {
            const isActive = activeView === item.view;

            if (isCollapsed) {
              return (
                <div key={item.id} className="relative w-full flex justify-center mt-1">
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-[1.05] ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100/50 dark:border-indigo-900/50' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title={item.label}
                  >
                    <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div key={item.id} className="relative w-full flex items-center justify-start animate-fade-in">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center w-full gap-3 px-4 py-2.5 justify-start rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100/50 dark:border-indigo-900/50' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold truncate text-left leading-none">
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* PART 3: BOTTOM (Profile & Long Collapse Toggle & Notifications) */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-col items-center justify-center w-full shrink-0">
          {/* 1. Long toggle button moved here from the floating border position */}
          <div className="w-full flex justify-center mb-1">
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                title="Mở rộng menu"
              >
                <ChevronRightIcon className="w-5 h-5 text-slate-500" />
              </button>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="flex items-center w-full gap-3 px-4 py-2.5 justify-start rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                title="Thu gọn menu"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
                </div>
                <span className="text-xs font-bold truncate text-left leading-none">
                  Thu gọn menu
                </span>
              </button>
            )}
          </div>

          {/* 2. Notification icon only visible when unreadCount > 0 */}
          {unreadCount > 0 && onNotificationClick && (
            <div className="w-full flex justify-center mb-1">
              {isCollapsed ? (
                <button
                  onClick={onNotificationClick}
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-all"
                  title={`Có ${unreadCount} thông báo mới`}
                >
                  <div className="relative">
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                      {unreadCount}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={onNotificationClick}
                  className="relative flex items-center w-full gap-3 px-4 py-2.5 justify-start rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-all shadow-sm"
                  title="Xem thông báo"
                >
                  <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-900 animate-ping" />
                  </div>
                  <span className="text-xs font-bold truncate text-left leading-none">
                    Thông báo mới ({unreadCount})
                  </span>
                </button>
              )}
            </div>
          )}

          {/* 3. User Profile Container */}
          <div className="w-full flex justify-center pt-1">
            <div className={`flex items-center transition-all ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full gap-3 px-4 py-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100/50 dark:border-gray-800/40'}`}>
              <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} direction="up" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex flex-col text-left animate-fade-in">
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
