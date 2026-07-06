import React, { useState, useMemo, useRef } from 'react';
import { User, RecentItem, View } from '../App';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import ContactCard, { Contact } from './ContactCard';
import { UsersIcon, SitemapIcon, ChatIcon, XIcon, MailIcon } from './icons';
import { useLanguage } from './LanguageContext';
import CreateContactModal from './CreateContactModal';
import { Search, Filter, Plus, Download, Upload, Grid, List, Share2 } from 'lucide-react';

// MOCK DATA
export const initialContacts: Contact[] = [
    { id: '1', name: 'Trần Văn An', title: 'Giám đốc Điều hành (CEO)', email: 'an.tran@company.com', phone: '090-111-2222', avatar: 'https://i.pravatar.cc/150?u=1', department: 'Ban Giám đốc', managerId: null, type: 'directory' },
    { id: '2', name: 'Lê Thị Bình', title: 'Giám đốc Công nghệ (CTO)', email: 'binh.le@company.com', phone: '090-222-3333', avatar: 'https://i.pravatar.cc/150?u=2', department: 'Công nghệ', managerId: '1', type: 'directory' },
    { id: '3', name: 'Phạm Minh Cường', title: 'Trưởng phòng Phát triển', email: 'cuong.pham@company.com', phone: '090-333-4444', avatar: 'https://i.pravatar.cc/150?u=3', department: 'Công nghệ', managerId: '2', type: 'directory' },
    { id: '4', name: 'Vũ Thị Dung', title: 'Lập trình viên Senior', email: 'dung.vu@company.com', phone: '090-444-5555', avatar: 'https://i.pravatar.cc/150?u=4', department: 'Công nghệ', managerId: '3', type: 'directory' },
    { id: '5', name: 'Hoàng Văn Em', title: 'Giám đốc Marketing (CMO)', email: 'em.hoang@company.com', phone: '090-555-6666', avatar: 'https://i.pravatar.cc/150?u=5', department: 'Marketing', managerId: '1', type: 'directory' },
    { id: '6', name: 'Nguyễn Thị Hoa', title: 'Chuyên viên Marketing', email: 'hoa.nguyen@company.com', phone: '090-666-7777', avatar: 'https://i.pravatar.cc/150?u=6', department: 'Marketing', managerId: '5', type: 'directory' },
    { id: '7', name: 'Đối tác Acme Inc.', title: 'Đối tác kinh doanh', email: 'contact@acme.com', phone: '028-123-4567', avatar: 'AI', department: 'Đối tác', managerId: null, type: 'personal' },
    { id: '8', name: 'Hung Thai', title: 'Quản trị viên cấp cao', email: 'hungthai84@gmail.com', phone: '091-234-5678', avatar: 'https://i.pravatar.cc/150?u=8', department: 'Quản trị hệ thống', managerId: '1', type: 'directory' },
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

interface ContactsViewProps {
  user: User;
  onItemViewed: (item: RecentItem) => void;
  onNavigate?: (view: View) => void;
}

const ContactsView: React.FC<ContactsViewProps> = ({ onItemViewed, onNavigate }) => {
    const [view, setView] = useState<'card' | 'list'>('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [activeTab, setActiveTab] = useState<'directory' | 'personal'>('directory');
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const departmentsList = useMemo(() => {
        const depts = new Set<string>();
        contacts.forEach(c => {
            if (c.department) depts.add(c.department);
        });
        return Array.from(depts);
    }, [contacts]);

    const filteredContacts = useMemo(() => {
        return contacts.filter(c => {
            const matchesTab = c.type === activeTab;

            const matchesSearch = 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.department.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesDept = 
                selectedDept === 'all' || 
                c.department === selectedDept;

            return matchesTab && matchesSearch && matchesDept;
        });
    }, [searchTerm, selectedDept, contacts, activeTab]);
        
    const handleSaveContact = (newContact: Contact) => {
        setContacts(prevContacts => [newContact, ...prevContacts]);
        setCreateModalOpen(false);
    };

    const handleExportCSV = () => {
        const headers = ['id', 'name', 'title', 'email', 'phone', 'avatar', 'department', 'managerId', 'type'];
        const csvRows = [
            headers.join(','),
            ...filteredContacts.map(contact => {
                const values = headers.map(header => {
                    const value = contact[header as keyof Contact] || '';
                    const escaped = ('' + value).replace(/"/g, '""');
                    return `"${escaped}"`;
                });
                return values.join(',');
            })
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'contacts.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`Đang nhập ${file.name}... (Đây là bản demo, dữ liệu sẽ không thực sự được nhập).`);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleContactView = (contact: Contact) => {
        onItemViewed({
            id: `contact-${contact.id}`,
            name: contact.name,
            type: 'contacts',
            icon: <UsersIcon />,
            itemId: contact.id,
        });
        setSelectedContact(contact);
    };

    return (
        <StandardPageLayout>
            {isCreateModalOpen && <CreateContactModal onClose={() => setCreateModalOpen(false)} onSave={handleSaveContact} />}
            
            <PageBanner 
                title={t('contactsTitle') || "Danh bạ & Nhân sự"}
                subtitle={t('contactsSubtitle') || "Kết nối với đồng nghiệp, quản lý đối tác và theo dõi sơ đồ tổ chức một cách trực quan."}
                icon={<UsersIcon className="w-full h-full text-white" />}
                gradient="from-purple-400 to-indigo-600"
                actions={
                    <>
                        <div className="flex bg-white/10 p-1 rounded-xl shadow-sm border border-white/20 mr-2">
                            <button onClick={() => setView('card')} className={`p-2 rounded-lg transition-all ${view === 'card' ? 'bg-white text-purple-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><Grid className="w-4 h-4" /></button>
                            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><List className="w-4 h-4" /></button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                        <button onClick={handleImportClick} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                            <Upload className="w-4 h-4" /> {t('importCsv') || 'Nhập CSV'}
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                            <Download className="w-4 h-4" /> {t('exportCsv') || 'Xuất CSV'}
                        </button>
                        <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 bg-white text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                            <Plus className="w-4 h-4" /> {t('addNew') || 'Thêm mới'}
                        </button>
                    </>
                }
            />

            {/* Sub-navigation Tabs (Consistent with Project and Drive layouts) */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border animate-fade-in-down">
                <button
                    onClick={() => { setActiveTab('directory'); setSelectedContact(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'directory'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <UsersIcon className="w-4 h-4" />
                    <span>Danh bạ nội bộ</span>
                </button>
                <button
                    onClick={() => { setActiveTab('personal'); setSelectedContact(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'personal'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <SitemapIcon className="w-4 h-4" />
                    <span>Đối tác cá nhân</span>
                </button>
            </div>

            <ContentCard>
                <div className="flex flex-col gap-6">
                    {/* Filters Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder={t('contactSearchPlaceholder') || "Tìm kiếm theo tên, email, phòng ban..."}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={selectedDept}
                                onChange={e => setSelectedDept(e.target.value)}
                                className="flex-1 md:w-56 bg-white border border-gray-200 font-bold text-slate-600 text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            >
                                <option value="all">{t('allDepartments') || 'Tất cả phòng ban'}</option>
                                {departmentsList.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-slate-400 hover:text-purple-600 transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content View */}
                    <div className="min-h-[400px]">
                        {view === 'card' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredContacts.map(c => (
                                    <div key={c.id} onClick={() => handleContactView(c)} className="cursor-pointer group">
                                        <ContactCard contact={c} onChatClick={(e) => {
                                            e.stopPropagation();
                                            if (onNavigate) onNavigate('chat');
                                        }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'list' && (
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('member') || 'Thành viên'}</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">{t('title') || 'Chức danh'}</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">{t('email') || 'Email'}</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">{t('phone') || 'Điện thoại'}</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredContacts.map((c) => (
                                            <tr key={c.id} onClick={() => handleContactView(c)} className="hover:bg-purple-50/30 cursor-pointer group transition-all">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-purple-50">
                                                            {c.avatar.length > 2 && c.avatar.startsWith('http') ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : getInitials(c.name)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-xs tracking-tight">{c.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{c.department}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden md:table-cell">{c.title}</td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden lg:table-cell">{c.email}</td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden sm:table-cell">{c.phone}</td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); if(onNavigate) onNavigate('chat'); }}
                                                        className="p-2 rounded-lg bg-gray-50 text-slate-400 hover:bg-purple-100 hover:text-purple-600 transition-all"
                                                    >
                                                        <ChatIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}



                        {filteredContacts.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 border border-gray-100">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t('noResultsFound') || 'Không tìm thấy kết quả'}</h3>
                                <p className="text-sm text-slate-500 mt-2">{t('tryDifferentSearch') || 'Vui lòng thử tìm kiếm với từ khóa khác.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </ContentCard>

            {/* DETAILS MODAL */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-indigo-600 p-8">
                            <button 
                                onClick={() => setSelectedContact(null)} 
                                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/30 text-white rounded-xl transition-all"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                    <div className="w-full h-full rounded-2xl bg-purple-100 flex items-center justify-center overflow-hidden">
                                        {selectedContact.avatar && selectedContact.avatar.startsWith('http') ? (
                                            <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-purple-600 font-bold text-3xl">{getInitials(selectedContact.name)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-8 pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{selectedContact.name}</h2>
                                    <p className="text-sm font-bold text-purple-600 mt-1 uppercase tracking-wider">{selectedContact.title}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-slate-400 hover:bg-gray-50 transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedContact(null);
                                            if (onNavigate) onNavigate('chat');
                                        }}
                                        className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
                                    >
                                        {t('sendMessage') || 'Gửi tin nhắn'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <MailIcon className="w-3 h-3" /> {t('workEmail') || 'Email làm việc'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700">{selectedContact.email || t('notSet') || 'Chưa thiết lập'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            {t('phone') || 'Số điện thoại'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700">{selectedContact.phone || t('notSet') || 'Chưa thiết lập'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <SitemapIcon className="w-3 h-3" /> {t('department') || 'Phòng ban'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700">{selectedContact.department || t('notAllocated') || 'Chưa phân bổ'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <UsersIcon className="w-3 h-3" /> {t('manager') || 'Người quản lý'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700">Trần Văn An (CEO)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StandardPageLayout>
    );
};

export default ContactsView;
