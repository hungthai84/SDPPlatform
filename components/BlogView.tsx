import React, { useState, useMemo, useEffect } from 'react';
import { User, View, RecentItem } from '../App';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import PageBanner from './PageBanner';
import { SearchIcon, PlusIcon, SettingsIcon, BloggerIcon, ChevronDownIcon, CalendarPlusIcon, RobotIcon, PaperAirplaneIcon, BookOpenIcon, PinIcon, ShareIcon, XIcon, TrashIcon } from './icons';
import { LayoutGrid, List, Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

import { db, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Article {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  tags: string[];
  previewImage: string;
  source: 'Internal' | 'Blogger';
  isPinned: boolean;
  date: string;
  status: 'Draft' | 'Published' | 'Archived';
  createdAt?: number;
}

const fallbackArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Chiến lược CSKH Đột phá trong Kỷ nguyên Số 2026',
    author: 'Trần Văn An',
    authorId: 'user-an',
    tags: ['Chiến lược', 'CSKH', 'Công nghệ'],
    previewImage: 'https://images.unsplash.com/photo-1552581230-c01bc0d48403?auto=format&fit=crop&w=800&q=80',
    source: 'Internal',
    isPinned: true,
    date: 'July 6, 2026',
    status: 'Published',
    createdAt: 1783321200000
  },
  {
    id: 'art-2',
    title: 'Tối ưu hóa SLA: Đưa thời gian xử lý yêu cầu về dưới 1 giờ',
    author: 'Hoàng Văn Em',
    authorId: 'user-em',
    tags: ['Quy trình', 'Hỗ trợ', 'Tối ưu'],
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    source: 'Internal',
    isPinned: false,
    date: 'July 5, 2026',
    status: 'Published',
    createdAt: 1783234800000
  },
  {
    id: 'art-3',
    title: 'Xây dựng Văn hóa Đồng hành cùng Khách hàng thành công',
    author: 'Lê Thị Bình',
    authorId: 'user-binh',
    tags: ['Văn hóa', 'Đội ngũ', 'Khách hàng'],
    previewImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    source: 'Internal',
    isPinned: false,
    date: 'July 2, 2026',
    status: 'Published',
    createdAt: 1782975600000
  },
  {
    id: 'art-4',
    title: 'Bí quyết viết Email phản hồi phàn nàn xoa dịu khách hàng',
    author: 'Vũ Thị Dung',
    authorId: 'user-dung',
    tags: ['Email', 'Kỹ năng', 'Mẫu'],
    previewImage: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
    source: 'Internal',
    isPinned: false,
    date: 'June 28, 2026',
    status: 'Draft',
    createdAt: 1782630000000
  }
];

interface ArticleCardProps {
    article: Article;
    onTagClick: (tag: string) => void;
    onSchedule: (title: string) => void;
    onView: () => void;
    onSummarize: (article: Article) => void;
    onShare: (article: Article) => void;
}

