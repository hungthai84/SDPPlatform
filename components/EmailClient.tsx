import React, { useState, useMemo } from 'react';
import { User, RecentItem } from '../App';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import { ReplyIcon, MailIcon, TagIcon, UsersIcon, ChevronLeftIcon } from './icons';
import ComposeModal from './ComposeModal';
import { useLanguage } from './LanguageContext';
import { getAccessToken } from '../firebase';
import { Search, Plus, Star, Inbox, Trash2, RefreshCw } from 'lucide-react';

interface Email {
  id: string;
  sender: { name: string; email: string; avatar: string; };
  subject: string;
  body: string;
  snippet: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  category: 'primary' | 'promotions' | 'social';
}

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: { name: 'Figma', email: 'team@figma.com', avatar: 'F' },
    subject: 'Weekly Design Digest - New plugins and tutorials',
    snippet: 'Hey Hung, check out the latest updates from the Figma community. We have new plugins for accessibility checking...',
    body: '<h2>Hey Hung,</h2><p>Check out the latest updates from the Figma community. We have new plugins for accessibility checking, advanced prototyping features, and a fresh batch of tutorials from top designers.</p><p>Explore new plugins now and enhance your workflow!</p><p>Best,<br>The Figma Team</p>',
    timestamp: '2h ago',
    read: false,
    starred: true,
    category: 'primary',
  },
  {
    id: '2',
    sender: { name: 'GitHub', email: 'noreply@github.com', avatar: 'G' },
    subject: '[WebApp-Project] New issue opened: #241',
    snippet: 'A new issue has been opened in your repository: "Footer does not render correctly on mobile devices".',
    body: '<p>A new issue has been opened in your repository WebApp-Project:</p><h3>#241 - Footer does not render correctly on mobile devices</h3><p>User "testuser123" reported that the footer icons overlap on screen widths below 375px.</p><p>Please investigate this issue.</p>',
    timestamp: '1d ago',
    read: true,
    starred: false,
    category: 'primary',
  },
  {
    id: '3',
    sender: { name: 'Alice Johnson', email: 'alice.j@example.com', avatar: 'A' },
    subject: 'Re: Project Alpha Meeting Minutes',
    snippet: 'Thanks for sending these over! I have a few comments on the action items for the marketing team.',
    body: '<p>Hi Hung,</p><p>Thanks for sending these over! I have a few comments on the action items for the marketing team. I\'ll add them to the shared document directly.</p><p>Regards,<br>Alice</p>',
    timestamp: '2d ago',
    read: true,
    starred: true,
    category: 'primary',
  },
  {
    id: '4',
    sender: { name: 'Google Cloud', email: 'alerts@google.com', avatar: 'G' },
    subject: 'Security Alert: New sign-in to your account',
    snippet: 'We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don\'t need to do anything.',
    body: '<h2>Security Alert</h2><p>We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don\'t need to do anything. If not, please secure your account immediately.</p>',
    timestamp: '3d ago',
    read: true,
    starred: false,
    category: 'social',
  },
  {
    id: '5',
    sender: { name: 'Lazada', email: 'noreply@lazada.vn', avatar: 'L' },
    subject: '🎉 Flash Sale 9.9 sắp bắt đầu!',
    snippet: 'Đừng bỏ lỡ hàng ngàn deal sốc giá chỉ từ 1K. Săn sale ngay!',
    body: '<h2>Flash Sale 9.9!</h2><p>Hàng ngàn deal sốc đang chờ bạn. Mua sắm ngay!</p>',
    timestamp: '4d ago',
    read: true,
    starred: false,
    category: 'promotions',
  }
];

interface EmailClientProps {
  user: User;
  onItemViewed: (item: RecentItem) => void;
}

