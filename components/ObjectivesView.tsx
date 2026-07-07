import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, Circle, MoreVertical, Plus } from 'lucide-react';
import { Banner, Tabs, StatsGrid, MainContentWrapper } from './StandardLayout';

const CoreObjectivesView = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6">
      <StatsGrid stats={[
        { label: 'Mục tiêu đang thực hiện', value: '4', trend: 'Hoạt động' },
        { label: 'Tiến độ trung bình', value: '68%', color: 'text-indigo-600' },
        { label: 'Kết quả then chốt', value: '12', trend: 'Tốt' },
        { label: 'Ngày còn lại (Q4)', value: '45 ngày', color: 'text-orange-500' },
      ]} />

      <MainContentWrapper 
        createLabel="Tạo OKR mới" 
        onCreate={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <div className="p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900">
          {[
            { title: 'Tăng trưởng doanh thu khu vực phía Nam', progress: 75, kr: 3 },
            { title: 'Cải thiện chỉ số hài lòng khách hàng (NPS)', progress: 40, kr: 4 },
            { title: 'Tối ưu quy trình vận hành nội bộ', progress: 90, kr: 2 },
          ].map((okr, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
              <div className="p-6 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">O{i+1}</div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{okr.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${okr.progress}%` }} />
                    </div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{okr.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{okr.kr} KRs</span>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="px-6 pb-6 pt-0 space-y-3">
                {Array.from({ length: okr.kr }).map((_, j) => (
                  <div key={j} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                    {j === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-300" />}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex-1">Kết quả then chốt {j+1}: Đạt chỉ tiêu X trong tháng Y</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400">80/100</span>
                       <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-3.5 h-3.5" /> Thêm KR
                </button>
              </div>
            </div>
          ))}
        </div>
      </MainContentWrapper>
    </div>
  );
};

const DeptOKRView = () => {
  return (
    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-6">
      <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">OKR Phòng ban</h3>
      <p className="text-slate-500 dark:text-slate-400">Quản lý và theo dõi mục tiêu cấp phòng ban.</p>
    </div>
  );
};

const CompanyOKRView = () => {
  return (
    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-6">
      <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">OKR Công ty</h3>
      <p className="text-slate-500 dark:text-slate-400">Mục tiêu chiến lược cấp công ty.</p>
    </div>
  );
};

const KPIEvaluationView = () => {
  return (
    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-6">
      <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Đánh giá KPI</h3>
      <p className="text-slate-500 dark:text-slate-400">Đánh giá hiệu suất và chấm điểm KPI định kỳ.</p>
    </div>
  );
};

const OKRReportView = () => {
  return (
    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-6">
      <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Báo cáo OKR</h3>
      <p className="text-slate-500 dark:text-slate-400">Phân tích và báo cáo tiến độ OKR.</p>
    </div>
  );
};

export const ObjectivesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('OKR của tôi');

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto p-4 md:p-8">
      <Banner 
        title="Quản trị Mục tiêu (OKR)" 
        icon={<Target />} 
        description="Quản lý mục tiêu và các kết quả then chốt theo phương pháp OKR, đồng bộ hiệu suất từ cá nhân đến cấp tổ chức."
      />

      <Tabs 
        items={['OKR của tôi', 'OKR Phòng ban', 'OKR Công ty', 'Đánh giá KPI', 'Báo cáo']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="mt-4">
        {activeTab === 'OKR của tôi' && <CoreObjectivesView />}
        {activeTab === 'OKR Phòng ban' && <DeptOKRView />}
        {activeTab === 'OKR Công ty' && <CompanyOKRView />}
        {activeTab === 'Đánh giá KPI' && <KPIEvaluationView />}
        {activeTab === 'Báo cáo' && <OKRReportView />}
      </div>
    </div>
  );
};
