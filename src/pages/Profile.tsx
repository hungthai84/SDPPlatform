import React, { useState } from 'react';
import { User, Mail, Shield, Clock, Camera, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const [profile] = useState({
    name: 'Quản trị viên',
    email: 'admin@powerservice.vn',
    role: 'Quản trị viên hệ thống (Admin)',
    status: 'Trực tuyến',
    shift: 'Ca sáng (08:00 - 17:00)'
  });

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Thông tin cá nhân & Tài khoản</h2>
          <p className="text-xs text-slate-500">Cập nhật thông tin liên hệ, ca trực và theo dõi trạng thái hoạt động của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative group cursor-pointer mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg border-4 border-white group-hover:opacity-90 transition-opacity">
              AD
            </div>
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 text-base">{profile.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
          
          <div className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {profile.status}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Chi tiết tài khoản</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold">
                  <User size={14} className="text-slate-400" />
                  {profile.name}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold">
                  <Mail size={14} className="text-slate-400" />
                  {profile.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Vai trò hệ thống</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold">
                  <Shield size={14} className="text-slate-400" />
                  {profile.role}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ca trực phân bổ</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold">
                  <Clock size={14} className="text-slate-400" />
                  {profile.shift}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-6 pt-5 flex justify-end">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer">
              <CheckCircle size={14} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
