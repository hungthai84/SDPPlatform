import React, { useState, useEffect } from 'react';
import { mockCustomers, mockAgents } from '../data';
import { 
  Search, Plus, Filter, Mail, Phone, 
  Building2, MapPin, ExternalLink, Star, X, User, 
  Shield, Tag, Calendar, Globe, UserCheck, Check, 
  Trash2, Edit2, AlertCircle, FileText,
  SlidersHorizontal, PlusCircle
} from 'lucide-react';
import { Customer, CustomFieldDefinition } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerFormState {
  type: 'individual' | 'company';
  name: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  company: string;
  taxCode: string;
  industry: string;
  vipLevel: 'standard' | 'silver' | 'gold' | 'platinum';
  tags: string[];
  source: string;
  assignedAgentId: string;
  province: string;
  district: string;
  detailAddress: string;
  notes: string;
}

const defaultForm: CustomerFormState = {
  type: 'individual',
  name: '',
  phone: '',
  email: '',
  gender: 'male',
  birthdate: '',
  company: '',
  taxCode: '',
  industry: '',
  vipLevel: 'standard',
  tags: [],
  source: '',
  assignedAgentId: '',
  province: '',
  district: '',
  detailAddress: '',
  notes: '',
};

const VIETNAM_PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 
  'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Quảng Ninh', 'Lâm Đồng'
];

const CRM_TAGS = [
  'Tiềm năng', 'Đang chăm sóc', 'Quan tâm', 'Nóng', 'Lạnh', 
  'Đã mua hàng', 'Hỗ trợ VIP', 'Cần liên hệ lại'
];

const LEAD_SOURCES = [
  'Hotline', 'Website', 'Facebook Fanpage', 'Zalo OA', 'Giới thiệu (Referral)', 'Khác'
];

const INDUSTRIES = [
  'Công nghệ thông tin', 'Bất động sản', 'Tài chính - Ngân hàng', 
  'Giáo dục', 'Y tế - Sức khỏe', 'Sản xuất - Thương mại', 'Khác'
];

