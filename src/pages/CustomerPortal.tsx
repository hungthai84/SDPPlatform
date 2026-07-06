import React, { useState, useEffect } from 'react';
import { mockTickets } from '../data';
import { Search, Plus, LifeBuoy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

export const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [config, setConfig] = useState<HelpdeskConfig>({
    title: 'OmniHelp Portal',
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
      } catch {}
    }
  }, []);

  const customerTickets = mockTickets.filter(t => t.customerId === 'c2'); // Mocking logged in as c2
  
  const displayTickets = customerTickets.filter(t => 
    activeTab === 'open' 
      ? ['new', 'assigned', 'in_progress', 'pending'].includes(t.status)
      : ['solved', 'closed'].includes(t.status)
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 font-sans" style={{ backgroundColor: config.bgColor }}>
      {/* Customer Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-md" style={{ backgroundColor: config.themeColor }}>
                {config.title.charAt(0)}
              </div>
              <span className="font-semibold text-slate-900">{config.title} Portal</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <a href="/portal" className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm" style={{ backgroundColor: `${config.themeColor}12`, color: config.themeColor }}>Yêu cầu của tôi</a>
              <a href="/help-center" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm">Trung tâm trợ giúp</a>
              {config.showCommunity && (
                <a href="/community" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium text-sm">Cộng đồng</a>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-900"><Search size={20} /></button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium group-hover:bg-slate-300 transition-colors">
                B
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Trần Thị B</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Yêu cầu của tôi</h1>
            <p className="text-slate-500 mt-1">Quản lý và theo dõi các vé hỗ trợ của bạn.</p>
          </div>
          <button 
            className="text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md hover:opacity-95"
            style={{ backgroundColor: config.themeColor }}
          >
            <Plus size={18} />
            Gửi yêu cầu mới
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-2 flex">
            <button 
              onClick={() => setActiveTab('open')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", 
                activeTab === 'open' ? "text-slate-900 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
              style={activeTab === 'open' ? { borderColor: config.themeColor, color: config.themeColor } : {}}
            >
              Mở hoặc Đang chờ xử lý
            </button>
            <button 
              onClick={() => setActiveTab('closed')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", 
                activeTab === 'closed' ? "text-slate-900 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
              style={activeTab === 'closed' ? { borderColor: config.themeColor, color: config.themeColor } : {}}
            >
              Đã giải quyết hoặc Đã đóng
            </button>
          </div>

          <div className="p-0 overflow-x-auto">
            {displayTickets.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-200">Chủ đề</th>
                    <th className="px-6 py-3 border-b border-slate-200 w-32">Mã vé</th>
                    <th className="px-6 py-3 border-b border-slate-200 w-32">Trạng thái</th>
                    <th className="px-6 py-3 border-b border-slate-200 w-48">Hoạt động cuối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {ticket.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border",
                          ticket.status === 'new' ? 'bg-red-50 text-red-700 border-red-100' :
                          ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          ticket.status === 'solved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        )}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                <LifeBuoy size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Không tìm thấy yêu cầu nào</h3>
                <p>Bạn không có yêu cầu hỗ trợ nào {activeTab === 'open' ? 'đang mở' : 'đã đóng'}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
