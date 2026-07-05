import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, PlusIcon, SyncIcon, CheckCircleIcon, CalendarIcon } from './icons';
import { useLanguage } from './LanguageContext';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import MeetingView from './MeetingView';
import { User, RecentItem } from '../types';
import { mockTaskLists } from './TasklistView';
import { MapPin, Video as LucideVideo, List as LucideList } from 'lucide-react';
import { getAccessToken } from '../firebase';

export interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    color: 'blue' | 'orange' | 'red' | 'green';
    isGoogleEvent?: boolean;
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    guests?: string[];
    listId?: string;
    locationType?: 'offline' | 'online';
    meetingRoom?: string;
    onlineLink?: string;
    onlineNotes?: string;
}

export const mockEvents: CalendarEvent[] = [
    { id: 'evt1', date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), title: 'Project Alpha Kick-off', startTime: '09:00', endTime: '10:00', color: 'blue' },
    { id: 'evt2', date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), title: 'Review OKR Q3', startTime: '14:00', endTime: '15:00', color: 'orange' },
    { id: 'evt3', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), title: 'HR Training Session', startTime: '10:00', endTime: '12:00', color: 'red' },
    { id: 'evt4', date: new Date(new Date().getFullYear(), new Date().getMonth(), 22), title: 'Design Sprint Week', startTime: '09:00', endTime: '17:00', color: 'blue' },
    { id: 'evt5', date: new Date(new Date().getFullYear(), new Date().getMonth(), 23), title: 'Team Building Event', startTime: '13:00', endTime: '18:00', color: 'red' },
];

interface CalendarViewProps {
    user: User;
    events: CalendarEvent[];
    onSaveEvent: (event: Omit<CalendarEvent, 'id' | 'color'> & { id?: string; color?: CalendarEvent['color'] }) => void;
    onEditEvent: (event: CalendarEvent) => void;
    onOpenModal: () => void;
    onItemViewed: (item: RecentItem) => void;
}

