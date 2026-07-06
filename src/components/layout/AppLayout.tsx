import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Ticket, 
  Users, 
  Settings, 
  BarChart3, 
  BookOpen, 
  X,
  FileText,
  CheckCircle2,
  HelpCircle,
  Zap,
  Megaphone,
  Sparkles,
  LineChart,
  User,
  Bell,
  Layers
} from 'lucide-react';

export const AppLayout = () => {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { opacity } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Get current page configuration
  const getPageConfig = () => {
    switch (path) {
      case '/':
        return {
          title: 'Bảng điều khiển',
          subtitle: 'Chào mừng trở lại! Dưới đây là hiệu suất làm việc và phân phối yêu cầu hỗ trợ ngày hôm nay.',
          icon: LayoutDashboard,
          iconAnim: 'animate-float',
          filters: [
            { label: 'Tất cả thời gian', active: true },
            { label: 'Hôm nay', active: false },
            { label: 'Tuần này', active: false },
            { label: 'Tháng này', active: false }
          ],
          actions: [
            { label: 'Tải lại dữ liệu', primary: false, icon: HelpCircle, onClick: () => window.location.reload() },
            { label: 'Xem cổng portal khách', primary: true, icon: FileText, onClick: () => navigate('/portal') }
          ],
          guide: {
            title: 'Hướng dẫn sử dụng Bảng điều khiển',
            steps: [
              'Xem các chỉ số quan trọng hôm nay bao gồm vé chưa giải quyết, thời gian phản hồi đầu tiên (SLA) và CSAT.',
              'Theo dõi danh sách Vé hỗ trợ gần đây ở góc trái màn hình.',
              'Tương tác với Trợ lý AI ở góc phải để nhận đề xuất xử lý tự động và phân loại thông minh.'
            ]
          }
        };
      case '/inbox':
        return {
          title: 'Hộp thư đa kênh',
          subtitle: 'Quản lý tập trung mọi tin nhắn, hội thoại từ Email, Livechat, Facebook, Zalo và các kênh hỗ trợ khác.',
          icon: Inbox,
          iconAnim: 'animate-pulse-slow',
          filters: [
            { label: 'Tất cả tin', active: true },
            { label: 'Chưa đọc', active: false },
            { label: 'Đang xử lý', active: false },
            { label: 'Đã đóng', active: false }
          ],
          actions: [
            { label: 'Bộ lọc kênh', primary: false, icon: HelpCircle, onClick: () => {} },
            { label: 'Đánh dấu đã đọc', primary: true, icon: CheckCircle2, onClick: () => {} }
          ],
          guide: {
            title: 'Hướng dẫn Hộp thư đa kênh',
            steps: [
              'Tất cả các tin nhắn đổ về từ các kênh (Facebook, Email, Hotline) được dồn về giao diện này.',
              'Nhấp vào một cuộc hội thoại ở danh sách bên trái để mở chi tiết nội dung chat.',
              'Sử dụng các mẫu trả lời nhanh (Canned responses) để tối ưu hóa thời gian phản hồi.'
            ]
          }
        };
      case '/tickets':
        return {
          title: 'Vé hỗ trợ',
          subtitle: 'Quy trình tiếp nhận, theo dõi tiến độ, phân phối nhiệm vụ và giải quyết khiếu nại khách hàng.',
          icon: Ticket,
          iconAnim: 'animate-wiggle',
          filters: [
            { label: 'Tất cả vé', active: true },
            { label: 'Vé đang mở', active: false },
            { label: 'Chưa chỉ định', active: false },
            { label: 'Quá hạn', active: false }
          ],
          actions: [
            { label: 'Bộ lọc thẻ', primary: false, icon: HelpCircle, onClick: () => {} },
            { label: 'Tạo vé mới', primary: true, icon: Ticket, onClick: () => {} }
          ],
          guide: {
            title: 'Hướng dẫn quản lý Vé hỗ trợ',
            steps: [
              'Mỗi yêu cầu từ khách hàng sẽ tự động tạo thành một tấm Vé (Ticket) với mã ID duy nhất.',
              'Chỉ định nhân sự chịu trách nhiệm xử lý (Assignee) và mức độ ưu tiên (Priority: Urgent, High, Medium, Low).',
              'Sử dụng cập nhật trạng thái (New, Open, Solved, Closed) để theo dõi vòng đời của vé hỗ trợ.'
            ]
          }
        };
      case '/customers':
        return {
          title: 'Khách hàng',
          subtitle: 'Hồ sơ khách hàng, thông tin doanh nghiệp, phân hạng VIP và lịch sử tương tác chăm sóc khách hàng.',
          icon: Users,
          iconAnim: 'animate-float',
          filters: [
            { label: 'Tất cả', active: true },
            { label: 'Khách hàng VIP', active: false },
            { label: 'Doanh nghiệp', active: false },
            { label: 'Cá nhân', active: false }
          ],
          actions: [
            { label: 'Xuất danh sách', primary: false, icon: FileText, onClick: () => {} },
            { label: 'Thêm khách hàng', primary: true, icon: Users, onClick: () => {} }
          ],
          guide: {
            title: 'Hướng dẫn Quản lý Khách hàng',
            steps: [
              'Lưu trữ hồ sơ thông tin liên hệ (Email, Số điện thoại, Địa chỉ) của từng khách hàng.',
              'Phân nhóm khách hàng theo VIP Level (Platinum, Gold, Silver, Standard) để áp dụng SLA ưu tiên tương ứng.',
              'Xem nhanh toàn bộ vé hỗ trợ liên quan đến khách hàng từ trang chi tiết hồ sơ.'
            ]
          }
        };
      case '/reports':
        return {
          title: 'Báo cáo & Phân tích',
          subtitle: 'Đo lường thời gian xử lý trung bình, tỷ lệ hoàn thành đúng hạn SLA và điểm CSAT hài lòng của khách hàng.',
          icon: BarChart3,
          iconAnim: 'animate-pulse-slow',
          filters: [
            { label: '7 ngày qua', active: true },
            { label: '30 ngày qua', active: false },
            { label: 'Tháng này', active: false },
            { label: 'Năm nay', active: false }
          ],
          actions: [
            { label: 'Tùy chỉnh khoảng thời gian', primary: false, icon: HelpCircle, onClick: () => {} },
            { label: 'Xuất Excel/PDF', primary: true, icon: FileText, onClick: () => {} }
          ],
          guide: {
            title: 'Hướng dẫn phân tích Báo cáo',
            steps: [
              'Theo dõi tổng số lượng vé tiếp nhận và tỷ lệ giải quyết thành công qua các biểu đồ phân tích trực quan.',
              'Đánh giá hiệu suất của từng nhân viên (đại diện hỗ trợ) dựa trên CSAT và thời gian phản hồi.',
              'Tối ưu các kênh có lượng vé lớn nhất để phân bổ nhân lực hợp lý.'
            ]
          }
        };
            case '/settings':
        return {
          title: 'Cài đặt hệ thống',
          subtitle: 'Thiết lập cấu hình thương hiệu, website Help Center, tích hợp API và phân quyền nhân sự.',
          icon: Settings,
          iconAnim: 'animate-spin-slow',
          filters: [
            { label: 'Hệ thống', active: true },
            { label: 'Thương hiệu', active: false },
            { label: 'Phân quyền', active: false },
            { label: 'Website Portal', active: false }
          ],
          actions: [
            { label: 'Lấy khóa API', primary: false, icon: HelpCircle, onClick: () => {} },
            { label: 'Lưu thay đổi', primary: true, icon: CheckCircle2, onClick: () => {} }
          ],
          guide: {
            title: 'Hướng dẫn Cài đặt & Cấu hình',
            steps: [
              'Tùy chỉnh Website Help Center trực tiếp, bao gồm hình nền, tiêu đề, banner và màu sắc nhận diện.',
              'Tải lên Logo công ty và cấu hình tên Power Service xuất hiện trên Sidebar điều hướng.',
              'Phân quyền nhân sự và cấu hình cổng thông tin dành cho Khách hàng (Customer Portal).'
            ]
          }
        };
      case '/automation':
        return {
          title: 'Tự động hóa',
          subtitle: 'Cấu hình quy tắc tự động hóa, điều phối vé và trả lời tin nhắn tự động.',
          icon: Zap,
          iconAnim: 'animate-float',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Tự động hóa',
            steps: [
              'Tạo các bộ lọc từ khóa để phân loại nội dung tự động.',
              'Thiết lập phản hồi ngoài giờ làm việc tự động gửi cho khách hàng.'
            ]
          }
        };
      case '/campaigns':
        return {
          title: 'Chiến dịch',
          subtitle: 'Quản lý các chiến dịch khảo sát, tiếp thị và chăm sóc khách hàng chủ động.',
          icon: Megaphone,
          iconAnim: 'animate-wiggle',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Chiến dịch',
            steps: [
              'Thiết lập chiến dịch gửi email khảo sát CSAT tự động.',
              'Theo dõi tỷ lệ phản hồi và độ hài lòng của khách hàng.'
            ]
          }
        };
      case '/ai-assistant':
        return {
          title: 'Trợ lý AI',
          subtitle: 'Trợ lý thông minh phân tích cuộc hội thoại, gợi ý phản hồi và hỗ trợ CSKH.',
          icon: Sparkles,
          iconAnim: 'animate-pulse-slow',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Trợ lý AI',
            steps: [
              'Kích hoạt gợi ý câu trả lời tự động dựa trên tri thức doanh nghiệp.',
              'Phân tích sắc thái (Sentiment) và tâm trạng khách hàng theo thời gian thực.'
            ]
          }
        };
      case '/analytics':
        return {
          title: 'Phân tích hiệu suất',
          subtitle: 'Báo cáo chuyên sâu về năng suất, thời gian giải quyết và chất lượng dịch vụ.',
          icon: LineChart,
          iconAnim: 'animate-pulse-slow',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Phân tích',
            steps: [
              'Xem biểu đồ xu hướng khối lượng công việc.',
              'Phân tích thời gian xử lý trung bình và các điểm nghẽn.'
            ]
          }
        };
      case '/profile':
        return {
          title: 'Hồ sơ cá nhân',
          subtitle: 'Quản lý thông tin tài khoản, ca trực và tùy chọn nhận thông báo.',
          icon: User,
          iconAnim: 'animate-float',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Hồ sơ',
            steps: [
              'Cập nhật ảnh đại diện và thông tin liên hệ.',
              'Đặt trạng thái trực tuyến/vắng mặt.'
            ]
          }
        };
      case '/notifications':
        return {
          title: 'Thông báo hệ thống',
          subtitle: 'Nhận cảnh báo, cập nhật mới từ hệ thống và yêu cầu hỗ trợ.',
          icon: Bell,
          iconAnim: 'animate-wiggle',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Thông báo',
            steps: [
              'Theo dõi các hoạt động quan trọng như vi phạm SLA.',
              'Đánh dấu đã đọc các thông báo cũ để dọn dẹp hộp thư.'
            ]
          }
        };
      case '/blank-page':
        return {
          title: 'Trang trắng sáng tạo',
          subtitle: 'Một không gian yên tĩnh và tối giản hoàn hảo để phác thảo ý tưởng, viết lách và ghi nhận mục tiêu tập trung.',
          icon: FileText,
          iconAnim: 'animate-float',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Trang Trắng',
            steps: [
              'Sử dụng lưới chấm tối giản Swiss để căn chỉnh thẳng hàng nội dung ý tưởng.',
              'Bấm Copy hoặc Download để xuất bản văn bản của bạn về thiết bị cá nhân.',
              'Đặt mục tiêu tập trung bên bảng phải để duy trì nhịp độ làm việc và đo lường thời gian đọc thực tế.'
            ]
          }
        };
      case '/projects':
        return {
          title: 'Quản lý dự án & Quy trình',
          subtitle: 'Thiết lập các dự án vận hành, chiến dịch nâng cấp dịch vụ Helpdesk và điều hành công việc phát sinh liên quan.',
          icon: Layers,
          iconAnim: 'animate-float',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Quản lý dự án',
            steps: [
              'Theo dõi tiến độ tổng thể của các dự án thông qua thanh trạng thái và tỉ lệ hoàn thành nhiệm vụ.',
              'Click vào bất kỳ dự án nào để mở bảng chi tiết và quản lý các Công việc (Tasks) phát sinh.',
              'Sử dụng trình In báo cáo (Swiss PDF style) để xuất nhanh báo cáo dự án chuyên nghiệp cho quản trị viên.'
            ]
          }
        };
      default:
        return {
          title: 'Hệ thống Power Service',
          subtitle: 'Trang quản trị vận hành Helpdesk chuyên nghiệp.',
          icon: HelpCircle,
          iconAnim: 'animate-float',
          filters: [],
          actions: [],
          guide: {
            title: 'Hướng dẫn Hệ thống',
            steps: ['Điều hướng nhanh qua sidebar bên trái.', 'Bấm Cài đặt để quản lý các tính năng chính.']
          }
        };
    }
  };

  const config = getPageConfig();
  const PageIcon = config.icon;

  return (
    <div className="w-screen h-screen bg-slate-100 dark:bg-slate-950 p-[15px] overflow-hidden flex">
      <div className="flex-1 flex h-full bg-slate-50 overflow-hidden font-sans text-slate-900 rounded-[10px] shadow-3xl border border-slate-200/80 p-0 gap-0">
        {/* Sidebar: Dynamic collapsing width */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Page Layout: Placed as a sibling flex child with transitions */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/70 transition-all duration-300 p-6">

        {/* Scrollable container of contents, scrollbar hidden by index.css */}
        <main className="flex-1 overflow-y-auto flex flex-col gap-6 pr-1">
          
          {/* BANNER WITH 10PX ROUNDED CORNERS, PAGES TITLES, ANIMATED ICONS AND "Tài liệu hướng dẫn" BUTTON */}
          <section className="bg-slate-900 text-white p-6 rounded-[10px] shadow-lg border border-slate-800 flex flex-col justify-between gap-6 relative overflow-hidden flex-shrink-0">
            {/* Ambient decoration */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-24 bottom-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Title, animated icon and Guide Documents Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
              <div className="flex items-center gap-4">
                {/* REPRESENTATIVE ICON WITH ANIMATION EFFECT */}
                <div className={cn(
                  "w-14 h-14 bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-lg shrink-0",
                  config.iconAnim
                )}>
                  <PageIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    {config.title}
                  </h1>
                  <p className="text-slate-400 text-xs mt-1 max-w-xl md:max-w-2xl leading-relaxed">
                    {config.subtitle}
                  </p>
                </div>
              </div>

              {/* TÀI LIỆU HƯỚNG DẪN BUTTON */}
              <button 
                onClick={() => setShowGuideModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all hover:scale-[1.03] shadow-md self-end md:self-auto shrink-0"
                id="btn-guide-documents"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                Tài liệu hướng dẫn
              </button>
            </div>

            {/* Bottom Row: Feature filters and actions */}
            {((config.filters && config.filters.length > 0) || (config.actions && config.actions.length > 0)) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-800 pt-4 z-10">
                {/* Quick Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {config.filters.map((filter, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all",
                        filter.active 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {config.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.onClick}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow",
                        act.primary
                          ? "bg-blue-600 hover:bg-blue-700 text-white border border-transparent"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      )}
                    >
                      {act.icon && <act.icon className="w-3.5 h-3.5 text-blue-400" />}
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* MAIN CONTENT CARD: Wrapper for Outlet content */}
          <div 
            className="rounded-[10px] border border-slate-200/80 shadow-md p-0 flex-1 flex flex-col min-h-0 relative overflow-hidden backdrop-blur-sm"
            style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
          >
            <Outlet />
          </div>

        </main>
      </div>

      {/* GORGEOUS FLOATING GUIDE MODAL FOR TÀI LIỆU HƯỚNG DẪN */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header decor */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            
            <button 
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {config.guide.title}
              </h3>
            </div>

            <div className="space-y-4 my-4">
              <p className="text-slate-500 text-sm">
                Chào mừng bạn đến với tài liệu hướng dẫn nhanh cho phân hệ này. Dưới đây là các bước quy trình chuẩn vận hành:
              </p>

              <div className="space-y-3">
                {config.guide.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">HỆ THỐNG POWER SERVICE V5</span>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/10"
              >
                Đồng ý, Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
  };
