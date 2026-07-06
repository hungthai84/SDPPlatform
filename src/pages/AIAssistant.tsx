import React, { useState } from 'react';
import { Sparkles, Brain, Bot, ShieldCheck, Heart, ArrowUpRight, CheckCircle } from 'lucide-react';

export const AIAssistant = () => {
  const [aiConfigs] = useState([
    { id: 1, feature: 'Phân tích sắc thái (Sentiment Analysis)', status: 'Hoạt động', detail: 'Tự động gán nhãn Tích cực, Tiêu cực, Trung lập dựa trên cảm xúc tin nhắn.', active: true },
    { id: 2, feature: 'Đề xuất câu trả lời thông minh (Smart Reply)', status: 'Hoạt động', detail: 'Đề xuất 3 phương án trả lời nhanh dựa trên lịch sử dữ liệu.', active: true },
    { id: 3, feature: 'Phân loại tự động (Auto Categorization)', status: 'Hoạt động', detail: 'Tự động phân nhóm vé vào các phòng ban: Kỹ thuật, Hóa đơn, Kinh doanh.', active: true },
    { id: 4, feature: 'Tự động tóm tắt cuộc hội thoại (AI Summarization)', status: 'Đang tắt', detail: 'Tạo tóm tắt ngắn cho vé sau khi được giải quyết xong.', active: false }
  ]);

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">OmniAI - Trợ lý AI Thông minh</h2>
          <p className="text-xs text-slate-500">Giúp tối ưu hóa quy trình làm việc, tự động hóa phản hồi và nâng cao mức độ hài lòng khách hàng.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-md">
          <Sparkles size={14} className="animate-spin-slow" /> Trực tuyến & Sẵn sàng
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +15%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-0.5">88%</h3>
            <p className="text-xs font-semibold text-slate-500">Độ chính xác phân loại</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Bot className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +8%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-0.5">1,240</h3>
            <p className="text-xs font-semibold text-slate-500">Vé đã được AI gán nhãn</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              96% hài lòng
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-0.5">4.9/5</h3>
            <p className="text-xs font-semibold text-slate-500">Đánh giá độ chính xác AI</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tiết kiệm 40%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-0.5">2.5 giờ</h3>
            <p className="text-xs font-semibold text-slate-500">TG xử lý trung bình giảm</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Các phân hệ AI khả dụng</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {aiConfigs.map((config) => (
            <div key={config.id} className="p-5 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs">{config.feature}</h4>
                  <p className="text-xs text-slate-500 mt-1">{config.detail}</p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <button className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  config.active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                } transition-all cursor-pointer`}>
                  {config.active ? 'Kích hoạt' : 'Bật tính năng'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
