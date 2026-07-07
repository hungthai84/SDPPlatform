import React, { useState } from 'react';
import { 
  Users, Rocket, ClipboardList, Heart, 
  MoreVertical, Sparkles, AlertCircle, PieChart, ChevronRight,
  Plus, FileText, TrendingUp
} from 'lucide-react';
import { Banner, Tabs, StatsGrid, MainContentWrapper } from './StandardLayout';

// --- Individual Module Views ---

export const CorePersonnelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Danh sách');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="animate-fade-in mx-auto py-4">
      <Tabs 
        items={['Danh sách', 'Sơ đồ tổ chức', 'Hợp đồng', 'Bảo hiểm']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Tổng nhân sự', value: '156', trend: '+12%' },
        { label: 'Nhân viên mới', value: '8', trend: '+2%' },
        { label: 'Nghỉ việc', value: '2', color: 'text-red-500' },
        { label: 'Tỷ lệ biến động', value: '1.4%', trend: '-0.5%' },
      ]} />

      <MainContentWrapper 
        createLabel="Thêm nhân viên" 
        onCreate={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-xs font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Phòng ban</th>
                <th className="px-6 py-4">Chức vụ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Nguyễn Văn A', dept: 'Kỹ thuật', pos: 'Fullstack Developer', status: 'Đang làm việc', avatar: 'https://ui-avatars.com/api/?name=NV+A&background=6366f1&color=fff' },
                { name: 'Trần Thị B', dept: 'Marketing', pos: 'Content Creator', status: 'Đang làm việc', avatar: 'https://ui-avatars.com/api/?name=TT+B&background=10b981&color=fff' },
                { name: 'Lê Văn C', dept: 'Nhân sự', pos: 'HR Manager', status: 'Nghỉ phép', avatar: 'https://ui-avatars.com/api/?name=LV+C&background=f59e0b&color=fff' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ID: EMP-00{i+1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{user.dept}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{user.pos}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${user.status === 'Nghỉ phép' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContentWrapper>
    </div>
  );
};

export const RecruitmentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tin tuyển dụng');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Tin tuyển dụng', 'Ứng viên', 'Quy trình', 'Báo cáo']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Tin đang đăng', value: '12', trend: '+2' },
        { label: 'Ứng viên mới', value: '45', trend: '+15%' },
        { label: 'Phỏng vấn', value: '8', color: 'text-indigo-600' },
        { label: 'Đã tuyển', value: '3', trend: '+1' },
      ]} />

      <MainContentWrapper createLabel="Đăng tin mới" onCreate={() => {}}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-50/30 dark:bg-slate-900">
          {['Mới nhận (4)', 'Đang phỏng vấn (2)', 'Đề nghị (1)'].map((col, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="font-black text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">{col}</h3>
                <button className="p-1 hover:bg-white rounded-lg transition-all"><Plus className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                {[1, 2].map((card, j) => (
                  <div key={j} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 border-l-indigo-500">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">Ứng viên #{i}{j}</span>
                      <button className="text-slate-300 hover:text-slate-500 transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Trần Anh Tuấn</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 italic">Vị trí: Senior Backend Developer</p>
                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-4 mt-auto">
                      <div className="flex -space-x-2">
                        <img src="https://ui-avatars.com/api/?name=Reviewer+1" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                        <img src="https://ui-avatars.com/api/?name=Reviewer+2" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Cập nhật 2 giờ trước</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MainContentWrapper>
    </div>
  );
};

export const OnboardingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Quy trình');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Quy trình', 'Đào tạo', 'Người hướng dẫn', 'Phản hồi']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Đang hội nhập', value: '12', trend: '+3' },
        { label: 'Hoàn thành', value: '24', trend: '100%' },
        { label: 'Tỷ lệ hài lòng', value: '4.8/5', color: 'text-orange-500' },
        { label: 'Thời gian TB', value: '14 ngày', trend: '-2 ngày' },
      ]} />

      <MainContentWrapper createLabel="Thiết lập quy trình" onCreate={() => {}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-orange-500" /> 
              Checklist hội nhập chuẩn
            </h3>
            <div className="space-y-3">
              {['Tạo tài khoản Email & Slack', 'Bàn giao thiết bị làm việc', 'Ký hợp đồng lao động', 'Tham gia buổi đào tạo văn hóa', 'Setup bàn làm việc & Welcome Kit'].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-orange-200 transition-all">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="w-5 h-5 rounded-md text-orange-500 border-slate-300 focus:ring-orange-500/20" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{task}</span>
                  <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-500" /> 
              Tân binh nổi bật
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((u) => (
                <div key={u} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=New+User+${u}&background=random`} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">Lê Văn Mới {u}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Start Date: 15/10/2023</p>
                    </div>
                  </div>
                  <button className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-4 py-1.5 rounded-lg text-xs font-black hover:bg-indigo-600 hover:text-white transition-all">CHÀO MỪNG</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainContentWrapper>
    </div>
  );
};

export const LeaveView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Đơn xin nghỉ');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Đơn xin nghỉ', 'Quỹ phép', 'Lịch nghỉ team', 'Cấu hình']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <StatsGrid stats={[
        { label: 'Phép năm còn lại', value: '10 ngày', trend: 'Ổn định' },
        { label: 'Đã nghỉ', value: '2 ngày', color: 'text-slate-500' },
        { label: 'Chờ duyệt', value: '1 đơn', color: 'text-orange-500' },
        { label: 'Bù phép', value: '1.5 ngày', trend: '+0.5' },
      ]} />

      <MainContentWrapper createLabel="Đăng ký nghỉ phép" onCreate={() => {}}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-xs font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Loại nghỉ</th>
                <th className="px-6 py-4">Lý do</th>
                <th className="px-6 py-4">Người duyệt</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">10/10/2023 - 11/10/2023</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">2 NGÀY</p>
                </td>
                <td className="px-6 py-5">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    Nghỉ phép năm
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-500 italic max-w-xs truncate">Giải quyết việc riêng gia đình</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=Manager" className="w-6 h-6 rounded-lg" alt="" />
                    <span className="text-sm font-bold">HR Manager</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">ĐÃ DUYỆT</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </MainContentWrapper>
    </div>
  );
};

export const TimekeepingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Bảng công');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Bảng công', 'Đơn giải trình', 'Lịch sử chấm', 'Báo cáo muộn']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <div className="w-40 h-40 rounded-full border-[10px] border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8 bg-slate-50/50 dark:bg-slate-800/30 shadow-inner">
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">08:45</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Check-in</p>
            </div>
          </div>
          <button className="w-full py-4.5 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]">CHẤM CÔNG VÀO</button>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <AlertCircle className="w-3.5 h-3.5" />
            Văn phòng: Quận 1, TP.HCM
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest">Lịch chấm công Tháng 10</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold">● Đủ công</div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold">● Đi muộn</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`h-16 flex flex-col items-center justify-center rounded-2xl text-sm font-black transition-all cursor-default ${i < 10 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400'}`}>
                <span>{i + 1}</span>
                {i < 10 && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PayrollView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Phiếu lương');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Phiếu lương', 'Bảng lương tổng', 'Cấu hình lương', 'Thuế & BH']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <FileText className="w-12 h-12 text-indigo-500/10" />
          </div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Phiếu lương Tháng 09/2023</h3>
            <button className="text-indigo-600 dark:text-indigo-400 text-xs font-black hover:underline underline-offset-4">XEM CHI TIẾT</button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Lương cơ bản', value: '15,000,000 đ' },
              { label: 'Phụ cấp ăn trưa', value: '1,000,000 đ' },
              { label: 'Thưởng hiệu quả', value: '2,000,000 đ', highlight: true },
              { label: 'Đóng bảo hiểm (BHXH)', value: '-1,575,000 đ', negative: true },
            ].map((item, i) => (
              <div key={i} className={`flex justify-between p-4 rounded-2xl border transition-all ${item.highlight ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50' : 'bg-slate-50 dark:bg-slate-800/30 border-transparent'}`}>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-bold">{item.label}</span>
                <span className={`font-black ${item.negative ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between p-6 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 dark:shadow-none mt-4 group">
              <div className="flex flex-col">
                <span className="font-black text-xs uppercase tracking-widest opacity-80 mb-1">Thực lĩnh nhận về</span>
                <span className="font-black text-3xl tracking-tighter">16,425,000 đ</span>
              </div>
              <button className="self-end bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all"><Plus className="w-5 h-5 rotate-45" /></button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" />
            Biểu đồ thu nhập 6 tháng
          </h3>
          <div className="flex items-end justify-between gap-3 h-64 mt-12">
            {[45, 60, 55, 75, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div 
                  className="w-full bg-indigo-500 rounded-t-2xl transition-all duration-700 hover:bg-indigo-600 cursor-help group relative" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {(h * 200000).toLocaleString()}đ
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">T0{i+4}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenefitsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Danh sách đãi ngộ');

  return (
    <div className="animate-fade-in mx-auto py-4">

      <Tabs 
        items={['Danh sách đãi ngộ', 'Đăng ký sử dụng', 'Lịch sử nhận', 'Cấu hình gói']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { title: 'Bảo hiểm PVI', desc: 'Gói chăm sóc cao cấp', icon: <Heart className="w-6 h-6 text-pink-500" />, count: 'Hoạt động' },
          { title: 'Gym Member', desc: 'California Fitness', icon: <TrendingUp className="w-6 h-6 text-indigo-500" />, count: '12/12 buổi' },
          { title: 'Coursera Account', desc: 'Unlimited Learning', icon: <Rocket className="w-6 h-6 text-orange-500" />, count: '2 khóa học' },
          { title: 'Voucher Team', desc: 'Ăn uống cuối tháng', icon: <Users className="w-6 h-6 text-emerald-500" />, count: '1,000,000đ' },
        ].map((benefit, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:scale-[1.03] transition-all cursor-pointer group">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit mb-6 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-all">
              {benefit.icon}
            </div>
            <h4 className="font-black text-slate-900 dark:text-white mb-2 text-lg tracking-tight">{benefit.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">{benefit.desc}</p>
            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-4">
               <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{benefit.count}</span>
               <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <MainContentWrapper createLabel="Thêm phúc lợi" onCreate={() => {}}>
         <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2">Chưa có hoạt động mới</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">Bạn có thể thiết lập các chương trình phúc lợi mới để khuyến khích tinh thần làm việc của đội ngũ.</p>
         </div>
      </MainContentWrapper>
    </div>
  );
};

export const PersonnelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tổng quan');

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto p-4 md:p-8">
      <Banner 
        title="Quản lý Nhân sự (HRM)" 
        icon={<Users />} 
        description="Quản lý toàn diện vòng đời nhân viên từ tuyển dụng, hội nhập, đến lương thưởng và phúc lợi."
      />

      <Tabs 
        items={['Tổng quan', 'Tuyển dụng', 'Hội nhập', 'Nghỉ phép', 'Chấm công', 'Lương', 'Phúc lợi']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="mt-4">
        {activeTab === 'Tổng quan' && <CorePersonnelView />}
        {activeTab === 'Tuyển dụng' && <RecruitmentView />}
        {activeTab === 'Hội nhập' && <OnboardingView />}
        {activeTab === 'Nghỉ phép' && <LeaveView />}
        {activeTab === 'Chấm công' && <TimekeepingView />}
        {activeTab === 'Lương' && <PayrollView />}
        {activeTab === 'Phúc lợi' && <BenefitsView />}
      </div>
    </div>
  );
};
