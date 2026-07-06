import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Download, 
  Trash2, 
  Sparkles, 
  Target, 
  Check, 
  RotateCw, 
  Bookmark, 
  Sun, 
  CloudSun, 
  CloudRain,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Definitions inside the file to ensure no broken imports
interface FocusGoal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface CanvasConfig {
  bgColor: 'slate' | 'amber' | 'emerald' | 'indigo' | 'zinc';
  textColor: string;
  opacity: number;
  showGrid: boolean;
}

interface ZenQuote {
  id: string;
  text: string;
  author: string;
}

const ZEN_QUOTES: ZenQuote[] = [
  { id: '1', text: 'Hãy bắt đầu bằng sự im lặng, và để trang giấy ghi lại những âm thanh của tư duy.', author: 'Thiền Sư' },
  { id: '2', text: 'Sự tinh giản không phải là ít đi, mà là vừa đủ để tâm hồn tự do.', author: 'Vô Danh' },
  { id: '3', text: 'Trang giấy trắng là gương soi tâm trí. Tâm có tĩnh, nét viết mới thanh.', author: 'Khuyết Danh' },
  { id: '4', text: 'Tập trung là chìa khóa mở lối cho những ý tưởng sâu sắc nhất của bạn.', author: 'Trí Tuệ Cổ Nhân' },
  { id: '5', text: 'Hãy viết như thể không ai đọc, sáng tạo như thể không có giới hạn nào tồn tại.', author: 'Tinh Thần Zen' }
];

const THEME_PRESETS = [
  { name: 'Xám Đá (Slate)', value: 'slate' as const },
  { name: 'Hổ Phách (Amber)', value: 'amber' as const },
  { name: 'Xanh Ngọc (Emerald)', value: 'emerald' as const },
  { name: 'Chàm Sâu (Indigo)', value: 'indigo' as const },
  { name: 'Cổ Điển (Zinc)', value: 'zinc' as const }
];

