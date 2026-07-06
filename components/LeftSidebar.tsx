import React, { useRef } from 'react';
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
  SearchIcon,
  TargetIcon
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

interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
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
  onSearchClick
}) => {
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuGroups: MenuGroup[] = [
    {
      id: 'work_goals',
      title: 'Công việc & Mục tiêu',
      items: [
        { id: 'dashboard', label: t('dashboard') || 'Trang chủ', icon: <HomeIcon className="w-5 h-5 text-indigo-500" />, view: 'dashboard' },
        { id: 'objectives', label: 'Mục tiêu (OKRs)', icon: <TargetIcon className="w-5 h-5 text-red-500" />, view: 'objectives' },
        { id: 'projects', label: 'Dự án', icon: <ChecklistIcon className="w-5 h-5 text-teal-600" />, view: 'projects' },
        { id: 'process', label: 'Quy trình', icon: <WorkflowIcon className="w-5 h-5 text-fuchsia-500" />, view: 'process' },
        { id: 'requests', label: 'Yêu cầu', icon: <ClipboardListIcon className="w-5 h-5 text-rose-500" />, view: 'requests' }
      ]
    },
    {
      id: 'comm_internal',
      title: 'Giao tiếp & Nội bộ',
      items: [
        { id: 'newsfeed', label: t('newsfeed') || 'Bảng tin', icon: <RssIcon className="w-5 h-5 text-orange-500" />, view: 'newsfeed' },
        { id: 'blog', label: t('blog') || 'Bài viết', icon: <BookOpenIcon className="w-5 h-5 text-emerald-500" />, view: 'blog' },
        { id: 'training', label: t('training') || 'Đào tạo', icon: <GraduationCapIcon className="w-5 h-5 text-violet-500" />, view: 'training' }
      ]
    },
    {
      id: 'personal_utils',
      title: 'Cá nhân & Tiện ích',
      items: [
        { id: 'drive', label: t('drive') || 'Lưu trữ', icon: <FolderIcon className="w-5 h-5 text-yellow-500" />, view: 'drive' },
        { id: 'calendar', label: 'Lịch hẹn', icon: <CalendarIcon className="w-5 h-5 text-red-500" />, view: 'calendar' },
        { id: 'contacts', label: t('contacts') || 'Danh bạ', icon: <UsersIcon className="w-5 h-5 text-cyan-500" />, view: 'contacts' }
      ]
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
        className={`relative flex flex-col p-3 h-full border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-16' : 'w-64'}`}
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
                  : 'w-full gap-3 px-4 py-2.5 justify-start rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 shadow-sm'
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
        <nav className={`flex-1 flex flex-col justify-start gap-4 w-full overflow-y-auto scrollbar-none py-4 ${isCollapsed ? 'items-center' : 'items-stretch'}`}>
          {menuGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1 w-full">
              {!isCollapsed && (
                <div className="px-4 pb-1">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {group.title}
                  </span>
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activeView === item.view;

                return (
                  <div key={item.id} className={`relative w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`flex items-center transition-all duration-200 ${
                        isCollapsed 
                          ? 'w-10 h-10 justify-center rounded-xl animate-fade-in' 
                          : 'w-full gap-3 px-4 py-2.5 justify-start rounded-xl'
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
                        <span className="text-sm font-semibold truncate text-left leading-none animate-fade-in">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* PART 3: BOTTOM (Profile) */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-col items-center justify-center w-full shrink-0">
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
