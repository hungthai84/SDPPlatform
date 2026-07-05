
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, LogoutIcon, NotificationScreenIcon } from './icons';
import WeatherClock from './WeatherClock';
import { User } from '../App';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[--color-accent-500] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[--color-surface-secondary]/50 hover:ring-[--color-accent-400] transition-all"
        aria-label="Open user menu"
      >
        {user.avatar ? <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover" /> : getInitials(user.name)}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-[--color-surface-secondary]/80 backdrop-blur-xl rounded-lg shadow-2xl ring-1 ring-[--color-border-secondary] z-[9999] animate-fade-in-down">
          <div className="p-4 border-b border-[--color-border-secondary]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[--color-accent-500] text-white flex items-center justify-center font-bold text-lg">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover" /> : getInitials(user.name)}
              </div>
              <div>
                <p className="font-semibold text-[--color-text-primary] truncate">{user.name}</p>
                <p className="text-sm text-[--color-text-secondary] truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-[--color-text-secondary] hover:bg-red-500/10 hover:text-red-600 transition-colors">
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopBarProps {
  user: User;
  onLogout: () => void;
  onNotificationClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onNotificationClick }) => {
  return (
    <header className="flex items-center h-16 px-6 bg-[--color-surface-secondary]/60 backdrop-blur-lg border-b border-[--color-border-secondary] shrink-0 z-[60]">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <UserMenu user={user} onLogout={onLogout} />
        <div className="w-px h-7 bg-[--color-border-secondary]"></div>
        <WeatherClock />
      </div>
      
      {/* Center Section */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-[--color-text-subtle]" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-[--color-surface-secondary] border border-[--color-border-secondary] focus:bg-[--color-surface-primary] focus:border-[--color-accent-500] focus:ring-0 focus:outline-none placeholder-[--color-text-subtle] text-[--color-text-primary] rounded-full py-2 pl-11 pr-4 transition-all duration-300"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onNotificationClick}
          className="relative p-2 rounded-full hover:bg-[--color-surface-tertiary] transition-colors" 
          aria-label="View notifications"
        >
          <NotificationScreenIcon className="w-6 h-6 text-[--color-text-primary]" />
          <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-[--color-accent-500] rounded-full ring-2 ring-[--color-surface-secondary]"></span>
          <span className="sr-only">You have new notifications</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;