import React, { useState, useMemo, useRef } from 'react';
import { User, RecentItem } from '../App';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import { 
    FolderIcon, ChevronLeftIcon, 
    FileTextIcon, FileImageIcon, FileVideoIcon, FilePdfIcon, TrashIcon, InfoIcon
} from './icons';
import { Search, Plus, Download, Grid, List, Share2 } from 'lucide-react';

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
        case 'png':
        case 'jpg': return <FileImageIcon className={className} />;
        case 'mp4': return <FileVideoIcon className={className} />;
        default: return <FileTextIcon className={className} />;
    }
};

interface DriveViewProps {
  user: User;
  onItemViewed: (item: RecentItem) => void;
}

const DriveView: React.FC<DriveViewProps> = ({ user, onItemViewed }) => {
    const [mockFileSystem, setMockFileSystem] = useState<FileSystemItem[]>(initialFileSystem);
    const [currentFolderId, setCurrentFolderId] = useState('root');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [toastMessage, setToastMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredItems = useMemo(() => {
        const inFolder = mockFileSystem.filter(item => item.parentId === currentFolderId);
        if (!searchTerm) return inFolder;
        return inFolder.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [mockFileSystem, currentFolderId, searchTerm]);

    const selectedItem = useMemo(() => mockFileSystem.find(item => item.id === selectedItemId), [mockFileSystem, selectedItemId]);

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
        } else {
            setSelectedItemId(item.id);
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
    };

    return (
        <StandardPageLayout>
            <PageBanner 
                title="Quản lý Tài liệu"
                subtitle="Lưu trữ, tổ chức và chia sẻ tài liệu công việc một cách thông minh và an toàn."
                icon={<FolderIcon className="w-full h-full" />}
                gradient="from-blue-500 to-cyan-600"
                actions={
                    <>
                        <div className="flex bg-white/10 p-1 rounded-xl shadow-sm border border-white/20 mr-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><Grid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}><List className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                            <Plus className="w-4 h-4" /> Tải lên
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                    </>
                }
            />

            <ContentCard>
                <div className="flex flex-col gap-6">
                    {/* Breadcrumbs & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-hidden">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.id}>
                                    {index > 0 && <span className="text-slate-300">/</span>}
                                    <button 
                                        onClick={() => setCurrentFolderId(crumb.id)} 
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
                                        className={`group relative p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center gap-3 ${selectedItemId === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${item.type === 'folder' ? 'bg-blue-50 text-blue-500 group-hover:scale-110' : 'bg-gray-50 text-slate-400'}`}>
                                            <FileIcon type={item.type} className="w-10 h-10" />
                                        </div>
                                        <div className="text-center w-full">
                                            <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.size === '-' ? 'Thư mục' : item.size}</p>
                                        </div>
                                        {item.source === 'google' && <GoogleIcon className="absolute top-3 right-3 w-4 h-4 opacity-50" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên tài liệu</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Chủ sở hữu</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Ngày sửa đổi</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Kích thước</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredItems.map(item => (
                                            <tr key={item.id} onClick={() => handleItemClick(item)} className="hover:bg-blue-50/30 cursor-pointer group transition-all">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${item.type === 'folder' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-slate-400'}`}>
                                                            <FileIcon type={item.type} className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-xs tracking-tight">{item.name}</p>
                                                            {item.source === 'google' && <p className="text-[10px] font-bold text-blue-500 mt-0.5">Google Drive</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden md:table-cell">{item.owner}</td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden sm:table-cell">{item.modifiedAt}</td>
                                                <td className="p-4 text-xs font-semibold text-slate-600 hidden lg:table-cell">{item.size}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={(e) => { e.stopPropagation(); handleShare(item); }} className="p-2 rounded-lg bg-gray-50 text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-all">
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
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
                        <button className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-100 transition-all">
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
