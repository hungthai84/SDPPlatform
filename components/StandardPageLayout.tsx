
import React from 'react';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({ children, onScroll }) => {
  return (
    <div onScroll={onScroll} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-transparent">
      <div className="max-w-[1600px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export const ContentCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div 
    style={{ backgroundColor: 'rgba(var(--color-card-bg-rgb, 255, 255, 255), var(--card-opacity, 1))' }}
    className={`rounded-[10px] shadow-sm border border-[--color-border-primary] p-6 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

export default StandardPageLayout;