const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) => 
                regex.test(part) ? (
                    <mark key={i} className="bg-pink-300 text-pink-900 rounded-px px-0.5">{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const ArticleCard: React.FC<ArticleCardProps & { searchTerm?: string; onDelete?: (id: string) => void; canDelete?: boolean }> = ({ article, onTagClick, onSchedule, onView, searchTerm = '', onSummarize, onShare, onDelete, canDelete }) => {
    const { t } = useLanguage();
    const [tagsExpanded, setTagsExpanded] = useState(false);
    const TAG_LIMIT = 2;
    const canTruncate = article.tags.length > TAG_LIMIT;
    const tagsToShow = tagsExpanded ? article.tags : article.tags.slice(0, TAG_LIMIT);
    const remainingTags = article.tags.length - TAG_LIMIT;

    return (
        <div onClick={onView} className={`relative flex flex-col bg-[--color-surface-secondary]/60 rounded-[20px] border border-[--color-border-secondary] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden cursor-pointer backdrop-blur-md ${article.isPinned ? 'ring-2 ring-[--color-accent-500]' : ''}`}>
            {article.source === 'Blogger' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full z-10 shadow-sm" title="From Blogger">
                    <BloggerIcon className="w-4 h-4" /> 
                </div>
            )}
            {article.isPinned && (
                <div className="absolute top-2 left-2 bg-pink-500 text-white p-1 rounded-full z-10 shadow-sm" title="Pinned Post">
                    <PinIcon className="w-4 h-4" />
                </div>
            )}
            <div className={`absolute top-2 ${article.source === 'Blogger' ? 'right-10' : 'right-2'} z-10 flex gap-2`}>
                {canDelete && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDelete?.(article.id); }}
                        className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full shadow-md transition-all hover:scale-110"
                        title="Xóa bài viết"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onSummarize(article); }}
                    className="bg-white/90 hover:bg-white text-purple-600 p-1.5 rounded-full shadow-md transition-all hover:scale-110"
                    title="AI Summary"
                >
                    <RobotIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onShare(article); }}
                    className="bg-white/90 hover:bg-white text-indigo-600 p-1.5 rounded-full shadow-md transition-all hover:scale-110"
                    title="Chia sẻ liên kết"
                >
                    <ShareIcon className="w-4 h-4" />
                </button>
                <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm text-white ${
                    article.status === 'Published' ? 'bg-green-500' : 
                    article.status === 'Draft' ? 'bg-slate-500' : 'bg-orange-700'
                }`}>
                    {article.status.toUpperCase()}
                </span>
            </div>
            <img src={article.previewImage} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex gap-2 mb-2 flex-wrap items-center">
                    {tagsToShow.map(tag => (
                        <button 
                            key={tag} 
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            className="text-xs font-semibold px-2 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                        >
                            {highlightText(tag, searchTerm)}
                        </button>
                    ))}
                    {canTruncate && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTagsExpanded(!tagsExpanded);
                            }}
                            className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors"
                            aria-label={tagsExpanded ? t('showLess') : `Show ${remainingTags} more tags`}
                        >
                            {tagsExpanded ? t('showLess') : `+${remainingTags}`}
                        </button>
                    )}
                </div>
                <h3 className="text-base font-bold text-slate-800 leading-tight flex-1 group-hover:text-purple-700 transition-colors">{highlightText(article.title, searchTerm)}</h3>
                <div className="flex justify-between items-center mt-2 mb-3">
                    <p className="text-sm text-slate-500">By {highlightText(article.author, searchTerm)} &bull; {article.date}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onSchedule(article.title); }} className="mt-auto flex items-center justify-center gap-2 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded-lg transition-colors w-full font-semibold">
                    <CalendarPlusIcon className="w-4 h-4"/>
                    {t('scheduleDiscussion') || 'Lên lịch thảo luận'}
                </button>
            </div>
        </div>
    );
};

const PinnedPost: React.FC<{ article: Article, onTagClick: (tag: string) => void, onSchedule: (title: string) => void, onView: () => void; searchTerm?: string, onSummarize: (article: Article) => void, onShare: (article: Article) => void, onDelete?: (id: string) => void; canDelete?: boolean }> = ({ article, onTagClick, onSchedule, onView, searchTerm = '', onSummarize, onShare, onDelete, canDelete }) => {
    const { t } = useLanguage();
    const [tagsExpanded, setTagsExpanded] = useState(false);
    const TAG_LIMIT = 2;
    const canTruncate = article.tags.length > TAG_LIMIT;
    const tagsToShow = tagsExpanded ? article.tags : article.tags.slice(0, TAG_LIMIT);
    const remainingTags = article.tags.length - TAG_LIMIT;

    return (
        <div onClick={onView} className="relative bg-[--color-surface-secondary]/60 rounded-[20px] border border-[--color-border-secondary] shadow-sm overflow-hidden group flex flex-col md:flex-row cursor-pointer backdrop-blur-md">
            <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
                {canDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete?.(article.id); }}
                        className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-md transition-all hover:scale-110"
                        title="Xóa bài viết"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onSummarize(article); }}
                    className="bg-white/90 hover:bg-white text-purple-600 p-2 rounded-full shadow-md transition-all hover:scale-110"
                    title="AI Summary"
                >
                    <RobotIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onShare(article); }}
                    className="bg-white/90 hover:bg-white text-indigo-600 p-2 rounded-full shadow-md transition-all hover:scale-110"
                    title="Chia sẻ liên kết"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-white ${
                    article.status === 'Published' ? 'bg-green-500' : 
                    article.status === 'Draft' ? 'bg-slate-500' : 'bg-orange-700'
                }`}>
                    {article.status.toUpperCase()}
                </span>
                {article.source === 'Blogger' && (
                    <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-sm" title="From Blogger">
                        <BloggerIcon className="w-4 h-4" />
                    </div>
                )}
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">PINNED</span>
            </div>
            <div className="md:w-1/2">
                <img src={article.previewImage} alt={article.title} className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-3 flex-wrap items-center">
                    {tagsToShow.map(tag => (
                        <button 
                            key={tag} 
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            className="text-sm font-semibold px-3 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                        >
                            {highlightText(tag, searchTerm)}
                        </button>
                    ))}
                    {canTruncate && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTagsExpanded(!tagsExpanded);
                            }}
                            className="text-sm font-semibold px-3 py-1 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors"
                            aria-label={tagsExpanded ? t('showLess') : `Show ${remainingTags} more tags`}
                        >
                            {tagsExpanded ? t('showLess') : `+${remainingTags}`}
                        </button>
                    )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{highlightText(article.title, searchTerm)}</h2>
                <p className="text-md text-slate-600 mt-3">By {highlightText(article.author, searchTerm)} &bull; {article.date}</p>
                <div className="flex items-center gap-4 mt-6">
                    <button onClick={(e) => e.stopPropagation()} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300">
                        Read More
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onSchedule(article.title); }} className="flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold px-6 py-2.5 rounded-lg hover:shadow-lg hover:bg-purple-200 transition-all duration-300">
                        <CalendarPlusIcon className="w-5 h-5"/>
                        {t('scheduleDiscussion') || 'Lên lịch thảo luận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface BlogViewProps {
  user: User;
  onNavigate: (view: View, section?: string) => void;
  onSchedule: (title: string) => void;
  onItemViewed: (item: RecentItem) => void;
}

