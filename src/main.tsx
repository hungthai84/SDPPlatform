import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { OmnichannelInbox } from './pages/Inbox';
import { Tickets } from './pages/Tickets';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { CustomerPortal } from './pages/CustomerPortal';
import { HelpCenter } from './pages/HelpCenter';
import { Community } from './pages/Community';
import { BackgroundWrapper } from './components/BackgroundWrapper';
import { SettingsProvider } from './contexts/SettingsContext';
import { Settings } from './pages/Settings';
import { Automation } from './pages/Automation';
import { Campaigns } from './pages/Campaigns';
import { AIAssistant } from './pages/AIAssistant';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { NotificationsPage } from './pages/NotificationsPage';
import { BlankPage } from './pages/BlankPage';
import { Projects } from './pages/Projects';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <BackgroundWrapper>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="inbox" element={<OmnichannelInbox />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="automation" element={<Automation />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="blank-page" element={<BlankPage />} />
              <Route path="projects" element={<Projects />} />
            </Route>
            
            {/* Customer Facing Portals */}
            <Route path="/portal" element={<CustomerPortal />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </BackgroundWrapper>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);

