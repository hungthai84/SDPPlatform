
import React from 'react';
import { motion } from 'motion/react';
import { BookOpenIcon } from './icons';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: string;
  actions?: React.ReactNode;
  onGuideClick?: () => void;
}

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  icon, 
  gradient = 'from-indigo-600 to-blue-500', 
  actions,
  onGuideClick 
}) => {
  return (
    <div className={`relative p-6 rounded-[10px] bg-gradient-to-br ${gradient} text-white shadow-md overflow-hidden mb-6`}>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-10 items-center gap-6">
        
        {/* Left Column (70% on desktop) */}
        <div className="md:col-span-7 flex items-center gap-5">
          {icon && (
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner flex items-center justify-center shrink-0"
            >
              <div className="w-8 h-8 text-white">
                {icon}
              </div>
            </motion.div>
          )}
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight break-words">{title}</h1>
            {subtitle && <p className="text-white/80 text-xs font-medium leading-relaxed break-words">{subtitle}</p>}
          </div>
        </div>
        
        {/* Right Column (30% on desktop) */}
        <div className="md:col-span-3 flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-center gap-3">
          {onGuideClick && (
            <button 
              onClick={onGuideClick}
              className="flex items-center justify-center gap-2 bg-white text-indigo-900 hover:bg-slate-50 border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 group shrink-0 w-full md:w-auto"
            >
              <BookOpenIcon className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              Tài liệu hướng dẫn
            </button>
          )}
          
          {actions && (
            <div className="flex items-center gap-2 bg-black/15 p-2 rounded-xl backdrop-blur-sm border border-white/5 w-full md:w-auto justify-center">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 left-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
    </div>
  );
};

export default PageBanner;
