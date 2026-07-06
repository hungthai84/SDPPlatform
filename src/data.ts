import { Ticket, Customer, Agent, Message } from './types';

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', vipLevel: 'gold', company: 'TechCorp' },
  { id: 'c2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', vipLevel: 'standard' },
  { id: 'c3', name: 'Lê Hoàng C', email: 'lehoangc@example.com', phone: '0933333333', vipLevel: 'platinum', company: 'Vingroup' },
];

export const mockAgents: Agent[] = [
  { id: 'a1', name: 'Quản trị viên', email: 'admin@omnihelp.com', role: 'admin' },
  { id: 'a2', name: 'Nhân viên hỗ trợ 1', email: 'agent1@omnihelp.com', role: 'agent' },
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-1001',
    subject: 'Không thể đăng nhập vào hệ thống CRM',
    status: 'new',
    priority: 'high',
    channel: 'email',
    customerId: 'c1',
    customer: mockCustomers[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'TKT-1002',
    subject: 'Hỏi về bảng giá Enterprise',
    status: 'in_progress',
    priority: 'medium',
    channel: 'chat',
    customerId: 'c2',
    customer: mockCustomers[1],
    assigneeId: 'a2',
    assignee: mockAgents[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'TKT-1003',
    subject: 'Lỗi đồng bộ dữ liệu với SAP',
    status: 'assigned',
    priority: 'urgent',
    channel: 'call',
    customerId: 'c3',
    customer: mockCustomers[2],
    assigneeId: 'a1',
    assignee: mockAgents[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    ticketId: 'TKT-1002',
    senderType: 'customer',
    senderId: 'c2',
    content: 'Chào bạn, tôi muốn hỏi về bảng giá gói Enterprise.',
    channel: 'chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'm2',
    ticketId: 'TKT-1002',
    senderType: 'agent',
    senderId: 'a2',
    content: 'Dạ chào chị B, gói Enterprise bên em có giá từ 500$/tháng tuỳ theo số lượng Agent ạ. Chị cần tư vấn thêm cho team bao nhiêu người ạ?',
    channel: 'chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  }
];

export const ZEN_QUOTES = [
  { id: '1', text: 'Hãy bắt đầu bằng sự im lặng, và để trang giấy ghi lại những âm thanh của tư duy.', author: 'Thiền Sư' },
  { id: '2', text: 'Sự tinh giản không phải là ít đi, mà là vừa đủ để tâm hồn tự do.', author: 'Vô Danh' },
  { id: '3', text: 'Trang giấy trắng là gương soi tâm trí. Tâm có tĩnh, nét viết mới thanh.', author: 'Khuyết Danh' },
  { id: '4', text: 'Tập trung là chìa khóa mở lối cho những ý tưởng sâu sắc nhất của bạn.', author: 'Trí Tuệ Cổ Nhân' },
  { id: '5', text: 'Hãy viết như thể không ai đọc, sáng tạo như thể không có giới hạn nào tồn tại.', author: 'Tinh Thần Zen' }
];

export const THEME_PRESETS = [
  { name: 'Xám Đá (Slate)', value: 'slate' },
  { name: 'Hổ Phách (Amber)', value: 'amber' },
  { name: 'Xanh Ngọc (Emerald)', value: 'emerald' },
  { name: 'Chàm Sâu (Indigo)', value: 'indigo' },
  { name: 'Cổ Điển (Zinc)', value: 'zinc' }
];
