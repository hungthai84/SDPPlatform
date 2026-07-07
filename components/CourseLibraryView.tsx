import React, { useState, useRef, useEffect } from 'react';
import { UsersIcon, FolderIcon, MoreVerticalIcon, PlusIcon, XIcon } from './icons';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  studentsCount: number;
  bannerColor: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Đào tạo Hội nhập (Onboarding)',
    description: 'Dành cho nhân sự mới',
    instructor: 'Phòng Nhân sự',
    studentsCount: 120,
    bannerColor: 'bg-blue-600',
  },
  {
    id: '2',
    title: 'Kỹ năng Bán hàng B2B',
    description: 'Chuyên sâu về đàm phán và chốt sale',
    instructor: 'Phòng Kinh doanh',
    studentsCount: 45,
    bannerColor: 'bg-emerald-600',
  },
  {
    id: '3',
    title: 'Quản lý Thời gian Hiệu quả',
    description: 'Nâng cao hiệu suất cá nhân',
    instructor: 'Ban Giám đốc',
    studentsCount: 85,
    bannerColor: 'bg-indigo-600',
  },
  {
    id: '4',
    title: 'Kỹ năng Giải quyết Vấn đề',
    description: 'Phương pháp tư duy logic',
    instructor: 'Phòng Đào tạo',
    studentsCount: 62,
    bannerColor: 'bg-violet-600',
  },
  {
    id: '5',
    title: 'Văn hóa Doanh nghiệp',
    description: 'Giá trị cốt lõi và hành vi ứng xử',
    instructor: 'Ban Giám đốc',
    studentsCount: 200,
    bannerColor: 'bg-rose-600',
  },
];

export const CourseLibraryView: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Thư viện khóa học</h2>
          <p className="text-sm text-slate-500">Khám phá và tham gia các khóa học trong hệ thống</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Tùy chọn
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20 animate-fade-in">
              <button 
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                Tham gia lớp học
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-700" />
              <button 
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                  setShowCreateModal(true);
                }}
              >
                Tạo lớp học mới
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
        {mockCourses.map(course => (
          <div key={course.id} className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            
            {/* Card Header (Banner) */}
            <div className={`h-24 ${course.bannerColor} relative p-4 flex flex-col justify-between`}>
              <div className="flex justify-between items-start text-white">
                <h3 className="font-bold text-lg leading-tight hover:underline cursor-pointer line-clamp-2 pr-4">{course.title}</h3>
                <button className="absolute top-3 right-2 p-1.5 rounded-full hover:bg-white/20 transition-colors text-white">
                  <MoreVerticalIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/90 text-sm truncate">{course.description}</p>
            </div>

            {/* Avatar overlapping banner */}
            <div className="absolute top-[72px] right-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                  {course.instructor.charAt(0)}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 pt-12 flex-1">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {course.instructor}
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-1.5" title={`${course.studentsCount} học viên`}>
                <UsersIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{course.studentsCount}</span>
              </div>
              <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Mở thư mục lớp học">
                <FolderIcon className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tạo lớp học mới</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <XIcon className="w-5 h-5" />
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
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
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
