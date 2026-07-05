import React, { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';
import EmailClient from './components/EmailClient';
import CalendarView, { CalendarEvent, mockEvents } from './components/CalendarView';
import ChatView from './components/ChatView';
import NotesView from './components/NotesView';
import TasklistView from './components/TasklistView';
import ContactsView from './components/ContactsView';
import MeetingView from './components/MeetingView';
import DriveView from './components/DriveView';
import BlogView from './components/BlogView';
import NewsfeedView from './components/NewsfeedView';
import AiChatWidget from './components/AiChatWidget';
import { LanguageProvider } from './components/LanguageContext';
import NewBlogPostView from './components/NewBlogPostView';
import BlogArticleView from './components/BlogArticleView';
import TaskView from './components/TaskView';
import TrainingDashboardView from './components/TrainingDashboardView';
import ClassDetailView from './components/ClassDetailView';
import SettingsView from './components/SettingsView';
import CheckInView from './components/CheckInView';
import UserManagementView from './components/UserManagementView';
import OrgChartView from './components/OrgChartView';
import RequestsView from './components/RequestsView';
import WebsiteDataView from './components/WebsiteDataView';
import ProjectManagementView from './components/ProjectManagementView';
import ProcessWorkflowView from './components/ProcessWorkflowView';
import CommandPalette from './components/CommandPalette';
import { FolderIcon, StickyNoteIcon, ChecklistIcon, MailIcon, CalendarIcon, GraduationCapIcon, BloggerIcon, ChatIcon, VideoIcon } from './components/icons';
import EventModal from './components/EventModal';
import MobileBottomNav from './components/MobileBottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, getAccessToken } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import NotificationToast from './components/NotificationToast';
import { handleFirestoreError, OperationType } from './firebase-errors';
import { User, View, ServiceName, ServiceState, CheckInEntry, RecentItem, ActivityItem, AppNotification } from './types';


const mockUsers: User[] = [
    { id: 'user-1', name: 'Hung Thai', email: 'hungthai84@gmail.com', role: 'superadmin', avatar: 'https://i.pravatar.cc/150?u=8', phoneNumber: '0901234567' },
    { id: 'user-admin', name: 'Trí Nhân', email: 'trinhan.virtual@gmail.com', role: 'superadmin', avatar: 'https://i.pravatar.cc/150?u=10' },
    { id: 'user-2', name: 'Lê Thị Bình', email: 'binh.le@company.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=2', phoneNumber: '0912345678' },
    { id: 'user-3', name: 'Phạm Minh Cường', email: 'cuong.pham@company.com', role: 'member', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 'user-4', name: 'Vũ Thị Dung', email: 'dung.vu@company.com', role: 'member', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 'user-5', name: 'Hoàng Văn Em', email: 'em.hoang@company.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 'user-an', name: 'Trần Văn An', email: 'an.tran@company.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=1' },
];

const mockActivityLog: ActivityItem[] = [
    { id: 'act-1', user: { name: 'Vũ Thị Dung', avatar: 'https://i.pravatar.cc/150?u=4' }, action: 'task_complete', target: 'Test A/B trang giá', timestamp: '5m ago' },
    { id: 'act-2', user: { name: 'Phạm Minh Cường', avatar: 'https://i.pravatar.cc/150?u=3' }, action: 'file_edit', target: 'Báo cáo tiến độ.pdf', timestamp: '25m ago' },
    { id: 'act-3', user: { name: 'Lê Thị Bình', avatar: 'https://i.pravatar.cc/150?u=2' }, action: 'comment_added', target: 'Ý tưởng chiến dịch CSKH 2025', timestamp: '1h ago' },
    { id: 'act-4', user: { name: 'Hoàng Văn Em', avatar: 'https://i.pravatar.cc/150?u=5' }, action: 'meeting_scheduled', target: 'Demo sản phẩm cho Đối tác Acme Inc.', timestamp: '3h ago' },
    { id: 'act-5', user: { name: 'Trần Văn An', avatar: 'https://i.pravatar.cc/150?u=1' }, action: 'login', target: 'system', timestamp: '8h ago' },
    { id: 'act-6', user: { name: 'Vũ Thị Dung', avatar: 'https://i.pravatar.cc/150?u=4' }, action: 'file_edit', target: 'Wireframes.png', timestamp: '1d ago' },
];


const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockUsers[1]);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  // Listen for all users
  React.useEffect(() => {
    // We can still listen for users if needed, but we don't block the app
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      if (usersFromDb.length > 0) {
        setAllUsers(prev => {
            const merged = [...prev];
            let hasChanges = false;
            usersFromDb.forEach(dbUser => {
                const idx = merged.findIndex(u => u.id === dbUser.id || u.email.toLowerCase() === dbUser.email.toLowerCase());
                if (idx !== -1) {
                    // Check if actually changed to avoid unnecessary re-renders
                    const existing = merged[idx];
                    if (existing.role !== dbUser.role || existing.name !== dbUser.name || existing.avatar !== dbUser.avatar) {
                        merged[idx] = { ...existing, ...dbUser };
                        hasChanges = true;
                    }
                } else {
                    merged.push(dbUser);
                    hasChanges = true;
                }
            });
            return hasChanges ? merged : prev;
        });
      }
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return () => unsubscribe();
  }, [user?.id]);

  const [isLeftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  
  // Auth listener disabled as login is bypassed

  // Current User Profile Listener
  React.useEffect(() => {
    if (!user || user.id.startsWith('user-')) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const profileData = docSnapshot.data() as User;
        setUser(prev => {
          if (!prev) return profileData;
          // Only update if key fields changed to avoid unnecessary re-renders from metadata/timestamp updates
          if (prev.role === profileData.role && prev.name === profileData.name && prev.avatar === profileData.avatar && prev.email === profileData.email) {
            return prev;
          }
          return { ...prev, ...profileData };
        });
      }
    });
    return () => unsubscribe();
  }, [user?.id]);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [isAiWidgetOpen, setAiWidgetOpen] = useState(false);
  const [activeTaskListId, setActiveTaskListId] = useState<string | undefined>(undefined);
  const [checkInLog, setCheckInLog] = useState<CheckInEntry[]>([]);
  const [activityLog] = useState<ActivityItem[]>(mockActivityLog);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);
  
  React.useEffect(() => {
    if (!user || user.id.startsWith('user-')) return;
    
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifs = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as AppNotification));
      setNotifications(allNotifs);

      if (!isInitialLoad) {
        const newToasts: AppNotification[] = [];
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const data = change.doc.data() as AppNotification;
                newToasts.push({ ...data, id: change.doc.id });
            }
        });
        if (newToasts.length > 0) {
            setActiveToasts(prev => [...prev, ...newToasts]);
        }
      }
      isInitialLoad = false;
    }, (error) => {
       handleFirestoreError(error, OperationType.LIST, 'notifications');
    });

    return () => unsubscribe();
  }, [user?.id]);

  const handleCloseToast = (id: string) => {
      setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToastClick = async (notif: AppNotification) => {
      handleCloseToast(notif.id);
      if (!notif.read) {
          if (user?.id === 'user-1' || notif.id.startsWith('demo-')) {
             setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
          } else {
              try {
                  await updateDoc(doc(db, 'notifications', notif.id), { read: true });
              } catch(e) {
                  console.error(e);
              }
          }
      }
      if (notif.link) {
          // Parse link and navigate
          // e.g., 'tasks', 'projects', etc.
          setActiveView(notif.link as View);
      }
  };

  // Mobile state
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobileActivityOpen, setMobileActivityOpen] = useState(false);

  // Global Modal States
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultEventTitle, setDefaultEventTitle] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  React.useEffect(() => {
    if (!user || user.id.startsWith('user-')) {
        setEvents(mockEvents);
        return;
    }

    const q = query(
        collection(db, 'events'),
        where('ownerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedEvents = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: new Date(data.date) // Convert timestamp number to Date object
            } as CalendarEvent;
        });
        
        if (fetchedEvents.length === 0) {
            setEvents(mockEvents);
        } else {
            setEvents(fetchedEvents);
        }
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'events');
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>((localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'cyan');
  const [wallpaper, setWallpaper] = useState<{ type: string; value: string }>(
      JSON.parse(localStorage.getItem('wallpaperSettings') || '{"type":"none","value":""}')
  );

  const [sidebarOpacity, setSidebarOpacity] = useState<number>(() => {
    return Number(localStorage.getItem('sidebarOpacity') || '90');
  });
  const [cardOpacity, setCardOpacity] = useState<number>(() => {
    return Number(localStorage.getItem('cardOpacity') || '95');
  });

  React.useEffect(() => {
    localStorage.setItem('sidebarOpacity', sidebarOpacity.toString());
  }, [sidebarOpacity]);

  React.useEffect(() => {
    localStorage.setItem('cardOpacity', cardOpacity.toString());
  }, [cardOpacity]);

  const borderColors = [
    'border-[#4f46e5]', // Indigo
    'border-[#06b6d4]', // Cyan
    'border-[#ec4899]', // Pink
    'border-[#f97316]', // Orange
    'border-[#10b981]', // Emerald
    'border-[#8b5cf6]', // Purple
    'border-[#eab308]', // Yellow
    'border-[#3b82f6]', // Blue
  ];
  const [borderColorIndex, setBorderColorIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setBorderColorIndex((prev) => (prev + 1) % borderColors.length);
    }, 60000); // 1 minute
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    const doc = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      doc.classList.add('dark');
    } else {
      doc.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.setAttribute('data-accent-color', accentColor);
  }, [accentColor]);

  React.useEffect(() => {
    localStorage.setItem('wallpaperSettings', JSON.stringify(wallpaper));
    const body = document.body;
    
    // Clear previous background styles
    body.style.backgroundImage = '';
    body.style.backgroundColor = '';
    body.style.background = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundRepeat = '';
    
    // Remove old video background if it exists
    const oldVideo = document.getElementById('wallpaper-video');
    if (oldVideo) {
      oldVideo.remove();
    }
    
    if (wallpaper.type === 'image') {
        body.style.backgroundImage = `url(${wallpaper.value})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
    } else if (wallpaper.type === 'gradient' || wallpaper.type === 'pattern') {
        body.style.background = wallpaper.value;
        if (wallpaper.type === 'pattern' && wallpaper.bgColor) {
             body.style.backgroundColor = wallpaper.bgColor;
             body.style.backgroundSize = wallpaper.size || 'auto';
        }
    } else if (wallpaper.type === 'video') {
        // Create a video element behind everything
        const video = document.createElement('video');
        video.id = 'wallpaper-video';
        video.src = wallpaper.value;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.objectFit = 'cover';
        video.style.zIndex = '-1';
        if (wallpaper.thumbnail) {
            video.poster = wallpaper.thumbnail;
        }
        document.body.appendChild(video);
    }
  }, [wallpaper]);

  const handleItemViewed = React.useCallback((item: RecentItem) => {
    setRecentlyViewed(prev => {
        const filtered = prev.filter(i => i.id !== item.id);
        const newRecentList = [item, ...filtered].slice(0, 5); // Limit to 5
        return newRecentList;
    });
  }, []);


  const [services, setServices] = useState<ServiceState[]>([
      { id: 'Drive', name: 'Lưu trữ', icon: <FolderIcon />, isConnected: true, isSyncEnabled: true, lastSync: '10 phút trước', storageUsage: '4.2 GB / 15 GB' },
      { id: 'Calendar', name: 'Lịch Google', icon: <CalendarIcon />, isConnected: true, isSyncEnabled: true, lastSync: '1 giờ trước' },
      { id: 'Gmail', name: 'Gmail', icon: <MailIcon />, isConnected: true, isSyncEnabled: false, lastSync: 'Vừa xong', storageUsage: '1.5 GB' },
      { id: 'Keep', name: 'Ghi chú Keep', icon: <StickyNoteIcon />, isConnected: true, isSyncEnabled: true, lastSync: '30 phút trước' },
      { id: 'Tasks', name: 'Việc cần làm (Tasks)', icon: <ChecklistIcon />, isConnected: false, isSyncEnabled: false },
      { id: 'Classroom', name: 'Lớp học Classroom', icon: <GraduationCapIcon />, isConnected: true, isSyncEnabled: false },
      { id: 'Blogger', name: 'Blog Blogger', icon: <BloggerIcon />, isConnected: true, isSyncEnabled: true },
      { id: 'Chat', name: 'Trao đổi Chat', icon: <ChatIcon />, isConnected: true, isSyncEnabled: true },
      { id: 'Meet', name: 'Cuộc họp Meet', icon: <VideoIcon />, isConnected: true, isSyncEnabled: true },
  ]);

  const handleToggleSync = (id: ServiceName) => {
      setServices(services.map(s => s.id === id ? { ...s, isSyncEnabled: !s.isSyncEnabled } : s));
  };

  const handleToggleConnection = async (id: ServiceName) => {
      const service = services.find(s => s.id === id);
      if (!service) return;

      if (!service.isConnected) {
          // Connecting
          if (['Drive', 'Calendar', 'Gmail', 'Keep', 'Tasks', 'Classroom', 'Blogger', 'Chat', 'Meet'].includes(id)) {
              try {
                  const token = await getAccessToken(true);
                  if (!token) throw new Error("Chưa kết nối");
                  
                  setServices(services.map(s => s.id === id ? { ...s, isConnected: true, isSyncEnabled: true } : s));
              } catch (error) {
                  console.error(`Failed to connect to ${id}:`, error);
                  alert(`Không thể kết nối với ${id}. Vui lòng thử lại.`);
              }
          } else {
              setServices(services.map(s => s.id === id ? { ...s, isConnected: true } : s));
          }
      } else {
          // Disconnecting
          setServices(services.map(s => s.id === id ? { ...s, isConnected: false, isSyncEnabled: false } : s));
      }
  };

  const getLocationName = (coords: GeolocationCoordinates): Promise<string> => {
    return new Promise(async (resolve) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        resolve(data.display_name || 'Unknown location');
      } catch (error) {
        console.error('Error fetching location name:', error);
        resolve('Location unavailable');
      }
    });
  };

  const handleCheckIn = () => {
    const doCheckIn = (locationName: string) => {
      const newEntry: CheckInEntry = {
        id: Date.now(),
        checkInTime: new Date(),
        checkInLocation: locationName,
      };
      setCheckInLog(prevLog => [...prevLog, newEntry]);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationName = await getLocationName(position.coords);
          doCheckIn(locationName);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          doCheckIn("Vị trí không xác định (Lỗi đăng ký quyền)");
        }
      );
    } else {
      doCheckIn("Vị trí không xác định");
    }
  };

  const handleCheckOut = () => {
    const doCheckOut = (locationName: string) => {
      setCheckInLog(prevLog => {
        const newLog = [...prevLog];
        const lastEntry = newLog.find(entry => !entry.checkOutTime);
        if (lastEntry) {
          lastEntry.checkOutTime = new Date();
          lastEntry.checkOutLocation = locationName;
        }
        return newLog;
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationName = await getLocationName(position.coords);
          doCheckOut(locationName);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          doCheckOut("Vị trí không xác định (Lỗi đăng ký quyền)");
        }
      );
    } else {
      doCheckOut("Vị trí không xác định");
    }
  };

  const handleUsersChange = React.useCallback((updatedUsers: User[]) => {
    setAllUsers(prev => {
        if (JSON.stringify(prev) === JSON.stringify(updatedUsers)) return prev;
        return updatedUsers;
    });
    if (user?.id) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === user.id);
        if (updatedCurrentUser) {
            setUser(prev => {
                if (!prev) return updatedCurrentUser;
                // Deeper check for stability
                if (prev.role === updatedCurrentUser.role && prev.name === updatedCurrentUser.name && prev.email === updatedCurrentUser.email && prev.avatar === updatedCurrentUser.avatar) {
                    return prev;
                }
                return { ...prev, ...updatedCurrentUser };
            });
        }
    }
  }, [user?.id]);

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'color'> & { id?: string; color?: CalendarEvent['color'] }) => {
      const currentUser = auth.currentUser;
      if (!currentUser || (eventData.id && eventData.id.startsWith('evt-'))) {
          if (eventData.id) {
              setEvents(prev => prev.map(e => e.id === eventData.id ? { 
                  ...e, 
                  ...eventData,
                  color: eventData.color || e.color
              } : e));
          } else {
              const newEvent: CalendarEvent = {
                  ...eventData,
                  id: `evt-${Date.now()}`,
                  color: eventData.color || 'green'
              };
              setEvents(prev => [...prev, newEvent]);
          }
          setEventModalOpen(false);
          setEditingEvent(null);
          setDefaultEventTitle(null);
          return;
      }

      try {
          const payload = {
              title: eventData.title,
              description: eventData.description || '',
              startTime: eventData.startTime,
              endTime: eventData.endTime,
              date: eventData.date.getTime(), // Save as number timestamp
              color: eventData.color || 'green',
              recurrence: eventData.recurrence || 'none',
              locationType: eventData.locationType || 'offline',
              meetingRoom: eventData.meetingRoom || '',
              onlineLink: eventData.onlineLink || '',
              ownerId: currentUser.uid
          };

          if (eventData.id) {
              await updateDoc(doc(db, 'events', eventData.id), payload);
          } else {
              await addDoc(collection(db, 'events'), payload);
          }
          
          setEventModalOpen(false);
          setEditingEvent(null);
          setDefaultEventTitle(null);
      } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'events');
      }
  };

  const handleEditEvent = (event: CalendarEvent) => {
      setEditingEvent(event);
      setEventModalOpen(true);
  };

  const handleScheduleFromArticle = (articleTitle: string) => {
    setDefaultEventTitle(`Thảo luận bài viết: ${articleTitle}`);
    setEventModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    signOut(auth).catch((err) => console.error("Sign out error:", err));
    setActiveView('dashboard');
  }

  const handleNavigate = React.useCallback((view: View, section?: string) => {
    setActiveView(view);
    if (view === 'settings' && section) {
      setActiveSettingsSection(section);
    } else {
      setActiveSettingsSection(null);
    }

    if (view === 'class-detail' && section) {
      setActiveClassId(section);
    }

    if (view === 'blog-article' && section) {
      setActiveArticleId(section);
    }
    
    if (view !== 'tasklist') {
        setActiveTaskListId(undefined);
    }
    
    setMobileNavOpen(false);
  }, []);

  const handleNavigateToTasks = (taskListId: string) => {
      setActiveTaskListId(taskListId);
      setActiveView('tasklist');
  };

  const handleSendNotification = React.useCallback(async (notifData: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const currentUserId = user?.id;
    if (!currentUserId) return;
    
    const demoNotification: AppNotification = {
        ...notifData,
        id: `notif-${Date.now()}-${Math.random()}`,
        createdAt: Date.now()
    };

    if (currentUserId === 'user-1' || currentUserId.startsWith('user-')) {
      setNotifications(prev => [demoNotification, ...prev]);
      setActiveToasts(prev => {
          // Avoid duplicate toasts if possible
          if (prev.some(t => t.title === demoNotification.title && t.message === demoNotification.message)) return prev;
          return [...prev, demoNotification];
      });
      return;
    }
    
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: demoNotification.userId,
        title: demoNotification.title,
        message: demoNotification.message,
        read: demoNotification.read,
        createdAt: demoNotification.createdAt,
        type: demoNotification.type,
        link: demoNotification.link
      });
    } catch (error) {
       console.error("Error creating notification", error);
    }
  }, [user?.id]);

  // User login is always bypassed, user is authenticated by default

  const closeAllDrawers = () => {
    setMobileNavOpen(false);
    setMobileActivityOpen(false);
  }

  const handleSyncService = (id: ServiceName) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, lastSync: 'Vừa xong' } : s));
  };

  const renderMainView = () => {
    switch(activeView) {
      case 'check-in':
        return <CheckInView user={user} log={checkInLog} activityLog={activityLog} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />;
      case 'requests':
        return <RequestsView user={user} users={allUsers} onSaveEvent={handleSaveEvent} />;
      case 'website-data':
        return <WebsiteDataView user={user} allUsers={allUsers} onUsersChange={handleUsersChange} />;
      case 'projects':
        return <ProjectManagementView user={user} onNavigateToTasks={handleNavigateToTasks} onSendNotification={handleSendNotification} />;
      case 'user-management':
        return <UserManagementView currentUser={user} users={allUsers} onUsersChange={handleUsersChange} />;
      case 'org-chart':
        return <OrgChartView user={user} allUsers={allUsers} />;
      case 'process':
        return <ProcessWorkflowView user={user} onNavigate={handleNavigate} />;
      case 'drive':
        return <DriveView user={user} onItemViewed={handleItemViewed} onSync={() => handleSyncService('Drive')} />;
      case 'meeting':
        return <MeetingView user={user} onItemViewed={handleItemViewed} />;
      case 'tasklist':
        return <TasklistView user={user} allUsers={allUsers} initialListId={activeTaskListId} onSendNotification={handleSendNotification} />;
      case 'contacts':
        return <ContactsView user={user} onItemViewed={handleItemViewed} onNavigate={handleNavigate} />;
      case 'calendar':
        return <CalendarView user={user} events={events} onSaveEvent={handleSaveEvent} onEditEvent={handleEditEvent} onOpenModal={() => { setEditingEvent(null); setEventModalOpen(true); }} onItemViewed={handleItemViewed} />;
      case 'notes':
        return <NotesView user={user} onSync={() => handleSyncService('Keep')} />;

      case 'blog':
        return <BlogView user={user} onNavigate={handleNavigate} onSchedule={handleScheduleFromArticle} onItemViewed={handleItemViewed} />;
      case 'blog-article':
        return <BlogArticleView user={user} articleId={activeArticleId} onNavigate={handleNavigate} />;
      case 'new-blog-post':
        return <NewBlogPostView user={user} onNavigate={handleNavigate} />;
      case 'email':
        return <EmailClient user={user} onItemViewed={handleItemViewed} />;
      case 'team-chat':
      case 'chat':
        return <ChatView user={user} allUsers={allUsers} />;
      case 'newsfeed':
        return <NewsfeedView user={user} />;
       case 'tasks':
        return <TaskView onItemViewed={handleItemViewed} onSendNotification={handleSendNotification} />;
      case 'training':
        return <TrainingDashboardView user={user} onNavigate={handleNavigate} />;
      case 'class-detail':
        return <ClassDetailView user={user} classId={activeClassId} onNavigate={handleNavigate} />;
      case 'settings':
        return (
          <SettingsView 
            user={user} 
            services={services} 
            onToggleSync={handleToggleSync} 
            onToggleConnection={handleToggleConnection} 
            allUsers={allUsers} 
            onUsersChange={handleUsersChange} 
            initialSection={activeSettingsSection} 
            onNavigate={handleNavigate} 
            theme={theme} 
            setTheme={setTheme} 
            accentColor={accentColor} 
            setAccentColor={setAccentColor} 
            wallpaper={wallpaper} 
            setWallpaper={setWallpaper} 
            sidebarOpacity={sidebarOpacity}
            setSidebarOpacity={setSidebarOpacity}
            cardOpacity={cardOpacity}
            setCardOpacity={setCardOpacity}
          />
        );
      case 'dashboard':
      default:
        return <MainContent user={user} recentlyViewed={recentlyViewed} events={events} onNavigate={handleNavigate} checkInLog={checkInLog} activityLog={activityLog} />;
    }
  }

  const handleCreateDemoNotification = async () => {
    handleSendNotification({
        userId: user?.id || 'user-1',
        title: 'Hệ thống (Demo)',
        message: 'Bạn vừa nhận được phân công nhiệm vụ mới. Vui lòng kiểm tra.',
        read: false,
        type: 'task',
        link: 'tasklist'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const hasWallpaper = wallpaper?.type && wallpaper.type !== 'none';

  return (
    <div 
      className="h-screen w-screen bg-transparent p-[15px] font-sans text-[--color-text-primary] overflow-hidden relative"
      style={{
        '--sidebar-opacity': sidebarOpacity / 100,
        '--card-opacity': cardOpacity / 100,
      } as React.CSSProperties}
    >
      <div 
        style={{ borderStyle: 'solid' }}
        className={`w-full h-full rounded-[10px] border-4 shadow-3xl overflow-hidden flex flex-col relative transition-all duration-1000 ${borderColors[borderColorIndex]} ${hasWallpaper ? 'bg-[--color-surface-primary]/80 backdrop-blur-md' : 'bg-[--color-surface-primary]'}`}
      >
        {(isMobileNavOpen || isMobileActivityOpen) && (
          <div 
              onClick={closeAllDrawers} 
              className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in-up"
              aria-hidden="true"
          />
        )}

        {isEventModalOpen && <EventModal 
            onClose={() => { setEventModalOpen(false); setEditingEvent(null); setDefaultEventTitle(null); }} 
            onSave={handleSaveEvent}
            initialEvent={editingEvent || undefined}
            defaultTitle={defaultEventTitle || undefined}
          />}
        
        <div className="flex flex-1 min-h-0">
          <LeftSidebar 
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={() => setLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            isMobileOpen={isMobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            activeView={activeView}
            onNavigate={handleNavigate}
            recentlyViewed={recentlyViewed}
            onAiClick={() => setAiWidgetOpen(!isAiWidgetOpen)}
            isAiOpen={isAiWidgetOpen}
            user={user}
            onLogout={handleLogout}
            unreadCount={unreadCount}
            onNotificationClick={() => setRightSidebarCollapsed(!isRightSidebarCollapsed)}
          />
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeView}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 flex flex-col min-w-0 overflow-hidden"
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
              }}
            >
              {renderMainView()}
            </motion.div>
          </AnimatePresence>
          <RightSidebar 
            isCollapsed={isRightSidebarCollapsed} 
            isMobileOpen={isMobileActivityOpen}
            onClose={() => setMobileActivityOpen(false)}
            onToggle={() => setRightSidebarCollapsed(!isRightSidebarCollapsed)}
            activityLog={activityLog}
            notifications={notifications}
            onNotificationClick={handleToastClick}
            onCreateDemoNotification={handleCreateDemoNotification}
            allUsers={allUsers}
          />
        </div>
        <MobileBottomNav 
          activeView={activeView}
          onNavigate={handleNavigate}
          onToggleMobileNav={() => setMobileNavOpen(true)}
        />

        {isAiWidgetOpen && <AiChatWidget user={user} onClose={() => setAiWidgetOpen(false)} isRightSidebarOpen={!isRightSidebarCollapsed} />}
        <NotificationToast notifications={activeToasts} onClose={handleCloseToast} onClick={handleToastClick} allUsers={allUsers} />
        <CommandPalette 
            isOpen={isCommandPaletteOpen} 
            onClose={() => setCommandPaletteOpen(false)} 
            onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
