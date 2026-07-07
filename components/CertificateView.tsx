import React from 'react';
import { GraduationCapIcon, DownloadIcon, CheckCircleIcon, ShareIcon, StarIcon } from './icons';

interface Certificate {
  id: string;
  title: string;
  courseName: string;
  issueDate: string;
  validUntil?: string;
  score: string;
  status: 'active' | 'expired';
}

const mockCertificates: Certificate[] = [
  {
    id: 'CERT-2023-001',
    title: 'Chứng nhận Hoàn thành Đào tạo Hội nhập',
    courseName: 'Đào tạo Hội nhập (Onboarding)',
    issueDate: '15/01/2023',
    score: '95/100',
    status: 'active',
  },
  {
    id: 'CERT-2023-045',
    title: 'Chứng chỉ Chuyên viên Bán hàng Xuất sắc',
    courseName: 'Kỹ năng Bán hàng B2B',
    issueDate: '20/05/2023',
    validUntil: '20/05/2025',
    score: '98/100',
    status: 'active',
  },
  {
    id: 'CERT-2022-112',
    title: 'Chứng nhận Kỹ năng Quản lý Thời gian',
    courseName: 'Quản lý Thời gian Hiệu quả',
    issueDate: '10/11/2022',
    score: '88/100',
    status: 'active',
  },
];

export const CertificateView: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full animate-fade-in bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <GraduationCapIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Chứng chỉ của tôi</h2>
            <p className="text-sm text-slate-500">Quản lý và cấp phát chứng chỉ hoàn thành khóa học</p>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      <div className="p-6">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {mockCertificates.map(cert => (
            <div key={cert.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              
              {/* Left visual representation */}
              <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-amber-100 dark:border-slate-600 flex flex-col items-center justify-center shrink-0 p-4 relative overflow-hidden text-center">
                <StarIcon className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-[10px] font-black uppercase text-amber-800/50 dark:text-slate-400 tracking-wider">
                  Certificate
                </div>
                {/* Decorative lines */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-200/50 dark:border-slate-500/50 rounded-lg pointer-events-none"></div>
              </div>

              {/* Right content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{cert.title}</h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Hiệu lực
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-3">
                    Khóa học: <span className="text-indigo-600 dark:text-indigo-400">{cert.courseName}</span>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <div className="text-slate-500 dark:text-slate-400">Ngày cấp:</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{cert.issueDate}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Điểm số:</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{cert.score}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Mã CC:</div>
                    <div className="font-mono text-xs text-slate-600 dark:text-slate-400 mt-0.5">{cert.id}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors flex-1 sm:flex-none">
                      <ShareIcon className="w-4 h-4" />
                      <span className="sm:hidden lg:inline">Chia sẻ</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex-1 sm:flex-none">
                      <DownloadIcon className="w-4 h-4" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
