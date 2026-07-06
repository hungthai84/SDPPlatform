import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  RefreshCw, 
  MapPin, 
  Video, 
  Plus, 
  X, 
  List, 
  Sparkles, 
  Globe, 
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import { CalendarEvent } from './CalendarView';
import { mockTaskLists } from './TasklistView';
import { initialContacts } from './ContactsView';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'color'> & { id?: string }) => void;
  initialEvent?: CalendarEvent;
  defaultTitle?: string;
}

const companyMeetingRooms = [
  'Phòng họp Alpha (Tầng 1)',
  'Phòng họp Beta (Tầng 2 - Lớn)',
  'Phòng họp Gamma (Tầng 3 - Kỹ thuật)',
  'Phòng họp Delta (Tầng 4)',
  'Phòng Hội nghị lớn (Tầng G)',
];

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, initialEvent, defaultTitle }) => {
  const [title, setTitle] = useState(initialEvent?.title || defaultTitle || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(
    initialEvent?.date 
      ? new Date(initialEvent.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '10:00');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(
    initialEvent?.recurrence || 'none'
  );

  // Error validation state
  const [error, setError] = useState<string | null>(null);

  // New features states
  const [guests, setGuests] = useState<string[]>(initialEvent?.guests || []);
  const [guestInput, setGuestInput] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [listId, setListId] = useState(initialEvent?.listId || '');
  const [locationType, setLocationType] = useState<'offline' | 'online'>(
    initialEvent?.locationType || 'offline'
  );
  const [meetingRoom, setMeetingRoom] = useState(
    initialEvent?.meetingRoom || companyMeetingRooms[0]
  );
  const [onlineLink, setOnlineLink] = useState(
    initialEvent?.onlineLink || 'https://meet.google.com/abc-defg-hij'
  );
  const [onlineNotes, setOnlineNotes] = useState(
    initialEvent?.onlineNotes || ''
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter contacts based on guestInput
  const suggestedContacts = initialContacts.filter((contact) => {
    const query = guestInput.toLowerCase().trim();
    if (!query) return false;
    
    // Check if contact already added
    const isAlreadyAdded = guests.some(
      (g) => g.toLowerCase() === contact.email.toLowerCase() || g.toLowerCase() === contact.name.toLowerCase()
    );
    if (isAlreadyAdded) return false;

    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  });

  const handleAddGuest = (guest: string) => {
    const cleanGuest = guest.trim();
    if (!cleanGuest) return;
    
    if (!guests.some((g) => g.toLowerCase() === cleanGuest.toLowerCase())) {
      setGuests([...guests, cleanGuest]);
    }
    setGuestInput('');
    setShowContactDropdown(false);
  };

  const handleRemoveGuest = (indexToRemove: number) => {
    setGuests(guests.filter((_, idx) => idx !== indexToRemove));
  };

  const handleGuestInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (guestInput.trim()) {
        handleAddGuest(guestInput.trim());
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề sự kiện.");
      return;
    }
    setError(null);
    onSave({
      id: initialEvent?.id,
      title: title.trim(),
      description: description.trim(),
      date: new Date(date + 'T00:00:00'), // Adjust for timezone
      startTime,
      endTime,
      recurrence,
      guests,
      listId,
      locationType,
      meetingRoom: locationType === 'offline' ? meetingRoom : undefined,
      onlineLink: locationType === 'online' ? onlineLink : undefined,
      onlineNotes: locationType === 'online' ? onlineNotes : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 overflow-y-auto" aria-modal="true" role="dialog">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <motion.form 
        onSubmit={handleSave}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-3xl max-h-[85vh] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-2xl flex flex-col my-auto overflow-hidden z-10"
      >
        
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-[10px]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
              {initialEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all" 
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 select-none no-scrollbar">
          
          {/* Validation Alert */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-[10px] border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiêu đề sự kiện *</label>
            <input 
              type="text" 
              placeholder="Nhập tiêu đề cuộc họp, sự kiện..."
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              required
              className="w-full text-sm font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[10px] py-2 px-3 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Time Picker Row */}
          <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800/60 rounded-[12px] space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Thời gian & Ngày diễn ra</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Ngày sự kiện</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Thời gian bắt đầu</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Thời gian kết thúc</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Select List Feature */}
          <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800/60 rounded-[12px] space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <List className="w-4 h-4 text-indigo-500" />
              <span>Gắn vào list công việc</span>
            </div>
            
            <select
              value={listId}
              onChange={e => setListId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="">-- Không gắn vào danh sách công việc --</option>
              {mockTaskLists.map(list => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.tasks.length} công việc)
                </option>
              ))}
            </select>
          </div>

          {/* Location tab and selector feature */}
          <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800/60 rounded-[12px] space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Phương thức địa điểm</span>
              </span>
              
              {/* Type Switcher tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-[10px]">
                <button
                  type="button"
                  onClick={() => setLocationType('offline')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-[8px] flex items-center gap-1 transition-all ${locationType === 'offline' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Trực tiếp
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('online')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-[8px] flex items-center gap-1 transition-all ${locationType === 'online' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Trực tuyến (Online)
                </button>
              </div>
            </div>

            {/* Render conditional inputs */}
            {locationType === 'offline' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500">Phòng họp công ty *</label>
                <select
                  value={meetingRoom}
                  onChange={e => setMeetingRoom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-200 font-medium"
                >
                  {companyMeetingRooms.map((room) => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">Chọn một trong những phòng thực tế có sẵn của công ty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 block">Đường link họp trực tuyến *</label>
                  <div className="relative">
                    <input
                      type="url"
                      required={locationType === 'online'}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={onlineLink}
                      onChange={e => setOnlineLink(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-indigo-600 dark:text-indigo-400"
                    />
                    <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 block">Ghi chú họp trực tuyến</label>
                  <input
                    type="text"
                    placeholder="Mật khẩu phòng, hướng dẫn chuẩn bị..."
                    value={onlineNotes}
                    onChange={e => setOnlineNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Add Guests from Contacts */}
          <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800/60 rounded-[12px] space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Khách mời (Từ danh bạ hoặc bên ngoài)</span>
            </div>

            <div className="relative" ref={dropdownRef}>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nhập tên, email danh bạ hoặc gõ email bên ngoài..."
                  value={guestInput}
                  onChange={e => {
                    setGuestInput(e.target.value);
                    setShowContactDropdown(true);
                  }}
                  onFocus={() => setShowContactDropdown(true)}
                  onKeyDown={handleGuestInputKeyDown}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => handleAddGuest(guestInput)}
                  disabled={!guestInput.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold rounded-[10px] text-[11px] transition-colors flex items-center gap-1 shrink-0 active:scale-95 duration-75"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showContactDropdown && suggestedContacts.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-xl z-30 max-h-48 overflow-y-auto py-1">
                  <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">Được gợi ý từ Danh bạ</div>
                  {suggestedContacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleAddGuest(contact.name || contact.email)}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 flex items-center gap-2 transition-colors group"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {contact.name ? contact.name.charAt(0) : '@'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{contact.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">{contact.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Badges of added guests */}
            {guests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {guests.map((g, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 py-0.5 pl-2 pr-1 rounded-full text-[11px] font-medium"
                  >
                    <span className="truncate max-w-40">{g}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGuest(idx)}
                      className="p-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">Chưa có khách mời nào được thêm vào cuộc họp.</p>
            )}
          </div>

          {/* Sync recurrence option */}
          <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800/60 rounded-[12px] space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 text-indigo-500" />
              <span>Chu kỳ lặp lại</span>
            </div>
            
            <select 
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly')}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-xs rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="none">Sự kiện một lần (Không lặp lại)</option>
              <option value="daily">Mỗi ngày</option>
              <option value="weekly">Mỗi tuần</option>
              <option value="monthly">Mỗi tháng</option>
              <option value="yearly">Mỗi năm</option>
            </select>
          </div>

          {/* Description field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nội dung chi tiết cuộc họp</label>
            <textarea
              placeholder="Nhập ghi chú thêm hoặc chương trình cuộc họp..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-white dark:bg-slate-950 p-2 rounded-[10px] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs text-slate-700 dark:text-slate-200 resize-y"
            />
          </div>

        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0 bg-white dark:bg-slate-900">
          <button 
            type="button" 
            onClick={onClose} 
            className="py-1.5 px-4 rounded-[10px] text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            className="py-1.5 px-5 bg-indigo-600 text-white font-bold rounded-[10px] hover:bg-indigo-700 transition-all shadow-xs text-xs"
          >
            {initialEvent ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}
          </button>
        </footer>

      </motion.form>
    </div>
  );
};

export default EventModal;

