import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, RecentItem } from '../App';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import { 
    FolderIcon, ChevronLeftIcon, 
    FileTextIcon, FileImageIcon, FileVideoIcon, FilePdfIcon, TrashIcon, InfoIcon, GoogleIcon
} from './icons';
import { 
    Search, Plus, Download, Grid, List, Share2, HardDrive, Cloud, AlertCircle, BarChart3,
    Play, Pause, Volume2, ZoomIn, ZoomOut, RotateCw, Eye, Sparkles, X, ChevronRight
} from 'lucide-react';
import GooglePickerButton from './GooglePickerButton';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES ---
interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'docx' | 'png' | 'mp4';
  size: string;
  modifiedAt: string;
  owner: string;
  parentId: string | null;
  source?: 'google';
}

// --- MOCK DATA ---
export const initialFileSystem: FileSystemItem[] = [
  { id: 'root', name: 'My Drive', type: 'folder', size: '-', modifiedAt: '2023-10-26', owner: 'Me', parentId: null },
  { id: '1', name: 'Phòng ban', type: 'folder', size: '3.1 GB', modifiedAt: '2023-10-25', owner: 'Me', parentId: 'root' },
  { id: '2', name: 'Dự án', type: 'folder', size: '10.5 GB', modifiedAt: '2023-10-26', owner: 'Me', parentId: 'root' },
  { id: '3', name: 'Cá nhân', type: 'folder', size: '512 MB', modifiedAt: '2023-10-20', owner: 'Me', parentId: 'root' },
  { id: '1-1', name: 'Kinh doanh', type: 'folder', size: '1.5 GB', modifiedAt: '2023-10-24', owner: 'Me', parentId: '1' },
  { id: '1-2', name: 'Nhân sự', type: 'folder', size: '800 MB', modifiedAt: '2023-10-23', owner: 'Me', parentId: '1' },
  { id: '2-1', name: 'Dự án POW', type: 'folder', size: '4.2 GB', modifiedAt: '2023-10-26', owner: 'Me', parentId: '2' },
  { id: '2-1-1', name: 'Báo cáo tiến độ.pdf', type: 'pdf', size: '2.3 MB', modifiedAt: '2023-10-26', owner: 'Alice', parentId: '2-1' },
  { id: '2-1-2', name: 'Wireframes.png', type: 'png', size: '5.1 MB', modifiedAt: '2023-10-25', owner: 'Me', parentId: '2-1' },
  { id: '2-1-3', name: 'Video Demo.mp4', type: 'mp4', size: '120 MB', modifiedAt: '2023-10-24', owner: 'Bob', parentId: '2-1' },
  { id: 'root-1', name: 'Quy chế công ty.docx', type: 'docx', size: '780 KB', modifiedAt: '2023-09-15', owner: 'HR Dept', parentId: 'root' },
];

const FileIcon: React.FC<{ type: string, className?: string }> = ({ type, className = "w-6 h-6" }) => {
    switch (type) {
        case 'folder': return <FolderIcon className={className} />;
        case 'pdf': return <FilePdfIcon className={className} />;
        case 'png': return <FileImageIcon className={className} />;
        case 'mp4': return <FileVideoIcon className={className} />;
        default: return <FileTextIcon className={className} />;
    }
};

