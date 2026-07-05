
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
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
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
              className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner flex items-center justify-center"
            >
              <div className="w-8 h-8 text-white">
                {icon}
              </div>
            </motion.div>
          )}
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
               <button 
                onClick={onGuideClick}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all backdrop-blur-sm group"
               >
                  <BookOpenIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  Tài liệu hướng dẫn
               </button>
             </div>
             {subtitle && <p className="text-white/80 text-xs font-medium max-w-md">{subtitle}</p>}
          </div>
        </div>
        
        {actions && (
          <div className="flex flex-wrap items-center gap-2 bg-black/10 p-2 rounded-xl backdrop-blur-sm border border-white/5">
             {actions}
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 left-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
    </div>
  );
};

export default PageBanner;
