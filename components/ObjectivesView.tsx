import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { TargetIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon, CheckCircleIcon, UserIcon } from './icons';

interface ObjectivesViewProps {
  user: User | null;
}

interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  owner: string;
  avatar: string;
}

interface Objective {
  id: string;
  title: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind';
  owner: string;
  avatar: string;
  keyResults: KeyResult[];
}

const mockObjectives: Objective[] = [
  {
    id: 'obj-1',
    title: 'Tăng trưởng doanh thu bứt phá Q3',
    progress: 68,
    status: 'on_track',
    owner: 'Hung Thai',
    avatar: 'https://i.pravatar.cc/150?u=8',
    keyResults: [
      { id: 'kr-1', title: 'Đạt doanh số bán mới', target: 500, current: 350, unit: 'Triệu', owner: 'Trí Nhân', avatar: 'https://i.pravatar.cc/150?u=10' },
      { id: 'kr-2', title: 'Tăng tỷ lệ chốt sales (Win rate)', target: 25, current: 20, unit: '%', owner: 'Lê Thị Bình', avatar: 'https://i.pravatar.cc/150?u=2' }
    ]
  },
  {
    id: 'obj-2',
    title: 'Nâng cao trải nghiệm khách hàng (CX)',
    progress: 45,
    status: 'at_risk',
    owner: 'Trí Nhân',
    avatar: 'https://i.pravatar.cc/150?u=10',
    keyResults: [
      { id: 'kr-3', title: 'Điểm CSAT trung bình', target: 95, current: 82, unit: '%', owner: 'Phạm Minh Cường', avatar: 'https://i.pravatar.cc/150?u=3' },
      { id: 'kr-4', title: 'Giảm thời gian phản hồi (SLA)', target: 2, current: 4, unit: 'Giờ', owner: 'Vũ Thị Dung', avatar: 'https://i.pravatar.cc/150?u=4' }
    ]
  },
  {
    id: 'obj-3',
    title: 'Mở rộng thị trường miền Trung',
    progress: 15,
    status: 'behind',
    owner: 'Lê Thị Bình',
    avatar: 'https://i.pravatar.cc/150?u=2',
    keyResults: [
      { id: 'kr-5', title: 'Mở mới đại lý', target: 10, current: 1, unit: 'Đại lý', owner: 'Hoàng Văn Em', avatar: 'https://i.pravatar.cc/150?u=5' }
    ]
  }
];

const ObjectivesView: React.FC<ObjectivesViewProps> = ({ user }) => {
  const [expandedObj, setExpandedObj] = useState<string | null>('obj-1');

  const toggleExpand = (id: string) => {
    setExpandedObj(expandedObj === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-emerald-500';
      case 'at_risk': return 'bg-amber-500';
      case 'behind': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_track': return 'Đúng tiến độ';
      case 'at_risk': return 'Rủi ro';
      case 'behind': return 'Chậm trễ';
      default: return 'Chưa rõ';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
              <TargetIcon className="w-6 h-6" />
            </div>
            Quản trị Mục tiêu (OKRs)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Đo lường tiến độ, căn chỉnh mục tiêu chiến lược và kết quả then chốt.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95">
          <PlusIcon className="w-5 h-5" />
          Tạo Mục tiêu
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 pb-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
            <TargetIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tổng Mục tiêu</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">12</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Đúng tiến độ</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">8</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Cần chú ý</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">3</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Chậm trễ</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">1</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Danh sách Mục tiêu (OKRs)</h2>
            <div className="flex gap-2">
              <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-transparent text-slate-700 dark:text-slate-300">
                <option>Quý 3, 2026</option>
                <option>Quý 2, 2026</option>
                <option>Cả năm 2026</option>
              </select>
              <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-transparent text-slate-700 dark:text-slate-300">
                <option>Tất cả phòng ban</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Product</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {mockObjectives.map(obj => {
              const isExpanded = expandedObj === obj.id;
              return (
                <div key={obj.id} className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  {/* Objective Row */}
                  <div 
                    className="flex items-center px-6 py-4 cursor-pointer gap-4"
                    onClick={() => toggleExpand(obj.id)}
                  >
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                      {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Mục tiêu
                        </span>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{obj.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <img src={obj.avatar} alt={obj.owner} className="w-5 h-5 rounded-full" />
                          <span>{obj.owner}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(obj.status)}`} />
                          <span>{getStatusText(obj.status)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-48">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Tiến độ</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{obj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${getStatusColor(obj.status)}`}
                          style={{ width: `${obj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Key Results */}
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50"
                    >
                      {obj.keyResults.map(kr => {
                        const krProgress = Math.round((kr.current / kr.target) * 100);
                        return (
                          <div key={kr.id} className="flex items-center px-6 py-3 pl-16 gap-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                  KR
                                </span>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{kr.title}</h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <img src={kr.avatar} alt={kr.owner} className="w-4 h-4 rounded-full" />
                                <span>{kr.owner}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {kr.current} / {kr.target} <span className="text-xs font-normal text-slate-500">{kr.unit}</span>
                              </span>
                              <div className="w-32 mt-1">
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full bg-indigo-500 transition-all duration-1000"
                                    style={{ width: `${krProgress > 100 ? 100 : krProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="px-6 py-3 pl-16">
                        <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                          <PlusIcon className="w-4 h-4" />
                          Thêm Kết quả then chốt
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectivesView;
