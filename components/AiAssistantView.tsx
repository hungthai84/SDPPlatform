import React, { useRef } from 'react';
import PageBanner from './PageBanner';
import StandardPageLayout, { ContentCard } from './StandardPageLayout';
import { User } from '../App';
import { Sparkles, Send, Mic, Info, Bot, History, Plus } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface AiAssistantViewProps {
  user: User;
}

const AiAssistantView: React.FC<AiAssistantViewProps> = ({ user }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useLanguage();
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    };

    return (
        <StandardPageLayout>
            <PageBanner 
                title={t('aiTitle') || "Trợ lý AI Thông minh"}
                subtitle={t('aiSubtitle') || "Sức mạnh của trí tuệ nhân tạo đồng hành cùng bạn trong mọi tác vụ công việc hàng ngày."}
                icon={<Sparkles className="w-full h-full" />}
                gradient="from-indigo-600 to-violet-700"
                actions={
                    <>
                        <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                            <History className="w-4 h-4" /> {t('history') || 'Lịch sử'}
                        </button>
                        <button className="flex items-center gap-2 bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-white/90 transition-all">
                            <Plus className="w-4 h-4" /> {t('newConversation') || 'Hội thoại mới'}
                        </button>
                    </>
                }
            />

            <ContentCard>
                <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full min-h-[500px]">
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* AI Message */}
                        <div className="flex items-start gap-4 animate-fade-in">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 border border-gray-100 p-5 rounded-3xl rounded-tl-none">
                                    <p className="text-sm font-bold text-slate-800 mb-1">{t('aiGreeting', { userName: user.name }) || `Xin chào, ${user.name}!`}</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        {t('aiIntro') || 'Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tóm tắt báo cáo, đọc lịch trình, tìm kiếm tài liệu hoặc hỗ trợ soạn thảo email. Bạn cần tôi hỗ trợ việc gì ngay bây giờ?'}
                                    </p>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {[
                                        "Tóm tắt công việc hôm nay",
                                        "Kiểm tra lịch họp tiếp theo",
                                        "Tìm tài liệu dự án POW"
                                    ].map(suggestion => (
                                        <button key={suggestion} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all">
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex items-start gap-4 justify-end animate-fade-in">
                            <div className="flex-1 flex flex-col items-end">
                                <div className="bg-indigo-600 text-white p-5 rounded-3xl rounded-tr-none shadow-xl shadow-indigo-600/10 max-w-lg">
                                    <p className="text-sm font-bold leading-relaxed">
                                        Liệt kê các nhiệm vụ quan trọng trong Tasklist mà tôi cần xử lý trong sáng nay.
                                    </p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Đã gửi • 10:30 AM</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-slate-500 flex items-center justify-center shrink-0 font-bold border border-gray-200">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    </div>

                    {/* Input System */}
                    <div className="sticky bottom-0 bg-white pt-4">
                        <div className="relative group">
                            <textarea 
                                ref={textareaRef}
                                rows={1} 
                                onInput={handleInput}
                                placeholder={t('aiInputPlaceholder') || "Đặt câu hỏi cho AI hoặc nhập yêu cầu..."}
                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none placeholder-slate-400 text-slate-800 font-bold text-sm rounded-3xl py-4 pl-14 pr-16 transition-all resize-none overflow-hidden"
                            />
                            <button className="absolute left-4 top-4 p-2 text-slate-400 hover:text-indigo-600 transition-all">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button className="absolute right-4 top-3.5 p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Info className="w-3 h-3" />
                            <span>{t('aiInfo') || 'AI có thể mắc lỗi. Vui lòng kiểm tra lại các thông tin quan trọng.'}</span>
                        </div>
                    </div>
                </div>
            </ContentCard>
        </StandardPageLayout>
    );
};

export default AiAssistantView;
