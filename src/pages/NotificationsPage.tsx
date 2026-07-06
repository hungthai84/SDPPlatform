import React, { useState } from 'react';
import { Bell, Check, Clock, Trash2, ShieldAlert } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Yêu cầu hỗ trợ mới #1042', description: 'Khách hàng Nguyễn Văn A vừa mở vé hỗ trợ mới về lỗi "Hóa đơn thanh toán".', time: '5 phút trước', read: false },
    { id: 2, title: 'Cập nhật hệ thống v2.5 hoàn tất', description: 'Đã loại bỏ thanh header, tích hợp toàn bộ tùy chọn vào Profile Sidebar và tối ưu hóa diện tích.', time: '2 giờ trước', read: false },
    { id: 3, title: 'Vé hỗ trợ #1029 quá hạn xử lý (SLA)', description: 'Mức độ ưu tiên cao nhưng đã vượt quá 4 giờ quy chuẩn phản hồi.', time: '1 ngày trước', read: true },
    { id: 4, title: 'Phản hồi mới từ khách hàng Trần Thảo', description: 'Khách hàng đã trả lời vé #1011 của bạn: "Tôi đã thử lại và thành công..."', time: '2 ngày trước', read: true }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Thông báo hệ thống</h2>
          <p className="text-xs text-slate-500">Giữ kết nối với tất cả cập nhật, hoạt động của vé hỗ trợ và tin nhắn từ khách hàng.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          <Check size={14} /> Đánh dấu đã đọc tất cả
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Hộp thư thông báo trống.</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50/50 transition-colors ${!notif.read ? 'bg-blue-50/10' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!notif.read ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                {notif.title.includes('SLA') ? <ShieldAlert size={16} className="text-rose-500" /> : <Bell size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'} truncate`}>{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1"><Clock size={11} /> {notif.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.description}</p>
              </div>
              <div className="shrink-0 flex items-center gap-1 ml-4">
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                  title="Xóa thông báo"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
