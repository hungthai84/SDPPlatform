import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Search, 
  Trash2, 
  User, 
  Check, 
  Printer, 
  X, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockAgents } from '../data';

// Interfaces for Projects & Tasks
interface Task {
  id: string;
  projectId: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed';
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  assignedAgentIds: string[];
  createdAt: string;
}

// Initial mock data to seed if empty
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Tối ưu hóa SLA phản hồi đa kênh',
    description: 'Nâng cấp quy trình phân phối vé tự động từ Zalo và Facebook OA để giảm thời gian phản hồi đầu tiên xuống dưới 10 phút.',
    status: 'in_progress',
    startDate: '2026-07-01',
    endDate: '2026-07-25',
    assignedAgentIds: ['a1', 'a2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: 'PRJ-102',
    name: 'Xây dựng kho tri thức Help Center khách hàng',
    description: 'Biên soạn và xuất bản bộ 50 tài liệu hướng dẫn nhanh, câu hỏi thường gặp FAQ để khách hàng có thể tự tra cứu xử lý sự cố.',
    status: 'planning',
    startDate: '2026-07-15',
    endDate: '2026-08-10',
    assignedAgentIds: ['a2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'PRJ-103',
    name: 'Huấn luyện Trợ lý AI nhận diện ý định',
    description: 'Đào tạo mô hình phân tích ngữ cảnh và tự động đề xuất phân loại thẻ độ ưu tiên cho đại lý CSKH dựa trên lịch sử trò chuyện.',
    status: 'completed',
    startDate: '2026-06-10',
    endDate: '2026-07-05',
    assignedAgentIds: ['a1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString()
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-1001',
    projectId: 'PRJ-101',
    title: 'Cấu hình và kiểm tra kết nối webhook Zalo API',
    priority: 'urgent',
    status: 'completed',
    assigneeId: 'a1',
    dueDate: '2026-07-05',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1002',
    projectId: 'PRJ-101',
    title: 'Thiết lập quy tắc phân luồng tự động cho nhóm CSKH',
    priority: 'high',
    status: 'completed',
    assigneeId: 'a2',
    dueDate: '2026-07-12',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1003',
    projectId: 'PRJ-101',
    title: 'Kiểm thử tải hệ thống định tuyến tin nhắn cao điểm',
    priority: 'medium',
    status: 'pending',
    assigneeId: 'a1',
    dueDate: '2026-07-22',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1004',
    projectId: 'PRJ-102',
    title: 'Tổng hợp 50 câu hỏi hỗ trợ kỹ thuật phổ biến nhất',
    priority: 'high',
    status: 'pending',
    assigneeId: 'a2',
    dueDate: '2026-07-20',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1005',
    projectId: 'PRJ-102',
    title: 'Biên tập video hướng dẫn khách hàng tự khôi phục mật khẩu',
    priority: 'low',
    status: 'pending',
    assigneeId: 'a2',
    dueDate: '2026-08-01',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1006',
    projectId: 'PRJ-103',
    title: 'Xuất dữ liệu 5,000 cuộc hội thoại mẫu từ database',
    priority: 'medium',
    status: 'completed',
    assigneeId: 'a1',
    dueDate: '2026-06-18',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TSK-1007',
    projectId: 'PRJ-103',
    title: 'Xây dựng cấu trúc prompt-template phân loại sắc thái',
    priority: 'high',
    status: 'completed',
    assigneeId: 'a1',
    dueDate: '2026-07-02',
    createdAt: new Date().toISOString()
  }
];

export const Projects = () => {
  // Database States (synced with localStorage)
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'in_progress' | 'paused' | 'completed'>('all');

  // Interactive UI states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for creating project
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'planning' | 'in_progress' | 'paused' | 'completed'>('planning');
  const [newProjectStart, setNewProjectStart] = useState('');
  const [newProjectEnd, setNewProjectEnd] = useState('');
  const [newProjectAgents, setNewProjectAgents] = useState<string[]>([]);

  // Form state for creating task inside Project Detail
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Load and seed data from local storage
  useEffect(() => {
    const savedProjects = localStorage.getItem('ps_projects');
    const savedTasks = localStorage.getItem('ps_tasks');

    if (savedProjects && savedTasks) {
      setProjects(JSON.parse(savedProjects));
      setTasks(JSON.parse(savedTasks));
    } else {
      setProjects(INITIAL_PROJECTS);
      setTasks(INITIAL_TASKS);
      localStorage.setItem('ps_projects', JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem('ps_tasks', JSON.stringify(INITIAL_TASKS));
    }
  }, []);

  // Sync state to local storage
  const syncToLocalStorage = (updatedProjects: Project[], updatedTasks: Task[]) => {
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('ps_projects', JSON.stringify(updatedProjects));
    localStorage.setItem('ps_tasks', JSON.stringify(updatedTasks));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      showToast('Vui lòng nhập tên dự án!');
      return;
    }

    const newProject: Project = {
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
      status: newProjectStatus,
      startDate: newProjectStart || new Date().toISOString().slice(0, 10),
      endDate: newProjectEnd || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      assignedAgentIds: newProjectAgents.length > 0 ? newProjectAgents : ['a1'],
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...projects];
    syncToLocalStorage(updatedProjects, tasks);

    // Reset Form
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectStatus('planning');
    setNewProjectStart('');
    setNewProjectEnd('');
    setNewProjectAgents([]);
    setShowCreateModal(false);
    showToast('Đã tạo dự án thành công!');
  };

  // Delete Project
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa dự án này cùng tất cả công việc liên quan?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      const updatedTasks = tasks.filter(t => t.projectId !== id);
      syncToLocalStorage(updatedProjects, updatedTasks);
      
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
      showToast('Đã xóa dự án thành công!');
    }
  };

  // Add Task inside selected project
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (!newTaskTitle.trim()) {
      showToast('Vui lòng nhập tên công việc!');
      return;
    }

    const newTask: Task = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: selectedProject.id,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      status: 'pending',
      assigneeId: newTaskAssignee || undefined,
      dueDate: newTaskDueDate || undefined,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [newTask, ...tasks];
    syncToLocalStorage(projects, updatedTasks);

    // Reset Form
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    showToast('Đã thêm công việc thành công!');
  };

  // Toggle Task Status
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus as 'completed' | 'pending' };
      }
      return t;
    });
    syncToLocalStorage(projects, updatedTasks);
    showToast('Đã cập nhật trạng thái công việc!');
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    syncToLocalStorage(projects, updatedTasks);
    showToast('Đã xóa công việc!');
  };

  // Calculate project task statistics
  const getProjectStats = (projectId: string) => {
    const projTasks = tasks.filter(t => t.projectId === projectId);
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  // Export & Print Report (Swiss layout print system)
  const handlePrintReport = (project: Project) => {
    const projTasks = tasks.filter(t => t.projectId === project.id);
    const stats = getProjectStats(project.id);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = '';
    html += '<html>';
    html += '<head>';
    html += '<title>Báo cáo Dự án: ' + project.name + '</title>';
    html += '<style>';
    html += 'body { font-family: "Inter", system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }';
    html += 'h1 { font-size: 24px; margin-bottom: 5px; letter-spacing: -0.025em; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }';
    html += '.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; margin-bottom: 30px; font-size: 13px; font-family: monospace; }';
    html += '.meta-item { border-left: 2px solid #cbd5e1; padding-left: 10px; }';
    html += '.meta-item strong { color: #64748b; font-size: 11px; display: block; text-transform: uppercase; }';
    html += '.desc { font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 30px; border: 1px solid #e2e8f0; }';
    html += 'table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }';
    html += 'th { text-align: left; padding: 10px; background: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; font-size: 11px; color: #475569; }';
    html += 'td { padding: 10px; border-bottom: 1px solid #e2e8f0; }';
    html += '.status-badge { font-family: monospace; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }';
    html += '.status-completed { background: #d1fae5; color: #065f46; }';
    html += '.status-pending { background: #fef3c7; color: #92400e; }';
    html += '.priority-urgent { color: #b91c1c; font-weight: bold; }';
    html += '.priority-high { color: #c2410c; }';
    html += '.priority-medium { color: #1d4ed8; }';
    html += '.priority-low { color: #4b5563; }';
    html += '.footer { margin-top: 60px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; font-family: monospace; }';
    html += '</style>';
    html += '</head>';
    html += '<body>';
    html += '<h1>Báo Cáo Tiến Độ Dự Án</h1>';
    html += '<div class="meta-grid">';
    html += '<div class="meta-item"><strong>Mã dự án</strong><br/>' + project.id + '</div>';
    html += '<div class="meta-item"><strong>Tên dự án</strong><br/>' + project.name + '</div>';
    html += '<div class="meta-item"><strong>Thời gian thực hiện</strong><br/>' + project.startDate + ' đến ' + project.endDate + '</div>';
    html += '<div class="meta-item"><strong>Tiến độ hoàn thành</strong><br/>' + stats.percent + '% (' + stats.completed + '/' + stats.total + ' công việc)</div>';
    html += '</div>';
    html += '<div class="desc"><strong>Mô tả dự án:</strong><br/>' + (project.description || 'Chưa có mô tả chi tiết.') + '</div>';
    html += '<h2>Danh sách công việc liên quan (Integrated Sub-tasks)</h2>';
    html += '<table>';
    html += '<thead><tr><th style="width: 80px;">Mã</th><th>Tên công việc</th><th style="width: 100px;">Ưu tiên</th><th style="width: 120px;">Thời hạn</th><th style="width: 100px;">Trạng thái</th></tr></thead>';
    html += '<tbody>';

    projTasks.forEach(t => {
      html += '<tr>';
      html += '<td>' + t.id + '</td>';
      html += '<td>' + t.title + '</td>';
      html += '<td><span class="priority-' + t.priority + '">' + t.priority.toUpperCase() + '</span></td>';
      html += '<td>' + (t.dueDate || 'Chưa rõ') + '</td>';
      html += '<td><span class="status-badge status-' + t.status + '">' + (t.status === 'completed' ? 'HOÀN THÀNH' : 'ĐANG LÀM') + '</span></td>';
      html += '</tr>';
    });

    html += '</tbody>';
    html += '</table>';
    html += '<div class="footer">BÁO CÁO ĐƯỢC XUẤT TỰ ĐỘNG TỪ HỆ THỐNG POWER SERVICE - OFFLINE-FIRST PERSISTENCE<br/>NGÀY IN: ' + new Date().toLocaleString('vi-VN') + ' | BẢO MẬT NỘI BỘ</div>';
    html += '</body>';
    html += '</html>';

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Filter projects based on search query & status filter
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Global project statistics
  const totalProjectsCount = projects.length;
  const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
  const activeTasksCount = tasks.filter(t => t.status === 'pending').length;
  const urgentTasksCount = tasks.filter(t => t.priority === 'urgent' && t.status === 'pending').length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50 p-6 gap-6 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-slate-900/90 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold border border-slate-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Projects Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 select-none">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 block tracking-wider">TỔNG DỰ ÁN</span>
            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">{totalProjectsCount}</span>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 block tracking-wider">ĐÃ HOÀN THÀNH</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">{completedProjectsCount}</span>
          </div>
          <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 block tracking-wider">CÔNG VIỆC CHỜ</span>
            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">{activeTasksCount}</span>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 block tracking-wider">KHẨN CẤP (PENDING)</span>
            <span className="text-2xl font-bold font-mono text-red-600 mt-1 block">{urgentTasksCount}</span>
          </div>
          <div className="p-3 rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Control bar (Search, filter and action) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm shrink-0">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dự án theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status filter tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 select-none">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'planning', label: 'Chuẩn bị' },
              { id: 'in_progress', label: 'Đang làm' },
              { id: 'completed', label: 'Xong' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as 'all' | 'planning' | 'in_progress' | 'paused' | 'completed')}
                className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Add project button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo dự án</span>
          </button>
        </div>
      </div>

      {/* 3. Main Projects Display (Grid Layout) */}
      <div className="flex-1 overflow-y-auto pr-0.5">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 opacity-50 mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">Không tìm thấy dự án nào</h3>
            <p className="text-xs text-slate-400 mt-1">Hãy tạo một dự án mới để bắt đầu lên quy trình làm việc cho nhóm hỗ trợ của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const stats = getProjectStats(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-350 hover:shadow-md transition-all p-5 shadow-sm cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[180px]"
                >
                  {/* Status header */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-200/40 rounded uppercase">
                      {project.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      project.status === 'planning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      project.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {project.status === 'planning' ? 'Chuẩn bị' :
                       project.status === 'in_progress' ? 'Đang thực hiện' :
                       project.status === 'completed' ? 'Hoàn thành' : 'Tạm dừng'}
                    </span>
                  </div>

                  {/* Body title & description */}
                  <div className="my-4 flex-1">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {project.description || 'Chưa có mô tả chi tiết.'}
                    </p>
                  </div>

                  {/* Footer details: Progress & due dates */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    
                    {/* Progress slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>TIẾN ĐỘ THỰC HIỆN</span>
                        <span>{stats.percent}% ({stats.completed}/{stats.total} tasks)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            project.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Timeline & Team */}
                    <div className="flex justify-between items-center pt-1 text-[10.5px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.endDate}</span>
                      </div>

                      {/* Team with standard icons - NO photos */}
                      <div className="flex items-center -space-x-1.5">
                        {project.assignedAgentIds.slice(0, 3).map((id) => {
                          const agent = mockAgents.find(a => a.id === id);
                          return (
                            <div 
                              key={id}
                              className="w-5.5 h-5.5 rounded-full bg-slate-100 border border-white text-slate-600 flex items-center justify-center font-bold text-[9px] shadow-sm select-none"
                              title={agent?.name || 'Tài khoản người dùng'}
                            >
                              <User className="w-3 h-3" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Delete button (hover aware) */}
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer z-10"
                    title="Xóa dự án"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Sliding Drawer Detail Panel (Integrated Tasks Sub-tab inside) */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-950 z-[100]"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[110] border-l border-slate-200 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-blue-400 border border-slate-700/60">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 border border-slate-700 rounded text-slate-400 uppercase">
                        {selectedProject.id}
                      </span>
                      <span className="text-[10px] text-slate-400">Dự Án Vận Hành</span>
                    </div>
                    <h2 className="text-sm font-bold truncate max-w-[340px] mt-0.5">{selectedProject.name}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Info Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase">THÔNG TIN CHI TIẾT</h3>
                  
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedProject.description || 'Chưa có mô tả chi tiết cho dự án này.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-3 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block font-sans">THỜI GIAN</span>
                        <span className="text-slate-700 font-semibold">{selectedProject.startDate} đến {selectedProject.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-sans">PHÂN QUYỀN NHÓM</span>
                        <span className="text-slate-700 font-semibold">Tài khoản người dùng</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print and Export CTA */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrintReport(selectedProject)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>In báo cáo dự án (Swiss PDF)</span>
                  </button>
                </div>

                {/* THE SUB-TAB CORE: INTEGRATED TASKS "Công việc" */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 select-none">
                    <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4" />
                      <span>CÔNG VIỆC PHÁT SINH ({tasks.filter(t => t.projectId === selectedProject.id).length})</span>
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      TỈ LỆ HOÀN THÀNH: {getProjectStats(selectedProject.id).percent}%
                    </span>
                  </div>

                  {/* Add New Task Form inline */}
                  <form onSubmit={handleAddTask} className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 space-y-3 shadow-sm">
                    <input
                      type="text"
                      placeholder="Nhập tên công việc phát sinh mới..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      maxLength={120}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Priority Selector */}
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                          className="bg-white border border-slate-200 px-2 py-1.5 rounded-md text-[10px] font-semibold text-slate-600 focus:outline-none"
                        >
                          <option value="low">Độ ưu tiên: Thấp</option>
                          <option value="medium">Độ ưu tiên: Trung bình</option>
                          <option value="high">Độ ưu tiên: Cao</option>
                          <option value="urgent">Độ ưu tiên: Khẩn cấp</option>
                        </select>

                        {/* Assignee Selector */}
                        <select
                          value={newTaskAssignee}
                          onChange={(e) => setNewTaskAssignee(e.target.value)}
                          className="bg-white border border-slate-200 px-2 py-1.5 rounded-md text-[10px] font-semibold text-slate-600 focus:outline-none"
                        >
                          <option value="">Người phụ trách: Đang mở</option>
                          {mockAgents.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>

                        {/* Due Date Picker */}
                        <input
                          type="date"
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                          className="bg-white border border-slate-200 px-2 py-1.5 rounded-md text-[10px] font-semibold text-slate-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                      >
                        Thêm việc
                      </button>
                    </div>
                  </form>

                  {/* Tasks List check/uncheck */}
                  <div className="space-y-2">
                    {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                      <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CheckSquare className="w-6 h-6 mx-auto opacity-20 mb-1" />
                        <p className="text-[11px]">Chưa có công việc nào phát sinh trong dự án này.</p>
                      </div>
                    ) : (
                      tasks.filter(t => t.projectId === selectedProject.id).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                task.status === 'completed'
                                  ? 'bg-blue-600 border-transparent text-white shadow-sm shadow-blue-600/10'
                                  : 'border-slate-300 bg-white hover:border-slate-400'
                              }`}
                            >
                              {task.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                            </button>

                            {/* Title & Priority Badge */}
                            <div className="min-w-0 flex-1">
                              <span className={`text-[12px] block leading-snug truncate pr-3 ${
                                task.status === 'completed' 
                                  ? 'line-through text-slate-400' 
                                  : 'text-slate-700 font-medium'
                              }`}>
                                {task.title}
                              </span>

                              <div className="flex items-center gap-2 mt-1 select-none font-mono text-[9px]">
                                <span className={`font-bold uppercase ${
                                  task.priority === 'urgent' ? 'text-red-600' :
                                  task.priority === 'high' ? 'text-orange-500' :
                                  task.priority === 'medium' ? 'text-blue-500' : 'text-slate-500'
                                }`}>
                                  {task.priority === 'urgent' ? 'khẩn cấp' :
                                   task.priority === 'high' ? 'cao' :
                                   task.priority === 'medium' ? 'trung bình' : 'thấp'}
                                </span>
                                {task.dueDate && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-400 flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" />
                                      Hạn: {task.dueDate}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Delete Action button inside Drawer Task list */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                            title="Xóa công việc"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Create Project Modal Dialog */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999]"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 relative overflow-hidden"
              >
                {/* Header decor bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div className="flex items-center gap-2.5 mb-5 mt-1 select-none">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Khởi Tạo Dự Án Mới</h3>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Tên dự án *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Tối ưu quy trình SLA phản hồi Đa kênh..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Mô tả tóm tắt</label>
                    <textarea
                      placeholder="Mô tả mục tiêu, lợi ích và giải pháp cốt lõi của dự án..."
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 resize-none"
                    />
                  </div>

                  {/* Timeline Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Ngày bắt đầu</label>
                      <input
                        type="date"
                        value={newProjectStart}
                        onChange={(e) => setNewProjectStart(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none text-slate-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Ngày kết thúc</label>
                      <input
                        type="date"
                        value={newProjectEnd}
                        onChange={(e) => setNewProjectEnd(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Trạng thái khởi tạo</label>
                    <select
                      value={newProjectStatus}
                      onChange={(e) => setNewProjectStatus(e.target.value as 'planning' | 'in_progress' | 'paused' | 'completed')}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none text-slate-600 font-semibold"
                    >
                      <option value="planning">Chuẩn bị (Planning)</option>
                      <option value="in_progress">Đang thực hiện (In progress)</option>
                      <option value="paused">Tạm dừng (Paused)</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/10"
                    >
                      Xác nhận tạo
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
