import React, { useState } from 'react';
import { mockTickets, mockMessages } from '../data';
import { formatDistanceToNow, format } from 'date-fns';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

export const OmnichannelInbox = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(mockTickets[1].id);

  const selectedTicket = mockTickets.find(t => t.id === selectedTicketId);
  const ticketMessages = mockMessages.filter(m => m.ticketId === selectedTicketId);

  return (
    <div className="bg-transparent overflow-hidden flex h-full flex-1 w-full relative">
      {/* Left Sidebar - Ticket List */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-semibold text-slate-800">Hộp thư</h2>
          <div className="flex gap-2 mt-3">
             <button className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-medium">Mở</button>
             <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200">Đã tạm ngưng</button>
             <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200">Đã đóng</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockTickets.map(ticket => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={cn(
                "p-4 border-b border-slate-100 cursor-pointer transition-colors",
                selectedTicketId === ticket.id ? "bg-blue-50/50 relative" : "hover:bg-slate-50"
              )}
            >
              {selectedTicketId === ticket.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
              )}
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-slate-900 text-sm truncate pr-2">{ticket.customer?.name}</span>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: false })}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium truncate mb-1">{ticket.subject}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide",
                  ticket.channel === 'email' ? 'bg-purple-100 text-purple-700' :
                  ticket.channel === 'chat' ? 'bg-blue-100 text-blue-700' :
                  'bg-emerald-100 text-emerald-700'
                )}>
                  {ticket.channel}
                </span>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide",
                  ticket.status === 'new' ? 'bg-red-100 text-red-700' :
                  ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                )}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Conversation View */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {selectedTicket.customer?.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  {selectedTicket.customer?.name}
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </h3>
                <p className="text-xs text-slate-500">{selectedTicket.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"><Phone size={18} /></button>
              <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"><Video size={18} /></button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            <div className="text-center">
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {format(new Date(selectedTicket.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            {ticketMessages.map((msg) => {
              const isCustomer = msg.senderType === 'customer';
              return (
                <div key={msg.id} className={cn("flex max-w-[80%]", isCustomer ? "justify-start" : "justify-end ml-auto")}>
                  {isCustomer && (
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 mr-3 mt-1 flex items-center justify-center text-blue-700 text-xs font-bold">
                       {selectedTicket.customer?.name.charAt(0)}
                     </div>
                  )}
                  <div className={cn(
                    "p-4 rounded-2xl shadow-sm text-sm",
                    isCustomer 
                      ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" 
                      : "bg-blue-600 text-white rounded-tr-none"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className={cn("text-[10px] mt-2 flex items-center gap-1", isCustomer ? "text-slate-400" : "text-blue-200")}>
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Composer */}
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
             <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                   <button className="hover:text-blue-600 text-blue-600">Trả lời</button>
                   <button className="hover:text-amber-600">Ghi chú nội bộ</button>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Tạo bằng AI
                </button>
             </div>
            <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
              <textarea 
                className="w-full p-3 max-h-32 min-h-[80px] outline-none text-sm resize-none bg-transparent"
                placeholder="Nhập câu trả lời của bạn vào đây..."
              ></textarea>
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-1 text-slate-400">
                  <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"><Paperclip size={16} /></button>
                  <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"><Smile size={16} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <select className="text-xs border border-slate-300 rounded bg-white px-2 py-1.5 outline-none text-slate-700">
                    <option>Gửi & Giữ mở</option>
                    <option>Gửi & Đánh dấu đã giải quyết</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <span>Gửi</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 flex-col">
          <Inbox size={48} className="mb-4 text-slate-300" />
          <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
        </div>
      )}

      {/* Right Sidebar - Customer Info */}
      {selectedTicket && (
        <div className="w-72 border-l border-slate-200 bg-white overflow-y-auto hidden lg:block shrink-0">
          <div className="p-6 border-b border-slate-200 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {selectedTicket.customer?.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-slate-900">{selectedTicket.customer?.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{selectedTicket.customer?.email}</p>
            <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full capitalize",
              selectedTicket.customer?.vipLevel === 'platinum' ? 'bg-slate-800 text-white' :
              selectedTicket.customer?.vipLevel === 'gold' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-700'
            )}>
              {selectedTicket.customer?.vipLevel} Customer
            </span>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Giới thiệu</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Công ty</span>
                  <span className="font-medium text-slate-900">{selectedTicket.customer?.company || 'Trống'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Điện thoại</span>
                  <span className="font-medium text-slate-900">{selectedTicket.customer?.phone || 'Trống'}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chi tiết vé hỗ trợ</h4>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                  <span className="text-slate-500">ID</span>
                  <span className="font-medium text-slate-900">{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người phụ trách</span>
                  <span className="font-medium text-slate-900">{selectedTicket.assignee?.name || 'Chưa chỉ định'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
