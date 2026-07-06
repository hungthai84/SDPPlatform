import React from 'react';
import { TrendingUp, Users, Clock } from 'lucide-react';

export const Analytics = () => {
  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Báo cáo & Phân tích Chuyên sâu</h2>
          <p className="text-xs text-slate-500">Giám sát năng lực xử lý, thời gian giải quyết trung bình và hiệu suất SLA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">HIỆU SUẤT ĐÚNG HẠN SLA</span>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">98.4%</h3>
          <p className="text-[11px] text-slate-500 mt-1">Cao nhất trong 30 ngày gần nhất <span className="text-emerald-600 font-bold">↑</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">THỜI GIAN GIẢI QUYẾT TRUNG BÌNH</span>
            <Clock size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">1.5 giờ</h3>
          <p className="text-[11px] text-slate-500 mt-1">Nhanh hơn 12 phút so với tháng trước</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">VÉ BỊ QUÁ HẠN</span>
            <Users size={16} className="text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">3 vé</h3>
          <p className="text-[11px] text-slate-500 mt-1">Tất cả đều thuộc diện ưu tiên Trung bình</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-sm">Xu hướng khối lượng công việc theo giờ</h3>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span> Vé mới nhận
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Vé đã giải quyết
          </div>
        </div>
        
        <div className="h-48 flex items-end justify-between gap-3 px-4 pb-4 border-b border-slate-100">
          {[
            { hour: '08:00', incoming: 30, solved: 20 },
            { hour: '10:00', incoming: 85, solved: 60 },
            { hour: '12:00', incoming: 40, solved: 55 },
            { hour: '14:00', incoming: 95, solved: 80 },
            { hour: '16:00', incoming: 70, solved: 75 },
            { hour: '18:00', incoming: 25, solved: 40 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
              <div className="flex gap-1.5 w-full items-end h-full justify-center">
                <div className="w-4 bg-blue-500 rounded-t-sm transition-all duration-300" style={{ height: `${item.incoming}%` }} title={`Vé mới: ${item.incoming}`}></div>
                <div className="w-4 bg-emerald-500 rounded-t-sm transition-all duration-300" style={{ height: `${item.solved}%` }} title={`Vé đã giải quyết: ${item.solved}`}></div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1">{item.hour}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
