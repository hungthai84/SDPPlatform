import React, { useState } from 'react';
import { 
  Search, Settings as GearIcon, X, ChevronRight, 
  Sparkles, Image as ImageIcon, Video, Palette, 
  LayoutTemplate, Check, Save, Plus, Trash2, Shield, FileText,
  Globe, Building, User, Users, 
  Layers, BookOpen, ExternalLink, MessageCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';
import { imageWallpapers, videoWallpapers, gradientWallpapers, customPatterns } from '../lib/constants';

// Interface for helpdesk website settings
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

export const Settings = () => {
  const { bgType, bgValue, opacity, setBgType, setBgValue, setOpacity, sidebarOpacity, setSidebarOpacity } = useSettings();
  const [activeTab, setActiveTab] = useState(bgType !== 'none' ? bgType : 'image');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Helpdesk Builder States
  const [helpdeskConfig, setHelpdeskConfig] = useState<HelpdeskConfig>(() => {
    const saved = localStorage.getItem('helpdesk_config');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return {
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
    };
  });

  // Rebranding States
  // Other mock states for CRUD
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Công ty Cổ phần Công nghệ Omni',
    email: 'info@omnitech.vn',
    phone: '024.7300.7373',
    website: 'https://omnitech.vn',
    address: 'Tòa nhà Landmark 81, TP. Hồ Chí Minh'
  });

  const [departments, setDepartments] = useState([
    { id: '1', name: 'Dịch vụ Khách hàng', code: 'CS', lead: 'Nguyễn Trần' },
    { id: '2', name: 'Hỗ trợ Kỹ thuật', code: 'TECH', lead: 'Lê Hoàng' },
    { id: '3', name: 'Phòng Thanh toán', code: 'BILL', lead: 'Trần Tâm' }
  ]);
  const [newDept, setNewDept] = useState({ name: '', code: '', lead: '' });

  const [agents, setAgents] = useState([
    { id: '1', name: 'Nguyễn Trần', email: 'tran.nguyen@omni.vn', role: 'Quản trị viên' },
    { id: '2', name: 'Lê Hoàng', email: 'hoang.le@omni.vn', role: 'Đại diện kỹ thuật' },
    { id: '3', name: 'Trần Tâm', email: 'tam.tran@omni.vn', role: 'Đại diện thanh toán' }
  ]);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', role: 'Đại diện kỹ thuật' });

  // Save helpdesk settings
  const handleSaveHelpdesk = () => {
    localStorage.setItem('helpdesk_config', JSON.stringify(helpdeskConfig));
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    alert('Đã xuất bản thành công Website Helpdesk của bạn!');
  };

  const handleSelectBg = (type: 'image' | 'video' | 'gradient' | 'pattern' | 'none', value: string) => {
    setBgType(type);
    setBgValue(value);
  };

  // Sections configuration as displayed in the screenshot
  const settingsStructure = [
    {
      category: 'TỔ CHỨC',
      items: [
        { id: 'company', label: 'Công ty', desc: 'Hồ sơ doanh nghiệp và địa chỉ liên hệ' },
        { id: 'rebranding', label: 'Thay đổi hình ảnh thương hiệu', desc: 'Cấu hình giao diện, hình nền & độ mờ' },
        { id: 'business_hours', label: 'Giờ làm việc', desc: 'Thời gian hỗ trợ khả dụng' },
        { id: 'holidays', label: 'Danh Sách Ngày Nghỉ', desc: 'Quản lý lịch nghỉ phép và ngày lễ' },
        { id: 'departments', label: 'Phòng', desc: 'Các phòng ban giải quyết sự cố' },
        { id: 'csat', label: 'Sự Hài Lòng của Khách Hàng', desc: 'Thu thập đánh giá độ hài lòng' },
        { id: 'products', label: 'Sản phẩm', desc: 'Quản lý danh sách sản phẩm hỗ trợ' }
      ]
    },
    {
      category: 'QUẢN LÝ NGƯỜI DÙNG',
      items: [
        { id: 'agents', label: 'Đại diện', desc: 'Danh sách nhân viên hỗ trợ/đại diện' },
        { id: 'teams', label: 'Các nhóm', desc: 'Phân nhóm làm việc' },
        { id: 'roles', label: 'Vai trò', desc: 'Phân quyền dựa trên vai trò hệ thống' },
        { id: 'profiles', label: 'Tóm lược', desc: 'Cấu hình thông tin hồ sơ' },
        { id: 'data_sharing', label: 'Chia Sẻ Dữ Liệu', desc: 'Nguyên tắc chia sẻ thông tin' }
      ]
    },
    {
      category: 'KÊNH',
      items: [
        { id: 'email', label: 'Email', desc: 'Cài đặt hòm thư nhận vé' },
        { id: 'phone', label: 'Điện thoại', desc: 'Tích hợp tổng đài hỗ trợ' },
        { id: 'chat', label: 'Chat', desc: 'Live chat widget trên website' },
        { id: 'helpdesk_builder', label: 'Trung Tâm Hỗ Trợ', desc: 'Tạo & Thiết lập Website Helpdesk tự phục vụ', highlight: true },
        { id: 'im', label: 'Nhắn Tin Tức Thời', desc: 'Messenger, Zalo, WhatsApp' },
        { id: 'social', label: 'Xã hội', desc: 'Facebook Page, Instagram' },
        { id: 'webforms', label: 'Biểu mẫu Web', desc: 'Nhúng form gửi vé vào website' },
        { id: 'community', label: 'Cộng đồng', desc: 'Diễn đàn thảo luận cho khách hàng' }
      ]
    },
    {
      category: 'TỰ PHỤC VỤ',
      items: [
        { id: 'guided_conv', label: 'Nói Chuyện Có Hướng Dẫn', desc: 'Hội thoại định hướng tự động' },
        { id: 'asap', label: 'ASAP', desc: 'Tiện ích trợ giúp nhanh nhúng web/app' }
      ]
    },
    {
      category: 'TUỲ BIẾN HOÁ',
      items: [
        { id: 'buttons', label: 'Các nút', desc: 'Tùy chỉnh nút bấm giao diện' },
        { id: 'modules_tabs', label: 'Mô-đun và Tab', desc: 'Hiển thị/Ẩn các tab phân hệ chính' },
        { id: 'layouts', label: 'Bố Cục và Trường', desc: 'Cài đặt các trường dữ liệu tùy biến' },
        { id: 'general_settings', label: 'Thiết Lập Chung', desc: 'Cấu hình hệ thống mặc định' },
        { id: 'notifications', label: 'Thông báo', desc: 'Cài đặt mẫu thông báo hệ thống' },
        { id: 'languages', label: 'Ngôn ngữ', desc: 'Quản lý đa ngôn ngữ' },
        { id: 'skills', label: 'Kỹ năng', desc: 'Phân loại kỹ năng nhân viên hỗ trợ' },
        { id: 'templates', label: 'Mẫu emails', desc: 'Tạo khung phản hồi thư mẫu sẵn' }
      ]
    },
    {
      category: 'TỰ ĐỘNG HÓA',
      items: [
        { id: 'assignment', label: 'Quy Tắc Chỉ Định', desc: 'Tự động phân phối vé' },
        { id: 'workflows', label: 'Luồng công việc', desc: 'Tự động kích hoạt hành động' },
        { id: 'blueprints', label: 'Sơ đồ thiết kế', desc: 'Thiết lập quy trình xử lý vé' },
        { id: 'macros', label: 'Macros', desc: 'Thực thi hàng loạt hành động nhanh' },
        { id: 'sla', label: 'Thỏa Thuận Cấp Dịch Vụ', desc: 'Cam kết thời gian phản hồi (SLA)' },
        { id: 'supervisors', label: 'Các Quy Tắc Người Gửi', desc: 'Quy tắc rà soát người gửi tin' },
        { id: 'contracts', label: 'Các Gói Hỗ Trợ', desc: 'Cài đặt điều khoản gói dịch vụ' },
        { id: 'schedules', label: 'Lịch', desc: 'Hành động theo lịch hẹn giờ sẵn' }
      ]
    },
    {
      category: 'QUẢN TRỊ DỮ LIỆU',
      items: [
        { id: 'sandbox', label: 'Sandbox', desc: 'Môi trường thử nghiệm an toàn' },
        { id: 'import', label: 'Nhập Liệu', desc: 'Nhập dữ liệu từ Excel/CSV' },
        { id: 'export', label: 'Xuất', desc: 'Xuất dữ liệu vé và khách hàng' },
        { id: 'zwitch', label: 'Zwitch (Di Chuyển Dữ Liệu)', desc: 'Chuyển dữ liệu từ Helpdesk khác' },
        { id: 'recycle', label: 'Thùng rác', desc: 'Khôi phục tài nguyên đã xóa' }
      ]
    },
    {
      category: 'TÍCH HỢP',
      items: [
        { id: 'marketplace', label: 'Marketplace', desc: 'Kho ứng dụng mở rộng bên thứ 3' },
        { id: 'zoho_integration', label: 'Zoho', desc: 'Tích hợp hệ sinh thái Zoho' },
        { id: 'ms_integration', label: 'Microsoft', desc: 'Đồng bộ Office 365 & Teams' },
        { id: 'other_integration', label: 'Khác', desc: 'Webhooks & API tùy chỉnh' }
      ]
    }
  ];

  // Filter sections by search query
  const filteredStructure = settingsStructure.map(section => {
    const items = section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items };
  }).filter(section => section.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden font-sans flex-1">
      
      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Settings Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/70">
          
          {/* Settings Top Control */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Cài đặt hệ thống (S)
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Zoho Engine v5</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Cấu hình các phân hệ hỗ trợ, kênh tiếp nhận, tự động hóa và website Helpdesk.</p>
            </div>

            {/* Dynamic Settings Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Thiết lập và cấu hình Tìm Kiếm ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Settings Group Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStructure.map((group, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">{group.category}</h3>
                </div>
                <div className="p-3 divide-y divide-slate-50 flex-1 flex flex-col justify-start">
                  {group.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => {
                        if (item.id === 'helpdesk_builder') {
                          setActiveModal('helpdesk_builder');
                        } else if (item.id === 'rebranding' || item.id === 'general_settings') {
                          setActiveModal('rebranding');
                        } else {
                          setActiveModal(item.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group flex items-start justify-between gap-2",
                        item.highlight && "bg-blue-50/50 border border-blue-100 hover:bg-blue-50"
                      )}
                    >
                      <div className="min-w-0">
                        <div className={cn(
                          "text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1.5",
                          item.highlight && "text-blue-700 font-bold"
                        )}>
                          {item.label}
                          {item.highlight && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Updates Panel */}
        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto hidden lg:flex flex-col shrink-0 select-none">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
              Cập Nhật Sản Phẩm ✨
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Tin Mới</span>
          </div>
          
          <div className="p-4 space-y-4">
            
            {/* News Card 1 */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-slate-800 leading-tight">Manage Department Notifications</div>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px] mb-2">
                Đại diện có thể tự động thiết lập các tùy chỉnh nhận thông báo cho mỗi phòng ban cụ thể để chỉ tiếp nhận tin nhắn từ những phòng họ chủ động làm việc.
              </p>
              <button className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1">Đọc thêm →</button>
            </div>

            {/* News Card 2 */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-slate-800 leading-tight">Dedicated Outbox for Scheduled Replies</div>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px] mb-2">
                Hộp thư đi riêng biệt quản lý tất cả các phản hồi được lên lịch trước khi gửi đi, tối ưu hóa các thao tác xử lý tự động hàng loạt.
              </p>
              <button className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1">Đọc thêm →</button>
            </div>

            {/* News Card 3 */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-slate-800 leading-tight">Xuất Bản Ghi Từ Chế Độ Xem</div>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px] mb-2">
                Bao gồm chế độ tải hàng loạt, tối ưu xuất dữ liệu vé từ các góc xem lọc thông tin tiện dụng cho báo cáo.
              </p>
              <button className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1">Đọc thêm →</button>
            </div>

            {/* News Card 4 (Zia AI) */}
            <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/30 hover:bg-blue-50/60 transition-all text-xs">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-blue-900 leading-tight">Zia Được Hỗ Trợ Bởi LLM Nguồn Mở</div>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] mb-2">
                Tận dụng các chức năng AI Tạo Sinh của trợ lý ảo Zia để tóm tắt hội thoại, gợi ý trả lời tự động, tăng năng suất xử lý vé gấp 3 lần.
              </p>
              <div className="flex gap-3">
                <button className="text-[10px] text-blue-700 font-bold hover:underline flex items-center gap-0.5"> Xem Video</button>
                <button className="text-[10px] text-slate-600 font-medium hover:underline">Đọc thêm</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM SMART CHAT FOOTER BAR (Zoho style) */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 select-none shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
            <span className="w-4 h-4 bg-amber-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">2</span>
            <span className="font-semibold text-slate-700">Nội Dung Chat Chưa</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Kênh</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Liên hệ</span>
          </div>
          <input 
            type="text" 
            placeholder="Đây là nội dung Smart Chat của bạn (Ctrl+Space)" 
            readOnly 
            className="hidden md:block w-96 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-slate-400">01:49:50 PM</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold flex items-center gap-1 shadow-sm text-[11px]">
            <MessageCircle className="w-3.5 h-3.5" />
            Cần Giúp Đỡ
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* 1. MODAL: HELPDESK WEBSITE BUILDER (GRAND CUSTOMIZER) */}
      {/* ========================================= */}
      {activeModal === 'helpdesk_builder' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            
            {/* Builder Header */}
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    Tạo & Thiết lập Website Helpdesk tự phục vụ
                    <span className="text-[10px] bg-blue-500 text-white font-semibold px-2 py-0.5 rounded-full">Live Studio</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Tự thiết kế trang hỗ trợ cho khách hàng của bạn.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Builder Body (Layout split in 2: Left is settings, Right is dynamic Live Preview) */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Form & settings options */}
              <div className="w-full md:w-[450px] border-r border-slate-200 overflow-y-auto p-5 space-y-6 shrink-0 bg-slate-50/50">
                
                {/* Branding Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-200 pb-1.5">Nhận diện thương hiệu</h4>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tên cổng trợ giúp (Title)</label>
                    <input 
                      type="text"
                      value={helpdeskConfig.title}
                      onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tiêu đề Banner lớn (Banner Title)</label>
                    <input 
                      type="text"
                      value={helpdeskConfig.bannerTitle}
                      onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, bannerTitle: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Mô tả phụ banner (Banner Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={helpdeskConfig.bannerSubtitle}
                      onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, bannerSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Theme & Style */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-200 pb-1.5">Giao diện & màu sắc</h4>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Bố cục trang chủ (Layout)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'standard', label: 'Tiêu chuẩn' },
                        { id: 'minimalist', label: 'Tối giản' },
                        { id: 'modern', label: 'Hiện đại' }
                      ].map((lay) => (
                        <button
                          key={lay.id}
                          onClick={() => setHelpdeskConfig({ ...helpdeskConfig, layout: lay.id as 'standard' | 'minimalist' | 'modern' })}
                          className={cn(
                            "py-2 px-1 text-[11px] rounded-lg border font-medium transition-all text-center",
                            helpdeskConfig.layout === lay.id 
                              ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold" 
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {lay.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Màu chủ đạo (Primary Theme Color)</label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        '#2563eb', // Blue
                        '#16a34a', // Green
                        '#ea580c', // Orange
                        '#7c3aed', // Purple
                        '#e11d48', // Rose
                        '#1e293b'  // Slate Dark
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setHelpdeskConfig({ ...helpdeskConfig, themeColor: color })}
                          className={cn(
                            "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 relative flex items-center justify-center",
                            helpdeskConfig.themeColor === color ? "border-slate-900 shadow-sm" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {helpdeskConfig.themeColor === color && (
                            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Settings toggle modules */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Mô-đun kích hoạt</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 cursor-pointer text-xs">
                        <span className="text-slate-600 font-medium">Diễn đàn cộng đồng (Community)</span>
                        <input 
                          type="checkbox"
                          checked={helpdeskConfig.showCommunity}
                          onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, showCommunity: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 cursor-pointer text-xs">
                        <span className="text-slate-600 font-medium">Bản nhúng gửi vé hỗ trợ (Submit ticket)</span>
                        <input 
                          type="checkbox"
                          checked={helpdeskConfig.showSubmitTicket}
                          onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, showSubmitTicket: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer and contact details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-200 pb-1.5">Thông tin liên hệ chân trang</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Email hỗ trợ</label>
                      <input 
                        type="text"
                        value={helpdeskConfig.contactEmail}
                        onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, contactEmail: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Hotline</label>
                      <input 
                        type="text"
                        value={helpdeskConfig.contactPhone}
                        onChange={(e) => setHelpdeskConfig({ ...helpdeskConfig, contactPhone: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Dynamic Live Preview Panel */}
              <div className="flex-1 bg-slate-100 p-6 flex flex-col justify-center items-center overflow-auto relative">
                <div className="absolute top-4 left-6 flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  Live Preview: Xem trước giao diện hiển thị cho khách hàng của bạn
                </div>
                
                {/* Simulated Portal / Helpdesk Site Card */}
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border overflow-hidden flex flex-col aspect-[4/3] scale-95 transition-all">
                  
                  {/* Simulated Header */}
                  <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: helpdeskConfig.themeColor }}>
                        {helpdeskConfig.title.charAt(0)}
                      </div>
                      <span className="font-bold text-xs text-slate-900">{helpdeskConfig.title}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
                      <span className="hover:text-blue-600 cursor-pointer">Yêu cầu của tôi</span>
                      <span className="text-blue-600 border-b-2 border-blue-600 pb-1">Trang chủ</span>
                      {helpdeskConfig.showCommunity && (
                        <span className="hover:text-blue-600 cursor-pointer">Cộng đồng</span>
                      )}
                    </div>
                  </div>

                  {/* Simulated Banner hero */}
                  <div className="text-white p-8 text-center flex flex-col justify-center items-center transition-all relative" style={{ backgroundColor: helpdeskConfig.themeColor }}>
                    <h5 className={cn("font-bold mb-2 transition-all", helpdeskConfig.layout === 'minimalist' ? "text-xl" : "text-3xl")}>
                      {helpdeskConfig.bannerTitle}
                    </h5>
                    <p className="text-[11px] opacity-90 max-w-lg mb-4">{helpdeskConfig.bannerSubtitle}</p>
                    
                    <div className="relative w-full max-w-md">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm kiến thức..." 
                        readOnly
                        className="w-full pl-9 pr-4 py-2 rounded-lg text-xs text-slate-800 bg-white shadow focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Simulated Body */}
                  <div className="p-6 flex-1 bg-slate-50 overflow-y-auto space-y-6">
                    <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Duyệt theo chủ đề</h6>
                    
                    <div className={cn("grid gap-4", helpdeskConfig.layout === 'standard' ? "grid-cols-3" : helpdeskConfig.layout === 'modern' ? "grid-cols-2" : "grid-cols-1")}>
                      {[
                        { title: 'Bắt đầu nhanh', desc: 'Sách hướng dẫn cài đặt cơ bản' },
                        { title: 'Quản lý tài khoản', desc: 'Thanh toán & hồ sơ cá nhân' },
                        { title: 'Khắc phục lỗi ngoại tuyến', desc: 'Các câu hỏi khẩn cấp về lỗi kỹ thuật' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:border-slate-300 transition-colors cursor-pointer">
                          <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-600 mb-2" style={{ backgroundColor: `${helpdeskConfig.themeColor}12`, color: helpdeskConfig.themeColor }}>
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <h7 className="font-bold text-[11px] text-slate-800 block">{item.title}</h7>
                          <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {helpdeskConfig.showSubmitTicket && (
                      <div className="border-t border-slate-200/60 pt-4 mt-4 text-center">
                        <button className="text-xs font-semibold text-white px-4 py-2 rounded-lg shadow-md transition-all inline-flex items-center gap-1.5" style={{ backgroundColor: helpdeskConfig.themeColor }}>
                          <Plus className="w-3.5 h-3.5" /> Gửi yêu cầu hỗ trợ mới
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Simulated Footer */}
                  <div className="bg-white border-t px-4 py-3 flex items-center justify-between text-[9px] text-slate-400">
                    <div>© 2026 {helpdeskConfig.title}. All rights reserved.</div>
                    <div className="flex items-center gap-3">
                      <span>Email: {helpdeskConfig.contactEmail}</span>
                      <span>Hotline: {helpdeskConfig.contactPhone}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Builder Footer controls */}
            <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
              <a 
                href="/help-center" 
                target="_blank" 
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem Website chính thức của khách hàng <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 transition-colors"
                >
                  Đóng lại
                </button>
                <button 
                  onClick={handleSaveHelpdesk}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Xuất bản ngay
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 2. MODAL: REBRANDING & WALLPAPERS (PRESERVING APP ACCENTS) */}
      {/* ========================================= */}
      {activeModal === 'rebranding' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-bold text-sm text-white">Thay đổi hình ảnh thương hiệu & Hình nền</h3>
                  <p className="text-[10px] text-slate-400">Tùy biến hình nền nền của ứng dụng và độ mờ kính các tab.</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
               {/* Opacity Settings */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div>
                   <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                     Độ mờ nền thẻ nội dung (%)
                   </label>
                   <div className="flex items-center gap-4">
                     <input 
                       type="range" 
                       min="0.1" 
                       max="1" 
                       step="0.05" 
                       value={opacity} 
                       onChange={(e) => setOpacity(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                     <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded min-w-14 text-center">
                       {Math.round(opacity * 100)}%
                     </span>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-1">Điều chỉnh độ trong suốt của thẻ nội dung chính màu trắng.</p>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                     Độ mờ menu Sidebar (%)
                   </label>
                   <div className="flex items-center gap-4">
                     <input 
                       type="range" 
                       min="0.1" 
                       max="1" 
                       step="0.05" 
                       value={sidebarOpacity} 
                       onChange={(e) => setSidebarOpacity(parseFloat(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                     />
                     <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded min-w-14 text-center">
                       {Math.round(sidebarOpacity * 100)}%
                     </span>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-1">Điều chỉnh độ trong suốt của menu Sidebar điều hướng màu trắng.</p>
                 </div>
               </div>

              {/* Wallpaper Tab Control */}
              <div className="border rounded-xl bg-white overflow-hidden">
                <div className="flex border-b bg-slate-50/50">
                  <button onClick={() => setActiveTab('image')} className={cn("px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap", activeTab === 'image' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
                    <ImageIcon className="w-3.5 h-3.5" /> Ảnh nền
                  </button>
                  <button onClick={() => setActiveTab('video')} className={cn("px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap", activeTab === 'video' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
                    <Video className="w-3.5 h-3.5" /> Video nền
                  </button>
                  <button onClick={() => setActiveTab('gradient')} className={cn("px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap", activeTab === 'gradient' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
                    <Palette className="w-3.5 h-3.5" /> Dải màu
                  </button>
                  <button onClick={() => setActiveTab('pattern')} className={cn("px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap", activeTab === 'pattern' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
                    <LayoutTemplate className="w-3.5 h-3.5" /> Họa tiết
                  </button>
                </div>

                {/* Wallpaper grid selectors */}
                <div className="p-4 bg-slate-50/20 max-h-60 overflow-y-auto">
                  {activeTab === 'image' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {imageWallpapers.map((url, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectBg('image', url)}
                          className={cn("aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105", bgType === 'image' && bgValue === url ? "border-blue-600 shadow-md ring-4 ring-blue-600/10" : "border-transparent shadow-sm hover:border-slate-300")}
                        >
                          <img src={url} alt={`Wallpaper ${i+1}`} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'video' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {videoWallpapers.map((v, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectBg('video', v.url)}
                          className={cn("aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 relative bg-black group", bgType === 'video' && bgValue === v.url ? "border-blue-600 shadow-md ring-4 ring-blue-600/10" : "border-transparent shadow-sm hover:border-slate-300")}
                        >
                          {v.thumbnail ? (
                            <img src={v.thumbnail} className="w-full h-full object-cover opacity-80" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px]">Video {i+1}</div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'gradient' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {gradientWallpapers.map((g, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectBg('gradient', g)}
                          className={cn("h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105", bgType === 'gradient' && bgValue === g ? "border-blue-600 shadow-md ring-4 ring-blue-600/10" : "border-slate-200 shadow-sm hover:border-slate-300")}
                          style={{ background: g }}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'pattern' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {customPatterns.map((p) => (
                        <button 
                          key={p.id} 
                          onClick={() => handleSelectBg('pattern', p.id)}
                          className={cn("h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 relative group", bgType === 'pattern' && bgValue === p.id ? "border-blue-600 shadow-md ring-4 ring-blue-600/10" : "border-slate-200 shadow-sm hover:border-slate-300")}
                          style={p.css}
                        >
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-center">
                            <p className="text-[9px] text-white font-medium truncate">{p.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal footer controls */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Hoàn tất & Lưu lại
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. MODAL: COMPANY CONFIGURATION (CÔNG TY) */}
      {/* ========================================= */}
      {activeModal === 'company' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-white">Thông tin doanh nghiệp</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Tên doanh nghiệp</label>
                <input 
                  type="text" 
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Email liên hệ</label>
                  <input 
                    type="text" 
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Điện thoại</label>
                  <input 
                    type="text" 
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Địa chỉ trụ sở</label>
                <input 
                  type="text" 
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold">Đóng</button>
              <button onClick={() => { setActiveModal(null); alert('Đã lưu thông tin công ty thành công!'); }} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Lưu lại</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 4. MODAL: DEPARTMENTS (PHÒNG BAN) */}
      {/* ========================================= */}
      {activeModal === 'departments' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-white">Quản lý Phòng ban hỗ trợ</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              {/* List existing */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3 border-b">Mã phòng</th>
                      <th className="p-3 border-b">Tên phòng ban</th>
                      <th className="p-3 border-b">Trưởng phòng</th>
                      <th className="p-3 border-b text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-600">{d.code}</td>
                        <td className="p-3 font-medium text-slate-800">{d.name}</td>
                        <td className="p-3 text-slate-500">{d.lead}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => setDepartments(departments.filter(dept => dept.id !== d.id))}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-700">Tạo phòng ban mới</h4>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Tên phòng..." 
                    value={newDept.name}
                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                    className="px-2 py-1.5 border rounded-lg bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Mã CODE..." 
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                    className="px-2 py-1.5 border rounded-lg bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Người đại diện..." 
                    value={newDept.lead}
                    onChange={(e) => setNewDept({ ...newDept, lead: e.target.value })}
                    className="px-2 py-1.5 border rounded-lg bg-white"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!newDept.name || !newDept.code) return;
                    setDepartments([...departments, { id: Date.now().toString(), ...newDept }]);
                    setNewDept({ name: '', code: '', lead: '' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm mới
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 5. MODAL: AGENTS (ĐẠI DIỆN) */}
      {/* ========================================= */}
      {activeModal === 'agents' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-white">Quản lý danh sách Nhân viên Đại diện</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3 border-b">Họ tên</th>
                      <th className="p-3 border-b">Email</th>
                      <th className="p-3 border-b">Vai trò</th>
                      <th className="p-3 border-b text-right">Hủy kích hoạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                            {a.name.charAt(0)}
                          </div>
                          {a.name}
                        </td>
                        <td className="p-3 text-slate-500">{a.email}</td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">{a.role}</span></td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => setAgents(agents.filter(age => age.id !== a.id))}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-700">Mời thêm nhân viên hỗ trợ</h4>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Họ và tên..." 
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="px-2 py-1.5 border rounded-lg bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Email công ty..." 
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    className="px-2 py-1.5 border rounded-lg bg-white"
                  />
                  <select 
                    value={newAgent.role}
                    onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                    className="px-2 py-1.5 border rounded-lg bg-white text-xs"
                  >
                    <option value="Đại diện kỹ thuật">Đại diện kỹ thuật</option>
                    <option value="Đại diện thanh toán">Đại diện thanh toán</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if (!newAgent.name || !newAgent.email) return;
                    setAgents([...agents, { id: Date.now().toString(), ...newAgent }]);
                    setNewAgent({ name: '', email: '', role: 'Đại diện kỹ thuật' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm đại diện
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Hoàn tất</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 6. MOCK DIALOG FOR OTHER OPTIONS */}
      {/* ========================================= */}
      {activeModal && !['helpdesk_builder', 'rebranding', 'company', 'departments', 'agents'].includes(activeModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GearIcon className="w-4 h-4 text-blue-500 animate-spin-slow" />
                <h3 className="font-bold text-sm text-white">Tính năng Cấu hình</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <GearIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Tính năng đang đồng bộ</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mục cấu hình này đã được đồng bộ hóa thành công với máy chủ quản trị trung tâm của Zoho Cloud Hub.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