const defaultCustomFields: CustomFieldDefinition[] = [
  { id: 'field_income', name: 'Mức thu nhập hàng tháng', type: 'select', options: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 50 triệu', 'Trên 50 triệu'] },
  { id: 'field_hobby', name: 'Sở thích cá nhân', type: 'text' },
  { id: 'field_joined_date', name: 'Ngày tham gia hệ thống', type: 'date' },
  { id: 'field_fb_profile', name: 'Link Facebook Profile', type: 'text' }
];

export const Customers = () => {
  // State for Customer list loaded from LocalStorage
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('crm_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse crm_customers', e);
      }
    }
    return mockCustomers;
  });

  // State for Custom Field Definitions
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(() => {
    const saved = localStorage.getItem('crm_custom_fields');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse crm_custom_fields', e);
      }
    }
    return defaultCustomFields;
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crm_custom_fields', JSON.stringify(customFields));
  }, [customFields]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVipFilter, setSelectedVipFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [formState, setFormState] = useState<CustomerFormState>(defaultForm);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'address' | 'custom'>('basic');
  const [newCustomTag, setNewCustomTag] = useState('');

  // Fields Creation states (for creating custom fields on-the-fly)
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'date' | 'select'>('text');
  const [newFieldOptionsString, setNewFieldOptionsString] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // Stats calculate
  const totalCount = customers.length;
  const individualCount = customers.filter(c => c.type === 'individual' || !c.company).length;
  const companyCount = customers.filter(c => c.type === 'company' || c.company).length;
  const vipGoldPlatinum = customers.filter(c => c.vipLevel === 'gold' || c.vipLevel === 'platinum').length;

  const getVipBadge = (level: Customer['vipLevel']) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'silver': return 'bg-slate-200 text-slate-700 border-slate-300';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getVipLabel = (level: Customer['vipLevel']) => {
    switch (level) {
      case 'platinum': return 'Platinum';
      case 'gold': return 'Gold';
      case 'silver': return 'Silver';
      default: return 'Standard';
    }
  };

  const handleOpenAddDrawer = () => {
    setFormState(defaultForm);
    setCustomFieldValues({});
    setEditingCustomerId(null);
    setFormErrors({});
    setActiveTab('basic');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (customer: Customer) => {
    setFormState({
      type: customer.type || (customer.company ? 'company' : 'individual'),
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      gender: customer.gender || 'male',
      birthdate: customer.birthdate || '',
      company: customer.company || '',
      taxCode: customer.taxCode || '',
      industry: customer.industry || '',
      vipLevel: customer.vipLevel || 'standard',
      tags: customer.tags || [],
      source: customer.source || '',
      assignedAgentId: customer.assignedAgentId || '',
      province: customer.province || '',
      district: customer.district || '',
      detailAddress: customer.detailAddress || '',
      notes: customer.notes || '',
    });
    setCustomFieldValues(customer.customFields || {});
    setEditingCustomerId(customer.id);
    setFormErrors({});
    setActiveTab('basic');
    setIsDrawerOpen(true);
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" khỏi hệ thống?`)) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCreateCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    const nameClean = newFieldName.trim();
    if (!nameClean) return;
    
    const newField: CustomFieldDefinition = {
      id: `field_${Date.now()}`,
      name: nameClean,
      type: newFieldType,
      isRequired: newFieldRequired,
      options: newFieldType === 'select' 
        ? newFieldOptionsString.split(',').map(o => o.trim()).filter(Boolean)
        : undefined
    };

    setCustomFields(prev => [...prev, newField]);
    
    // Reset inputs
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptionsString('');
    setNewFieldRequired(false);
    setIsCreatingField(false);
  };

  const handleDeleteCustomField = (fieldId: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa trường tùy chỉnh "${name}" khỏi hệ thống?`)) {
      setCustomFields(prev => prev.filter(f => f.id !== fieldId));
    }
  };

  const handleToggleTag = (tag: string) => {
    setFormState(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newCustomTag.trim();
    if (cleanTag && !formState.tags.includes(cleanTag)) {
      setFormState(prev => ({
        ...prev,
        tags: [...prev.tags, cleanTag]
      }));
      setNewCustomTag('');
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; phone?: string; email?: string } = {};
    if (!formState.name.trim()) {
      errors.name = 'Họ và tên bắt buộc không được bỏ trống';
    }
    if (!formState.phone.trim()) {
      errors.phone = 'Số điện thoại bắt buộc không được bỏ trống';
    } else if (!/^[0-9+() \-]{8,15}$/.test(formState.phone.trim())) {
      errors.phone = 'Số điện thoại không đúng định dạng';
    }
    if (formState.email.trim() && !/\S+@\S+\.\S+/.test(formState.email.trim())) {
      errors.email = 'Email không đúng định dạng';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCustomer = () => {
    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }

    if (editingCustomerId) {
      // Edit mode
      setCustomers(prev => prev.map(c => {
        if (c.id === editingCustomerId) {
          return {
            ...c,
            name: formState.name,
            email: formState.email,
            phone: formState.phone,
            company: formState.type === 'company' ? formState.company : undefined,
            type: formState.type,
            gender: formState.gender,
            birthdate: formState.birthdate,
            taxCode: formState.type === 'company' ? formState.taxCode : undefined,
            industry: formState.type === 'company' ? formState.industry : undefined,
            vipLevel: formState.vipLevel,
            tags: formState.tags,
            source: formState.source,
            assignedAgentId: formState.assignedAgentId,
            province: formState.province,
            district: formState.district,
            detailAddress: formState.detailAddress,
            notes: formState.notes,
            customFields: customFieldValues,
          };
        }
        return c;
      }));
    } else {
      // Add mode
      const newCustomer: Customer = {
        id: `c_${Date.now().toString().slice(-6)}`,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        company: formState.type === 'company' ? formState.company : undefined,
        type: formState.type,
        gender: formState.gender,
        birthdate: formState.birthdate,
        taxCode: formState.type === 'company' ? formState.taxCode : undefined,
        industry: formState.type === 'company' ? formState.industry : undefined,
        vipLevel: formState.vipLevel,
        tags: formState.tags,
        source: formState.source,
        assignedAgentId: formState.assignedAgentId,
        province: formState.province,
        district: formState.district,
        detailAddress: formState.detailAddress,
        notes: formState.notes,
        createdAt: new Date().toISOString(),
        customFields: customFieldValues,
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }

    setIsDrawerOpen(false);
  };

  // Filter customers based on search query and drop down criteria
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchQuery)) ||
      (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.tags && customer.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesVip = selectedVipFilter === 'all' || customer.vipLevel === selectedVipFilter;
    
    const isCompanyType = customer.type === 'company' || !!customer.company;
    const matchesType = 
      selectedTypeFilter === 'all' || 
      (selectedTypeFilter === 'individual' && !isCompanyType) ||
      (selectedTypeFilter === 'company' && isCompanyType);

    return matchesSearch && matchesVip && matchesType;
  });

  return (
    <div className="flex flex-col h-full bg-transparent flex-1 relative select-none">
      
      {/* Dynamic Summary Cards Row - OmiCRM Look */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 pt-1 pb-4">
        <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng số khách hàng</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <UserCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cá nhân</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{individualCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doanh nghiệp / Tổ chức</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{companyCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
            <Star size={18} className="fill-yellow-500 text-yellow-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hạng VIP Vàng trở lên</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{vipGoldPlatinum}</div>
          </div>
        </div>
      </div>

      {/* Control bar / filters */}
      <div className="px-6 py-4.5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm tên, SĐT, email, thẻ tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-full md:w-60 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Type dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Loại:</span>
            <select 
              value={selectedTypeFilter} 
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="font-semibold bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="individual">Cá nhân</option>
              <option value="company">Doanh nghiệp</option>
            </select>
          </div>

          {/* VIP filter dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Phân hạng:</span>
            <select 
              value={selectedVipFilter} 
              onChange={(e) => setSelectedVipFilter(e.target.value)}
              className="font-semibold bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả hạng</option>
              <option value="standard">Hạng Standard</option>
              <option value="silver">Hạng Silver</option>
              <option value="gold">Hạng Gold</option>
              <option value="platinum">Hạng Platinum</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleOpenAddDrawer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap shadow-md hover:scale-102 active:scale-98 w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khách hàng mới</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col mx-6 my-4">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Thông tin liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Công ty &amp; Tổ chức</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Phân hạng VIP</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Người phụ trách</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy khách hàng nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const assignedAgent = mockAgents.find(a => a.id === customer.assignedAgentId);
                  const isCompany = customer.type === 'company' || !!customer.company;
                  
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 w-12 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-slate-200/30",
                            isCompany 
                              ? "bg-purple-50 text-purple-700" 
                              : "bg-blue-50 text-blue-700"
                          )}>
                            {isCompany ? <Building2 className="w-5 h-5" /> : customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => handleOpenEditDrawer(customer)}>
                              {customer.name}
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0",
                                isCompany 
                                  ? "bg-purple-50 text-purple-600 border-purple-100" 
                                  : "bg-blue-50 text-blue-600 border-blue-100"
                              )}>
                                {isCompany ? "DN" : "CN"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5 flex items-center gap-2">
                              <span>Mã: {customer.id}</span>
                              {customer.source && (
                                <span className="bg-slate-100 text-slate-500 px-1 rounded flex items-center gap-0.5">
                                  <Globe className="w-2.5 h-2.5" />
                                  {customer.source}
                                </span>
                              )}
                            </div>
                            {/* Tags Chips in list */}
                            {customer.tags && customer.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {customer.tags.map((tag, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200/60 rounded px-1.5 py-0.5 text-[9px] font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Custom Fields in list */}
                            {customer.customFields && Object.keys(customer.customFields).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5 max-w-sm">
                                {Object.entries(customer.customFields).map(([key, val]) => {
                                  if (!val) return null;
                                  const def = customFields.find(f => f.id === key);
                                  if (!def) return null;
                                  return (
                                    <span key={key} className="bg-blue-50 text-blue-700 border border-blue-100 rounded px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1 shrink-0">
                                      <span className="opacity-75">{def.name}:</span>
                                      <span className="font-extrabold">{val}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-slate-600 text-xs hover:text-blue-600 cursor-pointer w-fit font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {customer.email}
                          </a>
                          {customer.phone && (
                            <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-slate-600 text-xs hover:text-blue-600 cursor-pointer w-fit font-mono font-medium">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {customer.phone}
                            </a>
                          )}
                          {(customer.province || customer.district) && (
                            <span className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate max-w-[200px] font-medium mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {[customer.detailAddress, customer.district, customer.province].filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {customer.company ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {customer.company}
                            </div>
                            {customer.taxCode && (
                              <div className="text-[10px] text-slate-400 font-mono">MST: {customer.taxCode}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs font-medium">Khách hàng cá nhân</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1 w-fit uppercase tracking-wider",
                          getVipBadge(customer.vipLevel)
                        )}>
                          <Star className="w-3 h-3 fill-current" />
                          {getVipLabel(customer.vipLevel)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {assignedAgent ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center border border-white shrink-0">
                              {assignedAgent.name.charAt(0)}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{assignedAgent.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Chưa chỉ định</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEditDrawer(customer)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEditDrawer(customer)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
                            title="Chi tiết hồ sơ"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-bold">
          <div>Hiển thị <span className="font-extrabold text-slate-950">{filteredCustomers.length}</span> trên tổng số <span className="font-extrabold text-slate-950">{customers.length}</span> khách hàng</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-bold cursor-pointer disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-bold cursor-pointer disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      {/* OmiCRM-style Right Sidebar Slide-over Drawer with AnimatePresence */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900 z-[9999] backdrop-blur-[2px]"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Main Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[560px] max-h-[85vh] bg-white border border-slate-200 shadow-2xl rounded-2xl z-[10000] flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold">
                    {editingCustomerId ? <Edit2 size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {editingCustomerId ? 'Cập nhật hồ sơ khách hàng' : 'Thêm khách hàng mới'}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {editingCustomerId ? 'Thay đổi thông tin dữ liệu lưu trữ' : 'Đồng bộ hồ sơ dữ liệu với OmiCRM'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs Control */}
              <div className="flex border-b border-slate-100 bg-slate-50/30 px-3 shrink-0">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={cn(
                    "flex-1 py-3 px-1 text-center font-bold text-xs transition-colors border-b-2 cursor-pointer",
                    activeTab === 'basic' 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  Thông tin cơ bản
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={cn(
                    "flex-1 py-3 px-1 text-center font-bold text-xs transition-colors border-b-2 cursor-pointer",
                    activeTab === 'address' 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  Liên hệ &amp; Địa chỉ
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={cn(
                    "flex-1 py-3 px-1 text-center font-bold text-xs transition-colors border-b-2 cursor-pointer",
                    activeTab === 'advanced' 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  Phân loại &amp; Ghi chú
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={cn(
                    "flex-1 py-3 px-1 text-center font-bold text-xs transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1",
                    activeTab === 'custom' 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  Trường tùy chỉnh
                  <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">{customFields.length}</span>
                </button>
              </div>

              {/* Drawer Body - Scrollable Form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* TAB 1: BASIC INFO */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    {/* Customer Type Card Selection */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Loại khách hàng *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormState(p => ({ ...p, type: 'individual' }))}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer font-bold text-xs",
                            formState.type === 'individual'
                              ? "bg-blue-50/60 border-blue-600 text-blue-600 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                          )}
                        >
                          <User size={16} />
                          <span>Cá nhân</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormState(p => ({ ...p, type: 'company' }))}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer font-bold text-xs",
                            formState.type === 'company'
                              ? "bg-purple-50/60 border-purple-600 text-purple-600 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                          )}
                        >
                          <Building2 size={16} />
                          <span>Doanh nghiệp</span>
                        </button>
                      </div>
                    </div>

                    {/* Full Name field */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Họ và tên khách hàng *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Nhập tên đầy đủ (ví dụ: Nguyễn Văn A)"
                          value={formState.name}
                          onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-3 py-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2",
                            formErrors.name 
                              ? "border-red-500 focus:ring-red-500/20" 
                              : "border-slate-200 focus:ring-blue-500/20"
                          )}
                        />
                      </div>
                      {formErrors.name && (
                        <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Phone field */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Số điện thoại liên hệ *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Nhập số điện thoại di động"
                          value={formState.phone}
                          onChange={(e) => setFormState(p => ({ ...p, phone: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-3 py-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2 font-mono",
                            formErrors.phone 
                              ? "border-red-500 focus:ring-red-500/20" 
                              : "border-slate-200 focus:ring-blue-500/20"
                          )}
                        />
                      </div>
                      {formErrors.phone && (
                        <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.phone}
                        </span>
                      )}
                    </div>

                    {/* Email field */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Địa chỉ Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="customer@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState(p => ({ ...p, email: e.target.value }))}
                          className={cn(
                            "w-full pl-9 pr-3 py-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2",
                            formErrors.email 
                              ? "border-red-500 focus:ring-red-500/20" 
                              : "border-slate-200 focus:ring-blue-500/20"
                          )}
                        />
                      </div>
                      {formErrors.email && (
                        <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Gender & Birthday Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Giới tính</label>
                        <select
                          value={formState.gender}
                          onChange={(e) => setFormState(p => ({ ...p, gender: e.target.value as 'male' | 'female' | 'other' }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Ngày sinh</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            value={formState.birthdate}
                            onChange={(e) => setFormState(p => ({ ...p, birthdate: e.target.value }))}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conditional Organization/Corporate Fields (Shown only if Business Type selected) */}
                    {formState.type === 'company' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-50/35 border border-purple-100 rounded-xl p-4 mt-2 space-y-4"
                      >
                        <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5 mb-1">
                          <Building2 size={14} />
                          <span>Thông tin pháp nhân doanh nghiệp</span>
                        </div>
                        
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Tên Công ty / Đơn vị chủ quản</label>
                          <input
                            type="text"
                            placeholder="Tên doanh nghiệp viết đúng theo đăng ký kinh doanh"
                            value={formState.company}
                            onChange={(e) => setFormState(p => ({ ...p, company: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Mã số thuế doanh nghiệp</label>
                            <input
                              type="text"
                              placeholder="MST doanh nghiệp"
                              value={formState.taxCode}
                              onChange={(e) => setFormState(p => ({ ...p, taxCode: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Lĩnh vực hoạt động</label>
                            <select
                              value={formState.industry}
                              onChange={(e) => setFormState(p => ({ ...p, industry: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                            >
                              <option value="">Lựa chọn lĩnh vực</option>
                              {INDUSTRIES.map((ind, i) => (
                                <option key={i} value={ind}>{ind}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* TAB 2: ADDRESS & CONTACTS */}
                {activeTab === 'address' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <MapPin size={14} className="text-blue-500" />
                      <span>Địa điểm và địa chỉ giao dịch</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Tỉnh / Thành phố</label>
                        <select
                          value={formState.province}
                          onChange={(e) => setFormState(p => ({ ...p, province: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                        >
                          <option value="">-- Chọn Tỉnh/Thành phố --</option>
                          {VIETNAM_PROVINCES.map((prov, i) => (
                            <option key={i} value={prov}>{prov}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Quận / Huyện</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Quận Cầu Giấy"
                          value={formState.district}
                          onChange={(e) => setFormState(p => ({ ...p, district: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Số nhà, ngõ, tên đường chi tiết</label>
                      <input
                        type="text"
                        placeholder="Số 10, Ngách 5, Ngõ 19 Trần Duy Hưng"
                        value={formState.detailAddress}
                        onChange={(e) => setFormState(p => ({ ...p, detailAddress: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                      />
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 space-y-4">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe size={14} className="text-indigo-500" />
                        <span>Kênh &amp; Nguồn tiếp cận khách hàng</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Nguồn tiếp cận</label>
                          <select
                            value={formState.source}
                            onChange={(e) => setFormState(p => ({ ...p, source: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                          >
                            <option value="">Không có / Chưa xác định</option>
                            {LEAD_SOURCES.map((src, i) => (
                              <option key={i} value={src}>{src}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Nhân viên quản lý phụ trách</label>
                          <select
                            value={formState.assignedAgentId}
                            onChange={(e) => setFormState(p => ({ ...p, assignedAgentId: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                          >
                            <option value="">Chưa chỉ định (Lưu kho chung)</option>
                            {mockAgents.map((agent) => (
                              <option key={agent.id} value={agent.id}>{agent.name} ({agent.role})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CLASSIFICATION & NOTES */}
                {activeTab === 'advanced' && (
                  <div className="space-y-4">
                    
                    {/* VIP Level Cards Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Phân hạng VIP</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['standard', 'silver', 'gold', 'platinum'] as const).map((level) => {
                          const isSel = formState.vipLevel === level;
                          let lvlColor = "text-slate-500 bg-slate-50 hover:bg-slate-100";
                          let borderClass = "border-slate-200";
                          if (isSel) {
                            if (level === 'platinum') { lvlColor = "bg-purple-50 text-purple-700 font-extrabold"; borderClass = "border-purple-500 ring-2 ring-purple-500/10"; }
                            else if (level === 'gold') { lvlColor = "bg-yellow-50 text-yellow-700 font-extrabold"; borderClass = "border-yellow-500 ring-2 ring-yellow-500/10"; }
                            else if (level === 'silver') { lvlColor = "bg-slate-100 text-slate-800 font-extrabold"; borderClass = "border-slate-700 ring-2 ring-slate-700/10"; }
                            else { lvlColor = "bg-blue-50 text-blue-600 font-extrabold"; borderClass = "border-blue-500 ring-2 ring-blue-500/10"; }
                          }
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setFormState(p => ({ ...p, vipLevel: level }))}
                              className={cn(
                                "py-2 px-1 border rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-[11px] cursor-pointer font-bold capitalize",
                                lvlColor, borderClass
                              )}
                            >
                              <Star size={12} className={cn("shrink-0", isSel ? "fill-current" : "text-slate-400")} />
                              <span>{level}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tag Segment list selection */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Thẻ tag phân nhóm khách hàng</label>
                      <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/80">
                        {CRM_TAGS.map((tag) => {
                          const isSelected = formState.tags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border transition-all flex items-center gap-1",
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                              )}
                            >
                              <Tag size={10} />
                              <span>{tag}</span>
                              {isSelected && <Check size={10} />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Add Custom Tag Form */}
                      <form onSubmit={handleAddCustomTag} className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Thêm nhãn tag tùy chỉnh mới..."
                          value={newCustomTag}
                          onChange={(e) => setNewCustomTag(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                        />
                        <button
                          type="submit"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Thêm nhãn
                        </button>
                      </form>
                    </div>

                    {/* Notes textarea */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Nhật ký ghi chú &amp; Nhu cầu khách hàng</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        <textarea
                          rows={4}
                          placeholder="Nhập nhu cầu chi tiết của khách hàng, ghi chú các mốc thảo luận ban đầu..."
                          value={formState.notes}
                          onChange={(e) => setFormState(p => ({ ...p, notes: e.target.value }))}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: CUSTOM FIELDS MANAGEMENT & VALUE FILLING */}
                {activeTab === 'custom' && (
                  <div className="space-y-5">
                    
                    {/* Part 1: Filling Values for Current Customer */}
                    <div className="bg-slate-50/60 rounded-xl p-4.5 border border-slate-100">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-200/60 pb-2 mb-4">
                        <SlidersHorizontal size={14} className="text-blue-500 animate-pulse" />
                        <span>Giá trị trường tùy chỉnh của khách hàng</span>
                      </div>

                      {customFields.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-xs italic font-medium">
                          Chưa cấu hình trường tùy chỉnh nào trong hệ thống.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {customFields.map((field) => {
                            const value = customFieldValues[field.id] || '';
                            return (
                              <div key={field.id} className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                  {field.name}
                                  {field.isRequired && <span className="text-red-500 font-extrabold">*</span>}
                                  <span className="text-[9px] bg-slate-100 text-slate-400 px-1 py-0.2 rounded font-extrabold capitalize scale-90 ml-1">
                                    {field.type === 'select' ? 'Lựa chọn' : field.type === 'text' ? 'Văn bản' : field.type === 'number' ? 'Số' : 'Ngày'}
                                  </span>
                                </label>

                                {field.type === 'select' ? (
                                  <select
                                    value={value}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                                  >
                                    <option value="">-- Chọn {field.name} --</option>
                                    {field.options?.map((opt, oIdx) => (
                                      <option key={oIdx} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : field.type === 'date' ? (
                                  <input
                                    type="date"
                                    value={value}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                                  />
                                ) : field.type === 'number' ? (
                                  <input
                                    type="number"
                                    placeholder={`Nhập ${field.name.toLowerCase()}...`}
                                    value={value}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-semibold"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    placeholder={`Nhập ${field.name.toLowerCase()}...`}
                                    value={value}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Part 2: Dynamic Fields Structuring configuration */}
                    <div className="bg-white rounded-xl p-4.5 border border-slate-200/80">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                        <div className="flex items-center gap-1.5">
                          <SlidersHorizontal size={14} className="text-indigo-500" />
                          <span>Cấu trúc trường tùy chỉnh (CRM)</span>
                        </div>
                        {!isCreatingField && (
                          <button
                            type="button"
                            onClick={() => setIsCreatingField(true)}
                            className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold px-2 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <PlusCircle size={12} />
                            Tạo trường mới
                          </button>
                        )}
                      </div>

                      {isCreatingField ? (
                        <form onSubmit={handleCreateCustomField} className="space-y-3.5 bg-slate-50/50 p-3.5 rounded-xl border border-dashed border-slate-200">
                          <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                            Tạo thêm trường dữ liệu mới
                          </div>
                          
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Tên trường thông tin *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ví dụ: Size áo, Ngày kết hôn, Người giới thiệu..."
                              value={newFieldName}
                              onChange={(e) => setNewFieldName(e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Loại trường dữ liệu</label>
                              <select
                                value={newFieldType}
                                onChange={(e) => setNewFieldType(e.target.value as 'text' | 'number' | 'date' | 'select')}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold cursor-pointer"
                              >
                                <option value="text">Văn bản (Text)</option>
                                <option value="number">Số (Number)</option>
                                <option value="date">Ngày tháng (Date)</option>
                                <option value="select">Lựa chọn (Select)</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2 pt-5">
                              <input
                                id="newFieldRequired"
                                type="checkbox"
                                checked={newFieldRequired}
                                onChange={(e) => setNewFieldRequired(e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                              />
                              <label htmlFor="newFieldRequired" className="text-[11px] font-bold text-slate-600 cursor-pointer select-none">
                                Bắt buộc nhập
                              </label>
                            </div>
                          </div>

                          {newFieldType === 'select' && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Các giá trị lựa chọn (Cách nhau bởi dấu phẩy) *</label>
                              <input
                                type="text"
                                required
                                placeholder="Gợi ý: Lựa chọn 1, Lựa chọn 2, Lựa chọn 3"
                                value={newFieldOptionsString}
                                onChange={(e) => setNewFieldOptionsString(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setIsCreatingField(false)}
                              className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs font-bold border border-transparent cursor-pointer"
                            >
                              Hủy bỏ
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                            >
                              Tạo trường mới
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {customFields.map((field) => (
                            <div key={field.id} className="py-2.5 flex items-center justify-between text-xs group/item">
                              <div className="flex flex-col gap-0.5">
                                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                                  {field.name}
                                  {field.isRequired && <span className="text-red-500 font-extrabold text-[10px]">*</span>}
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                  <span className="bg-slate-100 px-1 py-0.2 rounded">{field.type}</span>
                                  {field.type === 'select' && field.options && (
                                    <span className="truncate max-w-[200px]" title={field.options.join(', ')}>
                                      Tùy chọn: {field.options.join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomField(field.id, field.name)}
                                className="p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer opacity-0 group-hover/item:opacity-100"
                                title="Xóa trường tùy chỉnh này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-center bg-white"
                >
                  Đóng hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomer}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                  {editingCustomerId ? 'Cập nhật thay đổi' : 'Tạo mới hồ sơ'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
