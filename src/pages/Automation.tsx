import React, { useState } from 'react';
import { Zap, Play, Pause, Plus, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

export const Automation = () => {
  const [rules, setRules] = useState([
    { id: 1, name: 'Phân loại tự động theo từ khóa', description: 'Tự động gán nhãn "Kỹ thuật" khi nội dung có chứa "lỗi", "crash", "bug".', active: true, triggerCount: 142 },
    { id: 2, name: 'Chuyển vé cho bộ phận VIP', description: 'Gửi thẳng vé của khách hàng phân hạng VIP đến nhóm Hỗ trợ Ưu tiên.', active: true, triggerCount: 58 },
    { id: 3, name: 'Phản hồi tự động ngoài giờ làm việc', description: 'Tự động trả lời khách hàng khi họ gửi yêu cầu từ 18:00 đến 08:00 sáng hôm sau.', active: false, triggerCount: 312 },
    { id: 4, name: 'Cảnh báo quá hạn giải quyết SLA', description: 'Cảnh báo quản trị viên khi vé ở trạng thái "Đang xử lý" quá 4 tiếng không đổi.', active: true, triggerCount: 19 }
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cấu hình Quy tắc Tự động hóa</h2>
          <p className="text-xs text-slate-500">Tối ưu hóa thời gian xử lý và phân bổ tài nguyên tự động cho doanh nghiệp.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={14} /> Thêm quy tắc mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${rule.active ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  <Zap size={18} className={rule.active ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    {rule.name}
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${rule.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {rule.active ? 'Đang chạy' : 'Đã tạm dừng'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">{rule.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-[11px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-slate-400" /> Đã chạy: {rule.triggerCount} lần</span>
                    <span className="flex items-center gap-1"><ArrowRight size={13} className="text-slate-400" /> Bộ lọc: 1 active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${rule.active ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-100' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100'}`}
                  title={rule.active ? "Tạm dừng quy tắc" : "Kích hoạt quy tắc"}
                >
                  {rule.active ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
                  <Settings size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
