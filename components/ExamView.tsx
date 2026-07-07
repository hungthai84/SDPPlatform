import React, { useState } from 'react';
import { FileTextIcon, MoreVerticalIcon, PlusIcon, UsersIcon, CheckCircleIcon, ClockIcon, XIcon } from './icons';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  questionsCount: number;
  participantsCount: number;
  status: 'active' | 'draft' | 'closed';
  dueDate?: string;
  themeColor: string;
}

const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Kiểm tra năng lực Bán hàng B2B - Q3',
    description: 'Đánh giá kỹ năng đàm phán và xử lý tình huống',
    duration: 45,
    questionsCount: 30,
    participantsCount: 42,
    status: 'active',
    dueDate: '2024-10-15',
    themeColor: 'bg-indigo-500',
  },
  {
    id: '2',
    title: 'Bài test Hội nhập nhân sự mới - T9',
    description: 'Kiểm tra kiến thức văn hóa và nội quy',
    duration: 30,
    questionsCount: 20,
    participantsCount: 15,
    status: 'active',
    dueDate: '2024-09-30',
    themeColor: 'bg-emerald-500',
  },
  {
    id: '3',
    title: 'Đánh giá kỹ năng Leadership',
    description: 'Dành cho cấp quản lý cấp trung',
    duration: 60,
    questionsCount: 40,
    participantsCount: 0,
    status: 'draft',
    themeColor: 'bg-slate-500',
  },
  {
    id: '4',
    title: 'Kiểm tra ATVSLĐ Định kỳ',
    description: 'An toàn vệ sinh lao động',
    duration: 20,
    questionsCount: 15,
    participantsCount: 150,
    status: 'closed',
    dueDate: '2024-06-30',
    themeColor: 'bg-rose-500',
  }
];

export const ExamView: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex flex-col w-full h-full animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Bài kiểm tra & Đánh giá</h2>
          <p className="text-sm text-slate-500">Quản lý các bài kiểm tra năng lực và kỳ thi</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Tạo bài kiểm tra
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockExams.map(exam => (
          <div key={exam.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            
            {/* Top color bar */}
            <div className={`h-2 w-full ${exam.themeColor}`} />
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${exam.themeColor} shadow-sm`}>
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <MoreVerticalIcon className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-2 line-clamp-2">
                {exam.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {exam.description}
              </p>
              
              <div className="mt-auto grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-medium">{exam.duration} phút</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="font-medium">{exam.questionsCount} câu</span>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400" title={`${exam.participantsCount} người đã nộp`}>
                <UsersIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">{exam.participantsCount} nộp bài</span>
              </div>
              
              <div className="flex items-center gap-2">
                {exam.status === 'active' && <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Đang mở" />}
                {exam.status === 'draft' && <span className="flex h-2 w-2 rounded-full bg-slate-400" title="Bản nháp" />}
                {exam.status === 'closed' && <span className="flex h-2 w-2 rounded-full bg-rose-500" title="Đã đóng" />}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tạo bài kiểm tra mới</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề bài kiểm tra</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập tiêu đề..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả (tùy chọn)</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                  placeholder="Nhập hướng dẫn làm bài..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Thời gian làm bài (phút)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Vd: 45"
                    defaultValue={45}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Ngày đến hạn</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-start gap-3 mt-2">
                <div className="mt-0.5 text-indigo-500">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">Trình tạo câu hỏi</h4>
                  <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1 leading-relaxed">
                    Sau khi nhấn "Tạo", bạn sẽ được chuyển đến giao diện soạn thảo câu hỏi tương tự Google Forms để thêm trắc nghiệm, tự luận và các thiết lập nâng cao khác.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Tạo bài kiểm tra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
