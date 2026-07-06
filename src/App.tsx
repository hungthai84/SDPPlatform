import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Search, 
  User, 
  Trash2, 
  Download, 
  Copy, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  Target, 
  Sparkles, 
  Check, 
  CloudSun, 
  CloudRain, 
  FileText,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, ZenQuote, FocusGoal, CanvasConfig } from './types';
import { ZEN_QUOTES, THEME_PRESETS } from './data';

export default function App() {
  // Appearance & Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('zen_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Active View State
  const [activeView, setActiveView] = useState<ViewType>('canvas');
  
  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Content state (Blank Page text)
  const [canvasText, setCanvasText] = useState<string>(() => {
    const saved = localStorage.getItem('zen_canvas_text');
    return saved || '';
  });

  // Focus goals state
  const [goals, setGoals] = useState<FocusGoal[]>(() => {
    const saved = localStorage.getItem('zen_focus_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Thiết lập không gian làm việc tối giản', completed: true, createdAt: new Date().toISOString() },
      { id: '2', text: 'Viết ý tưởng sáng tạo đầu tiên vào trang trắng', completed: false, createdAt: new Date().toISOString() }
    ];
  });
  const [newGoalText, setNewGoalText] = useState<string>('');

  // Configuration state
  const [config, setConfig] = useState<CanvasConfig>(() => {
    const saved = localStorage.getItem('zen_canvas_config');
    return saved ? JSON.parse(saved) : {
      bgColor: 'slate',
      textColor: 'slate',
      opacity: 85,
      showGrid: true
    };
  });

  // Search filter for goals
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Zen quote state
  const [currentQuote, setCurrentQuote] = useState<ZenQuote>(ZEN_QUOTES[0]);
  const [isQuoteFading, setIsQuoteFading] = useState<boolean>(false);

  // Dynamic time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Focus mode helper for Editor
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('zen_dark_mode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('zen_canvas_text', canvasText);
  }, [canvasText]);

  useEffect(() => {
    localStorage.setItem('zen_focus_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('zen_canvas_config', JSON.stringify(config));
  }, [config]);

  // Update real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show a beautifully custom styled toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Change quote randomly with motion
  const handleRandomQuote = () => {
    setIsQuoteFading(true);
    setTimeout(() => {
      const remainingQuotes = ZEN_QUOTES.filter(q => q.id !== currentQuote.id);
      const randomIndex = Math.floor(Math.random() * remainingQuotes.length);
      setCurrentQuote(remainingQuotes[randomIndex]);
      setIsQuoteFading(false);
    }, 200);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    showToast(!isDark ? 'Chuyển sang Giao diện Tối' : 'Chuyển sang Giao diện Sáng');
  };

  // Text utilities
  const handleCopyText = async () => {
    if (!canvasText) {
      showToast('Không có nội dung để sao chép!');
      return;
    }
    try {
      await navigator.clipboard.writeText(canvasText);
      showToast('Đã sao chép nội dung vào bộ nhớ tạm!');
    } catch {
      showToast('Lỗi sao chép nội dung!');
    }
  };

  const handleDownloadText = () => {
    if (!canvasText) {
      showToast('Không có nội dung để tải về!');
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([canvasText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `trang-trang-zen-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Đã tải xuống tệp văn bản!');
  };

  const handleClearText = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm trống trang này không?')) {
      setCanvasText('');
      showToast('Đã làm trống trang trắng!');
    }
  };

  // Goal utilities
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal: FocusGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setGoals([newGoal, ...goals]);
    setNewGoalText('');
    showToast('Đã thêm mục tiêu tập trung!');
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    showToast('Đã xóa mục tiêu!');
  };

  // Calculate stats
  const completedCount = goals.filter(g => g.completed).length;
  const completionRate = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;
  
  // Calculate text analysis
  const charCount = canvasText.length;
  const wordCount = canvasText.trim() === '' ? 0 : canvasText.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words/min

  // Theme style mapping
  const getAccentStyles = () => {
    switch (config.bgColor) {
      case 'amber':
        return {
          accentBg: 'bg-amber-500',
          accentText: 'text-amber-600 dark:text-amber-400',
          accentBorder: 'border-amber-200 dark:border-amber-900/50',
          accentHover: 'hover:bg-amber-500/10',
          gradientFrom: 'from-amber-500/10',
          btnRing: 'focus:ring-amber-400'
        };
      case 'indigo':
        return {
          accentBg: 'bg-indigo-500',
          accentText: 'text-indigo-600 dark:text-indigo-400',
          accentBorder: 'border-indigo-200 dark:border-indigo-900/50',
          accentHover: 'hover:bg-indigo-500/10',
          gradientFrom: 'from-indigo-500/10',
          btnRing: 'focus:ring-indigo-400'
        };
      case 'emerald':
        return {
          accentBg: 'bg-emerald-500',
          accentText: 'text-emerald-600 dark:text-emerald-400',
          accentBorder: 'border-emerald-200 dark:border-emerald-900/50',
          accentHover: 'hover:bg-emerald-500/10',
          gradientFrom: 'from-emerald-500/10',
          btnRing: 'focus:ring-emerald-400'
        };
      case 'zinc':
        return {
          accentBg: 'bg-zinc-700',
          accentText: 'text-zinc-800 dark:text-zinc-300',
          accentBorder: 'border-zinc-200 dark:border-zinc-700/50',
          accentHover: 'hover:bg-zinc-700/10',
          gradientFrom: 'from-zinc-500/10',
          btnRing: 'focus:ring-zinc-400'
        };
      case 'slate':
      default:
        return {
          accentBg: 'bg-slate-700 dark:bg-slate-600',
          accentText: 'text-slate-700 dark:text-slate-300',
          accentBorder: 'border-slate-200 dark:border-slate-800',
          accentHover: 'hover:bg-slate-700/10 dark:hover:bg-slate-400/10',
          gradientFrom: 'from-slate-500/10',
          btnRing: 'focus:ring-slate-500'
        };
    }
  };

  const accentStyles = getAccentStyles();

  // Simulated Weather logic based on hour of the day
  const getWeatherInfo = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) {
      return { icon: <Sun className="w-4 h-4 text-amber-500" />, desc: 'Nắng sớm - 26°C' };
    } else if (hour >= 11 && hour < 16) {
      return { icon: <Sun className="w-4 h-4 text-orange-500" />, desc: 'Nắng trưa - 32°C' };
    } else if (hour >= 16 && hour < 19) {
      return { icon: <CloudSun className="w-4 h-4 text-amber-400" />, desc: 'Hoàng hôn - 28°C' };
    } else {
      return { icon: <CloudRain className="w-4 h-4 text-blue-400" />, desc: 'Trời đêm trong - 23°C' };
    }
  };

  const weather = getWeatherInfo();

  // Filter goals based on search query
  const filteredGoals = goals.filter(g => 
    g.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-[15px] flex flex-col transition-colors duration-300 font-sans`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 px-4 py-2.5 rounded-lg shadow-xl backdrop-blur-md text-sm font-medium border border-slate-800 dark:border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Stage */}
      <div 
        id="app_canvas"
        className="flex-1 flex flex-col md:flex-row bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[10px] shadow-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden relative"
        style={{ opacity: config.opacity / 100 }}
      >
        
        {/* LEFT SIDEBAR NAVIGATION - Collapsible */}
        <motion.aside 
          animate={{ width: isSidebarCollapsed ? '64px' : '256px' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="border-r border-slate-100 dark:border-slate-800/80 flex flex-col bg-white/50 dark:bg-slate-900/60 relative shrink-0"
        >
          {/* User profile with custom requirements (NO portraits, standard user icon, default account name) */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3 overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <User className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col truncate"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-tight">WORKSPACE</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Tài khoản người dùng</span>
              </motion.div>
            )}
          </div>

          {/* Navigation Menus */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {/* View Selection: Canvas */}
            <button
              onClick={() => setActiveView('canvas')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                activeView === 'canvas' 
                  ? `${accentStyles.accentHover} ${accentStyles.accentText} bg-slate-50 dark:bg-slate-800/40 border-l-[3px] border-l-current rounded-l-none` 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  Trang Trắng
                </motion.span>
              )}
            </button>

            {/* View Selection: Goals / Focus */}
            <button
              onClick={() => setActiveView('journal')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                activeView === 'journal' 
                  ? `${accentStyles.accentHover} ${accentStyles.accentText} bg-slate-50 dark:bg-slate-800/40 border-l-[3px] border-l-current rounded-l-none` 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Target className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  Mục Tiêu Tập Trung
                </motion.span>
              )}
            </button>

            {/* View Selection: Settings */}
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                activeView === 'settings' 
                  ? `${accentStyles.accentHover} ${accentStyles.accentText} bg-slate-50 dark:bg-slate-800/40 border-l-[3px] border-l-current rounded-l-none` 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  Cài Đặt
                </motion.span>
              )}
            </button>
          </nav>

          {/* Footer of Sidebar: Expand/Collapse & Theme switch */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
            {!isSidebarCollapsed && (
              <div className="bg-slate-50 dark:bg-slate-800/20 p-2.5 rounded-lg text-[11px] text-slate-400 dark:text-slate-500 flex flex-col gap-1 select-none font-mono">
                <div className="flex justify-between">
                  <span>TRẠNG THÁI:</span>
                  <span className="text-emerald-500 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span>PHIÊN BẢN:</span>
                  <span>1.0.0 (TS)</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-1.5">
              {/* Dark mode switch */}
              <button
                onClick={toggleDarkMode}
                className="flex-1 flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {!isSidebarCollapsed && (
                  <span className="text-xs font-medium ml-2">Giao diện</span>
                )}
              </button>

              {/* Collapse/Expand toggle button */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* MAIN DISPLAY SECTION */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 dark:bg-slate-950/20">
          
          {/* TOP BAR */}
          <header className="h-16 border-b border-slate-100 dark:border-slate-800/80 px-6 flex items-center justify-between shrink-0 gap-4">
            
            {/* Left Header section - Search Bar mockup */}
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder={activeView === 'journal' ? "Lọc mục tiêu tập trung..." : "Tìm kiếm ý tưởng sáng tạo..."}
                value={activeView === 'journal' ? searchQuery : ''}
                onChange={activeView === 'journal' ? (e) => setSearchQuery(e.target.value) : undefined}
                disabled={activeView !== 'journal'}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
              />
            </div>

            {/* Weather & Clock Component */}
            <div className="flex items-center gap-4 ml-auto select-none">
              {/* Simulated Weather Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-xs text-slate-500 dark:text-slate-400 shadow-sm font-mono">
                {weather.icon}
                <span>{weather.desc}</span>
              </div>

              {/* Dynamic Clock and Date Widget */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono leading-none">LOCAL TIME</span>
                  <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                    {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                </span>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCENE CONTAINER */}
          <main className="flex-1 p-6 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              
              {/* VIEW 1: TRANG TRẮNG (BLANK CANVAS) */}
              {activeView === 'canvas' && (
                <motion.div
                  key="canvas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col gap-5"
                >
                  {/* Canvas Header & Statistics */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Trang Trắng Sáng Tạo</span>
                        <span className="text-xs font-mono font-normal px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">CANVAS</span>
                      </h1>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Một không gian trống tinh khiết. Viết ra bất kỳ ý tưởng nào xuất hiện trong tâm trí bạn.</p>
                    </div>

                    {/* Stats HUD using JetBrains Mono */}
                    <div className="flex items-center gap-3 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-2 shadow-sm shrink-0">
                      <div className="px-2 border-r border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">KÝ TỰ: </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{charCount}</span>
                      </div>
                      <div className="px-2 border-r border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">TỪ: </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{wordCount}</span>
                      </div>
                      <div className="px-2">
                        <span className="text-slate-400">ĐỌC: </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">~{readTime} phút</span>
                      </div>
                    </div>
                  </div>

                  {/* Writing Stage Area (Content Card format) */}
                  <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-sm relative overflow-hidden">
                    
                    {/* Dotted Grid Background Toggle Effect */}
                    {config.showGrid && (
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
                        style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 95%)' }}
                      />
                    )}

                    {/* Canvas Floating Utilities */}
                    <div className="flex justify-between items-center px-4 py-2 bg-slate-50/80 dark:bg-slate-850/40 border-b border-slate-100 dark:border-slate-800/80 z-10 shrink-0 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-2">WRITER_v1.0.0</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={handleCopyText}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Sao chép toàn bộ"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleDownloadText}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Tải về máy (.txt)"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                        <button 
                          onClick={handleClearText}
                          className="p-1.5 rounded-md text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Làm trống toàn bộ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Pure Writing Area */}
                    <textarea
                      ref={editorRef}
                      value={canvasText}
                      onChange={(e) => setCanvasText(e.target.value)}
                      placeholder="Bắt đầu viết điều gì đó tại đây..."
                      className="flex-1 w-full p-6 md:p-8 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400/70 focus:outline-none resize-none font-sans text-base leading-relaxed overflow-y-auto"
                    />

                    {/* Mini Quick Access Toolbar */}
                    <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 select-none">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setCanvasText(prev => prev + '\n- ');
                            editorRef.current?.focus();
                          }}
                          className="hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          + Gạch đầu dòng
                        </button>
                        <button 
                          onClick={() => {
                            const nowStr = `\n[${new Date().toLocaleTimeString('vi-VN', { hour12: false })}] `;
                            setCanvasText(prev => prev + nowStr);
                            editorRef.current?.focus();
                          }}
                          className="hover:text-slate-600 dark:hover:text-slate-300 font-mono"
                        >
                          + Thêm mốc giờ
                        </button>
                      </div>
                      <span className="font-mono text-[10px]">ESC: THOÁT | CTRL+S: LƯU TỰ ĐỘNG</span>
                    </div>
                  </div>

                  {/* BOTTOM ZEN QUOTE DECORATION - Card-Opacity and beautiful alignment */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden shrink-0">
                    <div className="flex gap-3 items-start">
                      <Bookmark className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                      <div className="min-h-[40px]">
                        <p className={`text-sm italic text-slate-600 dark:text-slate-300 transition-opacity duration-200 ${isQuoteFading ? 'opacity-0' : 'opacity-100'}`}>
                          "{currentQuote.text}"
                        </p>
                        <p className={`text-xs text-slate-400 dark:text-slate-500 font-mono mt-1 transition-opacity duration-200 ${isQuoteFading ? 'opacity-0' : 'opacity-100'}`}>
                          — {currentQuote.author}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRandomQuote}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors ml-auto shadow-sm shrink-0"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Đổi cảm hứng</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: MỤC TIÊU TẬP TRUNG (FOCUS GOALS) */}
              {activeView === 'journal' && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col gap-6"
                >
                  {/* Goals Header */}
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Mục Tiêu Tập Trung</span>
                      <span className="text-xs font-mono font-normal px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">FOCUS</span>
                    </h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Giữ danh sách mục tiêu ngắn gọn và đơn giản. Càng ít mục tiêu, khả năng hoàn thành càng cao.</p>
                  </div>

                  {/* Progress dashboard - Minimal swiss grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                    
                    {/* Stat Cards */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">TỔNG MỤC TIÊU</span>
                        <span className="text-2xl font-semibold font-mono text-slate-800 dark:text-slate-200 mt-1 block">
                          {goals.length}
                        </span>
                      </div>
                      <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">ĐÃ HOÀN THÀNH</span>
                        <span className="text-2xl font-semibold font-mono text-slate-800 dark:text-slate-200 mt-1 block">
                          {completedCount}
                        </span>
                      </div>
                      <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-400 block">TỶ LỆ HOÀN THÀNH</span>
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{completionRate}%</span>
                      </div>
                      <div className="mt-2.5">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${accentStyles.accentBg}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${completionRate}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Add Goal Form */}
                  <form onSubmit={handleAddGoal} className="flex gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl shadow-sm shrink-0">
                    <input
                      type="text"
                      placeholder="Thiết lập một mục tiêu tập trung mới cho phiên này..."
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      maxLength={120}
                      className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg text-xs font-medium text-white ${accentStyles.accentBg} hover:opacity-90 transition-opacity flex items-center gap-1.5`}
                    >
                      <span>Thêm mục tiêu</span>
                    </button>
                  </form>

                  {/* Goal Lists */}
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 select-none">
                      <span className="font-mono">DANH SÁCH MỤC TIÊU TỔNG HỢP</span>
                      <span className="font-mono">TÌM THẤY: {filteredGoals.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      <AnimatePresence initial={false}>
                        {filteredGoals.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <Target className="w-8 h-8 opacity-20 mb-2" />
                            <p className="text-sm">Không tìm thấy mục tiêu nào phù hợp.</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Hãy thiết lập mục tiêu đầu tiên để duy trì sự tập trung.</p>
                          </div>
                        ) : (
                          filteredGoals.map((goal) => (
                            <motion.div
                              key={goal.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/10 group overflow-hidden"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleGoal(goal.id)}
                                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                                    goal.completed
                                      ? `${accentStyles.accentBg} border-transparent text-white`
                                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {goal.completed && <Check className="w-3.5 h-3.5" />}
                                </button>
                                <span className={`text-sm truncate pr-4 ${
                                  goal.completed 
                                    ? 'line-through text-slate-400 dark:text-slate-500' 
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                  {goal.text}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                  {new Date(goal.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                  className="p-1.5 rounded text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Xóa mục tiêu"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: CÀI ĐẶT (SETTINGS) */}
              {activeView === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col gap-6 max-w-2xl mx-auto"
                >
                  {/* Settings Header */}
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Cài Đặt Không Gian</span>
                      <span className="text-xs font-mono font-normal px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">SETTINGS</span>
                    </h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tinh chỉnh giao diện để tối ưu hóa khả năng tập trung và năng suất viết của bạn.</p>
                  </div>

                  {/* Settings Section (Content Card format) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                    
                    {/* Setting 1: Theme Presets */}
                    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Tông màu chủ đạo</label>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Màu nhấn sẽ được áp dụng cho toàn bộ các nút và đường viền chính.</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {THEME_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            onClick={() => {
                              setConfig({ ...config, bgColor: p.value });
                              showToast(`Đã đổi tông màu sang: ${p.name}`);
                            }}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                              config.bgColor === p.value
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-sm'
                                : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Setting 2: Opacity Slider */}
                    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Độ mờ của khung nền</label>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Hỗ trợ hiệu ứng kính mờ (backdrop-blur) phía sau ứng dụng.</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-48">
                        <input
                          type="range"
                          min="40"
                          max="100"
                          value={config.opacity}
                          onChange={(e) => setConfig({ ...config, opacity: parseInt(e.target.value) })}
                          className="w-full accent-slate-700 dark:accent-slate-300 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-10 text-right">{config.opacity}%</span>
                      </div>
                    </div>

                    {/* Setting 3: Toggle Grid */}
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Lưới điểm tối giản</label>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Hiển thị các chấm lưới chấm mảnh để làm định hướng viết thẳng hàng.</span>
                      </div>
                      <button
                        onClick={() => {
                          setConfig({ ...config, showGrid: !config.showGrid });
                          showToast(!config.showGrid ? 'Đã bật lưới chấm' : 'Đã tắt lưới chấm');
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                          config.showGrid ? accentStyles.accentBg : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      >
                        <motion.span 
                          layout
                          className="w-4 h-4 bg-white rounded-full mx-1 shadow-sm"
                          animate={{ x: config.showGrid ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Setting 4: Reset configuration */}
                    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Khôi phục cấu hình mặc định</label>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Xóa các tùy chọn lưu trữ và cài đặt lại từ đầu.</span>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Khôi phục lại toàn bộ cài đặt mặc định?')) {
                            setConfig({
                              bgColor: 'slate',
                              textColor: 'slate',
                              opacity: 85,
                              showGrid: true
                            });
                            showToast('Đã khôi phục cài đặt mặc định!');
                          }
                        }}
                        className="px-4 py-2 border border-red-200 dark:border-red-950/40 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 text-xs font-medium rounded-lg transition-colors"
                      >
                        Khôi phục mặc định
                      </button>
                    </div>

                  </div>

                  {/* Architecture Description */}
                  <div className="bg-slate-100/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Grid className="w-4 h-4 text-slate-400" />
                      <span>Thông tin Triết lý Thiết kế</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Trang trắng tối giản được xây dựng tuân thủ triết lý nghệ thuật Thụy Sĩ (Swiss Style): nhấn mạnh tính đối xứng, 
                      khoảng trống rộng rãi, màu sắc trung tính nhẹ mắt và sự rõ ràng của thông điệp. Hệ thống lưu trữ cục bộ 
                      (Local Storage) giúp bảo mật tuyệt đối các ý tưởng viết của bạn hoàn toàn trên thiết bị cá nhân mà không 
                      qua bất kỳ máy chủ trung gian nào.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="h-8 flex justify-between items-center px-4 mt-2 select-none text-[10px] text-slate-400 dark:text-slate-500 font-mono">
        <span>© 2026 TRANG TRẮNG TỐI GIẢN — KHÔNG GIAN ZEN SÁNG TẠO</span>
        <span className="hidden sm:inline">SWISS DESIGN PRINCIPLE & OFFLINE-FIRST PERSISTENCE</span>
      </footer>

    </div>
  );
}
