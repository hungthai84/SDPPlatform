import React from 'react';
import { 
  Search, Filter, Plus, BookOpen,
  LayoutGrid, List, TrendingUp
} from 'lucide-react';

// --- Reusable Components for Standard Layout ---

export const Banner: React.FC<{ title: string; icon: React.ReactNode; description: string }> = ({ title, icon, description }) => (
  <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full -mr-20 -mt-20" />
    
    {/* Left Column (70%) */}
    <div className="w-full md:w-[70%] flex items-center gap-6 relative z-10">
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{title}</h1>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{description}</p>
      </div>
    </div>

    {/* Right Column */}
    <div className="flex items-center gap-3 relative z-10">
      <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
        <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
        Tài liệu hướng dẫn
      </button>
    </div>
  </div>
);

export const Tabs: React.FC<{ items: string[]; activeTab: string; onTabChange: (tab: string) => void }> = ({ items, activeTab, onTabChange }) => (
  <div className="flex items-center gap-1 mb-8 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl w-fit overflow-x-auto max-w-full">
    {items.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
          activeTab === tab 
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export const StatsGrid: React.FC<{ stats: Array<{ label: string; value: string; trend?: string; color?: string }> }> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, i) => (
      <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all group">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
          {stat.trend && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <TrendingUp className="w-3 h-3" /> {stat.trend}
            </span>
          )}
        </div>
        <p className={`text-2xl font-black ${stat.color || 'text-slate-900 dark:text-white'}`}>{stat.value}</p>
      </div>
    ))}
  </div>
);

export const MainContentWrapper: React.FC<{ 
  children: React.ReactNode; 
  onSearch?: (val: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  viewMode?: 'grid' | 'list';
  setViewMode?: (mode: 'grid' | 'list') => void;
}> = ({ children, onSearch, onCreate, createLabel, viewMode, setViewMode }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    {/* Toolbar */}
    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20" 
          />
        </div>
        <button className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-xl transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {setViewMode && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
        {onCreate && (
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <Plus className="w-4.5 h-4.5" /> 
            {createLabel || 'Tạo mới'}
          </button>
        )}
      </div>
    </div>

    {/* Content Area */}
    <div className="p-0">
      {children}
    </div>
  </div>
);
