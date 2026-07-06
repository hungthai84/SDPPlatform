import React, { useState, useEffect, useRef, useMemo } from 'react';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import NoteCard, { Note, ChecklistItem, keepColors } from './NoteCard';
import { 
  Archive, 
  Pin, 
  Palette, 
  Image as ImageIcon, 
  Check, 
  CheckSquare, 
  Plus, 
  X, 
  Tag, 
  Search,
  Users,
  Link,
  Paperclip,
  File as FileIcon,
  RefreshCw,
  CheckCircle,
  StickyNote
} from 'lucide-react';
import { initialContacts } from './ContactsView';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase-errors';
import { fetchGoogleKeepNotes, getAccessToken, GoogleKeepNote } from '../googleKeep';
import GooglePickerButton from './GooglePickerButton';

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Ý tưởng chiến dịch CSKH 2025',
    content: 'Tập trung vào trải nghiệm khách hàng đa kênh, cá nhân hóa ưu đãi và xây dựng cộng đồng.',
    tags: ['marketing', 'chiến_dịch'],
    color: 'yellow',
    isPinned: true,
    createdAt: '2525-07-07T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'note-2',
    title: 'Danh sách việc cần chuẩn bị cho cuộc họp',
    checklist: [
      { item: 'Sữa tươi không đường cho phòng họp', done: true },
      { item: 'In ấn tài liệu báo cáo slide', done: false },
      { item: 'Kiểm tra máy chiếu & âm thanh', done: false },
      { item: 'Gửi email nhắc nhở phòng ban dự họp', done: true },
    ],
    tags: ['công_việc', 'họp'],
    color: 'green',
    createdAt: '2025-07-08T09:30:00Z',
  },
  {
    id: 'note-3',
    title: 'Ghi chú triết lý sống',
    content: '"The best way to predict the future is to invent it." - Alan Kay',
    tags: ['truyền_cảm_hứng'],
    color: 'blue',
    createdAt: '2025-07-08T15:00:00Z',
  },
];

interface CreateNoteProps {
  onAddNote: (noteData: Partial<Note>) => void;
  onCloseModal?: () => void;
  isModal?: boolean;
}

export interface CreateNoteHandle {
  focus: () => void;
  close: () => void;
}

