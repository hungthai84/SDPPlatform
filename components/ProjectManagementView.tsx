import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { useLanguage } from './LanguageContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import { SitemapIcon } from './icons';
import { 
  LayoutGrid, 
  List, 
  Download, 
  Trash2, 
  Edit3, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  FileText,
  X
} from 'lucide-react';

interface ProjectManagementViewProps {
  user: User;
  onNavigateToTasks?: (taskListId: string) => void;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  dueDate: string;
  startDate?: string;
  parentProjectId?: string;
  taskListIds?: string[];
  department?: string;
}

const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({ user }) => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'this_week' | 'this_month'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [statsTab, setStatsTab] = useState<'chart' | 'flowchart'>('chart');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentProject, setCurrentProject] = useState<Partial<ProjectData>>({
    status: 'active',
    name: '',
    description: '',
    department: 'None'
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectData));
      setProjects(projs);
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addDoc(collection(db, 'projects'), {
          ...currentProject,
          createdAt: new Date().toISOString(),
          userId: user.id
        });
        showToast('Đã thêm dự án mới thành công!');
      } else if (currentProject.id) {
        await updateDoc(doc(db, 'projects', currentProject.id), currentProject);
        showToast('Đã cập nhật dự án thành công!');
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Có lỗi xảy ra khi lưu dự án.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        showToast('Đã xóa dự án.');
      } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Có lỗi xảy ra khi xóa dự án.');
      }
    }
  };

  const getFilteredProjects = () => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'all' || p.department === selectedDepartment;
      
      let matchesDate = true;
      if (dueDateFilter !== 'all' && p.dueDate) {
        const due = new Date(p.dueDate);
        const now = new Date();
        if (dueDateFilter === 'overdue') matchesDate = due < now && p.status !== 'completed';
        else if (dueDateFilter === 'this_week') {
          const nextWeek = new Date();
          nextWeek.setDate(now.getDate() + 7);
          matchesDate = due >= now && due <= nextWeek;
        } else if (dueDateFilter === 'this_month') {
          matchesDate = due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesDept && matchesDate;
    });
  };

  const calculateProjectProgress = (p: ProjectData) => {
    if (p.status === 'completed') return 100;
    // Mock progress calculation for demo
    return Math.floor(Math.random() * 80) + 10;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Danh sách Dự án', 14, 15);
    const data = getFilteredProjects().map(p => [p.name, p.status, p.department || 'None', p.dueDate]);
    autoTable(doc, {
      head: [['Tên dự án', 'Trạng thái', 'Phòng ban', 'Hạn chót']],
      body: data,
      startY: 20
    });
    doc.save('danh-sach-du-an.pdf');
  };

  const handleExportCSV = () => {
    const headers = ['Tên dự án,Trạng thái,Phòng ban,Hạn chót'];
    const rows = getFilteredProjects().map(p => `${p.name},${p.status},${p.department || 'None'},${p.dueDate}`);
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-du-an.csv';
    a.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-tighter">Đang chạy</span>;
      case 'completed': return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-tighter">Hoàn thành</span>;
      case 'on_hold': return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-100 uppercase tracking-tighter">Tạm dừng</span>;
      default: return null;
    }
  };

  const openAddModal = (parentId?: string) => {
    setModalMode('add');
    setCurrentProject({ status: 'active', name: '', description: '', department: 'None', parentProjectId: parentId });
    setShowAddModal(true);
  };

  const openEditModal = (project: ProjectData) => {
    setModalMode('edit');
    setCurrentProject(project);
    setShowAddModal(true);
  };

  return (
    <StandardPageLayout>
      <PageBanner 
        title="Quản lý Dự án & Tiến độ"
        subtitle="Theo dõi, quản lý và tối ưu hóa hiệu suất các dự án chiến lược của doanh nghiệp."
        icon={<LayoutGrid className="w-full h-full text-white" />}
        gradient="from-indigo-600 to-blue-700"
        actions={
          <button 
            onClick={() => openAddModal()}
            className="flex items-center gap-2 bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo dự án mới
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Statistics Section */}
        <ContentCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <SitemapIcon className="w-4 h-4 text-indigo-600" />
                  Thống kê & Lưu đồ cấp bậc
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Xem cấu trúc tỷ lệ dự án hoặc lưu đồ các cấp của công việc.</p>
              </div>
              <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => setStatsTab('chart')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    statsTab === 'chart'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Biểu đồ tỷ lệ
                </button>
                <button
                  type="button"
                  onClick={() => setStatsTab('flowchart')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    statsTab === 'flowchart'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Lưu đồ nhiệm vụ
                </button>
              </div>
            </div>

            {statsTab === 'chart' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                  {[
                    { label: 'Đang thực hiện', count: projects.filter(p => p.status === 'active').length, color: 'bg-blue-500' },
                    { label: 'Đã hoàn thành', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
                    { label: 'Tạm dừng', count: projects.filter(p => p.status === 'on_hold').length, color: 'bg-yellow-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-500 uppercase tracking-wider text-[10px]">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                        {item.label}
                      </span>
                      <span className="text-slate-800">{item.count} dự án</span>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 h-[200px]">
                  {projects.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Đang thực hiện', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
                            { name: 'Đã hoàn thành', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
                            { name: 'Tạm dừng', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {[
                            { name: 'Đang thực hiện', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
                            { name: 'Đã hoàn thành', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
                            { name: 'Tạm dừng', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
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
                    <div className="flex items-center justify-center h-full text-xs font-bold text-slate-400">Chưa có dữ liệu.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                    💡 <strong>Cấu trúc:</strong> Dự án → Dự án con → Tasklists → Tasks.
                  </span>
                  <button 
                    onClick={() => {
                      const parents = projects.filter(p => !p.parentProjectId);
                      const anyCollapsed = parents.some(p => expandedNodes[p.id] === false);
                      const newExpanded: Record<string, boolean> = {};
                      projects.forEach(p => {
                        newExpanded[p.id] = anyCollapsed;
                      });
                      setExpandedNodes(newExpanded);
                    }}
                    className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest"
                  >
                    {projects.some(p => expandedNodes[p.id] === false) ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-2xl border border-gray-100 h-[500px] overflow-hidden relative shadow-inner">
                   <div className="w-full h-full overflow-auto p-8 flex flex-col gap-8 items-center min-w-max">
                        {projects.filter(p => !p.parentProjectId).map(p => (
                          <div key={p.id} className="flex flex-col items-center gap-4">
                            <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md font-bold text-xs border border-indigo-400">
                              {p.name}
                            </div>
                            <div className="flex gap-4">
                              {projects.filter(sp => sp.parentProjectId === p.id).map(sp => (
                                <div key={sp.id} className="flex flex-col items-center gap-2">
                                  <div className="w-px h-4 bg-gray-300"></div>
                                  <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-[10px] font-bold text-slate-700">
                                    {sp.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                </div>
              </div>
            )}
          </div>
        </ContentCard>

        {/* Project List Section */}
        <ContentCard>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">{t('projectList') || 'Danh sách dự án'}</h2>
                <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" /> Bảng
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Gantt
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleExportPDF} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={handleExportCSV} className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-10 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phòng ban:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="None">Khác</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thời hạn:</span>
                <select
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value as 'all' | 'overdue' | 'this_week' | 'this_month')}
                  className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="this_week">Tuần này</option>
                  <option value="this_month">Tháng này</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            {viewMode === 'list' ? (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tên dự án</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái / Tiến độ</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Hạn chót</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {getFilteredProjects().map(project => (
                      <tr key={project.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-slate-800">{project.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                              {project.department ? `Phòng ${project.department}` : 'Chưa phân loại'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(project.status)}
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${calculateProjectProgress(project)}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-500">{calculateProjectProgress(project)}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold text-slate-600">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString('vi-VN') : '---'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditModal(project)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[400px] bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Tính năng Gantt Chart đang được phát triển.</p>
                </div>
              </div>
            )}
          </div>
        </ContentCard>
      </div>

      {/* Add/Edit Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up border border-white/20">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {modalMode === 'add' ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="p-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên dự án</label>
                <input 
                  type="text" 
                  required 
                  value={currentProject.name || ''} 
                  onChange={e => setCurrentProject({...currentProject, name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phòng ban</label>
                  <select 
                    value={currentProject.department || 'None'} 
                    onChange={e => setCurrentProject({...currentProject, department: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option value="None">Chưa phân loại</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hạn chót</label>
                  <input 
                    type="date" 
                    value={currentProject.dueDate || ''} 
                    onChange={e => setCurrentProject({...currentProject, dueDate: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                <div className="flex gap-2">
                  {['active', 'completed', 'on_hold'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCurrentProject({...currentProject, status: s as 'active' | 'completed' | 'on_hold'})}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        currentProject.status === s 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                          : 'bg-white text-slate-500 border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      {s === 'active' ? 'Đang chạy' : s === 'completed' ? 'Xong' : 'Tạm dừng'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Lưu dự án
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

export default ProjectManagementView;