const BlogView: React.FC<BlogViewProps> = ({ user, onNavigate, onSchedule, onItemViewed }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useLanguage();
    const [visibleItems, setVisibleItems] = useState(8);
    const [articles, setArticles] = useState<Article[]>([]);
    const [statsTab, setStatsTab] = useState<'chart' | 'flowchart'>('chart');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    useEffect(() => {
        const isMock = !auth || !auth.currentUser || (user && user.id.startsWith('user-'));
        if (isMock) {
            const saved = localStorage.getItem('blog_articles');
            if (saved) {
                setArticles(JSON.parse(saved));
            } else {
                setArticles(fallbackArticles);
                localStorage.setItem('blog_articles', JSON.stringify(fallbackArticles));
            }
            return;
        }

        const q = query(collection(db, 'blogArticles'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                // Seed fallback articles if database is completely empty for this user
                fallbackArticles.forEach(async (art) => {
                    await setDoc(doc(db, 'blogArticles', art.id), {
                        title: art.title,
                        authorName: art.author,
                        authorId: user.id,
                        tags: art.tags,
                        previewImage: art.previewImage,
                        isPinned: art.isPinned,
                        status: art.status,
                        createdAt: art.createdAt
                    });
                });
                return;
            }
            const articlesData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    author: data.authorName || 'Anonymous',
                    authorId: data.authorId,
                    tags: data.tags || [],
                    previewImage: data.previewImage || '',
                    source: 'Internal',
                    isPinned: data.isPinned || false,
                    date: new Date(data.createdAt || Date.now()).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' }),
                    status: data.status || 'Published',
                    createdAt: data.createdAt || Date.now()
                } as Article;
            });
            setArticles(articlesData);
        }, (error) => {
            console.error('Error listening to blogArticles:', error);
            const saved = localStorage.getItem('blog_articles');
            setArticles(saved ? JSON.parse(saved) : fallbackArticles);
        });

        return () => unsubscribe();
    }, [user?.id]);

    const handleDeleteArticle = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
        const isMock = !auth || !auth.currentUser || (user && user.id.startsWith('user-'));
        try {
            if (isMock) {
                const updated = articles.filter(a => a.id !== id);
                setArticles(updated);
                localStorage.setItem('blog_articles', JSON.stringify(updated));
                showToast("Đã xóa bài viết thành công!");
            } else {
                await deleteDoc(doc(db, 'blogArticles', id));
                showToast("Đã xóa bài viết thành công!");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            showToast("Không thể xóa bài viết. Vui lòng thử lại.");
        }
    };

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    // AI Assistant State
    const [isAssistantOpen, setAssistantOpen] = useState(false);
    const [assistantMessages, setAssistantMessages] = useState<{author: 'user' | 'ai', text: string}[]>([]);
    const [assistantPrompt, setAssistantPrompt] = useState('');
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);

    // Summarization state
    const [activeSummary, setActiveSummary] = useState<{title: string, text: string} | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    
    // Toast state
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleShareArticle = async (article: Article) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}?article=${article.id}`);
            showToast("Đã sao chép liên kết vào bộ nhớ tạm!");
        } catch (error) {
            console.error("Copy failed", error);
            showToast("Không thể sao chép liên kết");
        }
    };

    useEffect(() => {
        setVisibleItems(8);
    }, [searchTerm, selectedTag, selectedStatus]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (scrollBottom < 100 && visibleItems < latestPosts.length) {
            setVisibleItems(prev => prev + 8);
        }
    };

    const handleSummarize = async (article: Article) => {
        setIsSummarizing(true);
        setActiveSummary({ title: article.title, text: '' });
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `Tóm tắt bài viết blog sau đây một cách súc tích và hấp dẫn: "${article.title}". Bài viết này do ${article.author} viết vào ngày ${article.date} với các chủ đề: ${article.tags.join(', ')}. Hãy tạo một bản tóm tắt khoảng 30-50 từ bằng tiếng Việt.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            if (response.text) {
                setActiveSummary({ title: article.title, text: response.text });
            }
        } catch (error) {
            console.error("Summarization Error:", error);
            setActiveSummary({ title: article.title, text: "Không thể tạo tóm tắt lúc này. Vui lòng thử lại sau." });
        } finally {
            setIsSummarizing(false);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const savedArticles = localStorage.getItem('blog_articles');
            if (savedArticles) setArticles(JSON.parse(savedArticles));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        articles.forEach(article => article.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, [articles]);

    const filteredPosts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return articles.filter(article => {
            const matchesSearch = !term || (
                article.title.toLowerCase().includes(term) ||
                article.author.toLowerCase().includes(term) ||
                article.tags.some(tag => tag.toLowerCase().includes(term))
            );
            const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;
            const matchesStatus = selectedStatus ? article.status === selectedStatus : true;
            return matchesSearch && matchesTag && matchesStatus;
        });
    }, [articles, searchTerm, selectedTag, selectedStatus]);

    const pinnedPost = useMemo(() => filteredPosts.find(a => a.isPinned), [filteredPosts]);
    const latestPosts = useMemo(() => filteredPosts.filter(a => !a.isPinned), [filteredPosts]);
    
    // Pagination (Infinite Scroll) Logic
    const paginatedPosts = useMemo(() => {
        return latestPosts.slice(0, visibleItems);
    }, [latestPosts, visibleItems]);

    const handleTagClick = (tag: string) => setSelectedTag(tag);
    const clearFilter = () => {
        setSelectedTag(null);
        setSelectedStatus(null);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Danh sách Bài viết & Nội dung', 14, 15);
        const data = filteredPosts.map(a => [a.title, a.author, a.tags.join(', '), a.date, a.status]);
        autoTable(doc, {
            head: [['Tiêu đề', 'Tác giả', 'Thẻ phân loại', 'Ngày tạo', 'Trạng thái']],
            body: data,
            startY: 20
        });
        doc.save('danh-sach-bai-viet.pdf');
    };

    const handleExportCSV = () => {
        const headers = ['Tiêu đề,Tác giả,Thẻ phân loại,Ngày tạo,Trạng thái'];
        const rows = filteredPosts.map(a => `"${a.title}","${a.author}","${a.tags.join('; ')}","${a.date}","${a.status}"`);
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'danh-sach-bai-viet.csv';
        a.click();
    };

    const handleAssistantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assistantPrompt.trim() || isAssistantLoading) return;

        const userMessage = { author: 'user' as const, text: assistantPrompt };
        setAssistantMessages(prev => [...prev, userMessage]);
        setAssistantPrompt('');
        setIsAssistantLoading(true);

        try {
            if (!process.env.API_KEY) throw new Error("API key not configured.");
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const articlesContext = filteredPosts.map(a => ({ title: a.title, author: a.author, tags: a.tags })).slice(0, 10); // Limit context size
            const systemInstruction = `You are a Blog Assistant. Your purpose is to answer questions based ONLY on the provided article data. Do not use external knowledge. Be concise and helpful. Respond in Vietnamese.\n\nHere are the available articles:\n${JSON.stringify(articlesContext)}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3.1-pro-preview',
                contents: assistantPrompt,
                config: { systemInstruction }
            });

            setAssistantMessages(prev => [...prev, { author: 'ai', text: response.text }]);
        } catch (error) {
            console.error(error);
            setAssistantMessages(prev => [...prev, { author: 'ai', text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' }]);
        } finally {
            setIsAssistantLoading(false);
        }
    };

    const handleArticleView = (article: Article) => {
        onItemViewed({
            id: `blog-${article.id}`,
            name: article.title,
            type: 'blog',
            icon: <BookOpenIcon />,
            itemId: article.id
        });
        onNavigate('blog-article', article.id);
    };

    return (
        <StandardPageLayout onScroll={handleScroll}>
            <PageBanner 
                title="Quản lý Bài viết & Nội dung"
                subtitle="Sáng tạo, quản lý và tối ưu hóa nội dung tiếp thị, truyền thông và tri thức doanh nghiệp."
                icon={<BookOpenIcon className="w-full h-full text-white" />}
                gradient="from-pink-600 to-rose-700"
                actions={
                    <button 
                        onClick={() => onNavigate('new-blog-post')}
                        className="flex items-center gap-2 bg-white text-pink-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" /> Viết bài mới
                    </button>
                }
            />

            <div className="flex flex-col gap-6 mt-6">
                {/* Statistics Section (Bento style matching projects page) */}
                <ContentCard>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <BookOpenIcon className="w-4 h-4 text-pink-600" />
                          Thống kê & Lưu đồ chuyên mục
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Theo dõi phân bổ bài viết và cấu trúc danh mục nội dung.</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-gray-200 dark:border-slate-700 shadow-inner shrink-0">
                        <button
                          type="button"
                          onClick={() => setStatsTab('chart')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            statsTab === 'chart'
                              ? 'bg-pink-600 text-white shadow-md'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          Biểu đồ tỷ lệ
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatsTab('flowchart')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            statsTab === 'flowchart'
                              ? 'bg-pink-600 text-white shadow-md'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          Sơ đồ chuyên mục
                        </button>
                      </div>
                    </div>

                    {statsTab === 'chart' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                        <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                          {[
                            { label: 'Đã xuất bản (Published)', count: articles.filter(a => a.status === 'Published').length, color: 'bg-green-500' },
                            { label: 'Bản nháp (Draft)', count: articles.filter(a => a.status === 'Draft').length, color: 'bg-slate-500' },
                            { label: 'Lưu trữ (Archived)', count: articles.filter(a => a.status === 'Archived').length, color: 'bg-orange-500' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold">
                              <span className="flex items-center gap-2 text-slate-500 uppercase tracking-wider text-[10px] dark:text-slate-400">
                                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                                {item.label}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200">{item.count} bài viết</span>
                            </div>
                          ))}
                        </div>

                        <div className="lg:col-span-2 h-[200px]">
                          {articles.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Đã xuất bản', value: articles.filter(a => a.status === 'Published').length, color: '#10B981' },
                                    { name: 'Bản nháp', value: articles.filter(a => a.status === 'Draft').length, color: '#64748B' },
                                    { name: 'Lưu trữ', value: articles.filter(a => a.status === 'Archived').length, color: '#F97316' },
                                  ].filter(d => d.value > 0)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={75}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {[
                                    { name: 'Đã xuất bản', value: articles.filter(a => a.status === 'Published').length, color: '#10B981' },
                                    { name: 'Bản nháp', value: articles.filter(a => a.status === 'Draft').length, color: '#64748B' },
                                    { name: 'Lưu trữ', value: articles.filter(a => a.status === 'Archived').length, color: '#F97316' },
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 dark:bg-slate-800/30 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed dark:text-slate-400">
                            📁 <strong>Cấu trúc:</strong> Chuyên mục (Thẻ) → Danh sách Bài viết tương ứng.
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                            {allTags.length > 0 ? (
                                allTags.map(tag => {
                                    const tagArticles = articles.filter(a => a.tags.includes(tag));
                                    return (
                                        <div key={tag} className="border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 bg-white dark:bg-slate-800/30">
                                            <h4 className="text-xs font-bold text-pink-600 flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                                {tag} ({tagArticles.length})
                                            </h4>
                                            <ul className="space-y-1">
                                                {tagArticles.map(art => (
                                                    <li key={art.id} onClick={() => handleArticleView(art)} className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-pink-600 cursor-pointer font-medium truncate flex items-center gap-1">
                                                        📝 {art.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 text-xs font-bold text-slate-400 col-span-full">Chưa có thẻ phân loại nào.</div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </ContentCard>

                {/* Search and Filter */}
                <ContentCard>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <div className="relative flex-1 w-full">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="search" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    placeholder={t('searchPlaceholderBlog')} 
                                    className="w-full bg-[--color-surface-secondary] border border-[--color-border-secondary] shadow-sm focus:ring-2 focus:ring-[--color-accent-500]/20 focus:outline-none placeholder-[--color-text-subtle] text-[--color-text-primary] rounded-full py-4 pl-12 pr-14 transition-all" 
                                />
                                <button 
                                    onClick={() => setAssistantOpen(!isAssistantOpen)}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all cursor-pointer ${isAssistantOpen ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 shadow-sm'}`}
                                    title={t('blogAssistant')}
                                >
                                    <RobotIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative flex-1">
                                    <select value={selectedTag || ''} onChange={(e) => setSelectedTag(e.target.value || null)} className="appearance-none w-full md:w-40 bg-[--color-surface-secondary] border border-[--color-border-secondary] shadow-sm rounded-full py-3.5 pl-4 pr-10 text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer">
                                        <option value="">{t('allTags')}</option>
                                        {allTags.map(tag => ( <option key={tag} value={tag}>{tag}</option> ))}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select value={selectedStatus || ''} onChange={(e) => setSelectedStatus(e.target.value || null)} className="appearance-none w-full md:w-44 bg-[--color-surface-secondary] border border-[--color-border-secondary] shadow-sm rounded-full py-3.5 pl-4 pr-10 text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer">
                                        <option value="">{t('allStatuses')}</option>
                                        <option value="Published">{t('statusPublished')}</option>
                                        <option value="Draft">{t('statusDraft')}</option>
                                        <option value="Archived">{t('statusArchived')}</option>
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            {(selectedTag || selectedStatus) && ( <button onClick={clearFilter} className="text-sm font-semibold text-pink-600 hover:text-pink-700 hover:underline shrink-0 px-2 cursor-pointer">{t('clearFilter')}</button> )}
                        </div>

                        {/* Export & View Toggle Bar (Matches projects page) */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 px-3.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5 text-pink-600" />
                                    Xuất báo cáo PDF
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 px-3.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5 text-pink-600" />
                                    Xuất báo cáo CSV
                                </button>
                            </div>

                            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-inner shrink-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                    title="Dạng lưới"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                    title="Dạng danh sách/bảng"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {/* Blog Assistant */}
                <AnimatePresence>
                    {isAssistantOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-8 max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100 overflow-hidden"
                        >
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <RobotIcon className="w-5 h-5 text-purple-600"/>
                                    <h2 className="font-bold text-purple-800">{t('blogAssistant')}</h2>
                                </div>
                                <button onClick={() => setAssistantOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4">
                               <div className="h-48 overflow-y-auto space-y-4 mb-4 p-2 bg-purple-50/30 rounded-lg no-scrollbar">
                                    {assistantMessages.map((msg, i) => (
                                        <div key={i} className={`flex items-start gap-2 ${msg.author === 'user' ? 'justify-end' : ''}`}>
                                            {msg.author === 'ai' && <RobotIcon className="w-5 h-5 text-purple-600 shrink-0 mt-1"/>}
                                            <p className={`p-2 rounded-lg max-w-[80%] text-sm ${msg.author === 'user' ? 'bg-purple-500 text-white' : 'bg-white border border-purple-100 shadow-sm text-slate-700'}`}>{msg.text}</p>
                                        </div>
                                    ))}
                                    {isAssistantLoading && <div className="flex items-center gap-2"><RobotIcon className="w-5 h-5 text-purple-600 shrink-0 mt-1"/> <span className="p-2 text-sm animate-pulse">...</span></div>}
                               </div>
                               <form onSubmit={handleAssistantSubmit} className="relative">
                                   <input type="text" value={assistantPrompt} onChange={e => setAssistantPrompt(e.target.value)} placeholder={t('askAboutArticles')} className="w-full bg-white border border-purple-200 rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"/>
                                   <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300 transition-colors" disabled={isAssistantLoading}><PaperAirplaneIcon className="w-4 h-4"/></button>
                               </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {pinnedPost && viewMode === 'grid' && <div className="mb-8"><PinnedPost article={pinnedPost} onTagClick={handleTagClick} onSchedule={onSchedule} onView={() => handleArticleView(pinnedPost)} searchTerm={searchTerm} onSummarize={handleSummarize} onShare={handleShareArticle} canDelete={user.role === 'superadmin' || pinnedPost.authorId === user.id} onDelete={handleDeleteArticle} /></div>}

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[--color-text-primary]">{t('latestPosts')}</h2>
                        <div className="flex items-center gap-2">
                           <button onClick={() => onNavigate('settings', 'blog')} title={t('blogSettings')} className="p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg shadow-md hover:bg-white/90 text-slate-600 dark:text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"> <SettingsIcon className="w-5 h-5"/> </button>
                            <button onClick={() => onNavigate('new-blog-post')} className="flex items-center gap-2 py-3 px-4 bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all transform hover:scale-105 cursor-pointer">
                                <PlusIcon className="w-5 h-5"/>
                                <span className="hidden sm:inline">{t('newPost')}</span>
                            </button>
                        </div>
                    </div>
                    
                    {filteredPosts.length === 0 ? (
                        <div className="py-20 text-center bg-white/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">{t('noArticlesFound')}</h3>
                            <p className="text-slate-500">{t('noArticlesFoundDesc')}</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedTag(null); setSelectedStatus(null); }} className="mt-4 text-pink-600 font-bold hover:underline cursor-pointer">{t('clearAllFilters')}</button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paginatedPosts.map(article => ( <ArticleCard key={article.id} article={article} onTagClick={handleTagClick} onSchedule={onSchedule} onView={() => handleArticleView(article)} searchTerm={searchTerm} onSummarize={handleSummarize} onShare={handleShareArticle} canDelete={user.role === 'superadmin' || article.authorId === user.id} onDelete={handleDeleteArticle} /> ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Tiêu đề bài viết</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Tác giả</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Thẻ phân loại</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Ngày tạo</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Trạng thái</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Nguồn</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.map(article => (
                                        <tr key={article.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => handleArticleView(article)}>
                                            <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-pink-600 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    {article.isPinned && <PinIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />}
                                                    <span className="truncate max-w-[280px] block">{highlightText(article.title, searchTerm)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300 text-xs font-medium">{highlightText(article.author, searchTerm)}</td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {article.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full border border-pink-100/50 dark:border-pink-900/30">
                                                            {highlightText(tag, searchTerm)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400 text-xs font-medium">{article.date}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                    article.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                                    article.status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400' :
                                                    'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400'
                                                }`}>
                                                    {article.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${article.source === 'Blogger' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {article.source}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-1.5 justify-end">
                                                    <button 
                                                        onClick={() => handleSummarize(article)}
                                                        className="p-1.5 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-600 dark:text-purple-400 rounded-lg transition-all cursor-pointer"
                                                        title="AI Summary"
                                                    >
                                                        <RobotIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleShareArticle(article)}
                                                        className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg transition-all cursor-pointer"
                                                        title="Chia sẻ"
                                                    >
                                                        <ShareIcon className="w-4 h-4" />
                                                    </button>
                                                    {(user.role === 'superadmin' || article.authorId === user.id) && (
                                                        <button 
                                                            onClick={() => handleDeleteArticle(article.id)}
                                                            className="p-1.5 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-lg transition-all cursor-pointer"
                                                            title="Xóa"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {viewMode === 'grid' && visibleItems < latestPosts.length && (
                        <div className="flex justify-center mt-12 mb-8">
                            <div className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-medium animate-pulse">
                                <ChevronDownIcon className="w-4 h-4" />
                                {t('scrollForMore') || 'Cuộn xuống để xem thêm'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Summary Modal */}
            <AnimatePresence>
                {activeSummary && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-purple-100"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <RobotIcon className="w-6 h-6 text-purple-600" />
                                    Tóm tắt AI
                                </h3>
                                <button onClick={() => setActiveSummary(null)} className="p-2 hover:bg-black/5 rounded-full text-slate-400 transition-colors cursor-pointer">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8">
                                <h4 className="font-bold text-slate-900 mb-4 text-lg">"{activeSummary.title}"</h4>
                                {isSummarizing ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-purple-600 font-semibold animate-pulse">Đang suy luận...</p>
                                    </div>
                                ) : (
                                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 relative">
                                        <div className="absolute -top-3 -left-3 text-4xl text-purple-200">“</div>
                                        <p className="text-slate-700 leading-relaxed italic text-lg">{activeSummary.text}</p>
                                        <div className="absolute -bottom-6 -right-3 text-4xl text-purple-200">”</div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button 
                                    onClick={() => setActiveSummary(null)}
                                    className="px-8 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all active:scale-95 cursor-pointer"
                                >
                                    Đã hiểu
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-[9999] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in-up">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}
        </StandardPageLayout>
    );
};

export default BlogView;