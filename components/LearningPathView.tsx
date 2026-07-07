import React from 'react';

export const LearningPathView: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full p-6 animate-fade-in bg-slate-50 dark:bg-slate-900">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lộ trình học tập</h2>
          <p className="text-sm text-slate-500 mt-1">Lộ trình học tập cá nhân hóa cho từng vị trí</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Lộ trình học tập đang được cập nhật</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Tính năng này đang trong quá trình phát triển.</p>
        </div>
      </div>
    </div>
  );
};