export const BlankPage = () => {
  // Appearance & Dark Mode State (synced with parent app)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('zen_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Content state (Blank Page text)
  const [canvasText, setCanvasText] = useState<string>(() => {
    const saved = localStorage.getItem('zen_canvas_text');
    return saved || '';
  });

  // Focus goals state
  const [goals, setGoals] = useState<FocusGoal[]>(() => {
    const saved = localStorage.getItem('zen_focus_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Thiết lập cấu hình không gian làm việc tối giản', completed: true, createdAt: new Date().toISOString() },
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
      opacity: 95,
      showGrid: true
    };
  });

  // Active side pane in BlankPage (Goals vs Settings)
  const [sidePane, setSidePane] = useState<'goals' | 'settings'>('goals');

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
    const file = new Blob([canvasText], {type: 'text/plain;charset=utf-8'});
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

  return (
    <div className={`flex-1 flex flex-col md:flex-row h-full min-h-[500px] overflow-hidden ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-900'} relative transition-colors duration-300 font-sans p-0 gap-0 rounded-[10px]`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md text-xs font-medium border border-slate-850 dark:border-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Writing Area (Left Column - 2/3 width) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200/60 dark:border-slate-800/60 relative">
        
        {/* Dotted Grid Background */}
        {config.showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
            style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 95%)' }}
          />
        )}

        {/* Toolbar Header of Writing Area */}
        <div className="flex justify-between items-center px-5 py-3 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 z-10 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-1">ZEN_EDITOR_v1.2</span>
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

        {/* Pure Typing Canvas */}
        <textarea
          ref={editorRef}
          value={canvasText}
          onChange={(e) => setCanvasText(e.target.value)}
          placeholder="Bắt đầu gõ những suy nghĩ, kế hoạch hay ý tưởng đột phá của bạn tại đây..."
          className="flex-1 w-full p-6 md:p-8 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400/70 focus:outline-none resize-none font-sans text-[15px] leading-relaxed overflow-y-auto"
          style={{ opacity: config.opacity / 100 }}
        />

        {/* Dynamic Statistics and Quote Footer */}
        <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3 shrink-0">
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-mono select-none">
            <div className="flex items-center gap-3">
              <span>CHARACTERS: <strong className="text-slate-700 dark:text-slate-300">{charCount}</strong></span>
              <span>WORDS: <strong className="text-slate-700 dark:text-slate-300">{wordCount}</strong></span>
              <span>EST. READ TIME: <strong className="text-slate-700 dark:text-slate-300">~{readTime}m</strong></span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setCanvasText(prev => prev + '\n- ');
                  editorRef.current?.focus();
                }}
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                + GẠCH ĐẦU DÒNG
              </button>
              <span>|</span>
              <button 
                onClick={() => {
                  const nowStr = `\n[${new Date().toLocaleTimeString('vi-VN', { hour12: false })}] `;
                  setCanvasText(prev => prev + nowStr);
                  editorRef.current?.focus();
                }}
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                + MỐC GIỜ
              </button>
            </div>
          </div>

          {/* Quote Panel */}
          <div className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/50 rounded-lg p-3 flex justify-between items-center gap-3 select-none">
            <div className="flex gap-2 items-start min-w-0">
              <Bookmark className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <div className="min-h-[32px] overflow-hidden">
                <p className={`text-[11.5px] italic text-slate-600 dark:text-slate-400 transition-opacity duration-200 ${isQuoteFading ? 'opacity-0' : 'opacity-100'} line-clamp-2`}>
                  "{currentQuote.text}"
                </p>
                <p className={`text-[9.5px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 transition-opacity duration-200 ${isQuoteFading ? 'opacity-0' : 'opacity-100'}`}>
                  — {currentQuote.author}
                </p>
              </div>
            </div>
            <button
              onClick={handleRandomQuote}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800 rounded-md transition-all shrink-0"
              title="Đổi câu cảm hứng"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Focus & Config Sidebar (Right Column - 1/3 width) */}
      <div className="w-full md:w-72 bg-white/40 dark:bg-slate-900/20 flex flex-col shrink-0">
        
        {/* Pane Selector */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 p-2 gap-1 shrink-0 select-none">
          <button
            onClick={() => setSidePane('goals')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              sidePane === 'goals'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Mục tiêu</span>
          </button>
          <button
            onClick={() => setSidePane('settings')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              sidePane === 'settings'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </button>
        </div>

        {/* Sidebar Panes Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {sidePane === 'goals' ? (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 h-full flex flex-col"
              >
                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase">MỤC TIÊU TẬP TRUNG</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Lọc bớt xao nhãng. Thiết lập các nhiệm vụ nhỏ cho phiên làm việc này.</p>
                </div>

                {/* Progress Indicators */}
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-3 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono text-slate-400">TIẾN ĐỘ HOÀN THÀNH</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${accentStyles.accentBg} transition-all duration-350`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
                    <span>ĐÃ XONG: {completedCount}</span>
                    <span>TỔNG: {goals.length}</span>
                  </div>
                </div>

                {/* New Goal Input Form */}
                <form onSubmit={handleAddGoal} className="flex gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1 rounded-lg shadow-sm">
                  <input
                    type="text"
                    placeholder="Đặt mục tiêu ngắn..."
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    maxLength={60}
                    className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold text-white ${accentStyles.accentBg} hover:opacity-90 transition-opacity`}
                  >
                    Thêm
                  </button>
                </form>

                {/* Goal List */}
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
                  {goals.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                      <Target className="w-6 h-6 mx-auto opacity-20 mb-1" />
                      <p className="text-[11px]">Chưa có mục tiêu tập trung nào.</p>
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 hover:border-slate-200/50 group select-none"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => handleToggleGoal(goal.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                              goal.completed
                                ? `${accentStyles.accentBg} border-transparent text-white`
                                : 'border-slate-350 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {goal.completed && <Check className="w-3 h-3" />}
                          </button>
                          <span className={`text-[11.5px] truncate ${
                            goal.completed 
                              ? 'line-through text-slate-400 dark:text-slate-500 font-normal' 
                              : 'text-slate-700 dark:text-slate-300 font-medium'
                          }`}>
                            {goal.text}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase">CẤU HÌNH KHÔNG GIAN</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Tùy biến môi trường tập trung của bạn.</p>
                </div>

                {/* Presets Grid */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Tông màu nhấn</label>
                  <div className="grid grid-cols-1 gap-1">
                    {THEME_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => {
                          setConfig({ ...config, bgColor: p.value });
                          showToast(`Màu nhấn: ${p.name}`);
                        }}
                        className={`px-2.5 py-1.5 text-left text-xs rounded-md border transition-all flex items-center justify-between ${
                          config.bgColor === p.value
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent font-bold shadow-sm'
                            : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <span>{p.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          p.value === 'slate' ? 'bg-slate-600' :
                          p.value === 'amber' ? 'bg-amber-500' :
                          p.value === 'emerald' ? 'bg-emerald-500' :
                          p.value === 'indigo' ? 'bg-indigo-500' : 'bg-zinc-700'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span>Độ rõ nét chữ</span>
                    <span className="font-mono">{config.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={config.opacity}
                    onChange={(e) => setConfig({ ...config, opacity: parseInt(e.target.value) })}
                    className="w-full accent-slate-700 dark:accent-slate-300 bg-slate-100 dark:bg-slate-800 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Grid Dot Toggle */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Lưới điểm Swiss</span>
                  <button
                    onClick={() => {
                      setConfig({ ...config, showGrid: !config.showGrid });
                      showToast(!config.showGrid ? 'Đã bật lưới chấm' : 'Đã tắt lưới chấm');
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${
                      config.showGrid ? accentStyles.accentBg : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <motion.span 
                      layout
                      className="w-3.5 h-3.5 bg-white rounded-full mx-0.5 shadow-sm"
                      animate={{ x: config.showGrid ? 14 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Chế độ tối (Dark mode)</span>
                  <button
                    onClick={() => {
                      setIsDark(!isDark);
                      showToast(!isDark ? 'Chuyển sang nền tối' : 'Chuyển sang nền sáng');
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${
                      isDark ? accentStyles.accentBg : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <motion.span 
                      layout
                      className="w-3.5 h-3.5 bg-white rounded-full mx-0.5 shadow-sm"
                      animate={{ x: isDark ? 14 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Reset button */}
                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                  <button
                    onClick={() => {
                      if (window.confirm('Khôi phục toàn bộ không gian làm việc về mặc định?')) {
                        setConfig({
                          bgColor: 'slate',
                          textColor: 'slate',
                          opacity: 95,
                          showGrid: true
                        });
                        setCanvasText('');
                        setGoals([
                          { id: '1', text: 'Thiết lập cấu hình không gian làm việc tối giản', completed: true, createdAt: new Date().toISOString() },
                          { id: '2', text: 'Viết ý tưởng sáng tạo đầu tiên vào trang trắng', completed: false, createdAt: new Date().toISOString() }
                        ]);
                        setIsDark(false);
                        showToast('Đã đặt lại không gian về mặc định!');
                      }
                    }}
                    className="w-full py-1.5 border border-red-200 dark:border-red-950/40 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 text-[10px] font-bold rounded-md transition-colors font-mono tracking-wider"
                  >
                    RESET WORKSPACE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Local time HUD inside the right panel */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 flex flex-col gap-2 shrink-0 select-none">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <span>TIME: </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <span>WEATHER: </span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-sans">
              {weather.icon}
              <span>{weather.desc.split(' - ')[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
