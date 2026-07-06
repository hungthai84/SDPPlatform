import React from 'react';
import { cn } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';
import { customPatterns } from '../lib/constants';

export const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  const { bgType, bgValue, opacity } = useSettings();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center p-[15px]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-full object-cover">
        {bgType === 'image' && (
          <img src={bgValue} alt="Background" className="w-full h-full object-cover" />
        )}
        {bgType === 'video' && (
          <video src={bgValue} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        )}
        {bgType === 'gradient' && (
          <div className="w-full h-full" style={{ background: bgValue, backgroundSize: bgValue.includes('-45deg') ? '400% 400%' : 'auto', animation: bgValue.includes('-45deg') ? 'gradientPulse 15s ease infinite' : 'none' }}></div>
        )}
        {bgType === 'pattern' && (
          <div className="w-full h-full" style={customPatterns.find(p => p.id === bgValue)?.css || {}}></div>
        )}
        {bgType === 'none' && (
          <div className="w-full h-full bg-slate-100"></div>
        )}
      </div>

      {/* Main Content Card Wrapper */}
      <div 
        className={cn(
          "relative z-10 w-full h-full rounded-[10px] overflow-hidden flex flex-col shadow-3d border-2 animate-border-color",
          "transition-all duration-300 backdrop-blur-sm"
        )}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${opacity})`
        }}
      >
        <div className="w-full h-full relative overflow-auto">
           {children}
        </div>
      </div>
    </div>
  );
};
