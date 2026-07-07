import React, { useState } from 'react';
import { 
  Building2, Box, Users, 
  BarChart, Receipt, Truck, ArrowRight,
  CircleDollarSign
} from 'lucide-react';
import { Banner, Tabs, StatsGrid, MainContentWrapper } from './StandardLayout';

export const ERPView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto p-4 md:p-8">
      <Banner 
        title="Quản trị Doanh nghiệp (ERP)" 
        icon={<Building2 />} 
        description="Quản lý toàn diện các nguồn lực cốt lõi của doanh nghiệp: tài chính, nhân sự, chuỗi cung ứng và sản xuất."
      />

      <Tabs 
        items={['Tổng quan', 'Tài chính', 'Mua hàng', 'Kho', 'Sản xuất']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Doanh thu thuần', value: '45.2B', trend: '+8%' },
        { label: 'Chi phí', value: '31.5B', color: 'text-rose-500' },
        { label: 'Lợi nhuận', value: '13.7B', trend: '+12%' },
        { label: 'Đơn hàng SX', value: '156', color: 'text-indigo-600' },
      ]} />

      <MainContentWrapper 
        createLabel="Tạo giao dịch mới" 
        onCreate={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <div className={`p-6 gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
          {[
            { title: 'Quản lý Tài chính', icon: <CircleDollarSign />, status: 'Đang hoạt động', color: 'bg-indigo-600' },
            { title: 'Quản lý Chuỗi cung ứng', icon: <Truck />, status: 'Cảnh báo tồn kho', color: 'bg-rose-600' },
            { title: 'Kế hoạch Sản xuất', icon: <Box />, status: 'Ổn định', color: 'bg-emerald-600' },
            { title: 'Quản lý Nhân sự', icon: <Users />, status: 'Đang hoạt động', color: 'bg-blue-600' },
            { title: 'Hóa đơn & Chứng từ', icon: <Receipt />, status: '5 cần duyệt', color: 'bg-amber-600' },
            { title: 'Báo cáo BI', icon: <BarChart />, status: 'Cập nhật', color: 'bg-slate-600' },
          ].map((module, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all p-6">
              <div className={`w-14 h-14 rounded-2xl ${module.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${module.color.replace('bg-', '')}/30`}>
                {module.icon}
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight mb-2">{module.title}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{module.status}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all">
                  Mở phân hệ <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </MainContentWrapper>
    </div>
  );
};
