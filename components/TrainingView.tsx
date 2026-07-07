import React, { useState } from 'react';
import { GraduationCap, MoreVertical, Plus, ArrowRight, Star, BookOpen, X } from 'lucide-react';
import { Banner, Tabs, StatsGrid, MainContentWrapper } from './StandardLayout';
import { CourseLibraryView } from './CourseLibraryView';
import { LearningPathView } from './LearningPathView';
import { ExamView } from './ExamView';
import { CertificateView } from './CertificateView';

export const TrainingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Khóa học của tôi');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const handleCreateClass = () => {
    setShowCreateClassModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Thư viện khóa học':
        return <CourseLibraryView />;
      case 'Lộ trình học tập':
        return <LearningPathView />;
      case 'Bài kiểm tra':
        return <ExamView />;
      case 'Chứng chỉ':
        return <CertificateView />;
      default:
        return (
          <MainContentWrapper 
            createLabel="Tạo lớp học mới" 
            onCreate={handleCreateClass}
            viewMode={viewMode}
            setViewMode={setViewMode}
          >
            <div className={`p-6 gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
              {[
                { title: 'Văn hóa doanh nghiệp 2024', teacher: 'HR Department', students: 156, color: 'bg-indigo-600', lessons: 12 },
                { title: 'Kỹ năng giao tiếp khách hàng', teacher: 'Nguyễn Văn A', students: 45, color: 'bg-emerald-600', lessons: 8 },
                { title: 'Bảo mật thông tin nội bộ', teacher: 'IT Security Team', students: 200, color: 'bg-rose-600', lessons: 5 },
                { title: 'Quy trình vận hành kho', teacher: 'Lê Thị B', students: 32, color: 'bg-amber-600', lessons: 10 },
              ].map((course, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`${course.color} p-6 h-32 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="flex justify-between items-start relative z-10">
                      <h3 className="font-black text-white text-xl tracking-tight leading-tight w-2/3">{course.title}</h3>
                      <button className="text-white/80 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                    <p className="text-white/70 text-xs font-bold mt-2 relative z-10">{course.teacher}</p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(u => (
                          <img key={u} src={`https://ui-avatars.com/api/?name=S+${u}&background=random`} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 border-2 border-white dark:border-slate-800">+{course.students - 3}</div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                         <BookOpen className="w-3.5 h-3.5" />
                         {course.lessons} Bài học
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">4.9</span>
                      </div>
                      <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-black group-hover:gap-4 transition-all">
                        VÀO LỚP <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleCreateClass}
                className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
              >
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Tạo lớp học mới</span>
              </button>
            </div>
          </MainContentWrapper>
        );
    }
  };

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col h-full">
      <Banner 
        title="Đào tạo & Phát triển" 
        icon={<GraduationCap />} 
        description="Không gian học tập trực tuyến dành cho nhân viên. Truy cập các khóa học, tài liệu và lộ trình phát triển kỹ năng."
      />
      <Tabs 
        items={['Khóa học của tôi', 'Thư viện khóa học', 'Lộ trình học tập', 'Bài kiểm tra', 'Chứng chỉ']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {activeTab === 'Khóa học của tôi' && (
        <StatsGrid stats={[
          { label: 'Khóa đang học', value: '3', trend: 'Hoạt động' },
          { label: 'Hoàn thành', value: '12', color: 'text-indigo-600' },
          { label: 'Điểm trung bình', value: '92/100', trend: 'Xuất sắc' },
          { label: 'Chứng chỉ mới', value: '2', color: 'text-orange-500' },
        ]} />
      )}

      <div className="flex-1 mt-6">
        {renderContent()}
      </div>

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tạo lớp học mới</h3>
              <button 
                onClick={() => setShowCreateClassModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên lớp học (bắt buộc)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Vd: Đào tạo hội nhập K24"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phần</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Vd: Phòng Nhân sự"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Chủ đề</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Vd: Hội nhập"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phòng</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Vd: Tầng 3, Phòng Đào tạo"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateClassModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => setShowCreateClassModal(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
