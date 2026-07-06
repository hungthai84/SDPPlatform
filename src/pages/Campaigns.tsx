import React, { useState } from 'react';
import { Megaphone, Mail, FileText, CheckCircle, BarChart3, Plus } from 'lucide-react';

export const Campaigns = () => {
  const [campaigns] = useState([
    { id: 1, name: 'Khảo sát CSAT - Quý 2/2026', type: 'Email', status: 'Đang chạy', sent: 1250, responseRate: '78%', rating: '4.8/5' },
    { id: 2, name: 'Chiến dịch giới thiệu tính năng Omnichannel', type: 'Thông báo', status: 'Sắp diễn ra', sent: 0, responseRate: '0%', rating: '-' },
    { id: 3, name: 'Khảo sát trải nghiệm sau bàn giao VIP', type: 'Email', status: 'Đã hoàn thành', sent: 480, responseRate: '92%', rating: '4.9/5' }
  ]);

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quản lý Chiến dịch Chăm sóc Chủ động</h2>
          <p className="text-xs text-slate-500">Thiết lập các kịch bản gửi khảo sát hoặc giới thiệu tính năng chủ động tới khách hàng.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={14} /> Thêm chiến dịch mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">CHIẾN DỊCH HOẠT ĐỘNG</span>
            <Megaphone size={16} className="text-blue-500 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">2 chiến dịch</h3>
          <p className="text-[11px] text-slate-500 mt-1">Đang trực tiếp gửi khảo sát tới người dùng</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">TỶ LỆ PHẢN HỒI (AVG)</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">85%</h3>
          <p className="text-[11px] text-slate-500 mt-1">Cao hơn 4.2% so với quý trước <span className="text-emerald-600 font-bold">↑</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">LƯỢT ĐÁNH GIÁ ĐÃ NHẬN</span>
            <BarChart3 size={16} className="text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">1,730 lượt</h3>
          <p className="text-[11px] text-slate-500 mt-1">94% ý kiến phản hồi tích cực</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Danh sách chiến dịch đã tạo</h3>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-semibold text-xs">
            <tr>
              <th className="px-5 py-3.5 border-b border-slate-200">Tên chiến dịch</th>
              <th className="px-5 py-3.5 border-b border-slate-200">Hình thức</th>
              <th className="px-5 py-3.5 border-b border-slate-200">Trạng thái</th>
              <th className="px-5 py-3.5 border-b border-slate-200">Đã gửi</th>
              <th className="px-5 py-3.5 border-b border-slate-200">Tỷ lệ trả lời</th>
              <th className="px-5 py-3.5 border-b border-slate-200">Điểm đánh giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-slate-900">{camp.name}</td>
                <td className="px-5 py-3.5 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    {camp.type === 'Email' ? <Mail size={13} className="text-slate-400" /> : <FileText size={13} className="text-slate-400" />}
                    {camp.type}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] ${
                    camp.status === 'Đang chạy' ? 'bg-blue-50 text-blue-700' :
                    camp.status === 'Sắp diễn ra' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {camp.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600 font-medium">{camp.sent > 0 ? camp.sent.toLocaleString() : '-'}</td>
                <td className="px-5 py-3.5 text-slate-600 font-bold">{camp.responseRate}</td>
                <td className="px-5 py-3.5 text-slate-900 font-extrabold text-blue-600">{camp.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
