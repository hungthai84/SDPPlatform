import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Ticket, 
  Users, 
  Settings,
  LifeBuoy,
  ChevronRight,
  Bell,
  Zap,
  Megaphone,
  Sparkles,
  LineChart,
  FileText,
  User,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { sidebarOpacity } = useSettings();

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: LayoutDashboard,
      path: '/'
    },
    {
      id: 'inbox',
      label: 'Đa kênh',
      icon: Inbox,
      path: '/inbox'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      icon: Users,
      path: '/customers'
    },
    {
      id: 'tickets',
      label: 'Phiếu ghi',
      icon: Ticket,
      path: '/tickets'
    },
    {
      id: 'projects',
      label: 'Dự án',
      icon: Layers,
      path: '/projects'
    },
    {
      id: 'blank-page',
      label: 'Trang trắng',
      icon: FileText,
      path: '/blank-page'
    },
    {
      id: 'automation',
      label: 'Tự động',
      icon: Zap,
      path: '/automation'
    },
    {
      id: 'campaigns',
      label: 'Chiến dịch',
      icon: Megaphone,
      path: '/campaigns'
    },
    {
      id: 'ai-assistant',
      label: 'Trợ lý Ai',
      icon: Sparkles,
      path: '/ai-assistant'
    },
    {
      id: 'help-center',
      label: 'Trung Tâm',
      icon: LifeBuoy,
      path: '/help-center'
    },
    {
      id: 'analytics',
      label: 'Phân tích',
      icon: LineChart,
      path: '/analytics'
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      icon: FileText,
      path: '/reports'
    }
  ];

  const bottomGroups = [
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      path: '/notifications',
      badge: 2
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      path: '/settings'
    },
    {
      id: 'profile',
      label: 'Hồ sơ',
      icon: User,
      path: '/profile'
    }
  ];

  return (
    <>
      <aside 
        className={cn(
          "h-full text-slate-700 flex flex-col z-[90] border-r border-slate-200/80 rounded-l-[8px] overflow-visible select-none transition-all duration-300 backdrop-blur-sm bg-white shrink-0 relative",
          isCollapsed ? "w-[72px]" : "w-[180px]"
        )}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${sidebarOpacity})`
        }}
      >
        {/* Toggle Collapse/Expand Arrow Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-md cursor-pointer z-[100] hover:scale-110 active:scale-95 transition-all duration-200"
          id="sidebar-toggle-btn"
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isCollapsed ? "rotate-0" : "rotate-180")} />
        </button>

        {/* TOP SECTION: Company Logo & Name */}
        <div className={cn(
          "flex-none pt-6 pb-4 border-b border-slate-100 flex items-center overflow-hidden",
          isCollapsed ? "px-2 justify-center" : "px-4 justify-start"
        )}>
          <Link 
            to="/" 
            className={cn(
              "flex items-center group",
              isCollapsed ? "justify-center w-10 h-10" : "w-full gap-2.5 justify-start"
            )}
            title="Trở về Trang chủ"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 p-1.5 flex items-center justify-center border border-slate-200/60 group-hover:border-blue-500/50 group-hover:bg-blue-50/30 transition-all duration-300 shrink-0">
              <img 
                src="https://i.ibb.co/GvcmMgD3/Logo-Tr-ng.png" 
                alt="Power Service Logo" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xs text-slate-800 tracking-tight uppercase group-hover:text-blue-600 transition-colors duration-300 truncate">
                Power Service
              </span>
            )}
          </Link>
        </div>

        {/* CENTER SECTION: Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-1 w-full scrollbar-none">
          {menuGroups.map((group) => {
            return (
              <div key={group.id} className="relative flex items-center justify-center w-full">
                <NavLink
                  to={group.path}
                  className={({ isActive: linkActive }) => cn(
                    "flex items-center transition-all duration-200 relative group cursor-pointer border border-transparent rounded-lg font-semibold text-[11.5px]",
                    isCollapsed 
                      ? "w-10 h-10 justify-center p-0" 
                      : "w-full px-3 py-2.5 gap-2.5 justify-start",
                    linkActive 
                      ? "bg-blue-50/80 text-blue-600 font-bold border-blue-100/50 shadow-[0_1px_2px_rgba(37,99,235,0.02)]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                  title={isCollapsed ? group.label : undefined}
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <group.icon size={17} className="transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  
                  {!isCollapsed && (
                    <span className="whitespace-nowrap truncate">{group.label}</span>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] border border-slate-800">
                      {group.label}
                    </div>
                  )}
                </NavLink>
              </div>
            );
          })}
        </div>

        {/* BOTTOM SECTION: Notifications, Settings, Profile */}
        <div className="flex-none p-2.5 border-t border-slate-100 flex flex-col gap-1 w-full bg-white/40">
          {bottomGroups.map((group) => {
            return (
              <div key={group.id} className="relative flex items-center justify-center w-full">
                <NavLink
                  to={group.path}
                  className={({ isActive: linkActive }) => cn(
                    "flex items-center transition-all duration-200 relative group cursor-pointer border border-transparent rounded-lg font-semibold text-[11.5px]",
                    isCollapsed 
                      ? "w-10 h-10 justify-center p-0" 
                      : "w-full px-3 py-2.5 gap-2.5 justify-start",
                    linkActive 
                      ? "bg-blue-50/80 text-blue-600 font-bold border-blue-100/50 shadow-[0_1px_2px_rgba(37,99,235,0.02)]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                  title={isCollapsed ? group.label : undefined}
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <group.icon size={17} className="transition-transform duration-200 group-hover:scale-105" />
                    {group.badge && (
                      <span className={cn(
                        "absolute rounded-full bg-red-500 ring-2 ring-white",
                        isCollapsed ? "top-0 right-0 h-2 w-2" : "-top-1 -right-1 h-2 w-2"
                      )} />
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <span className="whitespace-nowrap truncate flex-1">{group.label}</span>
                  )}

                  {group.badge && !isCollapsed && (
                    <span className="text-[9px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded-full scale-90 shrink-0">
                      {group.badge}
                    </span>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] border border-slate-800">
                      {group.label} {group.badge ? `(${group.badge})` : ''}
                    </div>
                  )}
                </NavLink>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
