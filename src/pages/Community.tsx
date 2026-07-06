import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export const Community = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const discussions = [
    {
      id: 1,
      title: 'Làm thế nào để tích hợp API với hệ thống nội bộ?',
      author: 'Nguyễn Văn A',
      avatar: 'N',
      category: 'Tích hợp & API',
      views: 128,
      replies: 5,
      likes: 12,
      time: '2 giờ trước',
      isHot: true
    },
    {
      id: 2,
      title: 'Lỗi không thể tải lên hình ảnh trong vé hỗ trợ',
      author: 'Trần Thị B',
      avatar: 'T',
      category: 'Báo lỗi',
      views: 56,
      replies: 2,
      likes: 3,
      time: '5 giờ trước',
      isHot: false
    },
    {
      id: 3,
      title: 'Góp ý: Thêm tính năng phân loại khách hàng tự động',
      author: 'Lê Hoàng C',
      avatar: 'L',
      category: 'Góp ý tính năng',
      views: 342,
      replies: 15,
      likes: 45,
      time: '1 ngày trước',
      isHot: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">OmniHelp</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <a href="/portal" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm">Yêu cầu của tôi</a>
            <a href="/help-center" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm">Trung tâm trợ giúp</a>
            <a href="/community" className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm">Cộng đồng</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Diễn đàn Cộng đồng</h1>
            <p className="text-slate-500 mt-2">Thảo luận, chia sẻ kinh nghiệm và kết nối với người dùng khác.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={20} />
            Tạo chủ đề mới
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Feed */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="border-b border-slate-200 px-4 py-3 flex gap-2 overflow-x-auto">
                {['recent', 'hot', 'unanswered'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                      activeTab === tab 
                        ? "bg-slate-100 text-slate-900" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    )}
                  >
                    {tab === 'recent' ? 'Mới nhất' : tab === 'hot' ? 'Sôi nổi' : 'Chưa trả lời'}
                  </button>
                ))}
              </div>
              
              <div className="divide-y divide-slate-100">
                {discussions.map((item) => (
                  <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                          {item.category}
                        </span>
                        {item.isHot && (
                          <span className="text-xs font-medium bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                            Nổi bật
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="font-medium text-slate-700">{item.author}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-slate-500 shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-700">{item.likes}</span>
                        <span className="text-xs">Thích</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-700">{item.replies}</span>
                        <span className="text-xs">Trả lời</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-700">{item.views}</span>
                        <span className="text-xs">Lượt xem</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button className="text-blue-600 font-medium hover:text-blue-700 hover:underline">Tải thêm</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4">Danh mục</h3>
              <ul className="space-y-2">
                {['Thông báo (12)', 'Thảo luận chung (45)', 'Hỏi đáp (89)', 'Góp ý tính năng (34)', 'Báo lỗi (21)'].map((cat, i) => (
                  <li key={i}>
                    <a href="#" className="text-slate-600 hover:text-blue-600 text-sm flex items-center justify-between group">
                      <span>{cat.split(' (')[0]}</span>
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {cat.split('(')[1].replace(')', '')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 OmniHelp. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
};