const CreateNote = React.forwardRef<CreateNoteHandle, CreateNoteProps>(({ onAddNote, onCloseModal, isModal = false }, ref) => {
  const [isFocused, setIsFocused] = useState(isModal);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteColor, setNoteColor] = useState('default');
  const [isPinned, setIsPinned] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  
  const [tagsInput, setTagsInput] = useState('');
  const [showTagsInput, setShowTagsInput] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSharePicker, setShowSharePicker] = useState(false);

  const [attachments, setAttachments] = useState<{ name: string; url: string; size?: string; type: string }[]>([]);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  
  const formRef = useRef<HTMLFormElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      setIsFocused(true);
      setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    },
    close: () => {
      handleClose();
    }
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const sizeKB = Math.round(file.size / 1024);
        const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
        const newAttachment = {
          name: file.name,
          url: reader.result,
          size: sizeStr,
          type: file.type || 'application/octet-stream'
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleContactShareLocal = (contactId: string) => {
    setSharedWith(prev => 
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };
   
  const handlePicked = (docs: { id: string; name: string; mimeType: string; url: string; lastEditedUtc: number; iconUrl: string; parentId: string; sizeBytes?: number }[]) => {
    const newAttachments = docs.map((doc) => ({
      name: doc.name,
      url: doc.url,
      size: doc.sizeBytes ? `${(doc.sizeBytes / 1024).toFixed(1)} KB` : undefined,
      type: doc.mimeType || 'application/octet-stream'
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };
   
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    const hasText = title.trim() || content.trim();
    const hasChecklist = showChecklist && checklistItems.length > 0;
    const hasImage = imageUrl.trim();
    const hasAttachments = attachments.length > 0;

    if (hasText || hasChecklist || hasImage || hasAttachments) {
      const tags = tagsInput
        ? tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

      onAddNote({
        title: title.trim(),
        content: content.trim() || undefined,
        checklist: showChecklist ? checklistItems : undefined,
        color: noteColor,
        isPinned,
        imageUrl: imageUrl.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        sharedWith: sharedWith.length > 0 ? sharedWith : undefined,
      });
    }

    setTitle('');
    setContent('');
    setNoteColor('default');
    setIsPinned(false);
    setImageUrl('');
    setShowImageUrlInput(false);
    setShowChecklist(false);
    setChecklistItems([]);
    setNewItemText('');
    setTagsInput('');
    setShowTagsInput(false);
    setShowColorPicker(false);
    setIsFocused(isModal);
    setAttachments([]);
    setSharedWith([]);
    setShowSharePicker(false);

    if (onCloseModal) {
      onCloseModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (isFocused) {
          handleClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFocused, title, content, noteColor, isPinned, checklistItems, newItemText, imageUrl, tagsInput, showChecklist, isModal, attachments, sharedWith]);

  const handleAddChecklistItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;
    setChecklistItems([...checklistItems, { item: newItemText.trim(), done: false }]);
    setNewItemText('');
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, idx) => idx !== index));
  };

  const handleToggleChecklistItemDirect = (index: number) => {
    setChecklistItems(checklistItems.map((item, idx) => 
      idx === index ? { ...item, done: !item.done } : item
    ));
  };

  const activeColor = keepColors.find(c => c.id === noteColor) || keepColors[0];

  return (
    <div className={isModal ? "w-full" : "max-w-xl mx-auto mb-10 px-4"}>
      <div 
        className={`rounded-xl border transition-all duration-300 shadow-md ${isFocused ? 'ring-2 ring-indigo-500/20 drop-shadow-lg' : 'hover:shadow-md cursor-text'} ${activeColor.bg} ${activeColor.border} ${isDragging ? 'ring-4 ring-indigo-500 border-indigo-500 scale-[1.01]' : ''}`}
        onClick={() => !isFocused && setIsFocused(true)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col relative">
          {imageUrl && isFocused && (
            <div className="w-full relative h-40 rounded-t-xl overflow-hidden border-b border-dashed border-slate-200 dark:border-slate-800">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                title="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isFocused ? (
            <>
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  placeholder="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => setIsPinned(!isPinned)} 
                  className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isPinned ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`}
                  title={isPinned ? "Bỏ ghim" : "Ghim ghi chú"}
                >
                  <Pin className={`w-4 h-4 fill-current ${isPinned ? 'scale-110 rotate-45' : 'scale-100'}`} />
                </button>
              </div>

              <div className="px-4 py-2 space-y-3">
                <textarea
                  autoFocus
                  placeholder="Tạo ghi chú..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none resize-none overflow-y-auto min-h-[50px] leading-relaxed"
                />

                {showChecklist && (
                  <div className="space-y-2 border-t border-slate-200/40 dark:border-slate-800/40 pt-3">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Danh mục checklist:</h5>
                    {checklistItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 group/item">
                        <button
                          type="button"
                          onClick={() => handleToggleChecklistItemDirect(index)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {item.done ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span 
                          className={`flex-1 text-xs text-slate-700 dark:text-slate-300 ${item.done ? 'line-through text-slate-400' : ''}`}
                        >
                          {item.item}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveChecklistItem(index)}
                          className="p-1 text-slate-400 hover:text-red-500 opacity-60 hover:opacity-100 rounded"
                          title="Xóa mục"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 mt-2">
                      <Plus className="w-4 h-4 text-slate-400 block shrink-0" />
                      <input 
                        type="text"
                        placeholder="Thêm mục..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddChecklistItem();
                          }
                        }}
                        className="flex-1 bg-transparent text-xs text-slate-707 dark:text-slate-300 focus:outline-none placeholder-slate-400"
                      />
                      {newItemText.trim() && (
                        <button 
                          type="button" 
                          onClick={() => handleAddChecklistItem()}
                          className="p-1 px-2.5 text-[10px] uppercase font-bold text-indigo-600 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all"
                        >
                          Thêm
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {attachments.length > 0 && (
                  <div className="space-y-1.5 border-t border-dashed border-slate-200/40 dark:border-slate-800/40 pt-3 text-left">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-505">Tệp đính kèm ({attachments.length}):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachments.map((file, idx) => {
                        const isImg = file.type.startsWith('image/');
                        return (
                          <div key={idx} className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 border border-slate-250 dark:bg-slate-950/40 dark:border-slate-800 text-left">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {isImg ? (
                                <ImageIcon className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              ) : (
                                <FileIcon className="w-3.5 h-3.5 text-indigo-550 shrink-0" />
                              )}
                              <div className="min-w-0 pr-1 truncate">
                                <p className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 truncate leading-tight">{file.name}</p>
                                {file.size && <p className="text-[8px] text-slate-400 font-semibold">{file.size}</p>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAttachments(attachments.filter((_, fidx) => fidx !== idx))}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded transition shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sharedWith.length > 0 && (
                  <div className="space-y-1.5 border-t border-dashed border-slate-200/40 dark:border-slate-800/40 pt-3 text-left">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-505 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" /> Thành viên cùng chia sẻ ({sharedWith.length}):
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {sharedWith.map((contactId) => {
                        const contact = initialContacts.find(c => c.id === contactId);
                        if (!contact) return null;
                        return (
                          <div key={contactId} className="inline-flex items-center gap-1 text-[9.5px] font-bold bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 p-0.5 px-2 rounded-full select-none shadow-xs">
                            <span>{contact.name}</span>
                            <button 
                              type="button" 
                              onClick={() => toggleContactShareLocal(contactId)} 
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {showTagsInput && (
                <div className="px-4 py-1.5 flex items-center gap-2 bg-black/5 dark:bg-white/5 border-t border-b border-slate-200/40 dark:border-slate-800/40">
                  <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Nhãn (Ngăn cách bằng dấu phẩy) e.g. công việc, mua sắm"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowTagsInput(false)}
                    className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 rounded-full"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {showImageUrlInput && (
                <div className="px-4 py-1.5 flex items-center gap-2 bg-black/5 dark:bg-white/5 border-t border-b border-slate-200/40 dark:border-slate-800/40">
                  <span className="text-xs font-semibold text-slate-500">Image URL:</span>
                  <input
                    type="text"
                    placeholder="Dán link ảnh từ Unsplash/Web..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none font-mono"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowImageUrlInput(false)}
                    className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 rounded-full"
                    title="Đóng nhập ảnh"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200/10 dark:border-white/5 mt-2 bg-black/5 dark:bg-white/5 rounded-b-xl">
                <div className="flex items-center gap-0.5">
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      title="Chọn màu nền" 
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
                    >
                      <Palette className="w-4 h-4" />
                    </button>

                    {showColorPicker && (
                      <div 
                        ref={colorPickerRef}
                        className="absolute left-0 bottom-10 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-2xl flex gap-1.5 items-center w-max"
                      >
                        {keepColors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => {
                              setNoteColor(color.id);
                              setShowColorPicker(false);
                            }}
                            title={color.name}
                            className={`w-5.5 h-5.5 rounded-full border border-slate-300 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all ${color.bullet} relative`}
                          >
                            {noteColor === color.id && (
                              <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200 absolute inset-0 m-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setShowChecklist(!showChecklist)}
                    title={showChecklist ? "Ẩn danh sách checklist" : "Bật danh sách checklist"} 
                    className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors ${showChecklist ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800' : ''}`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setShowTagsInput(!showTagsInput)}
                    title="Thêm nhãn" 
                    className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors ${tagsInput ? 'text-indigo-600' : ''}`}
                  >
                    <Tag className="w-4 h-4" />
                  </button>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    title="Tải ảnh lên từ thiết bị" 
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <input 
                    type="file" 
                    ref={attachmentInputRef} 
                    onChange={handleAttachmentUpload} 
                    className="hidden" 
                  />
                  <button 
                    type="button" 
                    onClick={() => attachmentInputRef.current?.click()}
                    title="Đính kèm file tài liệu" 
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <GooglePickerButton onPicked={handlePicked} variant="icon" label="Chọn tệp từ Google Drive" />

                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setShowSharePicker(!showSharePicker)}
                      title="Chia sẻ với các thành viên khác" 
                      className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors ${sharedWith.length > 0 ? 'text-indigo-600 bg-indigo-50/50 dark:bg-slate-800' : ''}`}
                    >
                      <Users className="w-4 h-4" />
                    </button>

                    {showSharePicker && (
                      <div className="absolute left-0 bottom-10 z-[1000] bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl p-3 shadow-2xl w-64 max-h-60 overflow-y-auto no-scrollbar">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 border-b border-slate-100 dark:border-slate-800/40 pb-1 flex items-center gap-1 ml-0.5">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          Thành viên đóng góp
                        </h4>
                        <div className="space-y-1">
                          {initialContacts.map((contact) => {
                            const isSelected = sharedWith.includes(contact.id);
                            return (
                              <div 
                                key={contact.id} 
                                onClick={() => toggleContactShareLocal(contact.id)}
                                className={`p-1.5 rounded-lg flex items-center gap-2 text-left cursor-pointer transition ${isSelected ? 'bg-indigo-50/45 dark:bg-indigo-950/25 font-semibold' : 'hover:bg-slate-5 transition'}`}
                              >
                                <span className="w-4.5 h-4.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400 text-[8px] font-bold rounded-full flex items-center justify-center shrink-0">
                                  {contact.name.split(' ').pop()?.[0] || 'C'}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] text-slate-700 dark:text-slate-350 truncate">{contact.name}</p>
                                </div>
                                <div className="shrink-0">
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected} 
                                    onChange={() => {}} 
                                    className="w-3 h-3 text-indigo-600 focus:ring-0 rounded"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                    title="Dán link ảnh từ URL"
                    className="px-1 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-800"
                  >
                    URL
                  </button>
                  
                  <button 
                    type="button" 
                    title="Kho lưu trữ" 
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    type="button" 
                    onClick={handleClose} 
                    className="py-1 px-3.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Lưu & Đóng
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between p-3.5 h-12">
              <span className="text-slate-400 text-xs font-bold pl-2">Tạo ghi chú...</span>
              <div className="flex items-center gap-1.5 pr-1">
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChecklist(true);
                    setIsFocused(true);
                  }}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-all"
                  title="Danh sách mới"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFocused(true);
                    setTimeout(() => {
                      fileInputRef.current?.click();
                    }, 50);
                  }}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-all"
                  title="Tải ảnh lên từ máy tính"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

const NotesView: React.FC<{ user: User; onSync?: () => void }> = ({ user, onSync }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [notesActiveTab, setNotesActiveTab] = useState<'notes' | 'tags'>('notes');
  const [isSyncingKeep, setIsSyncingKeep] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sharingNote, setSharingNote] = useState<Note | null>(null);
  const [shareSearchTerm, setShareSearchTerm] = useState('');
  
  const createNoteRef = useRef<CreateNoteHandle>(null);

  useEffect(() => {
    if (!user || user.id.startsWith('user-')) {
      setNotes(mockNotes);
      return;
    }

    const q = query(
      collection(db, 'notes'),
      where('ownerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Note));
      
      if (fetchedNotes.length === 0 && !localStorage.getItem('notes_migrated')) {
        setNotes(mockNotes);
      } else {
        setNotes(fetchedNotes);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notes');
    });

    return () => unsubscribe();
  }, [user?.id]);

  const handleSyncWithKeep = async () => {
    setIsSyncingKeep(true);
    try {
      const token = await getAccessToken(true);
      if (!token) throw new Error("Could not get access token");

      const keepNotes: GoogleKeepNote[] = await fetchGoogleKeepNotes(token);
      
      for (const kNote of keepNotes) {
        if (kNote.trashed) continue;
        
        const content = kNote.text?.text || kNote.body || '';
        let checklist = [];
        if (kNote.list?.listItems) {
           checklist = kNote.list.listItems.map((item) => ({
             item: item.text?.text || '',
             done: item.checked || false
           }));
        }

        const newNoteData = {
          title: kNote.title || 'Keep Note',
          content: content,
          checklist: checklist.length > 0 ? checklist : undefined,
          color: 'default',
          tags: ['Google Keep']
        };

        if (user && !user.id.startsWith('user-')) {
          const q = query(collection(db, 'notes'), where('keepId', '==', kNote.name), where('ownerId', '==', user.id));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            await addDoc(collection(db, 'notes'), {
              title: newNoteData.title || '',
              content: newNoteData.content || '',
              checklist: newNoteData.checklist || [],
              color: newNoteData.color,
              isPinned: false,
              imageUrl: '',
              tags: newNoteData.tags,
              ownerId: user.id,
              keepId: kNote.name,
              createdAt: Date.now()
            });
          } else {
            const docId = snapshot.docs[0].id;
            await updateDoc(doc(db, 'notes', docId), {
              title: newNoteData.title || '',
              content: newNoteData.content || '',
              checklist: newNoteData.checklist || [],
              updatedAt: Date.now()
            });
          }
        }
      }
      showToast('Đã đồng bộ ghi chú từ Google Keep!');
      if (onSync) onSync();
    } catch (err) {
      console.error(err);
      showToast('Đồng bộ thất bại. Kiểm tra kết nối / quyền Keep API.');
    } finally {
      setIsSyncingKeep(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleCopyShareLink = (note: Note) => {
    const title = note.title || 'Ghi chú không tiêu đề';
    const shareUrl = `${window.location.protocol}//${window.location.host}/?shareType=note&shareId=${note.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(`Đã sao chép liên kết ghi chú: "${title}"!`);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`Đã sao chép liên kết ghi chú: "${title}"!`);
    });
  };

  const handleShareNote = (note: Note) => {
    setSharingNote(note);
    setShareSearchTerm('');
  };

  const toggleContactShare = (noteId: string, contactId: string) => {
    const updated = notes.map(note => {
      if (note.id === noteId) {
        const currentShared = note.sharedWith || [];
        const isAlreadyShared = currentShared.includes(contactId);
        const updatedShared = isAlreadyShared
          ? currentShared.filter(id => id !== contactId)
          : [...currentShared, contactId];
        
        const updatedNote = { ...note, sharedWith: updatedShared };
        if (sharingNote && sharingNote.id === noteId) {
          setSharingNote(updatedNote);
        }
        return updatedNote;
      }
      return note;
    });
    setNotes(updated);
  };

  const handleAddNote = async (newNoteData: Partial<Note>) => {
    if (!user || user.id.startsWith('user-')) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        color: newNoteData.color || 'default',
        title: newNoteData.title || undefined,
        content: newNoteData.content || undefined,
        checklist: newNoteData.checklist || undefined,
        imageUrl: newNoteData.imageUrl || undefined,
        tags: newNoteData.tags || undefined,
        isPinned: newNoteData.isPinned || false,
      };
      setNotes(prev => [newNote, ...prev]);
      showToast("Đã lưu ghi chú mới!");
      return;
    }

    try {
      await addDoc(collection(db, 'notes'), {
        title: newNoteData.title || '',
        content: newNoteData.content || '',
        checklist: newNoteData.checklist || [],
        color: newNoteData.color || 'default',
        isPinned: newNoteData.isPinned || false,
        imageUrl: newNoteData.imageUrl || '',
        tags: newNoteData.tags || [],
        ownerId: user.id,
        createdAt: Date.now()
      });
      showToast("Đã lưu ghi chú mới!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notes');
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    if (!user || user.id.startsWith('user-') || updatedNote.id.startsWith('note-')) {
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
      return;
    }

    try {
      const { id, ...data } = updatedNote;
      await updateDoc(doc(db, 'notes', id), {
        title: data.title || '',
        content: data.content || '',
        checklist: data.checklist || [],
        color: data.color || 'default',
        isPinned: data.isPinned || false,
        imageUrl: data.imageUrl || '',
        tags: data.tags || []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notes');
    }
  };
  
  const handleTogglePin = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (!user || user.id.startsWith('user-') || noteId.startsWith('note-')) {
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
      return;
    }

    try {
      await updateDoc(doc(db, 'notes', noteId), {
        isPinned: !note.isPinned
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notes');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
      if (!user || user.id.startsWith('user-') || noteId.startsWith('note-')) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        showToast("Đã xóa ghi chú!");
        return;
      }

      try {
        await deleteDoc(doc(db, 'notes', noteId));
        showToast("Đã xóa ghi chú!");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'notes');
      }
    }
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(t => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.checklist && note.checklist.some(ci => ci.item.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (note.tags && note.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesTag = !activeTag || (note.tags && note.tags.includes(activeTag));

      return !!(matchesSearch && matchesTag);
    });
  }, [notes, searchTerm, activeTag]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  return (
    <StandardPageLayout>
      <PageBanner 
        title="Ghi chú & Sổ tay"
        subtitle="Lưu giữ ý tưởng, lập danh sách công việc và quản lý kiến thức cá nhân một cách thông minh."
        icon={<StickyNote className="w-full h-full text-white" />}
        gradient="from-yellow-500 to-amber-600"
        actions={
          <div className="flex gap-2">
            <button onClick={handleSyncWithKeep} disabled={isSyncingKeep} className={`flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${isSyncingKeep ? 'animate-pulse' : ''}`}>
              <RefreshCw className="w-3.5 h-3.5" /> Đồng bộ Keep
            </button>
            <button onClick={() => { setNotesActiveTab('notes'); setTimeout(() => createNoteRef.current?.focus(), 100); }} className="flex items-center gap-1.5 bg-white text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
              <Plus className="w-3.5 h-3.5" /> Ghi chú mới
            </button>
          </div>
        }
      />

      {/* Pill-style sub-navigation tabs matching the Projects layout */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border overflow-x-auto no-scrollbar mt-6">
        <button
          onClick={() => setNotesActiveTab('notes')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            notesActiveTab === 'notes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <StickyNote className="w-4 h-4" />
          <span>Tất cả Ghi chú</span>
        </button>
        <button
          onClick={() => setNotesActiveTab('tags')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            notesActiveTab === 'tags'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Bộ sưu tập Nhãn ({allTags.length})</span>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {notesActiveTab === 'notes' ? (
          <>
            <ContentCard>
              <CreateNote 
                ref={createNoteRef} 
                onAddNote={handleAddNote} 
              />
            </ContentCard>

            {/* Quick Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm ghi chú theo tiêu đề hoặc nội dung..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>

              {activeTag && (
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 font-bold">Bộ lọc:</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-150">
                    #{activeTag}
                    <button onClick={() => setActiveTag(null)} className="text-indigo-400 hover:text-indigo-600 font-bold">×</button>
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <Pin className="w-4 h-4 text-orange-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Đã ghim</h3>
                  </div>
                  <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 [column-fill:_balance]">
                    {pinnedNotes.map(note => (
                      <div key={note.id} className="break-inside-avoid mb-5">
                        <NoteCard 
                          note={note} 
                          onClick={() => setEditingNote(note)}
                          onTogglePin={() => handleTogglePin(note.id)}
                          onDeleteNote={() => handleDeleteNote(note.id)}
                          onShareNote={() => handleShareNote(note)}
                          onCopyLink={() => handleCopyShareLink(note)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <StickyNote className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Khác</h3>
                  </div>
                )}
                <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 [column-fill:_balance]">
                  {otherNotes.map(note => (
                    <div key={note.id} className="break-inside-avoid mb-5">
                      <NoteCard 
                        note={note} 
                        onClick={() => setEditingNote(note)}
                        onTogglePin={() => handleTogglePin(note.id)}
                        onDeleteNote={() => handleDeleteNote(note.id)}
                        onShareNote={() => handleShareNote(note)}
                        onCopyLink={() => handleCopyShareLink(note)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {filteredNotes.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-gray-100">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Không tìm thấy ghi chú nào</h3>
                  <p className="text-sm text-slate-500 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm theo từ khóa khác nhé.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ContentCard>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Thư mục nhãn</h3>
                    <p className="text-[10px] text-slate-500">Chọn một nhãn để xem các ghi chú tương ứng.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTag(null)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${!activeTag ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                    >
                      Tất cả nhãn
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTag === tag ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {allTags.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Chưa có nhãn ghi chú nào được tạo.</p>
                  )}

                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tính năng khác</h4>
                    <button 
                      onClick={handleSyncWithKeep} 
                      disabled={isSyncingKeep}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingKeep ? 'animate-spin' : ''}`} />
                      Đồng bộ Google Keep
                    </button>
                  </div>
                </div>
              </ContentCard>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Danh sách ghi chú: {activeTag ? `#${activeTag}` : 'Tất cả nhãn'}
                </h3>
                <span className="text-xs text-slate-500 font-medium">Tìm thấy {filteredNotes.length} ghi chú</span>
              </div>

              <div className="columns-1 sm:columns-2 gap-5 [column-fill:_balance]">
                {filteredNotes.map(note => (
                  <div key={note.id} className="break-inside-avoid mb-5">
                    <NoteCard 
                      note={note} 
                      onClick={() => setEditingNote(note)}
                      onTogglePin={() => handleTogglePin(note.id)}
                      onDeleteNote={() => handleDeleteNote(note.id)}
                      onShareNote={() => handleShareNote(note)}
                      onCopyLink={() => handleCopyShareLink(note)}
                    />
                  </div>
                ))}
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-850/30 rounded-3xl border border-gray-100 dark:border-slate-800 border-dashed">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-gray-100 dark:border-slate-800">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Không tìm thấy ghi chú nào</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-450 mt-2">Hãy tạo ghi chú mới hoặc chọn một nhãn khác.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <CreateNote 
              onAddNote={(updatedData) => {
                handleUpdateNote({ ...editingNote, ...updatedData });
                setEditingNote(null);
              }}
              onCloseModal={() => setEditingNote(null)}
              isModal={true}
              ref={null}
            />
          </div>
        </div>
      )}

      {/* Share Note Modal */}
      {sharingNote && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Chia sẻ ghi chú</h3>
                <button onClick={() => setSharingNote(null)} className="p-2 hover:bg-gray-100 rounded-xl text-slate-400 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{sharingNote.title || sharingNote.content}</p>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={shareSearchTerm}
                  onChange={(e) => setShareSearchTerm(e.target.value)}
                  placeholder="Tìm thành viên..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                {initialContacts.filter(c => c.name.toLowerCase().includes(shareSearchTerm.toLowerCase())).map(contact => {
                  const isShared = sharingNote.sharedWith?.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleContactShare(sharingNote.id, contact.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${isShared ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {contact.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 tracking-tight">{contact.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{contact.role}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isShared ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200'}`}>
                        {isShared && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <button onClick={() => handleCopyShareLink(sharingNote)} className="flex items-center gap-2 text-indigo-600 text-xs font-bold hover:underline">
                <Link className="w-4 h-4" /> Sao chép liên kết
              </button>
              <button onClick={() => setSharingNote(null)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
      
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[2000] animate-fade-in-up">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">{toastMessage}</span>
          </div>
        </div>
      )}
    </StandardPageLayout>
  );
};

export default NotesView;