const EmailClient: React.FC<EmailClientProps> = ({ onItemViewed }) => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'primary' | 'promotions' | 'social' | 'starred'>('primary');
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
    onItemViewed({
        id: `email-${email.id}`,
        name: email.subject,
        type: 'email',
        icon: <MailIcon />,
        itemId: email.id
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
        const token = await getAccessToken();
        if (!token) throw new Error("No token available");
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=in:inbox', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch gmail');
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
            // Simulated fetch for brevity
            alert(`Đã tìm thấy ${data.messages.length} email mới (Bản demo).`);
        }
    } catch(err) {
        console.error(err);
        alert('Lỗi đồng bộ. Vui lòng kết nối Gmail.');
    } finally {
        setIsSyncing(false);
    }
  };

  const filteredEmails = useMemo(() => {
    let result = [...emails];
    if (activeCategory === 'starred') {
        result = result.filter(e => e.starred);
    } else {
        result = result.filter(e => e.category === activeCategory);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(e => e.subject.toLowerCase().includes(q) || e.sender.name.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.read ? 1 : -1) - (b.read ? 1 : -1));
  }, [emails, activeCategory, searchQuery]);

  return (
    <StandardPageLayout>
        {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
        
        <PageBanner 
            title={t('emailTitle') || "Hòm thư Công việc"}
            subtitle={t('emailSubtitle') || "Giao tiếp hiệu quả, quản lý email và cộng tác trực tiếp với đội ngũ trên một nền tảng duy nhất."}
            icon={<Inbox className="w-full h-full" />}
            gradient="from-cyan-500 to-blue-600"
            actions={
                <>
                    <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> {t('refresh') || 'Làm mới'}
                    </button>
                    <button onClick={() => setIsComposing(true)} className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                        <Plus className="w-4 h-4" /> {t('compose') || 'Soạn thư'}
                    </button>
                </>
            }
        />

        <ContentCard>
            <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t('emailSearchPlaceholder') || "Tìm kiếm email..."}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        {[
                            { id: 'primary', label: t('primary'), icon: Inbox },
                            { id: 'starred', label: t('starred'), icon: Star },
                            { id: 'promotions', label: t('promotions'), icon: TagIcon },
                            { id: 'social', label: t('social'), icon: UsersIcon },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveCategory(item.id as 'primary' | 'promotions' | 'social' | 'starred'); setSelectedEmail(null); }}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </div>
                                {item.id === 'primary' && emails.filter(e => !e.read).length > 0 && (
                                    <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[10px]">{emails.filter(e => !e.read).length}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Email Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {!selectedEmail ? (
                        <div className="flex flex-col gap-2">
                            {filteredEmails.map(email => (
                                <div 
                                    key={email.id} 
                                    onClick={() => handleSelectEmail(email)}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${email.read ? 'bg-white border-gray-100 hover:border-blue-200' : 'bg-blue-50/30 border-blue-100 hover:border-blue-300'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-bold text-slate-500">
                                        {email.sender.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className={`text-xs font-bold truncate ${email.read ? 'text-slate-700' : 'text-blue-900'}`}>{email.sender.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{email.timestamp}</p>
                                        </div>
                                        <p className={`text-xs font-bold truncate mb-1 ${email.read ? 'text-slate-600' : 'text-slate-900'}`}>{email.subject}</p>
                                        <p className="text-xs text-slate-400 truncate font-semibold">{email.snippet}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEmails(prev => prev.map(em => em.id === email.id ? { ...em, starred: !em.starred } : em));
                                        }}
                                        className={`p-2 rounded-xl transition-all ${email.starred ? 'text-yellow-500 bg-yellow-50' : 'text-slate-300 hover:bg-gray-100 opacity-0 group-hover:opacity-100'}`}
                                    >
                                        <Star className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                            ))}
                            {filteredEmails.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 border border-gray-100">
                                        <Inbox className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t('inboxEmpty') || 'Hòm thư trống'}</h3>
                                    <p className="text-sm text-slate-500 mt-2">{t('allTasksHandled') || 'Bạn đã xử lý hết mọi công việc! Tuyệt vời.'}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col animate-fade-in">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                <button 
                                    onClick={() => setSelectedEmail(null)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-slate-500 text-xs font-bold transition-all"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" /> {t('back') || 'Quay lại'}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-slate-400 hover:bg-gray-50 transition-all"><ReplyIcon className="w-5 h-5" /></button>
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-slate-400 hover:bg-gray-50 transition-all"><Star className="w-5 h-5" /></button>
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-red-400 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                                    {selectedEmail.sender.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-1">{selectedEmail.subject}</h2>
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                        <span className="text-slate-700">{selectedEmail.sender.name}</span>
                                        <span className="text-slate-400">&lt;{selectedEmail.sender.email}&gt;</span>
                                        <span className="text-slate-300 px-2">•</span>
                                        <span className="text-slate-400 uppercase tracking-widest">{selectedEmail.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div 
                                className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </ContentCard>
    </StandardPageLayout>
  );
};

export default EmailClient;
