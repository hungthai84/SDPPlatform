import React, { useState } from 'react';
import { 
  Play, MoreVertical, Plus, 
  Layers, Settings, Eye, Zap
} from 'lucide-react';
import { Tabs, StatsGrid, MainContentWrapper } from './StandardLayout';

export const BPMView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Quy trình');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto p-4 md:p-8">

      <Tabs 
        items={['Quy trình', 'Trường hợp (Cases)', 'Nhiệm vụ', 'Biểu mẫu', 'Báo cáo hiệu suất']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Quy trình hoạt động', value: '12', trend: '+2' },
        { label: 'Cases đang xử lý', value: '86', color: 'text-indigo-600' },
        { label: 'Thời gian chu kỳ TB', value: '2.4 ngày', trend: '-15%' },
        { label: 'Tỷ lệ tự động hóa', value: '45%', color: 'text-emerald-500' },
      ]} />

      <MainContentWrapper 
        createLabel="Thiết kế quy trình" 
        onCreate={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <div className={`p-6 gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
          {[
            { title: 'Phê duyệt mua sắm tài sản', category: 'Admin', steps: 5, active: 24, status: 'Active', color: 'bg-indigo-600' },
            { title: 'Onboarding nhân viên mới', category: 'HR', steps: 8, active: 12, status: 'Active', color: 'bg-emerald-600' },
            { title: 'Quy trình tạm ứng kinh phí', category: 'Finance', steps: 4, active: 35, status: 'Active', color: 'bg-amber-600' },
            { title: 'Xử lý khiếu nại khách hàng', category: 'CS', steps: 6, active: 15, status: 'Active', color: 'bg-rose-600' },
          ].map((process, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`${process.color} p-6 h-28 relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                 <div className="flex justify-between items-start relative z-10">
                    <div>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{process.category}</span>
                        <h3 className="font-black text-white text-lg tracking-tight leading-tight mt-1">{process.title}</h3>
                    </div>
                    <button className="text-white/80 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Số bước</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" /> {process.steps}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Đang chạy</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Play className="w-3.5 h-3.5 text-emerald-500" /> {process.active}
                        </p>
                    </div>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">AI-Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all group">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
                <span className="font-black text-sm uppercase tracking-widest block">Tạo quy trình mới</span>
                <span className="text-[10px] font-bold opacity-60">Sử dụng BPMN 2.0 Standard</span>
            </div>
          </button>
        </div>
      </MainContentWrapper>
    </div>
  );
};
