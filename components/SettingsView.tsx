
import React, { useState, useEffect } from 'react';
import { User, ServiceState, ServiceName, View } from '../App';
import { useLanguage } from './LanguageContext';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
    SettingsIcon, UserCircleIcon, SunIcon, GlobeIcon, ZapIcon, RobotIcon,
    CheckIcon, MoonIcon, LaptopIcon,
    SaveIcon, MailIcon, XIcon as CloseIcon
} from './icons';
import UserManagementView from './UserManagementView';
import AccountSettingsBanner from './AccountSettingsBanner';
import WebsiteDataView from './WebsiteDataView';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// --- Reusable Setting Components ---
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent-500] dark:focus:ring-offset-slate-800 ${
        checked ? 'bg-[--color-accent-500]' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

const ServiceCard: React.FC<{
  service: ServiceState;
  onToggleSync: (id: ServiceName) => void;
  onToggleConnection: (id: ServiceName) => void;
}> = ({ service, onToggleSync, onToggleConnection }) => {
    const { t } = useLanguage();
    return (
        <div className="p-5 bg-[--color-surface-secondary] rounded-xl ring-1 ring-[--color-border-primary] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[--color-surface-solid] rounded-lg">{React.cloneElement(service.icon, { className: "w-6 h-6 text-[--color-accent-600]" })}</div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-[--color-text-primary]">{service.name}</h3>
                        {service.isConnected && service.lastSync && (
                            <p className="text-xs text-[--color-text-subtle] font-medium flex items-center gap-1 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${service.isSyncEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400 font-bold'}`}></span>
                                Sync: {service.lastSync}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 text-right">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${service.isConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-200 text-slate-600 border border-slate-300'}`}>
                        {service.isConnected ? t('connected') : t('notConnected')}
                    </span>
                    {service.isConnected && service.storageUsage && (
                        <div className="flex flex-col items-end gap-1">
                             <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[--color-accent-500]" style={{ width: service.id === 'Drive' ? '30%' : '10%' }}></div>
                             </div>
                             <span className="text-xs font-bold text-[--color-text-subtle]">
                                {service.storageUsage}
                             </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[--color-border-secondary] flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={service.isSyncEnabled && service.isConnected} onChange={() => service.isConnected && onToggleSync(service.id)} />
                            <div className={`block w-12 h-6 rounded-full transition-colors ${service.isSyncEnabled && service.isConnected ? 'bg-[--color-accent-500]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${service.isSyncEnabled && service.isConnected ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                    <span className={`text-sm font-medium ${service.isConnected ? 'text-[--color-text-secondary]' : 'text-slate-400'}`}>{t('sync')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button disabled={!service.isConnected} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"><SettingsIcon className="w-5 h-5 text-[--color-text-subtle]"/></button>
                    <button
                        onClick={() => onToggleConnection(service.id)}
                        className={`text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors ${service.isConnected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                        {service.isConnected ? t('disconnect') : t('connect')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Settings View ---

interface SettingsViewProps {
    user: User;
    services: ServiceState[];
    onToggleSync: (id: ServiceName) => void;
    onToggleConnection: (id: ServiceName) => void;
    allUsers: User[];
    onUsersChange: (users: User[]) => void;
    initialSection?: string | null;
    onNavigate: (view: View, section?: string) => void;
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    wallpaper: { type: string; value: string; bgColor?: string; size?: string; thumbnail?: string };
    setWallpaper: (wallpaper: { type: string; value: string; bgColor?: string; size?: string; thumbnail?: string }) => void;
    sidebarOpacity: number;
    setSidebarOpacity: (opacity: number) => void;
    cardOpacity: number;
    setCardOpacity: (opacity: number) => void;
}
type Theme = 'light' | 'dark' | 'system';
const THEMES: { name: Theme, icon: React.ReactNode }[] = [
    { name: 'light', icon: <SunIcon className="w-5 h-5" /> },
    { name: 'dark', icon: <MoonIcon className="w-5 h-5" /> },
    { name: 'system', icon: <LaptopIcon className="w-5 h-5" /> },
];
const ACCENT_COLORS = [
    { name: 'cyan', color: '#06b6d4' },
    { name: 'rose', color: '#f43f5e' },
    { name: 'orange', color: '#f97316' },
    { name: 'green', color: '#22c55e' },
    { name: 'purple', color: '#a855f7' },
];

const IMAGE_WALLPAPERS = [
  "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg",
  "https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg",
  "https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg",
  "https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg",
  "https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg",
  "https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg",
  "https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg",
  "https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg",
  "https://i.ibb.co/rKL4ffH2/2.jpg",
  "https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg",
  "https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg",
  "https://i.ibb.co/Fc1dczn/Wallpaper.jpg",
  "https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg",
  "https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg",
  "https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg",
  "https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg",
  "https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg",
  "https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg",
  "https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg"
];

const VIDEO_WALLPAPERS = [
    { url: "https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4" },
    { url: "https://cdn.dribbble.com/userupload/9438742/file/original-9334dd4051bb585cc561e8be06870b39.mp4" },
    { url: "https://cdn.dribbble.com/userupload/4241992/file/original-1fcb82b5ace105f3ec88a2deb08e842d.mp4" },
    { url: "https://cdn.dribbble.com/userupload/34993295/file/original-2ea4b30fcd7c6eac3ca0f4d5bfd3d67b.mp4" },
    { url: "https://cdn.dribbble.com/userupload/32536603/file/original-db8060ba2540c3bf1cd2f30b4984cd51.mp4" },
    { url: "https://cdn.dribbble.com/userupload/32480516/file/original-f4a88d4031fee315e3175bf1834c24b4.mp4" },
    { url: "https://cdn.dribbble.com/userupload/32404914/file/original-57644971c47c0d16f90a68404a5e65c1.mp4" },
    { url: "https://cdn.dribbble.com/userupload/16365481/file/original-527fee647d12f31fce8a309ad136c4bb.mp4" },
    { url: "https://cdn.dribbble.com/userupload/15594644/file/original-6008d4b0ddcff73c116cb7989a144a71.mp4" },
    { url: "https://cdn.dribbble.com/userupload/14779635/file/original-1aca59fc5dc52bee9dcd291a27effcbf.mp4" },
    { url: "https://cdn.dribbble.com/userupload/10782874/file/original-06f7280dda982b62cd9452b0da032598.mp4" },
    { url: "https://cdn.dribbble.com/userupload/32524948/file/original-3c68e4ad227ae70e1875ef71289be2b0.mp4", thumbnail: "https://i.postimg.cc/jS3rSGdF/videoframe-8901.png" },
    { url: "https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4", thumbnail: "https://i.postimg.cc/BnmJ1jNN/videoframe-3046.png" },
    { url: "https://cdn.dribbble.com/userupload/16718734/file/original-f2df9314dbf922d5452d7a8a5885d744.mp4", thumbnail: "https://i.postimg.cc/NfYtJ6zp/videoframe-1990.png" },
    { url: "https://cdn.dribbble.com/userupload/43797830/file/original-b9bafe56dd75a7ae175f827cfc662738.mp4", thumbnail: "https://i.postimg.cc/yNJW1hB0/videoframe-3097.png" },
    { url: "https://cdn.dribbble.com/userupload/16365364/file/original-dcc3ad4c0f5802c6670d36fcca720e5e.mp4", thumbnail: "https://i.postimg.cc/vBgPtKyD/videoframe-4678.png" },
    { url: "https://cdn.dribbble.com/userupload/43797856/file/original-46c91cbdf46a3cbc3f30a85f061ed817.mp4", thumbnail: "https://i.postimg.cc/L6TVLSPN/videoframe-3537.png" },
    { url: "https://cdn.dribbble.com/userupload/12532568/file/original-816b8af88c5a4336e9f0467a7848033e.mp4" },
    { url: "https://cdn.dribbble.com/userupload/9535990/file/original-3a87c5fdf2433287d096795a11fa9ee4.mp4" },
    { url: "https://cdn.dribbble.com/userupload/13253460/file/original-85659da2508a303a516780470e3ae354.mp4" },
    { url: "https://cdn.dribbble.com/userupload/9783516/file/original-47f57ffecea5c7874ff6d6c2f0ce42bf.mp4" }
];

const GRADIENT_WALLPAPERS = [
  "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
  "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)",
  "linear-gradient(45deg, #ed6ea0 0%, #ec8c69 100%)",
  "linear-gradient(45deg, #000428 0%, #004e92 100%)",
  "linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(45deg, #373b44 0%, #4286f4 100%)",
  "linear-gradient(45deg, #7028e4 0%, #e5b2ca 100%)",
  "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(45deg, #0250c5 0%, #d43f8d 100%)"
];

const PATTERN_WALLPAPERS = [
  { 
      name: "Orbiting Planets", 
      type: "image",
      value: "https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  },
  {
      name: "Dotted Pattern",
      type: "pattern",
      value: "radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)",
      bgColor: "#e0e7ed",
      size: "10px 10px"
  },
  {
      name: "Dark Dotted Pattern",
      type: "pattern",
      value: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
      bgColor: "#1d1f20",
      size: "11px 11px"
  }
];

const mockFetchedArticles = [
    {
      id: 'blogger-1',
      title: 'Khám phá ẩm thực đường phố Sài Gòn',
      author: 'Travel Blogger',
      tags: ['Du lịch', 'Ẩm thực'],
      previewImage: 'https://images.unsplash.com/photo-1595233543958-f9359a3e5126?q=80&w=800',
      source: 'Blogger',
      isPinned: false,
      date: 'July 29, 2024'
    },
];

const SettingsView: React.FC<SettingsViewProps> = ({ 
    user, 
    services, 
    onToggleSync, 
    onToggleConnection, 
    allUsers, 
    onUsersChange, 
    initialSection, 
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    wallpaper,
    setWallpaper,
    sidebarOpacity,
    setSidebarOpacity,
    cardOpacity,
    setCardOpacity
}) => {
    const { language, setLanguage, t } = useLanguage();
    const [activeSection, setActiveSection] = useState('profile');

    // Profile States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editAvatar, setEditAvatar] = useState(user.avatar || '');
    const [editPhone, setEditPhone] = useState(user.phoneNumber || '');
    const [profileMessage, setProfileMessage] = useState('');

    const handleSaveProfile = async () => {
        const updatedUser: User = {
            ...user,
            name: editName,
            avatar: editAvatar,
            phoneNumber: editPhone
        };

        // Update local state first
        const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
        onUsersChange(updatedUsers);

        // Update Firestore if not mock user
        if (user.id !== 'user-1' && !user.id.startsWith('demo-')) {
            try {
                await updateDoc(doc(db, 'users', user.id), {
                    name: editName,
                    avatar: editAvatar,
                    phoneNumber: editPhone
                });
                setProfileMessage(t('profileUpdated'));
            } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `users/${user.id}`);
                setProfileMessage(t('profileUpdateError'));
            }
        } else {
            setProfileMessage(t('profileUpdated'));
        }
        setIsEditingProfile(false);
        setTimeout(() => setProfileMessage(''), 4000);
    };

    // Blog Settings States
    const [blogUrl, setBlogUrl] = useState('');
    const [blogFrequency, setBlogFrequency] = useState('manual');
    const [isFetching, setIsFetching] = useState(false);
    const [fetchMessage, setFetchMessage] = useState('');

    // Drive Settings States
    const [driveUrl, setDriveUrl] = useState('');
    const [driveFrequency, setDriveFrequency] = useState('manual');
    const [isFetchingDrive, setIsFetchingDrive] = useState(false);
    const [fetchDriveMessage, setFetchDriveMessage] = useState('');

    // Zimbra Settings States
    const [zimbraEmail, setZimbraEmail] = useState('');
    const [zimbraPassword, setZimbraPassword] = useState('');
    const [zimbraServer, setZimbraServer] = useState('');
    const [zimbraFrequency, setZimbraFrequency] = useState('manual');
    const [isSyncingZimbra, setIsSyncingZimbra] = useState(false);
    const [zimbraSyncMessage, setZimbraSyncMessage] = useState('');

    useEffect(() => {
        if(initialSection) {
            setActiveSection(initialSection);
        }
    }, [initialSection]);

    // Load settings from localStorage on mount
    useEffect(() => {
        setTheme((localStorage.getItem('theme') as Theme) || 'system');
        setAccentColor(localStorage.getItem('accentColor') || 'cyan');
        setIsSpeechEnabled(localStorage.getItem('aiSpeechEnabled') !== 'false');
        setIsRobotEffectEnabled(localStorage.getItem('aiRobotEffectEnabled') === 'true');
        setIsSoundEffectsEnabled(localStorage.getItem('soundEffectsEnabled') !== 'false');
        setIsCursorTrailsEnabled(localStorage.getItem('cursorTrailsEnabled') === 'true');
        setSelectedVoiceURI(localStorage.getItem('selectedVoiceURI'));
        setBlogUrl(localStorage.getItem('blog_settings_url') || '');
        setBlogFrequency(localStorage.getItem('blog_settings_frequency') || 'manual');
        setDriveUrl(localStorage.getItem('drive_settings_url') || '');
        setDriveFrequency(localStorage.getItem('drive_settings_frequency') || 'manual');
        setZimbraEmail(localStorage.getItem('zimbra_email') || '');
        setZimbraPassword(localStorage.getItem('zimbra_password') || '');
        setZimbraServer(localStorage.getItem('zimbra_server') || '');
        setZimbraFrequency(localStorage.getItem('zimbra_frequency') || 'manual');

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const filtered = availableVoices.filter(v => v.lang.startsWith('vi') || v.lang.startsWith('en'));
            setVoices(filtered);
            if (!localStorage.getItem('selectedVoiceURI') && filtered.length > 0) {
                 const namMinhVoice = filtered.find(v => v.name === 'Nam Minh' && v.lang === 'vi-VN');
                const googleVietnameseVoice = filtered.find(v => v.lang === 'vi-VN' && v.name.includes('Google'));
                const defaultVoice = namMinhVoice || googleVietnameseVoice || filtered[0];
                if(defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
    const [isRobotEffectEnabled, setIsRobotEffectEnabled] = useState(false);
    const [isSoundEffectsEnabled, setIsSoundEffectsEnabled] = useState(true);
    const [isCursorTrailsEnabled, setIsCursorTrailsEnabled] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

    // Effects for other settings
    useEffect(() => { localStorage.setItem('aiSpeechEnabled', String(isSpeechEnabled)); }, [isSpeechEnabled]);
    useEffect(() => { localStorage.setItem('aiRobotEffectEnabled', String(isRobotEffectEnabled)); }, [isRobotEffectEnabled]);
    useEffect(() => { localStorage.setItem('soundEffectsEnabled', String(isSoundEffectsEnabled)); }, [isSoundEffectsEnabled]);
    useEffect(() => { localStorage.setItem('cursorTrailsEnabled', String(isCursorTrailsEnabled)); }, [isCursorTrailsEnabled]);
    useEffect(() => { if (selectedVoiceURI) localStorage.setItem('selectedVoiceURI', selectedVoiceURI); }, [selectedVoiceURI]);

    // Blog Settings Logic
    const handleSaveBlogSettings = () => {
        localStorage.setItem('blog_settings_url', blogUrl);
        localStorage.setItem('blog_settings_frequency', blogFrequency);
        setFetchMessage('Cài đặt đã được lưu!');
        setTimeout(() => setFetchMessage(''), 3000);
    };

    const handleFetchBlogPosts = async () => {
        setIsFetching(true);
        setFetchMessage('');
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        try {
            const existingArticlesRaw = localStorage.getItem('blog_articles');
            const existingArticles: { id: string }[] = existingArticlesRaw ? JSON.parse(existingArticlesRaw) : [];
            const existingIds = new Set(existingArticles.map((a: { id: string }) => a.id));
            const newArticles = mockFetchedArticles.filter(a => !existingIds.has(a.id));

            if (newArticles.length > 0) {
                localStorage.setItem('blog_articles', JSON.stringify([...existingArticles, ...newArticles]));
                window.dispatchEvent(new Event('storage'));
            }
            
            setFetchMessage(t('fetchSuccess', { count: newArticles.length }));
        } catch (err) {
            console.error('Fetch Blog Error:', err);
            setFetchMessage(t('fetchError'));
        } finally {
            setIsFetching(false);
            setTimeout(() => setFetchMessage(''), 4000);
        }
    };

    // Drive Settings Logic
    const handleSaveDriveSettings = () => {
        localStorage.setItem('drive_settings_url', driveUrl);
        localStorage.setItem('drive_settings_frequency', driveFrequency);
        setFetchDriveMessage(t('saveSuccess') || 'Cài đặt đã được lưu!');
        setTimeout(() => setFetchDriveMessage(''), 3000);
    };

    const handleFetchDriveFiles = async () => {
        setIsFetchingDrive(true);
        setFetchDriveMessage('');
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        try {
            setFetchDriveMessage(t('syncSuccess') || 'Đồng bộ thành công!');
        } catch (err) {
            console.error('Fetch Drive Error:', err);
            setFetchDriveMessage(t('fetchDriveError') || 'Có lỗi xảy ra.');
        } finally {
            setIsFetchingDrive(false);
            setTimeout(() => setFetchDriveMessage(''), 4000);
        }
    };

    // Zimbra Settings Logic
    const handleSaveZimbraSettings = () => {
        localStorage.setItem('zimbra_email', zimbraEmail);
        localStorage.setItem('zimbra_password', zimbraPassword);
        localStorage.setItem('zimbra_server', zimbraServer);
        localStorage.setItem('zimbra_frequency', zimbraFrequency);
        setZimbraSyncMessage(t('saveSuccess') || 'Cài đặt đã được lưu!');
        setTimeout(() => setZimbraSyncMessage(''), 3000);
    };

    const handleSyncZimbra = async () => {
        setIsSyncingZimbra(true);
        setZimbraSyncMessage('');
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        try {
            setZimbraSyncMessage(t('syncSuccess') || 'Đồng bộ Zimbra thành công!');
        } catch (err) {
            console.error('Zimbra Sync Error:', err);
            setZimbraSyncMessage('Lỗi kết nối Zimbra. Vui lòng kiểm tra lại cấu hình.');
        } finally {
            setIsSyncingZimbra(false);
            setTimeout(() => setZimbraSyncMessage(''), 4000);
        }
    };


    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const sections = [
        { id: 'profile', label: t('profile'), icon: <UserCircleIcon className="w-5 h-5"/>, description: t('manageYourProfile') },
        { id: 'appearance', label: t('appearance') || 'Tùy chỉnh Giao diện', icon: <SunIcon className="w-5 h-5"/>, description: t('customizeAppearance') || 'Tùy chỉnh chủ đề và màu sắc của ứng dụng' },
        { id: 'language', label: t('language'), icon: <GlobeIcon className="w-5 h-5"/>, description: t('chooseLanguage') },
        { id: 'effects', label: t('effectsAndSound'), icon: <ZapIcon className="w-5 h-5"/>, description: t('manageEffects') },
        { id: 'ai_voice', label: t('aiVoiceSettings'), icon: <RobotIcon className="w-5 h-5"/>, description: t('configureAiAssistant') },
        { id: 'zimbra', label: t('zimbraSettings'), icon: <MailIcon className="w-5 h-5"/>, description: t('zimbraSettingsDesc') },
        { id: 'website-admin', label: t('websiteAdmin') || 'Quản trị Website', icon: <GlobeIcon className="w-5 h-5"/>, description: t('websiteAdminDesc') || 'Cấu hình website, trang tĩnh và email' },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile': return (
                <div className="flex flex-col items-center gap-6 p-8 bg-[--color-surface-secondary] rounded-xl shadow-inner border border-[--color-border-primary]">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full bg-[--color-accent-500] text-white flex items-center justify-center font-bold text-4xl ring-4 ring-white shadow-xl overflow-hidden">
                            {isEditingProfile ? (
                                editAvatar ? <img src={editAvatar} alt="editing" className="w-full h-full object-cover" /> : getInitials(editName)
                            ) : (
                                user.avatar ? <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover" /> : getInitials(user.name)
                            )}
                        </div>
                        {isEditingProfile && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{t('changeAvatar') || 'Thay đổi'}</span>
                            </div>
                        )}
                    </div>

                    {!isEditingProfile ? (
                        <div className="flex flex-col items-center gap-2 w-full">
                            <h3 className="text-2xl font-bold text-[--color-text-primary] mt-2">{user.name}</h3>
                            <p className="text-[--color-text-secondary] flex items-center gap-2 font-medium">
                                <GlobeIcon className="w-4 h-4 opacity-70" /> {user.email}
                            </p>
                            {user.phoneNumber && (
                                <p className="text-sm text-[--color-text-secondary] flex items-center gap-2">
                                    <ZapIcon className="w-4 h-4 opacity-70" /> {user.phoneNumber}
                                </p>
                            )}
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs font-bold px-3 py-1 bg-[--color-accent-600] text-white rounded-full uppercase tracking-tighter">{user.role}</span>
                                <span className="text-xs font-bold px-3 py-1 bg-green-500 text-white rounded-full uppercase tracking-tighter">Verified</span>
                            </div>
                            <button 
                                onClick={() => {
                                    setEditName(user.name);
                                    setEditAvatar(user.avatar || '');
                                    setEditPhone(user.phoneNumber || '');
                                    setIsEditingProfile(true);
                                }}
                                className="mt-8 w-full max-w-xs flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white bg-gradient-to-r from-[--color-accent-600] to-[--color-accent-400] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-lg shadow-[--color-accent-500]/20"
                            >
                                <SettingsIcon className="w-5 h-5"/> {t('editProfile')}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-md space-y-5 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[--color-text-secondary] px-1">{t('fullName')}</label>
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-[--color-surface-primary] p-3 rounded-xl border-2 border-[--color-border-secondary] focus:border-[--color-accent-500] outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[--color-text-secondary] px-1">{t('avatarUrl')}</label>
                                <input 
                                    type="text" 
                                    value={editAvatar} 
                                    onChange={(e) => setEditAvatar(e.target.value)}
                                    className="w-full bg-[--color-surface-primary] p-3 rounded-xl border-2 border-[--color-border-secondary] focus:border-[--color-accent-500] outline-none transition-all font-medium"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[--color-text-secondary] px-1">{t('phoneNumber')}</label>
                                <input 
                                    type="text" 
                                    value={editPhone} 
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full bg-[--color-surface-primary] p-3 rounded-xl border-2 border-[--color-border-secondary] focus:border-[--color-accent-500] outline-none transition-all font-medium"
                                    placeholder="+84..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-[--color-text-primary] bg-[--color-surface-solid] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold"
                                >
                                    <CloseIcon className="w-5 h-5"/> {t('cancel')}
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-500/20"
                                >
                                    <SaveIcon className="w-5 h-5"/> {t('saveProfile')}
                                </button>
                            </div>
                        </div>
                    )}

                    {profileMessage && (
                        <div className={`w-full max-w-md p-3 text-center rounded-lg font-bold border animate-fade-in ${profileMessage === t('profileUpdateError') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {profileMessage}
                        </div>
                    )}
                </div>
            );
            case 'appearance': return (
                <div className="space-y-6">
                    <div className="p-6 bg-[--color-surface-secondary] rounded-xl">
                        <label className="text-lg font-bold text-[--color-text-primary]">{t('mode')}</label>
                        <p className="text-sm text-[--color-text-subtle] mb-4">Chọn giao diện sáng, tối hoặc theo hệ thống.</p>
                        <div className="flex items-center bg-[--color-surface-primary] p-1 rounded-lg">
                            {THEMES.map(t_item => (
                                <button key={t_item.name} onClick={() => setTheme(t_item.name)} className={`w-full flex justify-center items-center gap-2 text-sm capitalize p-2 rounded-md transition-colors ${theme === t_item.name ? 'bg-[--color-surface-solid] text-[--color-text-primary] shadow-sm' : 'text-[--color-text-secondary] hover:bg-[--color-surface-secondary]'}`}>
                                    {t_item.icon} <span>{t(t_item.name)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="p-6 bg-[--color-surface-secondary] rounded-xl">
                        <label className="text-lg font-bold text-[--color-text-primary]">{t('accent')}</label>
                         <p className="text-sm text-[--color-text-subtle] mb-4">Chọn màu nhấn cho ứng dụng.</p>
                        <div className="flex justify-around p-2">
                            {ACCENT_COLORS.map(c => (
                                <button key={c.name} onClick={() => setAccentColor(c.name)} className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 dark:ring-offset-slate-800 transition-all" style={{ backgroundColor: c.color, borderColor: accentColor === c.name ? c.color : 'transparent'}}>
                                    {accentColor === c.name && <CheckIcon className="w-6 h-6 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                     <div className="p-6 bg-[--color-surface-secondary] rounded-xl space-y-6">
                        <div>
                            <label className="text-lg font-bold text-[--color-text-primary]">Độ trong suốt thanh menu bên trái (Sidebar)</label>
                            <p className="text-sm text-[--color-text-subtle] mb-4">Điều chỉnh mức độ hiển thị trong suốt cho thanh menu.</p>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="100" 
                                    value={sidebarOpacity} 
                                    onChange={(e) => setSidebarOpacity(Number(e.target.value))} 
                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[--color-accent-500]"
                                />
                                <span className="text-md font-mono font-bold text-[--color-text-primary] bg-[--color-surface-primary] px-3 py-1 rounded-md shadow-sm border border-[--color-border-secondary]">
                                    {sidebarOpacity}%
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-[--color-border-secondary] pt-6">
                            <label className="text-lg font-bold text-[--color-text-primary]">Độ trong suốt của thẻ nội dung</label>
                            <p className="text-sm text-[--color-text-subtle] mb-4">Điều chỉnh độ mờ nền thẻ nội dung (thẻ nền màu trắng).</p>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="100" 
                                    value={cardOpacity} 
                                    onChange={(e) => setCardOpacity(Number(e.target.value))} 
                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[--color-accent-500]"
                                />
                                <span className="text-md font-mono font-bold text-[--color-text-primary] bg-[--color-surface-primary] px-3 py-1 rounded-md shadow-sm border border-[--color-border-secondary]">
                                    {cardOpacity}%
                                </span>
                            </div>
                        </div>
                     </div>
                    
                    <div className="p-6 bg-[--color-surface-secondary] rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label className="text-lg font-bold text-[--color-text-primary]">Hình nền</label>
                                <p className="text-sm text-[--color-text-subtle]">Cá nhân hóa nền ứng dụng với ảnh, video, dải màu.</p>
                            </div>
                            <button 
                                onClick={() => setWallpaper({ type: 'none', value: '' })}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                Mặc định
                            </button>
                        </div>

                        {/* Live Wallpaper Info & Preview Panel */}
                        <div className="mb-6 p-4 bg-[--color-surface-primary] border border-[--color-border-secondary] rounded-xl flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative shadow-inner shrink-0 border border-[--color-border-primary]">
                                {wallpaper?.type === 'none' || !wallpaper?.type ? (
                                    <span className="text-xs text-[--color-text-subtle]">Mặc định (Không hình nền)</span>
                                ) : wallpaper?.type === 'image' ? (
                                    <img src={wallpaper.value} className="w-full h-full object-cover animate-fade-in" />
                                ) : wallpaper?.type === 'video' ? (
                                    <video src={wallpaper.value} className="w-full h-full object-cover animate-fade-in" autoPlay loop muted playsInline />
                                ) : wallpaper?.type === 'gradient' ? (
                                    <div className="w-full h-full animate-fade-in" style={{ background: wallpaper.value }} />
                                ) : (
                                    <div className="w-full h-full animate-fade-in" style={{ background: wallpaper.value, backgroundColor: wallpaper.bgColor || 'transparent', backgroundSize: wallpaper.size || 'auto' }} />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-sm font-bold text-[--color-text-primary]">Cài đặt & Mô tả hình nền hiện tại</h4>
                                <p className="text-xs text-[--color-text-subtle] mt-1 leading-relaxed">
                                    {(!wallpaper?.type || wallpaper?.type === 'none') && 'Hệ thống đang sử dụng nền màu trơn mặc định của Power Service.'}
                                    {wallpaper?.type === 'image' && 'Hình nền dạng Ảnh Tĩnh có độ nét cao, mang lại chiều sâu tuyệt đối cho không gian làm việc mà không ảnh hưởng hiệu năng.'}
                                    {wallpaper?.type === 'video' && 'Hình nền dạng Video Chuyển Động lặp vô tận mượt mà. Đề xuất sử dụng máy có cấu hình đồ họa tốt.'}
                                    {wallpaper?.type === 'gradient' && 'Hình nền dạng Dải Màu (Dynamic CSS Gradient) chuyển sắc mượt mà góc 45 độ vô cùng tinh tế, hiện đại.'}
                                    {wallpaper?.type === 'pattern' && 'Hình nền dạng Họa Tiết lập nghệ thuật đối xứng tinh tế, tạo chiều sâu thị giác sang trọng.'}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[--color-surface-secondary] rounded text-[--color-text-secondary] border border-[--color-border-primary] capitalize">
                                        Thể loại: {wallpaper?.type || 'Mặc định'}
                                    </span>
                                    {wallpaper?.value && (
                                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[--color-surface-secondary] rounded text-[--color-text-secondary] border border-[--color-border-primary] truncate max-w-[220px]">
                                            Nguồn: {wallpaper.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Image Wallpapers */}
                            <div>
                                <h4 className="text-sm font-semibold text-[--color-text-secondary] mb-3">Hình ảnh</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 pb-2">
                                    {IMAGE_WALLPAPERS.map((url, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setWallpaper({ type: 'image', value: url })}
                                            className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${wallpaper?.type === 'image' && wallpaper?.value === url ? 'border-[--color-accent-500] scale-105 shadow-lg' : 'border-transparent hover:border-slate-300'}`}
                                        >
                                            <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" loading="lazy" />
                                            {wallpaper?.type === 'image' && wallpaper?.value === url && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><CheckIcon className="w-6 h-6 text-white drop-shadow-md" /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Video Wallpapers */}
                            <div>
                                <h4 className="text-sm font-semibold text-[--color-text-secondary] mb-3">Video chuyển động</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 pb-2">
                                    {VIDEO_WALLPAPERS.map((video, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setWallpaper({ type: 'video', value: video.url, thumbnail: video.thumbnail })}
                                            className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-all bg-black ${wallpaper?.type === 'video' && wallpaper?.value === video.url ? 'border-[--color-accent-500] scale-105 shadow-lg' : 'border-transparent hover:border-slate-300'}`}
                                        >
                                            {video.thumbnail ? (
                                                <img src={video.thumbnail} alt={`Video Wallpaper ${i}`} className="w-full h-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px] font-medium">Video {i+1}</div>
                                            )}
                                            {wallpaper?.type === 'video' && wallpaper?.value === video.url ? (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><CheckIcon className="w-6 h-6 text-white drop-shadow-md" /></div>
                                            ) : (
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                    <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center pl-0.5">
                                                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white border-b-[3px] border-b-transparent"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Gradient & Patterns */}
                            <div>
                                <h4 className="text-sm font-semibold text-[--color-text-secondary] mb-3">Dải màu & Họa tiết</h4>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-48 overflow-y-auto pr-2 pb-2">
                                    {PATTERN_WALLPAPERS.map((pattern, i) => (
                                        <button
                                            key={`pattern-${i}`}
                                            onClick={() => setWallpaper({ type: pattern.type, value: pattern.value, bgColor: pattern.bgColor, size: pattern.size })}
                                            title={pattern.name}
                                            className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${wallpaper?.type === pattern.type && wallpaper?.value === pattern.value ? 'border-[--color-accent-500] scale-110 shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:scale-105'}`}
                                            style={pattern.type === 'image' ? { backgroundImage: `url(${pattern.value})`, backgroundSize: 'cover' } : { background: pattern.value, backgroundColor: pattern.bgColor, backgroundSize: pattern.size || 'auto' }}
                                        >
                                            {wallpaper?.type === pattern.type && wallpaper?.value === pattern.value && <div className="w-full h-full bg-black/20 flex items-center justify-center"><CheckIcon className="w-5 h-5 text-white drop-shadow-md" /></div>}
                                        </button>
                                    ))}
                                    {GRADIENT_WALLPAPERS.map((gradient, i) => (
                                        <button
                                            key={`grad-${i}`}
                                            onClick={() => setWallpaper({ type: 'gradient', value: gradient })}
                                            className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${wallpaper?.type === 'gradient' && wallpaper?.value === gradient ? 'border-[--color-accent-500] scale-110 shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:scale-105'}`}
                                            style={{ background: gradient }}
                                        >
                                            {wallpaper?.type === 'gradient' && wallpaper?.value === gradient && <div className="w-full h-full bg-black/20 flex items-center justify-center"><CheckIcon className="w-5 h-5 text-white drop-shadow-md" /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            );
             case 'language': return (
                 <div className="p-6 bg-[--color-surface-secondary] rounded-xl space-y-2">
                    <button onClick={() => setLanguage('vi')} className={`w-full text-left flex items-center justify-between p-3 rounded-lg text-md transition-colors ${language === 'vi' ? 'bg-[--color-surface-solid] text-[--color-text-primary] font-semibold shadow-sm' : 'text-[--color-text-secondary] hover:bg-[--color-surface-secondary]'}`}>
                        <span>Tiếng Việt</span> {language === 'vi' && <CheckIcon className="w-5 h-5 text-[--color-accent-500]" />}
                    </button>
                    <button onClick={() => setLanguage('en')} className={`w-full text-left flex items-center justify-between p-3 rounded-lg text-md transition-colors ${language === 'en' ? 'bg-[--color-surface-solid] text-[--color-text-primary] font-semibold shadow-sm' : 'text-[--color-text-secondary] hover:bg-[--color-surface-secondary]'}`}>
                        <span>English</span> {language === 'en' && <CheckIcon className="w-5 h-5 text-[--color-accent-500]" />}
                    </button>
                 </div>
            );
            case 'effects': return (
                <>
                    <h3 className="text-xl font-bold text-[--color-text-primary] mb-4">{t('visualEffects')}</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[--color-surface-secondary]">
                        <div>
                            <p className="font-medium text-[--color-text-primary]">{t('cursorTrails')}</p>
                            <p className="text-sm text-[--color-text-subtle]">{t('cursorTrailsDesc')}</p>
                        </div>
                        <ToggleSwitch checked={isCursorTrailsEnabled} onChange={setIsCursorTrailsEnabled} />
                    </div>
                     <h3 className="text-xl font-bold text-[--color-text-primary] mt-6 mb-4">{t('soundEffects')}</h3>
                     <div className="flex items-center justify-between p-4 rounded-xl bg-[--color-surface-secondary]">
                        <div>
                            <p className="font-medium text-[--color-text-primary]">{t('enableSoundEffects')}</p>
                            <p className="text-sm text-[--color-text-subtle]">{t('enableSoundEffectsDesc')}</p>
                        </div>
                        <ToggleSwitch checked={isSoundEffectsEnabled} onChange={setIsSoundEffectsEnabled} />
                    </div>
                </>
            );
            case 'ai_voice': return (
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 rounded-xl bg-[--color-surface-secondary]">
                        <div>
                            <p className="font-medium text-[--color-text-primary]">{t('enableAiVoice')}</p>
                            <p className="text-sm text-[--color-text-subtle]">{t('enableAiVoiceDesc')}</p>
                        </div>
                        <ToggleSwitch checked={isSpeechEnabled} onChange={setIsSpeechEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[--color-surface-secondary]">
                        <div>
                            <p className="font-medium text-[--color-text-primary]">{t('robotEffect')}</p>
                            <p className="text-sm text-[--color-text-subtle]">{t('robotEffectDesc')}</p>
                        </div>
                        <ToggleSwitch checked={isRobotEffectEnabled} onChange={setIsRobotEffectEnabled} />
                    </div>
                     <div className="p-4 rounded-xl bg-[--color-surface-secondary]">
                        <label htmlFor="voice-select" className="font-medium text-[--color-text-primary]">{t('voiceModel')}</label>
                        <p className="text-sm text-[--color-text-subtle] mb-2">{t('voiceModelDesc')}</p>
                        <select
                            id="voice-select"
                            value={selectedVoiceURI || ''}
                            onChange={(e) => setSelectedVoiceURI(e.target.value)}
                            className="w-full mt-1 bg-[--color-surface-primary] p-2 rounded-md border border-[--color-border-secondary] focus:ring-1 focus:ring-[--color-accent-500] focus:outline-none"
                        >
                            {voices.length > 0 ? voices.map(voice => (
                                <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>
                            )) : <option disabled>{t('loadingVoices')}</option>}
                        </select>
                    </div>
                </div>
            );
            case 'zimbra':
                return (
                 <div className="bg-[--color-surface-secondary] rounded-xl shadow-lg p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <MailIcon className="w-8 h-8 text-[--color-accent-600]"/>
                        <div>
                             <h2 className="text-xl font-bold text-[--color-text-primary]">{t('zimbraSettings')}</h2>
                             <p className="text-sm text-[--color-text-subtle]">{t('zimbraSettingsDesc')}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="zimbra-email" className="text-sm font-semibold text-[--color-text-secondary]">{t('zimbraEmail')}</label>
                            <input
                                id="zimbra-email"
                                type="email"
                                value={zimbraEmail}
                                onChange={e => setZimbraEmail(e.target.value)}
                                placeholder="user@zimbra.example.com"
                                className="w-full bg-[--color-surface-primary] p-2.5 rounded-lg border border-[--color-border-secondary] focus:ring-2 focus:ring-[--color-accent-500] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="zimbra-password" className="text-sm font-semibold text-[--color-text-secondary]">{t('zimbraPassword')}</label>
                            <input
                                id="zimbra-password"
                                type="password"
                                value={zimbraPassword}
                                onChange={e => setZimbraPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[--color-surface-primary] p-2.5 rounded-lg border border-[--color-border-secondary] focus:ring-2 focus:ring-[--color-accent-500] focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="zimbra-server" className="text-sm font-semibold text-[--color-text-secondary]">{t('zimbraServer')}</label>
                        <input
                            id="zimbra-server"
                            type="url"
                            value={zimbraServer}
                            onChange={e => setZimbraServer(e.target.value)}
                            placeholder="https://mail.zimbra.example.com"
                            className="w-full bg-[--color-surface-primary] p-2.5 rounded-lg border border-[--color-border-secondary] focus:ring-2 focus:ring-[--color-accent-500] focus:outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="zimbra-frequency" className="text-sm font-semibold text-[--color-text-secondary] mb-2 block">{t('fetchFrequency')}</label>
                        <select
                            id="zimbra-frequency"
                            value={zimbraFrequency}
                            onChange={e => setZimbraFrequency(e.target.value)}
                            className="w-full bg-[--color-surface-primary] p-2.5 rounded-lg border border-[--color-border-secondary] focus:ring-2 focus:ring-[--color-accent-500] focus:outline-none transition-all"
                        >
                            <option value="manual">{t('manual')}</option>
                            <option value="daily">{t('daily')}</option>
                            <option value="weekly">{t('weekly')}</option>
                        </select>
                    </div>

                    <div className="border-t border-[--color-border-secondary] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={handleSaveZimbraSettings}
                            className="w-full sm:w-auto text-sm font-bold py-2.5 px-8 rounded-xl text-white bg-gradient-to-r from-slate-600 to-slate-800 shadow-lg shadow-slate-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {t('saveSettings')}
                        </button>
                        <button
                            onClick={handleSyncZimbra}
                            disabled={isSyncingZimbra || !zimbraEmail}
                            className="w-full sm:w-auto text-sm font-bold py-2.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSyncingZimbra ? t('syncing') : 'Sync Zimbra Now'}
                        </button>
                    </div>
                    
                    {zimbraSyncMessage && (
                        <div className="p-4 text-center rounded-xl bg-cyan-50 text-cyan-800 font-bold border border-cyan-100 animate-fade-in">
                            {zimbraSyncMessage}
                        </div>
                    )}
                </div>
            );
             case 'drive':
                const driveService = services.find(s => s.id === 'Drive');
                return (
                 <div className="bg-[--color-surface-secondary] rounded-xl shadow-lg p-6 space-y-6">
                    {driveService && (
                        <ServiceCard service={driveService} onToggleSync={onToggleSync} onToggleConnection={onToggleConnection} />
                    )}
                    <div>
                        <label htmlFor="drive-url" className="text-sm font-semibold text-[--color-text-secondary] mb-2 block">{t('driveFolderUrl') || 'Drive Folder URL'}</label>
                        <input
                            id="drive-url"
                            type="url"
                            value={driveUrl}
                            onChange={e => setDriveUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full bg-[--color-surface-primary] p-2 rounded-md border border-[--color-border-secondary] focus:ring-1 focus:ring-[--color-accent-500] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="drive-fetch-frequency" className="text-sm font-semibold text-[--color-text-secondary] mb-2 block">{t('fetchFrequency')}</label>
                        <select
                            id="drive-fetch-frequency"
                            value={driveFrequency}
                            onChange={e => setDriveFrequency(e.target.value)}
                            className="w-full bg-[--color-surface-primary] p-2 rounded-md border border-[--color-border-secondary] focus:ring-1 focus:ring-[--color-accent-500] focus:outline-none"
                        >
                            <option value="manual">{t('manual')}</option>
                            <option value="daily">{t('daily')}</option>
                            <option value="weekly">{t('weekly')}</option>
                        </select>
                    </div>

                    <div className="border-t border-[--color-border-secondary] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={handleSaveDriveSettings}
                            className="w-full sm:w-auto text-sm font-semibold py-2.5 px-6 rounded-lg text-[--color-text-primary] bg-[--color-surface-primary] hover:bg-[--color-surface-tertiary] transition-colors"
                        >
                            {t('saveSettings')}
                        </button>
                        <button
                            onClick={handleFetchDriveFiles}
                            disabled={isFetchingDrive || !driveService?.isConnected}
                            className="w-full sm:w-auto text-sm font-semibold py-2.5 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFetchingDrive ? (t('fetchingFiles') || 'Fetching...') : (t('fetchFiles') || 'Fetch Files')}
                        </button>
                    </div>
                    
                    {fetchDriveMessage && (
                        <div className="p-3 text-center rounded-md bg-[--color-surface-primary] text-[--color-text-primary] font-medium">
                            {fetchDriveMessage}
                        </div>
                    )}
                </div>
            );
             case 'blog':
                const bloggerService = services.find(s => s.id === 'Blogger');
                return (
                 <div className="bg-[--color-surface-secondary] rounded-xl shadow-lg p-6 space-y-6">
                    {bloggerService && (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-slate-100 dark:bg-slate-800/50">
                            <div className={`w-3 h-3 rounded-full ${bloggerService.isConnected ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                            <p className="text-sm font-semibold text-[--color-text-secondary]">
                                Blogger Status: <span className={bloggerService.isConnected ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>
                                    {bloggerService.isConnected ? t('connected') : t('notConnected')}
                                </span>
                            </p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="blogger-url" className="text-sm font-semibold text-[--color-text-secondary] mb-2 block">{t('bloggerUrl')}</label>
                        <input
                            id="blogger-url"
                            type="url"
                            value={blogUrl}
                            onChange={e => setBlogUrl(e.target.value)}
                            placeholder="https://yourblog.blogspot.com"
                            className="w-full bg-[--color-surface-primary] p-2 rounded-md border border-[--color-border-secondary] focus:ring-1 focus:ring-[--color-accent-500] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="fetch-frequency" className="text-sm font-semibold text-[--color-text-secondary] mb-2 block">{t('fetchFrequency')}</label>
                        <select
                            id="fetch-frequency"
                            value={blogFrequency}
                            onChange={e => setBlogFrequency(e.target.value)}
                            className="w-full bg-[--color-surface-primary] p-2 rounded-md border border-[--color-border-secondary] focus:ring-1 focus:ring-[--color-accent-500] focus:outline-none"
                        >
                            <option value="manual">{t('manual')}</option>
                            <option value="daily">{t('daily')}</option>
                            <option value="weekly">{t('weekly')}</option>
                        </select>
                    </div>

                    <div className="border-t border-[--color-border-secondary] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={handleSaveBlogSettings}
                            className="w-full sm:w-auto text-sm font-semibold py-2.5 px-6 rounded-lg text-[--color-text-primary] bg-[--color-surface-primary] hover:bg-[--color-surface-tertiary] transition-colors"
                        >
                            {t('saveSettings')}
                        </button>
                        <button
                            onClick={handleFetchBlogPosts}
                            disabled={isFetching || !bloggerService?.isConnected}
                            className="w-full sm:w-auto text-sm font-semibold py-2.5 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFetching ? t('fetchingPosts') : t('fetchNow')}
                        </button>
                    </div>
                    
                    {fetchMessage && (
                        <div className="p-3 text-center rounded-md bg-[--color-surface-primary] text-[--color-text-primary] font-medium">
                            {fetchMessage}
                        </div>
                    )}
                </div>
            );
            case 'website-admin':
                return (
                    <WebsiteDataView user={user} allUsers={allUsers} onUsersChange={onUsersChange} />
                );
            case 'user-management':
                return (
                    <UserManagementView currentUser={user} users={allUsers} onUsersChange={onUsersChange} />
                );
            default: return null;
        }
    };
    
    return (
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden p-[15px] gap-3 pb-24 md:pb-8">
            <div className="shrink-0">
                <AccountSettingsBanner />
            </div>

            {/* Horizontal Navigation Tabs */}
            <div className="shrink-0 border-b border-[--color-border-secondary] overflow-x-auto no-scrollbar -mx-4 px-4">
                <nav className="flex gap-2 min-w-max pb-1">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                activeSection === section.id 
                                    ? 'border-[--color-accent-600] text-[--color-accent-600]' 
                                    : 'border-transparent text-[--color-text-secondary] hover:text-[--color-text-primary] hover:border-[--color-border-secondary]'
                            }`}
                        >
                            <span className={activeSection === section.id ? 'text-[--color-accent-600]' : 'text-[--color-text-subtle]'}>
                                {section.icon}
                            </span>
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-2 -mr-2 mt-2">
                <div className="space-y-6">
                    {renderSectionContent()}
                </div>
            </div>
        </main>
    );
};

export default SettingsView;