interface GoogleCalendarItem {
    id: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
    summary?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user, events, onSaveEvent, onEditEvent, onOpenModal, onItemViewed }) => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'meetings'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
    const { language, t } = useLanguage();

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const placeholderDays = Array.from({ length: startDayOfWeek });

    const weekDays = useMemo(() => {
        const formatter = new Intl.DateTimeFormat(language, { weekday: 'short' });
        return Array.from(Array(7).keys()).map(day => 
            formatter.format(new Date(Date.UTC(2021, 5, day)))
        );
    }, [language]);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
        setExpandedDays(new Set());
    };
    
    const handleDayClick = (day: number) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    const toggleExpandDay = (e: React.MouseEvent, day: number) => {
        e.stopPropagation();
        setExpandedDays(prev => {
            const newSet = new Set(prev);
            if (newSet.has(day)) {
                newSet.delete(day);
            } else {
                newSet.add(day);
            }
            return newSet;
        });
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage(t('syncing'));
        
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("No token available");
            
            const timeMin = new Date();
            timeMin.setMonth(timeMin.getMonth() - 1);
            
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&maxResults=50&singleEvents=true&orderBy=startTime`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if(!response.ok) throw new Error('Failed to fetch calendar');
            const data = await response.json();
            
            if (data.items) {
                 const newGoogleEvents: CalendarEvent[] = data.items.map((item: GoogleCalendarItem) => {
                     const start = item.start?.dateTime || item.start?.date;
                     const end = item.end?.dateTime || item.end?.date;
                     const startDate = new Date(start);
                     return {
                         id: item.id || `google-evt-${Date.now()}-${Math.random()}`,
                         date: startDate,
                         title: item.summary || 'Trống',
                         startTime: `${startDate.getHours().toString().padStart(2,'0')}:${startDate.getMinutes().toString().padStart(2,'0')}`,
                         endTime: end ? `${new Date(end).getHours().toString().padStart(2,'0')}:${new Date(end).getMinutes().toString().padStart(2,'0')}` : '23:59',
                         color: 'blue',
                         isGoogleEvent: true,
                         description: item.description,
                         locationType: item.hangoutLink ? 'online' : (item.location ? 'offline' : undefined),
                         onlineLink: item.hangoutLink,
                         meetingRoom: item.location
                     };
                 });
                 newGoogleEvents.forEach(evt => onSaveEvent(evt));
            }

            setSyncMessage(t('syncSuccess'));
        } catch(e) {
            console.error("Calendar Sync error", e);
            setSyncMessage(t('syncError') || 'Lỗi đồng bộ. Vui lòng thử lại.');
        } finally {
            setIsSyncing(false);
            setTimeout(() => setSyncMessage(''), 3000);
        }
    };

    const doesEventOccurOnDate = (event: CalendarEvent, targetDate: Date) => {
        const eventDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());
        const queryDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        
        if (queryDate < eventDate) return false;
        if (!event.recurrence || event.recurrence === 'none') {
            return queryDate.getTime() === eventDate.getTime();
        }
        if (event.recurrence === 'daily') return true;
        if (event.recurrence === 'weekly') return queryDate.getDay() === eventDate.getDay();
        if (event.recurrence === 'monthly') return queryDate.getDate() === eventDate.getDate();
        if (event.recurrence === 'yearly') return queryDate.getDate() === eventDate.getDate() && queryDate.getMonth() === eventDate.getMonth();
        return false;
    };

    const eventsForSelectedDay = useMemo(() => {
        return events
            .filter(e => doesEventOccurOnDate(e, selectedDate))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [events, selectedDate]);

    return (
        <StandardPageLayout>
            <PageBanner 
                title={t('calendarTitle') || "Lịch biểu & Cuộc hẹn"}
                subtitle={t('calendarSubtitle') || "Quản lý thời gian, sắp xếp lịch họp và tối ưu hóa hiệu suất làm việc hàng ngày của Anh."}
                icon={<CalendarIcon className="w-full h-full" />}
                gradient="from-blue-400 to-indigo-600"
                actions={
                    <>
                        <div className="flex bg-white/10 p-1 rounded-xl shadow-sm border border-white/20 mr-2">
                            <button 
                                onClick={() => setActiveTab('calendar')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}
                            >
                                {t('calendar')}
                            </button>
                            <button 
                                onClick={() => setActiveTab('meetings')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'meetings' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}
                            >
                                {t('meeting')}
                            </button>
                        </div>
                        <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                            <SyncIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> {t('sync')}
                        </button>
                        <button onClick={onOpenModal} className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                            <PlusIcon className="w-4 h-4" /> {t('newEvent') || 'Sự kiện mới'}
                        </button>
                    </>
                }
            />

            <ContentCard>
                {activeTab === 'meetings' ? (
                    <MeetingView user={user} onItemViewed={onItemViewed} isEmbedded={true} />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Calendar Main Section */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                        {currentDate.toLocaleString(language, { month: 'long' })} {currentDate.getFullYear()}
                                    </h2>
                                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-white transition-all"><ChevronLeftIcon className="w-4 h-4 text-slate-500" /></button>
                                        <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-white rounded-lg transition-all">{t('today')}</button>
                                        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-white transition-all"><ChevronLeftIcon className="w-4 h-4 text-slate-500 rotate-180" /></button>
                                    </div>
                                </div>
                                {syncMessage && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 animate-fade-in">
                                        <CheckCircleIcon className="w-3 h-3" /> {syncMessage}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                                {weekDays.map(day => (
                                    <div key={day} className="bg-gray-50 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                                ))}
                                {placeholderDays.map((_, i) => <div key={`p-${i}`} className="bg-white min-h-[100px] lg:min-h-[140px] opacity-40"></div>)}
                                {monthDays.map(day => {
                                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    const isToday = new Date().toDateString() === date.toDateString();
                                    const isSelected = selectedDate.toDateString() === date.toDateString();
                                    const dailyEvents = events.filter(e => doesEventOccurOnDate(e, date));
                                    const isExpanded = expandedDays.has(day);
                                    return (
                                        <button 
                                            key={day} 
                                            onClick={() => handleDayClick(day)} 
                                            className={`bg-white p-2 min-h-[100px] lg:min-h-[140px] flex flex-col gap-1.5 text-left transition-all hover:bg-blue-50/30 relative group ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/20' : ''}`}
                                        >
                                            <span className={`inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-xl transition-all ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : isSelected ? 'text-blue-600' : 'text-slate-700'}`}>{day}</span>
                                            <div className="flex flex-col gap-1">
                                                {dailyEvents.slice(0, isExpanded ? dailyEvents.length : 3).map((event, i) => (
                                                    <div 
                                                        key={i} 
                                                        onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                                                        className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-white truncate shadow-sm transition-all hover:scale-105 active:scale-95 bg-${event.color}-500`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dailyEvents.length > 3 && (
                                                    <div onClick={(e) => toggleExpandDay(e, day)} className="text-[9px] font-bold text-slate-400 hover:text-blue-600 mt-1 cursor-pointer">
                                                        {isExpanded ? t('collapse') || 'Thu gọn' : `+ ${dailyEvents.length - 3} ${t('more') || 'thêm'}`}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Event Details Section */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4">
                                    {selectedDate.toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                
                                {eventsForSelectedDay.length > 0 ? (
                                    <div className="space-y-3">
                                        {eventsForSelectedDay.map(event => {
                                            const matchedList = mockTaskLists.find(l => l.id === event.listId);
                                            return (
                                                <div 
                                                    key={event.id} 
                                                    onClick={() => onEditEvent(event)}
                                                    className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full bg-${event.color}-500 shrink-0 shadow-sm`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{event.title}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{event.startTime} - {event.endTime}</p>
                                                        </div>
                                                    </div>

                                                    {(event.locationType || matchedList) && (
                                                        <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
                                                            {event.locationType === 'online' && (
                                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold border border-blue-100">
                                                                    <LucideVideo className="w-3 h-3" /> Online
                                                                </div>
                                                            )}
                                                            {event.locationType === 'offline' && (
                                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-bold border border-emerald-100">
                                                                    <MapPin className="w-3 h-3" /> {event.meetingRoom || t('meetingRoom') || 'Phòng họp'}
                                                                </div>
                                                            )}
                                                            {matchedList && (
                                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-bold border border-purple-100">
                                                                    <LucideList className="w-3 h-3" /> {matchedList.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-200 border border-gray-100">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('noEventsScheduled')}</p>
                                    </div>
                                )}
                            </div>

                            <button onClick={onOpenModal} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                                <PlusIcon className="w-4 h-4" /> {t('newEvent') || 'Tạo sự kiện mới'}
                            </button>
                        </div>
                    </div>
                )}
            </ContentCard>
        </StandardPageLayout>
    );
};

export default CalendarView;
