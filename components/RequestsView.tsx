import React, { useState, useMemo } from 'react';
import { User } from '../App';
import { useLanguage } from './LanguageContext';
import { XIcon, CheckIcon, SearchIcon, ShareIcon } from './icons';
import CreateRequestModal, { Request } from './CreateRequestModal';
import { CalendarEvent } from './CalendarView';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import PageBanner from './PageBanner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ClipboardList, Plus, Search } from 'lucide-react';

interface RequestsViewProps {
    user: User;
    users: User[];
    onSaveEvent: (event: Omit<CalendarEvent, 'id' | 'color'> & { id?: string; color?: CalendarEvent['color'] }) => Promise<void>;
}

const mockRequests: Request[] = [
    {
        id: '1',
        title: 'Xin nghỉ phép ngày 20/11',
        type: 'leaveRequest',
        content: 'Tôi có việc gia đình đột xuất.',
        status: 'pending',
        createdAt: new Date(),
        authorId: 'user-1',
        authorName: 'Nguyễn Văn A',
        approverId: 'dev-admin',
        approverName: 'Admin',
    }
];

const RequestsView: React.FC<RequestsViewProps> = ({ user, users, onSaveEvent }) => {
    const { t } = useLanguage();
    const [requests, setRequests] = useState<Request[]>(mockRequests);
    const [activeTab, setActiveTab] = useState<'mine' | 'to-approve'>('mine');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const stats = useMemo(() => {
        const approved = requests.filter(r => r.status === 'approved').length;
        const rejected = requests.filter(r => r.status === 'rejected').length;
        const pending = requests.filter(r => r.status === 'pending').length;
        return { approved, rejected, pending, total: requests.length };
    }, [requests]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 2500);
    };

    const handleShareRequest = (req: Request) => {
        const shareUrl = `${window.location.protocol}//${window.location.host}/?shareType=approval&shareId=${req.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Đã sao chép liên kết phiếu phê duyệt: "${req.title}"!`);
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(`Đã sao chép liên kết phiếu phê duyệt: "${req.title}"!`);
        });
    };

    const handleSaveRequest = async (newRequest: Request) => {
        setRequests([newRequest, ...requests]);
        setCreateModalOpen(false);
        showToast('Đã tạo yêu cầu thành công!');

        // If it's a leave request, create a calendar event
        if (newRequest.type === 'leaveRequest' && newRequest.startDate && onSaveEvent) {
            const startDate = new Date(newRequest.startDate);
            
            // For simplicity, we create one event for the start date. 
            // In a real app, you might want to create a range or multiple events.
            await onSaveEvent({
                title: `Nghỉ phép: ${newRequest.authorName}`,
                description: `Yêu cầu: ${newRequest.title}\nNội dung: ${newRequest.content}`,
                date: startDate,
                startTime: '08:00',
                endTime: '17:30',
                color: 'purple',
                locationType: 'offline',
                meetingRoom: 'Out of Office'
            });
        }
        
        try {
            const approver = users.find(u => u.id === newRequest.approverId);
            const approverEmail = approver?.email || approver?.id === 'dev-admin' ? 'admin@example.com' : 'approver@example.com'; 
            
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: approverEmail,
                    subject: `Yêu cầu mới cần phê duyệt: ${newRequest.title}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #4f46e5;">Có yêu cầu mới cần phê duyệt</h2>
                            <p><strong>Từ:</strong> ${newRequest.authorName}</p>
                            <p><strong>Tiêu đề:</strong> ${newRequest.title}</p>
                            <p><strong>Nội dung:</strong></p>
                            <div style="background: #f3f4f6; padding: 10px; border-radius: 8px;">
                                ${newRequest.content}
                            </div>
                            <p style="margin-top: 20px;">Vui lòng đăng nhập vào hệ thống để phê duyệt phiếu này.</p>
                        </div>
                    `
                })
            });
        } catch (error) {
            console.error("Failed to send email notification", error);
        }
    };

    const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    };

    const displayedRequests = useMemo(() => {
        const filteredByTab = requests.filter(r => 
            activeTab === 'mine' ? r.authorId === user.id : r.approverId === user.id || user.role === 'superadmin'
        );

        if (!searchTerm.trim()) return filteredByTab;

        const lowerSearch = searchTerm.toLowerCase();
        return filteredByTab.filter(r => 
            r.title.toLowerCase().includes(lowerSearch) ||
            r.type.toLowerCase().includes(lowerSearch) ||
            r.status.toLowerCase().includes(lowerSearch) ||
            t(r.type).toLowerCase().includes(lowerSearch)
        );
    }, [requests, activeTab, user, searchTerm, t]);

    const checkHasToApprove = requests.some(r => r.approverId === user.id && r.status === 'pending') || user.role === 'superadmin';

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-500/20 dark:text-green-400 rounded-full">{t('statusApproved')}</span>;
            case 'rejected':
                return <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 dark:bg-red-500/20 dark:text-red-400 rounded-full">{t('statusRejected')}</span>;
            case 'pending':
            default:
                return <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400 rounded-full flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>{t('statusPending')}</span>;
        }
    };

    return (
        <StandardPageLayout>
            <PageBanner 
                title="Quản lý & Phê duyệt Yêu cầu"
                subtitle="Gửi yêu cầu cá nhân, theo dõi trạng thái và xử lý các hồ sơ phê duyệt hành chính nhanh chóng."
                icon={<ClipboardList className="w-full h-full text-white" />}
                gradient="from-rose-500 to-pink-600"
                actions={
                    <button 
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-white text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all border border-rose-100"
                    >
                        <Plus className="w-4 h-4" /> {t('newRequest')}
                    </button>
                }
            />

            {/* Sub-navigation Tabs (Consistent with Project and Drive layouts) */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border animate-fade-in-down mt-6">
                <button
                    onClick={() => setActiveTab('mine')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'mine'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    <span>Yêu cầu của tôi</span>
                </button>
                {checkHasToApprove && (
                    <button
                        onClick={() => setActiveTab('to-approve')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all relative ${
                            activeTab === 'to-approve'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <ClipboardList className="w-4 h-4" />
                        <span>Yêu cầu cần duyệt</span>
                        {requests.filter(r => r.approverId === user.id && r.status === 'pending').length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {/* Statistics Card similar to Project Management */}
                <ContentCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-rose-500" />
                                    Thống kê & Tiến độ Phê duyệt
                                </h3>
                                <p className="text-[11px] text-slate-500 font-medium">Theo dõi tổng thể các phiếu yêu cầu và tỷ lệ xét duyệt của phòng ban.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                                {[
                                    { label: 'Đã duyệt', count: stats.approved, color: 'bg-green-500' },
                                    { label: 'Đang chờ', count: stats.pending, color: 'bg-yellow-500' },
                                    { label: 'Từ chối', count: stats.rejected, color: 'bg-red-500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs font-bold">
                                        <span className="flex items-center gap-2 text-slate-500 uppercase tracking-wider text-[10px]">
                                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                                            {item.label}
                                        </span>
                                        <span className="text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{item.count} phiếu</span>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-2 h-[180px]">
                                {requests.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Đã duyệt', value: stats.approved, color: '#10B981' },
                                                    { name: 'Đang chờ', value: stats.pending, color: '#F59E0B' },
                                                    { name: 'Từ chối', value: stats.rejected, color: '#EF4444' },
                                                ].filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={75}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {[
                                                    { name: 'Đã duyệt', value: stats.approved, color: '#10B981' },
                                                    { name: 'Đang chờ', value: stats.pending, color: '#F59E0B' },
                                                    { name: 'Từ chối', value: stats.rejected, color: '#EF4444' },
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
                                    <div className="flex items-center justify-center h-full text-xs font-bold text-slate-400">Chưa có dữ liệu yêu cầu.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {/* Main Table ContentCard */}
                <ContentCard>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="relative flex items-center w-full md:w-64">
                                <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input 
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('search')}
                                    className="w-full bg-white border border-slate-200 text-xs text-slate-800 rounded-xl py-2 pl-9 pr-4 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-semibold"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                            {displayedRequests.length === 0 ? (
                                <div className="text-center text-slate-400 py-16 flex flex-col items-center justify-center h-full">
                                    <ClipboardList className="w-12 h-12 mb-3 opacity-30 text-rose-500" />
                                    <p className="text-sm font-bold text-slate-500">Không có yêu cầu nào.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/75 border-b border-slate-100">
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{t('requestTitle')}</th>
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{t('requestType')}</th>
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{t('authorName') || 'Người tạo'}</th>
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{t('createdAt') || 'Ngày tạo'}</th>
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{t('status')}</th>
                                            <th className="p-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider text-right">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedRequests.map(req => (
                                            <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800 text-sm mb-0.5">{req.title}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium line-clamp-1">{req.content}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-tight">
                                                        {t(req.type)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs font-bold text-slate-600">
                                                    {req.authorName}
                                                </td>
                                                <td className="p-4 text-xs text-slate-400 font-semibold">
                                                    {req.createdAt.toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(req.status)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {activeTab === 'to-approve' && req.status === 'pending' ? (
                                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                                title={t('reject')}
                                                            >
                                                                <XIcon className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                                title={t('approve')}
                                                            >
                                                                <CheckIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end items-center gap-1.5">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleShareRequest(req); }}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                                                                title="Chia sẻ liên kết"
                                                            >
                                                                <ShareIcon className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                                                                <SearchIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </ContentCard>
            </div>

            {isCreateModalOpen && (
                <CreateRequestModal 
                    user={user} 
                    users={users} 
                    onClose={() => setCreateModalOpen(false)} 
                    onSave={handleSaveRequest} 
                />
            )}

            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-[9999] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in-up border border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}
        </StandardPageLayout>
    );
};

export default RequestsView;
