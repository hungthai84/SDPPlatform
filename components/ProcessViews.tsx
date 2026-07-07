import React, { useState } from 'react';
import { Workflow, } from 'lucide-react';
import { Banner, Tabs } from './StandardLayout';
import ProcessWorkflowView from './ProcessWorkflowView';
import { BPMView } from './BPMView';
import RequestsView from './RequestsView';

import { User, Event } from '../types';

export const ProcessView: React.FC<{ user: User | null, users: User[], onNavigate: (view: string) => void, onSaveEvent: (e: Event) => void }> = ({ user, users, onNavigate, onSaveEvent }) => {
  const [activeTab, setActiveTab] = useState('Quy trình (Process)');

  return (
    <div className="animate-fade-in mx-auto py-4">
      <Banner 
        title="Quản lý Quy trình & Yêu cầu" 
        icon={<Workflow />} 
        description="Số hóa, tự động hóa và theo dõi toàn bộ quy trình làm việc, yêu cầu phê duyệt nội bộ của doanh nghiệp."
      />

      <Tabs 
        items={['Quy trình (Process)', 'BPM (Workflow)', 'Yêu cầu & Đề xuất']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="mt-4">
        {activeTab === 'Quy trình (Process)' && <div className="mt-[-2rem]"><ProcessWorkflowView user={user} onNavigate={onNavigate} /></div>}
        {activeTab === 'BPM (Workflow)' && <div className="mt-[-2rem]"><BPMView /></div>}
        {activeTab === 'Yêu cầu & Đề xuất' && <div className="mt-[-2rem]"><RequestsView user={user} users={users} onSaveEvent={onSaveEvent} /></div>}
      </div>
    </div>
  );
};
