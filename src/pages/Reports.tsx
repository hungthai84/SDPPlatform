import React from 'react';
import { 
  BarChart3, Users, Clock, CheckCircle2, 
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Reports = () => {
  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">1,248</h3>
          <p className="text-sm font-medium text-slate-500">Tổng vé đã nhận</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +5.4%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">1,102</h3>
          <p className="text-sm font-medium text-slate-500">Vé đã giải quyết</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3" /> -18%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">14p</h3>
          <p className="text-sm font-medium text-slate-500">Thời gian phản hồi lần đầu</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3" /> -2.1%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">94%</h3>
          <p className="text-sm font-medium text-slate-500">Điểm hài lòng (CSAT)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Lượng vé theo kênh</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Chi tiết</button>
          </div>
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
            {/* Simple CSS Bar Chart Mockup */}
            {[
              { label: 'Email', value: 80, color: 'bg-blue-500' },
              { label: 'Chat', value: 65, color: 'bg-indigo-500' },
              { label: 'Gọi', value: 45, color: 'bg-emerald-500' },
              { label: 'Facebook', value: 30, color: 'bg-blue-600' },
              { label: 'Zalo', value: 55, color: 'bg-blue-400' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{item.value}%</div>
                <div className={cn("w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80", item.color)} style={{ height: `${item.value}%` }}></div>
                <div className="text-xs font-medium text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Hiệu suất nhân viên</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Nguyễn Trần', solved: 145, csat: 98, avg: '12p' },
              { name: 'Lê Hoàng', solved: 132, csat: 95, avg: '15p' },
              { name: 'Trần Tâm', solved: 128, csat: 92, avg: '14p' },
              { name: 'Phạm Hùng', solved: 110, csat: 89, avg: '18p' },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{agent.name}</div>
                    <div className="text-xs text-slate-500">Đã giải quyết: {agent.solved} vé</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="text-right">
                    <div className="font-medium text-slate-900">{agent.csat}%</div>
                    <div className="text-xs text-slate-500">CSAT</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900">{agent.avg}</div>
                    <div className="text-xs text-slate-500">Thời gian TL</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
