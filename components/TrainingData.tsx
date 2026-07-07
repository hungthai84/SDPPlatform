import React from 'react';

export interface ClassInfo {
    id: string;
    name: string;
    section?: string;
    teacher: string;
    subject: string;
    room?: string;
    image: string;
}

export const presetThemes = [
  { id: 'theme-teal', name: 'Màu Mòng Két (Teal)', gradient: 'linear-gradient(135deg, #0d9488, #115e59)', lightBg: '#f0fdfa', text: '#0d9488', activeBorder: 'border-teal-500' },
  { id: 'theme-blue', name: 'Xanh Cổ Điển (Classic Blue)', gradient: 'linear-gradient(135deg, #2563eb, #1e3a8a)', lightBg: '#eff6ff', text: '#2563eb', activeBorder: 'border-blue-500' },
  { id: 'theme-purple', name: 'Oải Hương (Violet/Indigo)', gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', lightBg: '#f5f3ff', text: '#7c3aed', activeBorder: 'border-purple-500' },
  { id: 'theme-coral', name: 'San Hô Đỏ (Coral)', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)', lightBg: '#fff1f2', text: '#f43f5e', activeBorder: 'border-rose-500' },
  { id: 'theme-emerald', name: 'Ngọc Lục Bảo (Emerald)', gradient: 'linear-gradient(135deg, #10b981, #064e3b)', lightBg: '#ecfdf5', text: '#10b981', activeBorder: 'border-emerald-500' },
  { id: 'theme-amber', name: 'Hổ Phách (Amber)', gradient: 'linear-gradient(135deg, #f59e0b, #78350f)', lightBg: '#fffbeb', text: '#d97706', activeBorder: 'border-amber-500' }
];

export const mockClasses: ClassInfo[] = [
    { id: 'class-1', name: 'Kỹ năng Quản lý Thời gian', teacher: 'Trần Văn An', subject: 'Phát triển bản thân', section: 'Mùa thu 2026', room: 'Phòng 201', image: 'theme-purple' },
    { id: 'class-2', name: 'Marketing Kỹ thuật số 101', teacher: 'Hoàng Văn Em', subject: 'Marketing', section: 'Bộ phận Kinh Doanh', room: 'Phòng Hội nghị', image: 'theme-teal' },
    { id: 'class-3', name: 'Nhập môn Lập trình React', teacher: 'Phạm Minh Cường', subject: 'Công nghệ', section: 'Đội ngũ IT', room: 'Phòng Lab 1', image: 'theme-blue' },
    { id: 'class-4', name: 'An toàn Thông tin Doanh nghiệp', teacher: 'Lê Thị Bình', subject: 'Bảo mật', section: 'Dành cho tất cả nhân viên', room: 'Sảnh lớn', image: 'theme-coral' },
];

export const ClassBannerBg: React.FC<{ image: string; className?: string }> = ({ image, className = "w-full h-full" }) => {
    const isPreset = image.startsWith('theme-');
    const theme = presetThemes.find(t => t.id === image) || presetThemes[0];
    
    if (isPreset) {
        return (
            <div 
                className={`${className} relative overflow-hidden flex flex-col justify-end`}
                style={{ background: theme.gradient }}
            >
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
            </div>
        );
    }
    
    return <img src={image} className={`${className} object-cover`} alt="" referrerPolicy="no-referrer" />;
};
