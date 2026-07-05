import React, { useState, useEffect, useMemo } from 'react';
import { User, View } from '../App';
import { useLanguage } from './LanguageContext';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import PageBanner from './PageBanner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Plus, 
  User as UserIcon, 
  Share2, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Search, 
  X, 
  BookOpen, 
  Home, 
  Book,
  GraduationCap
} from 'lucide-react';

export interface ClassInfo {
    id: string;
    name: string;
    section?: string;  // Phần
    teacher: string;
    subject: string;
    room?: string;      // Phòng học
    image: string;      // URLảnh hoặc theme-id
}

// Preset Google Classroom style gradient theme headers
export const presetThemes = [
  { id: 'theme-teal', name: 'Màu Mòng Két (Teal)', gradient: 'linear-gradient(135deg, #0d9488, #115e59)', lightBg: '#f0fdfa', text: '#0d9488', activeBorder: 'border-teal-500' },
  { id: 'theme-blue', name: 'Xanh Cổ Điển (Classic Blue)', gradient: 'linear-gradient(135deg, #2563eb, #1e3a8a)', lightBg: '#eff6ff', text: '#2563eb', activeBorder: 'border-blue-500' },
  { id: 'theme-purple', name: 'Oải Hương (Violet/Indigo)', gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', lightBg: '#f5f3ff', text: '#7c3aed', activeBorder: 'border-purple-500' },
  { id: 'theme-coral', name: 'San Hô Đỏ (Coral)', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)', lightBg: '#fff1f2', text: '#f43f5e', activeBorder: 'border-rose-500' },
  { id: 'theme-emerald', name: 'Ngọc Lục Bảo (Emerald)', gradient: 'linear-gradient(135deg, #10b981, #064e3b)', lightBg: '#ecfdf5', text: '#10b981', activeBorder: 'border-emerald-500' },
  { id: 'theme-amber', name: 'Hổ Phách (Amber)', gradient: 'linear-gradient(135deg, #f59e0b, #78350f)', lightBg: '#fffbeb', text: '#d97706', activeBorder: 'border-amber-500' }
];

// Mock Data
export const mockClasses: ClassInfo[] = [
    { id: 'class-1', name: 'Kỹ năng Quản lý Thời gian', teacher: 'Trần Văn An', subject: 'Phát triển bản thân', section: 'Mùa thu 2026', room: 'Phòng 201', image: 'theme-purple' },
    { id: 'class-2', name: 'Marketing Kỹ thuật số 101', teacher: 'Hoàng Văn Em', subject: 'Marketing', section: 'Bộ phận Kinh Doanh', room: 'Phòng Hội nghị', image: 'theme-teal' },
    { id: 'class-3', name: 'Nhập môn Lập trình React', teacher: 'Phạm Minh Cường', subject: 'Công nghệ', section: 'Đội ngũ IT', room: 'Phòng Lab 1', image: 'theme-blue' },
    { id: 'class-4', name: 'An toàn Thông tin Doanh nghiệp', teacher: 'Lê Thị Bình', subject: 'Bảo mật', section: 'Dành cho tất cả nhân viên', room: 'Sảnh lớn', image: 'theme-coral' },
];

// Helper to render banner backgrounds
export const ClassBannerBg: React.FC<{ image: string; className?: string }> = ({ image, className = "w-full h-full" }) => {
    const isPreset = image.startsWith('theme-');
    const theme = presetThemes.find(t => t.id === image) || presetThemes[0];
    
    if (isPreset) {
        return (
            <div 
                className={`${className} relative overflow-hidden flex flex-col justify-end`}
                style={{ background: theme.gradient }}
            >
                {/* Vintage Classroom Grid Accent Overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
            </div>
        );
    }
    
    return <img src={image} className={`${className} object-cover`} alt="" referrerPolicy="no-referrer" />;
};

interface ClassCardProps {
    classInfo: ClassInfo;
    user: User;
    onNavigate: (view: View, classId: string) => void;
    onShare: (classInfo: ClassInfo) => void;
    onEdit: (classInfo: ClassInfo) => void;
    onDelete: (classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, user, onNavigate, onShare, onEdit, onDelete }) => {
    const { t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleOutsideClick = () => setShowMenu(false);
        if (showMenu) {
            document.addEventListener('click', handleOutsideClick);
        }
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [showMenu]);

    // Teacher avatar placeholder
    const firstLetter = classInfo.teacher ? classInfo.teacher.charAt(0).toUpperCase() : 'T';

    // Retrieve the computed completion rate for employee pathway
    const completionRate = useMemo(() => {
        if (!classInfo?.id || !user?.id) return 0;
        const rateStr = localStorage.getItem(`course_completion_rate_${classInfo.id}_${user.id}`);
        if (rateStr) return parseInt(rateStr, 10);

        const stepStr = localStorage.getItem(`course_step_idx_${classInfo.id}_${user.id}`);
        if (stepStr && parseInt(stepStr, 10) > 0) {
            return 25; // fallback starter progress
        }
        return 0;
    }, [classInfo.id, user?.id]);

    const statusInfo = useMemo(() => {
        const isCompleted = completionRate === 100 || localStorage.getItem(`course_completed_${classInfo.id}_${user.id}`) === 'true';
        if (isCompleted) {
            return {
                label: t('completed') || 'Đã hoàn thành',
                bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-150/15',
                bar: 'bg-emerald-500'
            };
        }
        if (completionRate > 0) {
            return {
                label: t('learning') || 'Đang học',
                bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-150/15',
                bar: 'bg-amber-500'
            };
        }
        return {
            label: t('notStarted') || 'Chưa bắt đầu',
            bg: 'bg-slate-50 dark:bg-slate-950/30 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/40',
            bar: 'bg-slate-200 dark:bg-slate-800'
        };
    }, [completionRate, classInfo.id, user?.id]);

    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800/90 rounded-xl shadow-xs overflow-hidden flex flex-col group text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative">
            
            {/* Header / Banner region */}
            <div className="relative h-28 w-full group/banner cursor-pointer shrink-0 overflow-hidden" onClick={() => onNavigate('class-detail', classInfo.id)}>
                <div className="w-full h-full transform group-hover/banner:scale-105 transition-transform duration-500">
                    <ClassBannerBg image={classInfo.image} className="w-full h-full" />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover/banner:bg-black/30 transition-all"></div>
                
                {/* Text Content inside the Class Banner */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-3 flex flex-col z-10 text-white min-w-0">
                    <h3 className="text-base font-extrabold leading-tight text-white group-hover/banner:underline truncate">
                        {classInfo.name}
                    </h3>
                    <p className="text-white/80 text-xs truncate mt-0.5">
                        {classInfo.section || classInfo.subject}
                    </p>
                </div>

                {/* Overlaid settings trigger */}
                <div className="absolute top-2.5 right-2.5 z-20">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="p-1.5 bg-black/20 hover:bg-black/40 text-white hover:text-white rounded-full transition-all focus:outline-none"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30 min-w-28 text-sm text-slate-700 dark:text-slate-200">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(classInfo); }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                                <Edit className="w-3.5 h-3.5" /> Chỉnh sửa
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(classInfo.id); }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-rose-500 font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Xóa lớp
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlaid Teacher Avatar standard to Google Classroom */}
            <div className="absolute right-4 top-20 w-11 h-11 rounded-full border-2 border-white dark:border-slate-900 bg-sky-500 text-white font-extrabold shadow-md flex items-center justify-center text-sm z-10">
                {firstLetter}
            </div>

            {/* Center Content / Teacher Details */}
            <div className="flex-1 p-4 pt-5 pb-3 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{classInfo.teacher}</span>
                    </div>
                    {classInfo.room && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 pl-0.5">
                            <Home className="w-3" />
                            <span>{t('room') || 'Phòng'}: {classInfo.room}</span>
                        </div>
                    )}
                    
                    {/* Sleek Progress Status Badge & Bar */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 mt-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400">{t('learningStatus') || 'Trạng thái học tập'}</span>
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                <span>{t('completionProgress') || 'Tiến độ hoàn tất'}</span>
                                <span className={completionRate === 100 ? 'text-emerald-500' : ''}>{completionRate}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${statusInfo.bar}`}
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 mt-auto flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {classInfo.subject}
                </span>

                <div className="flex gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onShare(classInfo); }}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all"
                        title="Sao chép link lớp học"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                     <button 
                        onClick={() => onNavigate('class-detail', classInfo.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-all"
                        title="Vào lớp học"
                     >
                         <BookOpen className="w-4 h-4" />
                     </button>
                </div>
            </div>
        </div>
    );
};

interface TrainingDashboardViewProps {
  user: User;
  onNavigate: (view: View, classId?: string) => void;
}

const TrainingDashboardView: React.FC<TrainingDashboardViewProps> = ({ user, onNavigate }) => {
    const { t } = useLanguage();
    
    // Manage class states with localStorage support!
    const [classes, setClasses] = useState<ClassInfo[]>(() => {
        const stored = localStorage.getItem('classroom_classes');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return mockClasses;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [progressFilter, setProgressFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
    const [toastMessage, setToastMessage] = useState('');

    // Stats calculations for training progress matching project dashboard structure
    const stats = useMemo(() => {
        const completed = classes.filter(c => localStorage.getItem(`course_completed_${c.id}_${user.id}`) === 'true').length;
        const inProgress = classes.filter(c => {
            const rate = parseInt(localStorage.getItem(`course_completion_rate_${c.id}_${user.id}`) || '0', 10);
            const completedCheck = localStorage.getItem(`course_completed_${c.id}_${user.id}`) === 'true';
            return rate > 0 && !completedCheck;
        }).length;
        const notStarted = classes.length - completed - inProgress;
        return { completed, inProgress, notStarted };
    }, [classes, user?.id]);

    // Modal forms states
    const [showEditAddModal, setShowEditAddModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingClassId, setEditingClassId] = useState<string | null>(null);

    // Form fields states based exactly on Google Classroom Create Class fields
    const [fieldName, setFieldName] = useState('');
    const [fieldSection, setFieldSection] = useState('');
    const [fieldSubject, setFieldSubject] = useState('');
    const [fieldRoom, setFieldRoom] = useState('');
    const [fieldImageTheme, setFieldImageTheme] = useState('theme-teal');
    const [customUnsplashUrl, setCustomUnsplashUrl] = useState('');
    const [isCustomCover, setIsCustomCover] = useState(false);

    // Save classes update to localStorage
    const updateClassesList = (newList: ClassInfo[]) => {
        setClasses(newList);
        localStorage.setItem('classroom_classes', JSON.stringify(newList));
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 2500);
    };

    const handleShareClass = (classInfo: ClassInfo) => {
        const shareUrl = `${window.location.protocol}//${window.location.host}/?shareType=class&shareId=${classInfo.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Đã sao chép liên kết khoá đào tạo: "${classInfo.name}"!`);
        }).catch(() => {
            // Fallback copy
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(`Đã sao chép liên kết khoá đào tạo: "${classInfo.name}"!`);
        });
    };

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setEditingClassId(null);
        setFieldName('');
        setFieldSection('');
        setFieldSubject('');
        setFieldRoom('');
        setFieldImageTheme(presetThemes[Math.floor(Math.random() * presetThemes.length)].id);
        setCustomUnsplashUrl('');
        setIsCustomCover(false);
        setShowEditAddModal(true);
    };

    const handleOpenEditModal = (classInfo: ClassInfo) => {
        setModalMode('edit');
        setEditingClassId(classInfo.id);
        setFieldName(classInfo.name);
        setFieldSection(classInfo.section || '');
        setFieldSubject(classInfo.subject);
        setFieldRoom(classInfo.room || '');
        
        if (classInfo.image.startsWith('theme-')) {
            setFieldImageTheme(classInfo.image);
            setCustomUnsplashUrl('');
            setIsCustomCover(false);
        } else {
            setFieldImageTheme('theme-teal');
            setCustomUnsplashUrl(classInfo.image);
            setIsCustomCover(true);
        }
        setShowEditAddModal(true);
    };

    const handleDeleteClass = (classId: string) => {
        const matched = classes.find(c => c.id === classId);
        if (!matched) return;
        
        if (confirm(`Bạn có chắc chắn muốn xóa lớp học "${matched.name}" không? Hành động này sẽ xóa tất cả chủ đề và bài giảng liên quan.`)) {
            const newList = classes.filter(c => c.id !== classId);
            updateClassesList(newList);
            // Delete accompanying classwork from localStorage too to keep tidy
            localStorage.removeItem(`classroom_classworks_${classId}`);
            showToast(`Đã xóa lớp học "${matched.name}"`);
        }
    };

    const handleSaveClass = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fieldName.trim()) {
            alert('Tên lớp học là bắt buộc.');
            return;
        }

        const coverValue = isCustomCover ? (customUnsplashUrl.trim() || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800') : fieldImageTheme;

        if (modalMode === 'create') {
            const newClass: ClassInfo = {
                id: `class-${Date.now()}`,
                name: fieldName.trim(),
                section: fieldSection.trim() || undefined,
                teacher: user?.name || 'Trần Văn An',
                subject: fieldSubject.trim() || 'Khác',
                room: fieldRoom.trim() || undefined,
                image: coverValue
            };
            const newList = [...classes, newClass];
            updateClassesList(newList);
            showToast(`Đã tạo thành công lớp học "${newClass.name}"!`);
        } else if (modalMode === 'edit' && editingClassId) {
            const newList = classes.map(c => c.id === editingClassId ? {
                ...c,
                name: fieldName.trim(),
                section: fieldSection.trim() || undefined,
                subject: fieldSubject.trim() || 'Khác',
                room: fieldRoom.trim() || undefined,
                image: coverValue
            } : c);
            updateClassesList(newList);
            showToast(`Đã cập nhật lớp học!`);
        }

        setShowEditAddModal(false);
    };

    // Filter classes based on search and progress tracking profiles
    const filteredClasses = useMemo(() => {
        return classes.filter(c => {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || (
                c.name.toLowerCase().includes(query) ||
                c.subject.toLowerCase().includes(query) ||
                c.teacher.toLowerCase().includes(query) ||
                (c.section && c.section.toLowerCase().includes(query))
            );
            if (!matchesSearch) return false;

            // Get progress rate from our synced localStorage key
            const rateStr = localStorage.getItem(`course_completion_rate_${c.id}_${user.id}`);
            const rate = rateStr ? parseInt(rateStr, 10) : 0;
            const isCompleted = rate === 100 || localStorage.getItem(`course_completed_${c.id}_${user.id}`) === 'true';

            if (progressFilter === 'completed') {
                return isCompleted;
            }
            if (progressFilter === 'in-progress') {
                return !isCompleted && (rate > 0 || (localStorage.getItem(`course_step_idx_${c.id}_${user.id}`) && parseInt(localStorage.getItem(`course_step_idx_${c.id}_${user.id}`)!, 10) > 0));
            }
            if (progressFilter === 'not-started') {
                const stepIdx = localStorage.getItem(`course_step_idx_${c.id}_${user.id}`);
                const step = stepIdx ? parseInt(stepIdx, 10) : 0;
                return rate === 0 && step === 0 && !isCompleted;
            }
            return true;
        });
    }, [classes, searchQuery, progressFilter, user?.id]);

    return (
        <StandardPageLayout>
            <PageBanner 
                title={t('trainingTitle') || "Đào tạo & Phát triển"}
                subtitle={t('trainingSubtitle') || "Nâng cao kỹ năng chuyên môn, cập nhật kiến thức mới và xây dựng lộ trình sự nghiệp bền vững."}
                icon={<GraduationCap className="w-full h-full text-white" />}
                gradient="from-emerald-600 to-teal-700"
                actions={
                    <button 
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-white text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all"
                    >
                        <Plus className="w-4 h-4" /> {t('createNewClass') || 'Tạo lớp học mới'}
                    </button>
                }
            />

            <div className="flex flex-col gap-6 mt-6">
                {/* Statistics Section matching Project Management style */}
                <ContentCard>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-emerald-600" />
                          Thống kê & Lộ trình Học tập
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">Theo dõi tỉ lệ hoàn thành khoá học và tổng quan tiến độ đào tạo cá nhân.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                      <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                        {[
                          { label: 'Đã hoàn thành', count: stats.completed, color: 'bg-emerald-500' },
                          { label: 'Đang học', count: stats.inProgress, color: 'bg-amber-500' },
                          { label: 'Chưa bắt đầu', count: stats.notStarted, color: 'bg-slate-300' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold">
                            <span className="flex items-center gap-2 text-slate-500 uppercase tracking-wider text-[10px]">
                              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                              {item.label}
                            </span>
                            <span className="text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{item.count} khoá học</span>
                          </div>
                        ))}
                      </div>

                      <div className="lg:col-span-2 h-[180px]">
                        {classes.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Đã hoàn thành', value: stats.completed, color: '#10B981' },
                                  { name: 'Đang học', value: stats.inProgress, color: '#F59E0B' },
                                  { name: 'Chưa bắt đầu', value: stats.notStarted, color: '#CBD5E1' },
                                ].filter(d => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={75}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {[
                                  { name: 'Đã hoàn thành', value: stats.completed, color: '#10B981' },
                                  { name: 'Đang học', value: stats.inProgress, color: '#F59E0B' },
                                  { name: 'Chưa bắt đầu', value: stats.notStarted, color: '#CBD5E1' },
                                ].filter(d => d.value > 0).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                                  borderRadius: '12px', 
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }} 
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs font-bold text-slate-400">Chưa có dữ liệu học tập.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </ContentCard>

                <ContentCard>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder={t('searchClassPlaceholder') || "Tìm kiếm lớp học..."}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-2">{t('filter')}:</span>
                                {[
                                    { id: 'all', label: t('all') || 'Tất cả', count: classes.length },
                                    { id: 'completed', label: t('completed') || 'Hoàn thành', count: classes.filter(c => localStorage.getItem(`course_completed_${c.id}_${user.id}`) === 'true').length },
                                    { id: 'in-progress', label: t('learning') || 'Đang học', count: classes.filter(c => (parseInt(localStorage.getItem(`course_completion_rate_${c.id}_${user.id}`) || '0', 10) > 0 && localStorage.getItem(`course_completed_${c.id}_${user.id}`) !== 'true')).length },
                                ].map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setProgressFilter(filter.id as 'all' | 'completed' | 'in-progress')}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${progressFilter === filter.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-gray-200 hover:border-emerald-200'}`}
                                    >
                                        {filter.label} ({filter.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {filteredClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredClasses.map(classInfo => (
                            <ClassCard 
                                key={classInfo.id} 
                                classInfo={classInfo} 
                                user={user}
                                onNavigate={onNavigate} 
                                onShare={handleShareClass}
                                onEdit={handleOpenEditModal}
                                onDelete={handleDeleteClass}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 p-8 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                            <Book className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Không tìm thấy khóa học nào</h3>
                        <p className="text-xs text-slate-500 mt-1">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.</p>
                    </div>
                )}
            </div>

            {/* Modal & Toast remain similar but with standardized styling classes */}
            {showEditAddModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up border border-white/20">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{modalMode === 'create' ? t('createNewClass') || 'Tạo lớp học mới' : t('editClass') || 'Chỉnh sửa lớp học'}</h3>
                            <button onClick={() => setShowEditAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSaveClass} className="p-8 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('className') || 'Tên lớp học'}</label>
                                <input type="text" required value={fieldName} onChange={e => setFieldName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('subject') || 'Lĩnh vực'}</label>
                                    <input type="text" value={fieldSubject} onChange={e => setFieldSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('room') || 'Phòng học'}</label>
                                    <input type="text" value={fieldRoom} onChange={e => setFieldRoom(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-5 h-5" /> {modalMode === 'create' ? t('createClass') || 'Tạo lớp học' : t('saveChanges') || 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}
        </StandardPageLayout>
    );
};

export default TrainingDashboardView;
