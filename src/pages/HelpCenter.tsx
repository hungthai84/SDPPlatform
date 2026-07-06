import React, { useState, useEffect } from 'react';
import { Search, Book, FileText, Video, Plus, HelpCircle as QuestionIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface HelpdeskConfig {
  title: string;
  bannerTitle: string;
  bannerSubtitle: string;
  themeColor: string;
  bgColor: string;
  layout: 'standard' | 'minimalist' | 'modern';
  logoUrl: string;
  showCommunity: boolean;
  showSubmitTicket: boolean;
  contactEmail: string;
  contactPhone: string;
}

export const HelpCenter = () => {
  const [config, setConfig] = useState<HelpdeskConfig>({
    title: 'OmniHelp Trung tâm trợ giúp',
    bannerTitle: 'Bạn cần giúp đỡ gì?',
    bannerSubtitle: 'Tìm kiếm các bài viết, hướng dẫn và giải pháp cho mọi vấn đề.',
    themeColor: '#2563eb', // blue-600
    bgColor: '#f8fafc', // slate-50
    layout: 'standard',
    logoUrl: '',
    showCommunity: true,
    showSubmitTicket: true,
    contactEmail: 'support@company.com',
    contactPhone: '1900 1234'
  });

  useEffect(() => {
    const saved = localStorage.getItem('helpdesk_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading helpdesk config', e);
      }
    }

    // Support listening to real-time changes if edited in other tabs/customizer
    const handleStorageChange = () => {
      const updated = localStorage.getItem('helpdesk_config');
      if (updated) {
        try {
          setConfig(JSON.parse(updated));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: config.bgColor }}>
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: config.themeColor }}>
              {config.title.charAt(0)}
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">{config.title}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <a href="/portal" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm transition-colors">Yêu cầu của tôi</a>
            <a href="/help-center" className="px-3 py-2 rounded-md font-medium text-sm transition-colors" style={{ backgroundColor: `${config.themeColor}12`, color: config.themeColor }}>Trung tâm trợ giúp</a>
            {config.showCommunity && (
              <a href="/community" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm transition-colors">Cộng đồng</a>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Banner Section with customized text and theme color background */}
        <section className="text-white py-16 px-4 transition-all duration-300 relative overflow-hidden" style={{ backgroundColor: config.themeColor }}>
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className={cn(
              "font-extrabold mb-4 tracking-tight drop-shadow-sm transition-all",
              config.layout === 'minimalist' ? 'text-2xl' : config.layout === 'modern' ? 'text-5xl' : 'text-4xl'
            )}>
              {config.bannerTitle}
            </h1>
            <p className="opacity-90 mb-8 text-sm md:text-lg max-w-xl mx-auto">
              {config.bannerSubtitle}
            </p>
            
            <div className="relative max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu, bài viết hướng dẫn..." 
                className="w-full pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white transition-all text-sm"
                style={{ '--tw-ring-color': config.themeColor } as React.CSSProperties}
              />
            </div>
          </div>
        </section>

        {/* Categories Grid (dynamic rendering based on Layout) */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-8 text-center uppercase tracking-wider">Duyệt kiến thức theo chủ đề</h2>
          
          <div className={cn(
            "grid gap-6",
            config.layout === 'standard' ? 'grid-cols-1 md:grid-cols-3' : config.layout === 'modern' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          )}>
            {[
              { icon: Book, title: 'Bắt đầu sử dụng', desc: 'Hướng dẫn thiết lập tài khoản, cài đặt ban đầu và các tính năng cốt lõi.' },
              { icon: FileText, title: 'Tài khoản & Hóa đơn', desc: 'Thay đổi gói cước dịch vụ, quản lý phương thức thanh toán và xem biên lai.' },
              { icon: QuestionIcon, title: 'Câu hỏi thường gặp (FAQs)', desc: 'Tổng hợp các giải đáp nhanh cho thắc mắc phổ biến của người dùng.' },
              { icon: Video, title: 'Video hướng dẫn', desc: 'Thao tác trực quan sinh động thông qua hệ thống video ngắn.' },
            ].map((cat, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-transparent"
                style={{ 
                  '--tw-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                } as React.CSSProperties}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${config.themeColor}12`, color: config.themeColor }}
                >
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Submit ticket section inside Help Center if enabled */}
          {config.showSubmitTicket && (
            <div className="mt-16 p-8 rounded-2xl bg-white border border-slate-200/80 shadow-md text-center max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy câu trả lời phù hợp?</h3>
              <p className="text-slate-500 text-sm mb-6">Gửi yêu cầu hỗ trợ trực tiếp tới nhân viên đại diện hỗ trợ của chúng tôi.</p>
              <button 
                onClick={() => window.location.href = '/portal'}
                className="text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: config.themeColor }}
              >
                <Plus className="w-4 h-4" /> Gửi yêu cầu hỗ trợ ngay
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>© 2026 {config.title}. Bảo lưu mọi quyền.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span>Email hỗ trợ: <strong className="text-slate-800 font-semibold">{config.contactEmail}</strong></span>
            <span>Hotline: <strong className="text-slate-800 font-semibold">{config.contactPhone}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
