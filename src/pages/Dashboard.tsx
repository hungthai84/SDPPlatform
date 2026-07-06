import React from 'react';
import { Users, Ticket, CheckCircle2, Clock } from 'lucide-react';
import { mockTickets, mockCustomers } from '../data';

export const Dashboard = () => {
  const newTickets = mockTickets.filter(t => t.status === 'new').length;
  const inProgressTickets = mockTickets.filter(t => t.status === 'in_progress').length;
  
  return (
    <div className="space-y-6 p-6 overflow-y-auto flex-1">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Vé chưa giải quyết</p>
              <h3 className="text-2xl font-bold text-slate-900">{newTickets + inProgressTickets}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">TG phản hồi lần đầu</p>
              <h3 className="text-2xl font-bold text-slate-900">14p</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Vé đã giải quyết (H.nay)</p>
              <h3 className="text-2xl font-bold text-slate-900">128</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Khách hàng hoạt động</p>
              <h3 className="text-2xl font-bold text-slate-900">{mockCustomers.length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
