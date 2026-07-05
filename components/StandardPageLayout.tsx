
import React from 'react';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({ children, onScroll }) => {
  return (
    <div onScroll={onScroll} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export const ContentCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div 
    style={{ backgroundColor: 'rgba(255, 255, 255, var(--card-opacity, 1))' }}
    className={`rounded-[10px] shadow-sm border border-gray-100/80 p-6 ${className}`}
  >
    {children}
  </div>
);

export default StandardPageLayout;