// --- FILE PREVIEW COMPONENT ---
const FilePreviewModal: React.FC<{
    item: FileSystemItem;
    onClose: () => void;
    onShare: (item: FileSystemItem) => void;
    onDelete: (id: string) => void;
}> = ({ item, onClose, onShare, onDelete }) => {
    // Interactive Video state
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoTime, setVideoTime] = useState(12); // start at 12s
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [pdfPage, setPdfPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');

    // Video ticking simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && item.type === 'mp4') {
            interval = setInterval(() => {
                setVideoTime(prev => (prev >= 142 ? 0 : prev + 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, item.type]);

    const formatVideoTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="absolute inset-0" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col relative z-10"
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <FileIcon type={item.type} className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                                {item.name}
                                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Quick Preview
                                </span>
                            </h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                {item.size} • Chủ sở hữu: {item.owner} • Sửa đổi: {item.modifiedAt}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onShare(item)} 
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-xs font-bold"
                            title="Chia sẻ liên kết"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Chia sẻ</span>
                        </button>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); alert(`Đang tải tệp "${item.name}" về máy tính...`); }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-xs font-bold"
                            title="Tải về"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Tải về</span>
                        </a>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-xl transition-all ml-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left side preview window */}
                    <div className="flex-1 bg-slate-100/50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-auto select-none border-r border-gray-150 dark:border-slate-850">
                        
                        {/* Interactive Toolbar for Previewers */}
                        {item.type !== 'mp4' && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-4 z-20 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="hover:text-blue-500 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" title="Thu nhỏ"><ZoomOut className="w-4 h-4" /></button>
                                <span className="font-mono text-[11px] w-12 text-center">{zoom}%</span>
                                <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="hover:text-blue-500 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" title="Phóng to"><ZoomIn className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-gray-200 dark:bg-slate-700" />
                                <button onClick={() => setRotation(r => (r + 90) % 360)} className="hover:text-blue-500 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1" title="Xoay">
                                    <RotateCw className="w-4 h-4" />
                                    <span className="text-[10px] hidden md:inline">Xoay</span>
                                </button>
                            </div>
                        )}

                        <div 
                            style={{ 
                                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, 
                                transition: 'transform 0.15s ease-out' 
                            }}
                            className="w-full h-full flex items-center justify-center min-h-[300px]"
                        >
                            {/* --- PDF FILE PREVIEW --- */}
                            {item.type === 'pdf' && (
                                <div className="bg-white dark:bg-slate-900 w-[550px] aspect-[1/1.4] shadow-xl border border-gray-250 dark:border-slate-800 p-8 flex flex-col gap-6 relative rounded-lg">
                                    <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Báo cáo hiệu suất Service Desk</h4>
                                            <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase tracking-widest">Power Service One JSC</p>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-right">
                                            <span className="block text-[8px] font-black text-slate-400 uppercase">Mã tài liệu</span>
                                            <span className="font-mono text-[9px] font-bold text-slate-700 dark:text-slate-300">PS-SLA-2026-Q1</span>
                                        </div>
                                    </div>

                                    {pdfPage === 1 ? (
                                        <div className="flex-1 flex flex-col gap-4 text-slate-850 dark:text-slate-200">
                                            <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">1. Tổng quan Dự án & Tối ưu hóa SLA</h5>
                                            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                Tài liệu này đánh giá tổng thể chất lượng phản hồi hỗ trợ kỹ thuật của Service Desk trong Quý 1 năm 2026. Bằng việc tối ưu hóa sơ đồ điều phối Ticket tự động và nâng cao năng lực giám sát, chúng tôi đã đạt được những bước tiến đáng kể trong việc rút ngắn thời gian xử lý sự cố.
                                            </p>
                                            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex flex-col gap-1.5">
                                                <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest">Chỉ số đo lường chính (KPIs):</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-100 dark:border-slate-750">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase">SLA đạt chuẩn</span>
                                                        <span className="text-xs font-black text-slate-850 dark:text-white font-mono">98.4%</span>
                                                    </div>
                                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-100 dark:border-slate-750">
                                                        <span className="block text-[8px] font-bold text-slate-400 uppercase">Time to Resolution</span>
                                                        <span className="text-xs font-black text-slate-850 dark:text-white font-mono">~45 phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col gap-4 text-slate-800 dark:text-slate-200">
                                            <h5 className="text-xs font-black text-slate-850 dark:text-white mt-2">2. Đề xuất quy trình Service Desk 2.0</h5>
                                            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                Sử dụng AI Tự động Phân loại và Gán người phụ trách dựa trên độ phức tạp của Ticket. Các nhân sự hỗ trợ sẽ nhận được thông báo tức thời thông qua SDP Notification Service để phản hồi trong vòng 5 phút đối với các sự cố mức độ ưu tiên "Cao".
                                            </p>
                                            <div className="h-24 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 border-dashed flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Sơ đồ phân phối sự cố tự động (SDP-AI)</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer inside PDF */}
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] font-bold text-slate-400 mt-auto">
                                        <span>Bảo mật • Lưu hành nội bộ</span>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setPdfPage(1)} disabled={pdfPage === 1} className="hover:text-blue-500 disabled:opacity-30">Trước</button>
                                            <span className="font-mono text-slate-800 dark:text-slate-300">{pdfPage} / 2</span>
                                            <button onClick={() => setPdfPage(2)} disabled={pdfPage === 2} className="hover:text-blue-500 disabled:opacity-30">Tiếp</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- DOCX FILE PREVIEW --- */}
                            {item.type === 'docx' && (
                                <div className="bg-white dark:bg-slate-900 w-[550px] h-[550px] shadow-xl border border-gray-200 dark:border-slate-800 p-10 rounded-md overflow-y-auto no-scrollbar flex flex-col gap-4 text-left">
                                    <div className="text-center pb-6 border-b border-gray-100 dark:border-slate-800">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase leading-relaxed">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Độc lập - Tự do - Hạnh phúc</p>
                                        <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-2"></div>
                                    </div>

                                    <div className="pt-4 space-y-4 text-slate-800 dark:text-slate-200">
                                        <h3 className="text-xs font-black text-center text-slate-900 dark:text-white uppercase tracking-wider">QUY CHẾ VẬN HÀNH & NỘI QUY CÔNG TY</h3>
                                        <p className="text-[11px] font-bold text-slate-500 text-center">Số: 124/QĐ-HR-POWER</p>

                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                            <strong>Điều 1: Thời gian làm việc tiêu chuẩn</strong><br />
                                            Nhân sự thuộc khối văn phòng và Service Desk làm việc từ Thứ Hai đến Thứ Sáu, bắt đầu từ 08:30 đến 17:30 hằng ngày. Thời gian nghỉ trưa từ 12:00 đến 13:00.
                                        </p>

                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                            <strong>Điều 2: Bảo mật thông tin khách hàng</strong><br />
                                            Tất cả dữ liệu thông tin, mật khẩu, máy chủ và lịch trình của khách hàng Power Service One phải được lưu trữ trong môi trường bảo mật của công ty. Nghiêm cấm chia sẻ tài liệu ra ngoài mạng nội bộ hoặc xuất bản không có sự phê duyệt bằng văn bản từ Giám đốc vận hành.
                                        </p>

                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                            <strong>Điều 3: Xử lý phản hồi SLA</strong><br />
                                            Các sự cố khẩn cấp (P1/Critical) phải được tiếp nhận và xử lý trong vòng tối đa 15 phút từ lúc phát sinh. Báo cáo khắc phục sự cố cần gửi đến ban điều hành dự án trong vòng 24 giờ.
                                        </p>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold mt-8 text-right italic">Đại diện Ban Giám đốc đã ký duyệt</p>
                                </div>
                            )}

                            {/* --- PNG IMAGE FILE PREVIEW --- */}
                            {item.type === 'png' && (
                                <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-750 max-w-lg w-full flex flex-col items-center justify-center">
                                    <div className="bg-[#0F172A] w-full aspect-[16/10] rounded-2xl relative overflow-hidden p-6 flex flex-col text-white shadow-inner">
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                        
                                        {/* Mock UI Design Wireframe inside image */}
                                        <div className="flex justify-between items-center pb-3 border-b border-white/10 z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                <span className="font-mono text-[9px] text-slate-400 ml-2">sdp-crm-dashboard-v3.sketch</span>
                                            </div>
                                            <span className="text-[8px] bg-indigo-500 text-white font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Approved</span>
                                        </div>

                                        <div className="flex-1 grid grid-cols-3 gap-3 pt-4 z-10">
                                            <div className="col-span-1 bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-2">
                                                <div className="w-8 h-2 bg-indigo-500/80 rounded-full"></div>
                                                <div className="w-full h-1 bg-white/10 rounded"></div>
                                                <div className="w-2/3 h-1 bg-white/10 rounded"></div>
                                                <div className="w-3/4 h-1 bg-white/10 rounded"></div>
                                                <div className="w-1/2 h-1 bg-white/10 rounded mt-auto"></div>
                                            </div>

                                            <div className="col-span-2 flex flex-col gap-3">
                                                <div className="h-12 bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="w-24 h-1.5 bg-blue-400 rounded-full"></div>
                                                        <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black font-mono">75%</div>
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1">
                                                        <div className="w-8 h-1 bg-white/20 rounded"></div>
                                                        <div className="w-16 h-3 bg-white/10 rounded-lg mt-1"></div>
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1">
                                                        <div className="w-8 h-1 bg-white/20 rounded"></div>
                                                        <div className="w-16 h-3 bg-white/10 rounded-lg mt-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                        Wireframe phác thảo giao diện Bảng điều khiển CRM hệ thống
                                    </span>
                                </div>
                            )}

                            {/* --- MP4 VIDEO FILE PREVIEW --- */}
                            {item.type === 'mp4' && (
                                <div className="bg-slate-950 w-full max-w-xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative group border border-slate-800 flex flex-col justify-end">
                                    {/* Video simulation visual container */}
                                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                                        {/* Animated waves representing video frames */}
                                        <div className="flex items-end gap-1.5 h-16 w-32 justify-center">
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                                <div 
                                                    key={i} 
                                                    className="w-2 bg-blue-500/80 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        height: isPlaying ? `${Math.random() * 50 + 15}px` : '15px' 
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                                            {isPlaying ? 'Đang phát demo video...' : 'Video đã tạm dừng'}
                                        </span>
                                    </div>

                                    {/* Play button overlay in center */}
                                    <AnimatePresence>
                                        {!isPlaying && (
                                            <motion.button 
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                onClick={() => setIsPlaying(true)}
                                                className="absolute inset-0 m-auto w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all z-20"
                                            >
                                                <Play className="w-6 h-6 fill-white ml-1" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>

                                    {/* Video custom player skins bar */}
                                    <div className="bg-slate-900/95 border-t border-slate-800 p-4 flex flex-col gap-2.5 z-10">
                                        {/* Timeline tracking seeker */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-400 font-mono">{formatVideoTime(videoTime)}</span>
                                            <div className="flex-1 bg-slate-800 h-1 rounded-full relative cursor-pointer" onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const pct = (e.clientX - rect.left) / rect.width;
                                                setVideoTime(Math.floor(pct * 142));
                                            }}>
                                                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${(videoTime / 142) * 100}%` }}></div>
                                                <div className="w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-full absolute top-1/2 -translate-y-1/2" style={{ left: `calc(${(videoTime / 142) * 100}% - 5px)` }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono">2:22</span>
                                        </div>

                                        {/* Volume & control switches */}
                                        <div className="flex justify-between items-center text-slate-400">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white transition-all">
                                                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-400" /> : <Play className="w-4 h-4 fill-slate-400" />}
                                                </button>
                                                <div className="flex items-center gap-1.5 hover:text-white transition-all cursor-pointer">
                                                    <Volume2 className="w-4 h-4 text-slate-400" />
                                                    <div className="w-12 bg-slate-800 h-1 rounded-full">
                                                        <div className="bg-blue-500 h-full rounded-full w-2/3"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <span className="text-[9px] bg-slate-800 text-slate-300 font-bold tracking-wider px-2 py-0.5 rounded uppercase">SDP-Video-Engine</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side information panel */}
                    <div className="w-80 overflow-y-auto p-6 hidden lg:flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 dark:border-slate-800 p-1 bg-gray-50 dark:bg-slate-850 rounded-xl">
                            <button 
                                onClick={() => setActiveTab('content')} 
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'content' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Gợi ý AI
                            </button>
                            <button 
                                onClick={() => setActiveTab('metadata')} 
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'metadata' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Chi tiết
                            </button>
                        </div>

                        {activeTab === 'content' ? (
                            <div className="flex flex-col gap-4">
                                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex flex-col gap-2">
                                    <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                        Tóm tắt thông minh (AI Summary)
                                    </span>
                                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                                        {item.type === 'pdf' && "Tập trung phân tích chất lượng xử lý Ticket hỗ trợ kỹ thuật và cam kết SLA của phòng ban IT trong Quý 1 năm 2026. Báo cáo ghi nhận tỷ lệ hài lòng đạt 98.4%."}
                                        {item.type === 'docx' && "Quyết định ban hành nội quy giờ giấc làm việc chuẩn chỉ, nội quy bảo mật thông tin khách hàng nhạy cảm và quy trình phản hồi SLA sự cố khẩn cấp (P1)."}
                                        {item.type === 'png' && "Bản thiết kế wireframe sơ đồ cấu trúc của Bảng điều khiển CRM hệ thống hỗ trợ Service Desk, tối ưu hóa các bento-grid và hiển thị biểu đồ phân tích trực quan."}
                                        {item.type === 'mp4' && "Video ghi nhận lại quá trình demo hệ thống và quy trình điều phối Ticket tự động thông qua trí tuệ nhân tạo thông minh tích hợp."}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/60">
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Tác vụ được đề xuất</p>
                                    <div className="flex flex-col gap-2">
                                        <button className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-bold transition-all text-left px-3 flex items-center justify-between">
                                            Trích xuất bảng dữ liệu
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                        <button className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-bold transition-all text-left px-3 flex items-center justify-between">
                                            Dịch tài liệu sang Tiếng Anh
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/60">
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Thông tin chi tiết</p>
                                    <div className="space-y-3 font-semibold text-[11px]">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Định dạng:</span>
                                            <span className="text-slate-800 dark:text-slate-200 uppercase font-bold">{item.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Dung lượng:</span>
                                            <span className="text-slate-800 dark:text-slate-200 font-mono">{item.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Sửa đổi cuối:</span>
                                            <span className="text-slate-800 dark:text-slate-200">{item.modifiedAt}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Chủ sở hữu:</span>
                                            <span className="text-slate-800 dark:text-slate-200">{item.owner}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/60">
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Bảo mật hệ thống</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span>Đã quét mã độc an toàn</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer buttons bar */}
                <div className="p-5 border-t border-gray-150 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <button 
                        onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa tài liệu này hẵn khỏi hệ thống?')) {
                                onDelete(item.id);
                                onClose();
                            }
                        }}
                        className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Xóa tài liệu
                    </button>

                    <button 
                        onClick={onClose} 
                        className="py-2.5 px-6 bg-slate-800 hover:bg-slate-950 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-all"
                    >
                        Đóng xem trước
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

interface DriveViewProps {
  user: User;
  onItemViewed: (item: RecentItem) => void;
}

const DriveView: React.FC<DriveViewProps> = ({ user, onItemViewed }) => {
    const [mockFileSystem, setMockFileSystem] = useState<FileSystemItem[]>(initialFileSystem);
    const [currentFolderId, setCurrentFolderId] = useState('root');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [previewItemId, setPreviewItemId] = useState<string | null>(null); // New Preview State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [toastMessage, setToastMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'local' | 'cloud'>('local');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2500);
    };

    const handleShare = (item: FileSystemItem) => {
        const shareUrl = `${window.location.protocol}//${window.location.host}/?shareType=drive&shareId=${item.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Đã sao chép liên kết chia sẻ của "${item.name}"!`);
        });
    };

    const handleGooglePickerResult = (docs: {
        id: string;
        name: string;
        mimeType: string;
        url: string;
        lastEditedUtc: number;
        iconUrl: string;
        parentId: string;
        sizeBytes?: number;
    }[]) => {
        const newItems: FileSystemItem[] = docs.map((doc, idx) => {
            const sizeString = doc.sizeBytes ? (doc.sizeBytes > 1024 * 1024 ? (doc.sizeBytes / (1024 * 1024)).toFixed(1) + ' MB' : (doc.sizeBytes / 1024).toFixed(0) + ' KB') : '1.2 MB';
            const fileType = doc.mimeType.includes('pdf') ? 'pdf' : (doc.mimeType.includes('image') ? 'png' : (doc.mimeType.includes('video') ? 'mp4' : 'docx'));
            return {
                id: `google-${doc.id}-${idx}`,
                name: doc.name,
                type: fileType as 'pdf' | 'docx' | 'png' | 'mp4',
                size: sizeString,
                modifiedAt: new Date(doc.lastEditedUtc || Date.now()).toISOString().split('T')[0],
                owner: 'Google Drive',
                parentId: currentFolderId,
                source: 'google'
            };
        });
        setMockFileSystem(prev => [...prev, ...newItems]);
        showToast(`Đã đồng bộ thành công ${newItems.length} tài liệu từ Google Drive!`);
    };

    const handleDeleteItem = (id: string) => {
        setMockFileSystem(prev => prev.filter(item => item.id !== id));
        setSelectedItemId(null);
        setPreviewItemId(null);
        showToast('Đã xóa tài liệu thành công.');
    };

    const filteredItems = useMemo(() => {
        const inFolder = mockFileSystem.filter(item => {
            if (activeTab === 'cloud') {
                return item.source === 'google';
            } else {
                return item.parentId === currentFolderId;
            }
        });
        if (!searchTerm) return inFolder;
        return inFolder.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [mockFileSystem, currentFolderId, searchTerm, activeTab]);

    const selectedItem = useMemo(() => mockFileSystem.find(item => item.id === selectedItemId), [mockFileSystem, selectedItemId]);
    const previewItem = useMemo(() => mockFileSystem.find(item => item.id === previewItemId), [mockFileSystem, previewItemId]);

    const breadcrumbs = useMemo(() => {
        const path = [];
        let currentId: string | null = currentFolderId;
        while (currentId) {
            const currentItem = mockFileSystem.find(item => item.id === currentId);
            if (currentItem) {
                path.unshift(currentItem);
                currentId = currentItem.parentId;
            } else {
                break;
            }
        }
        return path;
    }, [mockFileSystem, currentFolderId]);

    const handleItemClick = (item: FileSystemItem) => {
        onItemViewed({
            id: `drive-${item.id}`,
            name: item.name,
            type: 'drive',
            icon: <FileIcon type={item.type} />,
            itemId: item.id
        });

        if (item.type === 'folder') {
            setCurrentFolderId(item.id);
            setSelectedItemId(null);
            setPreviewItemId(null);
        } else {
            // Clicking name triggers the gorgeous quick preview modal!
            setPreviewItemId(item.id);
            setSelectedItemId(null); // Close sidebar to let preview shine
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles: FileSystemItem[] = Array.from(files).map((file, index) => ({
            id: `uploaded-${Date.now()}-${index}`,
            name: file.name,
            type: file.name.endsWith('.pdf') ? 'pdf' : (file.type.startsWith('image') ? 'png' : (file.type.startsWith('video') ? 'mp4' : 'docx')),
            size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB',
            modifiedAt: new Date().toISOString().split('T')[0],
            owner: user.name,
            parentId: currentFolderId,
        }));
        setMockFileSystem(prev => [...prev, ...newFiles]);
        showToast(`Đã tải lên ${newFiles.length} tài liệu thành công!`);
    };

    return (
        <StandardPageLayout>
            <PageBanner 
                title="Quản lý Tài liệu"
                subtitle="Lưu trữ, tổ chức và chia sẻ tài liệu công việc một cách thông minh và an toàn."
                icon={<FolderIcon className="w-full h-full text-white" />}
                gradient="from-blue-500 to-indigo-600"
                actions={
                    <>
                        <div className="flex bg-white/10 p-1 rounded-xl shadow-sm border border-white/20 mr-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><Grid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><List className="w-4 h-4" /></button>
                        </div>
                        {activeTab === 'local' ? (
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                                <Plus className="w-4 h-4" /> Tải lên
                            </button>
                        ) : (
                            <GooglePickerButton onPicked={handleGooglePickerResult} label="Chọn tài liệu từ Google Drive" variant="secondary" className="!bg-white !text-blue-600 hover:!bg-white/95" />
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                    </>
                }
            />

            {/* Sub-navigation Tabs (Consistent with Project Page Layout) */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border">
                <button
                    onClick={() => { setActiveTab('local'); setSelectedItemId(null); setPreviewItemId(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'local'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <HardDrive className="w-4 h-4" />
                    <span>Bộ nhớ hệ thống</span>
                </button>
                <button
                    onClick={() => { setActiveTab('cloud'); setSelectedItemId(null); setPreviewItemId(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'cloud'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <Cloud className="w-4 h-4" />
                    <span>Lưu trữ đám mây</span>
                </button>
            </div>

            {activeTab === 'local' ? (
                <div className="flex flex-col gap-6">
                    {/* Storage Statistics Component Card */}
                    <ContentCard>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-100">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                        Thống kê dung lượng lưu trữ
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Theo dõi chi tiết dung lượng và cơ cấu các tệp tin trong hệ thống.</p>
                                </div>
                                <span className="text-xs font-bold text-slate-600">Đã dùng: 14.1 GB / 15 GB (94%)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài liệu PDF / Word</span>
                                    <span className="text-sm font-bold text-blue-700">3.1 GB</span>
                                    <div className="w-full h-1 bg-blue-100 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '22%' }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hình ảnh</span>
                                    <span className="text-sm font-bold text-emerald-700">512 MB</span>
                                    <div className="w-full h-1 bg-emerald-100 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5%' }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video bài giảng</span>
                                    <span className="text-sm font-bold text-amber-700">10.5 GB</span>
                                    <div className="w-full h-1 bg-amber-100 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thư mục tổ chức</span>
                                    <span className="text-sm font-bold text-indigo-700">5 Thư mục chính</span>
                                    <span className="text-[10px] font-medium text-slate-400 mt-2">Đồng bộ hoàn tất</span>
                                </div>
                            </div>
                        </div>
                    </ContentCard>

                    {/* Files Explorer Card */}
                    <ContentCard>
                        <div className="flex flex-col gap-6">
                            {/* Breadcrumbs & Search */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-hidden">
                                    {breadcrumbs.map((crumb, index) => (
                                        <React.Fragment key={crumb.id}>
                                            {index > 0 && <span className="text-slate-300">/</span>}
                                            <button 
                                                onClick={() => { setCurrentFolderId(crumb.id); setPreviewItemId(null); setSelectedItemId(null); }} 
                                                className={`px-2 py-1 rounded-lg transition-all ${index === breadcrumbs.length - 1 ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/50'}`}
                                            >
                                                {crumb.name}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Tìm kiếm tài liệu..."
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* File Grid/List */}
                            <div className="min-h-[400px]">
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                        {filteredItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => handleItemClick(item)}
                                                className={`group relative p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center gap-3 ${selectedItemId === item.id || previewItemId === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                            >
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${item.type === 'folder' ? 'bg-blue-50 text-blue-500 group-hover:scale-110' : 'bg-gray-50 text-slate-400'}`}>
                                                    <FileIcon type={item.type} className="w-10 h-10" />
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.size === '-' ? 'Thư mục' : item.size}</p>
                                                </div>
                                                {item.type !== 'folder' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setPreviewItemId(item.id); }}
                                                        className="absolute bottom-2 right-2 bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-blue-100"
                                                        title="Xem nhanh"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {item.source === 'google' && (
                                                    <div className="absolute top-2 right-2 bg-blue-50 p-1 rounded-full border border-blue-100" title="Google Drive Synced">
                                                        <GoogleIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredItems.map(item => (
                                                    <tr key={item.id} onClick={() => handleItemClick(item)} className="hover:bg-blue-50/30 cursor-pointer group transition-all">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${item.type === 'folder' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-slate-400'}`}>
                                                                    <FileIcon type={item.type} className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-xs tracking-tight hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                                                        {item.name}
                                                                        {item.type !== 'folder' && (
                                                                            <span className="opacity-0 group-hover:opacity-100 text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                                                                                Xem nhanh
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                    {item.source === 'google' && (
                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                            <GoogleIcon className="w-3.5 h-3.5" />
                                                                            <span className="text-[10px] font-bold text-blue-500">Google Drive Synced</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-xs font-semibold text-slate-600 hidden md:table-cell">{item.owner}</td>
                                                        <td className="p-4 text-xs font-semibold text-slate-600 hidden sm:table-cell">{item.modifiedAt}</td>
                                                        <td className="p-4 text-xs font-semibold text-slate-600 hidden lg:table-cell">{item.size}</td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                                {item.type !== 'folder' && (
                                                                    <button onClick={() => setPreviewItemId(item.id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Xem nhanh">
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button onClick={() => handleShare(item)} className="p-2 rounded-lg bg-gray-50 text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-all" title="Chia sẻ">
                                                                    <Share2 className="w-4 h-4" />
                                                                </button>
                                                                {item.id.includes('uploaded') && (
                                                                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg bg-gray-50 text-red-500 hover:bg-red-50 transition-all" title="Xóa">
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

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 border border-gray-100">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Không tìm thấy tài liệu</h3>
                                        <p className="text-sm text-slate-500 mt-2">Vui lòng thử tìm kiếm với từ khóa khác.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ContentCard>
                </div>
            ) : (
                /* Cloud Tab Content */
                <div className="flex flex-col gap-6">
                    <ContentCard>
                        <div className="flex flex-col gap-6 items-center text-center p-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-100 shadow-md">
                                <GoogleIcon className="w-12 h-12" />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-base font-bold text-slate-800 tracking-tight">Đồng bộ đám mây với Google Drive</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                                    Kết nối an toàn tài khoản Google Workspace của Anh để đồng bộ hóa, xem và chia sẻ tài liệu trực tiếp ngay trên nền tảng SDP Platform.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2 mt-2">
                                <GooglePickerButton onPicked={handleGooglePickerResult} label="Chọn tệp tin từ Google Drive" variant="secondary" className="!px-6 !py-3 !rounded-2xl shadow-lg shadow-blue-500/20" />
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                                    Tương thích hoàn toàn với Google Docs, Sheets, PDF và tệp tin đa phương tiện
                                </span>
                            </div>
                        </div>
                    </ContentCard>

                    {/* Google Drive Synced Items List Card */}
                    <ContentCard>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Cloud className="w-4.5 h-4.5 text-blue-500" />
                                    Tài liệu Google Drive đã đồng bộ ({mockFileSystem.filter(i => i.source === 'google').length})
                                </h4>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Tìm tài liệu đám mây..."
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên tài liệu</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nguồn</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Đồng bộ lúc</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Kích thước</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredItems.map(item => (
                                            <tr key={item.id} onClick={() => handleItemClick(item)} className="hover:bg-blue-50/30 cursor-pointer group transition-all">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                                                            <FileIcon type={item.type} className="w-5 h-5" />
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-xs tracking-tight">{item.name}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-bold uppercase tracking-tight">
                                                        <GoogleIcon className="w-3 h-3" /> Google Drive
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden sm:table-cell">{item.modifiedAt}</td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden lg:table-cell">{item.size}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => setPreviewItemId(item.id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Xem nhanh">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleShare(item)} className="p-2 rounded-lg bg-gray-50 text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-all" title="Chia sẻ liên kết">
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg bg-gray-50 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all" title="Hủy đồng bộ">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-16">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chưa đồng bộ tài liệu nào từ Google Drive</p>
                                        <p className="text-[11px] text-slate-400 mt-1">Sử dụng nút chọn tệp tin ở trên để bắt đầu thêm tài liệu từ đám mây.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ContentCard>
                </div>
            )}

            {/* Quick Document Preview Modal */}
            <AnimatePresence>
                {previewItem && (
                    <FilePreviewModal 
                        item={previewItem} 
                        onClose={() => setPreviewItemId(null)} 
                        onShare={handleShare}
                        onDelete={handleDeleteItem}
                    />
                )}
            </AnimatePresence>

            {/* Item Details Sidebar/Modal */}
            {selectedItem && (
                <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[1000] animate-slide-in-right border-l border-gray-100 flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Chi tiết tài liệu</h3>
                        <button onClick={() => setSelectedItemId(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                            <ChevronLeftIcon className="w-5 h-5 text-slate-400 rotate-180" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className={`w-32 h-32 rounded-[32px] flex items-center justify-center shadow-xl ${selectedItem.type === 'folder' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-slate-400'}`}>
                                <FileIcon type={selectedItem.type} className="w-16 h-16" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-slate-800 tracking-tight">{selectedItem.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedItem.type === 'folder' ? 'Thư mục' : selectedItem.type}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                <Download className="w-4 h-4" /> Tải về
                            </button>
                            <button onClick={() => handleShare(selectedItem)} className="flex items-center justify-center gap-2 p-3 bg-gray-50 text-slate-700 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all">
                                <Share2 className="w-4 h-4" /> Chia sẻ
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Thông tin tệp</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Chủ sở hữu:</span>
                                        <span className="text-slate-800 font-bold">{selectedItem.owner}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Kích thước:</span>
                                        <span className="text-slate-800 font-bold">{selectedItem.size === '-' ? 'N/A' : selectedItem.size}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Ngày sửa:</span>
                                        <span className="text-slate-800 font-bold">{selectedItem.modifiedAt}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hoạt động gần đây</p>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <InfoIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700">Bạn đã tạo tệp này</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{selectedItem.modifiedAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100">
                        <button onClick={() => handleDeleteItem(selectedItem.id)} className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-100 transition-all">
                            <TrashIcon className="w-4 h-4" /> Xóa tài liệu
                        </button>
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

export default DriveView;
