import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel,
  Card,
  CardContent,
  Chip,
  Autocomplete,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Fab,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { sendSMSBatch, deleteSMSMessage, resendSMSMessage, SMSRecipient } from '../../services/smsService';
import { useDelete, useCreate, useUpdate, useList } from '@refinedev/core';
import { dataProvider } from '../../providers/dataProvider';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { StatCard } from '../../components/StatCard';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { StatusChip } from '../../components/messaging/StatusChip';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CommonModalShell } from '../../components/common/CommonModalShell';
import { SharedDataGrid } from '../../components/common/SharedDataGrid';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { GridColDef } from '@mui/x-data-grid';
import {
  Send as SendIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  TrendingUp as LeadIcon,
  TextSnippet as TemplateIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  PriorityHigh as PriorityIcon,
  Refresh as RefreshIcon,
  CheckCircle as DeliveredIcon,
  Error as ErrorIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// FAB positioning constants
const FAB_BOTTOM_OFFSET = 90; // Above bottom navigation
const FAB_Z_INDEX = 1000;

interface Recipient {
  id: string;
  name: string;
  phone: string;
  type: 'individual' | 'course' | 'lead_group';
  count?: number;
}

interface SMSMessage {
  id: string;
  message: string;
  recipients: string[];
  sentAt: Date;
  status: 'sending' | 'sent' | 'failed';
  totalCount: number;
  deliveredCount: number;
  failedCount: number;
  cost: number;
  recipient_type: string;
}

const getMessageTemplates = (t: (key: string) => string) => [
  { id: 'welcome', name: t('sms.templates.welcome.name'), content: t('sms.templates.welcome.content') },
  { id: 'reminder', name: t('sms.templates.class_reminder.name'), content: t('sms.templates.class_reminder.content') },
  { id: 'cancellation', name: t('sms.templates.cancellation.name'), content: t('sms.templates.cancellation.content') },
  { id: 'promotion', name: t('sms.templates.promotion.name'), content: t('sms.templates.promotion.content') },
  { id: 'completion', name: t('sms.templates.completion.name'), content: t('sms.templates.completion.content') },
  { id: 'follow_up', name: t('sms.templates.follow_up.name'), content: t('sms.templates.follow_up.content') },
];

const getTestPhoneNumbers = (t: (key: string) => string) => [
  { id: 'test1', name: 'Test Phone 1', phone: '+972545456489', type: 'individual' },
  { id: 'test2', name: 'Test Phone 2', phone: '+972544660397', type: 'individual' },
  { id: 'manual', name: t('sms.labels.manual_entry'), phone: '', type: 'individual' },
];

// SMS Content component for mobile cards
const CompactSMSContent: React.FC<{ sms: SMSMessage }> = ({ sms }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <MessageIcon color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {sms.message.length > 50 ? `${sms.message.substring(0, 50)}...` : sms.message}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.1em', fontWeight: 400 }}>
            {sms.totalCount} {t('sms.labels.recipients')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PriorityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.1em', fontWeight: 400 }}>
            ${sms.cost.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusChip status={sms.status} />
        <Typography variant="caption" color="text.secondary">
          {sms.sentAt.toLocaleDateString()} {sms.sentAt.toLocaleTimeString()}
        </Typography>
      </Box>
    </>
  );
};

const SimpleSMSNew: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SMSMessage | null>(null);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [messageToResend, setMessageToResend] = useState<SMSMessage | null>(null);
  const [history, setHistory] = useState<SMSMessage[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [manualPhoneNumber, setManualPhoneNumber] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState(0);
  
  // Send SMS Modal State
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [recipientFilter, setRecipientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteMessage } = useDelete();
  const { mutate: createMessage } = useCreate();
  
  // Load SMS history from API - use custom endpoint
  const [smsHistoryData, setSmsHistoryData] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const loadSmsHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const result = await dataProvider.custom!({
        url: '/sms/history',
        method: 'get'
      });
      setSmsHistoryData(result);
    } catch (error) {
      console.error('Failed to load SMS history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);
  
  // Load real recipients from API
  const { data: participantsData } = useList({ resource: 'participants' });
  const { data: activitiesData } = useList({ resource: 'activities' });
  
  // Memoize expensive calculations
  const smsMetrics = useMemo(() => {
    const maxLength = 160;
    const smsCount = Math.ceil(message.length / maxLength);
    const totalRecipients = selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0);
    const estimatedCost = (smsCount * totalRecipients * 0.06).toFixed(2);
    return { maxLength, smsCount, totalRecipients, estimatedCost };
  }, [message, selectedRecipients]);
  
  // Load SMS history on component mount
  useEffect(() => {
    const loadData = async () => {
      setHistoryLoading(true);
      try {
        const result = await dataProvider.custom!({
          url: '/sms/history',
          method: 'get'
        });
        setSmsHistoryData(result);
      } catch (error) {
        console.error('Failed to load SMS history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadData();
  }, []);
  
  // Process SMS history data when it changes
  useEffect(() => {
    if (smsHistoryData?.data) {
      const formattedHistory = smsHistoryData.data.messages?.map((item: any) => ({
        id: item.id,
        message: item.message,
        recipients: item.phone_numbers || [],
        sentAt: new Date(item.created_at),
        status: item.status,
        totalCount: item.total_recipients || 0,
        deliveredCount: item.sent_count || 0,
        failedCount: item.failed_count || 0,
        cost: (item.total_recipients || 0) * 0.1,
        recipient_type: 'individual'
      })) || [];
      setHistory(formattedHistory);
    }
  }, [smsHistoryData]);
  
  // Update recipients with real data
  useEffect(() => {
    const realRecipients = [...getTestPhoneNumbers(t)];
    
    // Add participants as individuals
    if (participantsData?.data) {
      participantsData.data.forEach((participant: any) => {
        if (participant.phone) {
          realRecipients.push({
            id: `participant-${participant.id}`,
            name: participant.name,
            phone: participant.phone,
            type: 'individual'
          });
        }
      });
    }
    
    // Add activities as courses
    if (activitiesData?.data) {
      activitiesData.data.forEach((activity: any) => {
        realRecipients.push({
          id: `course-${activity.id}`,
          name: activity.name,
          phone: `course-${activity.id}`,
          type: 'course',
          count: activity.participant_count || 0
        });
      });
    }
    
    setRecipients(realRecipients);
  }, [participantsData, activitiesData, t]);
  
  // Memoize filtered data to prevent unnecessary re-calculations
  const filteredHistory = useMemo(() => {
    return history.filter(msg => {
      const matchesSearch = !searchText || 
        msg.message.toLowerCase().includes(searchText.toLowerCase()) ||
        msg.recipient_type.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = !statusFilter || msg.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [history, searchText, statusFilter]);
  
  const filteredRecipients = useMemo(() => {
    return recipients.filter((r: Recipient) => {
      const matchesType = recipientFilter === 'all' || r.type === recipientFilter;
      const matchesSearch = !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [recipients, recipientFilter, searchTerm]);
  
  const handleView = (id: string) => {
    const messageToView = history.find(m => m.id === id);
    if (messageToView) {
      setSelectedMessage(messageToView);
      setViewDialogOpen(true);
    }
  };
  
  const handleResend = (id: string) => {
    const messageToResend = history.find(m => m.id === id);
    if (messageToResend) {
      setMessageToResend(messageToResend);
      setResendDialogOpen(true);
    }
  };
  
  const confirmResend = async () => {
    if (messageToResend) {
      try {
        setSending(true);
        await resendSMSMessage(messageToResend.recipients, messageToResend.message);
        
        // Refresh history
        await loadSmsHistory();
        
        showSuccess(`SMS resent successfully to ${messageToResend.recipients.length} recipients`);
      } catch (error) {
        console.error('Resend failed:', error);
        handleError(new Error('Failed to resend SMS'));
      } finally {
        setSending(false);
      }
    }
    setResendDialogOpen(false);
    setMessageToResend(null);
  };
  
  const handleDuplicate = (id: string) => {
    const messageToDuplicate = history.find(m => m.id === id);
    if (messageToDuplicate) {
      setMessage(messageToDuplicate.message);
      setSendModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSending(true);
      const success = await deleteSMSMessage(id);
      
      if (success) {
        // Refresh history
        await loadSmsHistory();
        
        showSuccess(t('sms.messages.delete_success'));
      } else {
        throw new Error(t('sms.messages.delete_operation_failed'));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      handleError(new Error(t('sms.messages.delete_failed')));
    } finally {
      setSending(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    console.log('Bulk deleting SMS messages with IDs:', selectedRows);
    let deleteCount = 0;
    let errorCount = 0;

    setSending(true);
    
    for (const id of selectedRows) {
      try {
        const success = await deleteSMSMessage(id);
        if (success) {
          deleteCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Delete error for ID ${id}:`, error);
        errorCount++;
      }
    }

    if (deleteCount > 0) {
      showSuccess(t('messages.bulk_delete_success', { count: deleteCount }));
      // Refresh history
      await loadSmsHistory();
    }
    if (errorCount > 0) {
      handleError(new Error(`${errorCount} items failed to delete`), t('actions.bulk_delete'));
    }

    setBulkDeleteDialogOpen(false);
    setSelectedRows([]);
    setSending(false);
  };
  
  const handleTemplateSelect = (templateId: string) => {
    const template = getMessageTemplates(t).find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };
  
  const handleAddManualPhone = () => {
    if (manualPhoneNumber.trim()) {
      // Clean and format the phone number
      let cleanPhone = manualPhoneNumber.trim();
      
      // Remove any non-digit characters except +
      cleanPhone = cleanPhone.replace(/[^\d+]/g, '');
      
      // If it doesn't start with +, add +972 for Israeli numbers
      if (!cleanPhone.startsWith('+')) {
        // If it starts with 0, remove it (Israeli local format)
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1);
        }
        cleanPhone = '+972' + cleanPhone;
      }
      
      const newRecipient: Recipient = {
        id: `manual-${Date.now()}`,
        name: `Manual: ${cleanPhone}`,
        phone: cleanPhone,
        type: 'individual'
      };
      setSelectedRecipients([...selectedRecipients, newRecipient]);
      setManualPhoneNumber('');
    }
  };
  
  const handleSendSMS = async () => {
    if (!message.trim() || selectedRecipients.length === 0) {
      return;
    }
    
    setSending(true);
    
    try {
      // Convert selectedRecipients to SMSRecipient format
      const smsRecipients: SMSRecipient[] = selectedRecipients.map(recipient => ({
        id: recipient.id,
        name: recipient.name,
        phone: recipient.phone || '', // Handle different phone field names
        type: recipient.type
      }));
      
      // Send SMS using AWS SNS
      const result = await sendSMSBatch(smsRecipients, message.trim());
      
      // Reload SMS history from API instead of using local state
      await loadSmsHistory();
      
      resetSendModal();
      setSending(false);
      setSendModalOpen(false);
      
      if (result.successCount > 0) {
        showSuccess(t('sms.messages.success_detailed', { successCount: result.successCount, totalSent: result.totalSent, cost: result.cost.toFixed(4) }));
      } else {
        handleError(new Error(t('sms.messages.failed_all')));
      }
      
    } catch (error) {
      console.error('SMS sending error:', error);
      setSending(false);
      // Don't close modal or reset form on error - let user try again
      handleError(error instanceof Error ? error : new Error(t('sms.messages.failed_unknown')));
    }
  };
  
  const resetSendModal = () => {
    setMessage('');
    setSelectedRecipients([]);
    setSelectedTemplate('');
    setRecipientFilter('all');
    setSearchTerm('');
    setManualPhoneNumber('');
  };
  
  const getRecipientIcon = (type: string) => {
    switch (type) {
      case 'individual': return <PersonIcon fontSize="small" />;
      case 'course': return <SchoolIcon fontSize="small" />;
      case 'lead_group': return <LeadIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };
  
  const columns: GridColDef[] = [
    {
      field: 'sentAt',
      headerName: t('sms.columns.date_time'),
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.sentAt.toLocaleDateString()} {params.row.sentAt.toLocaleTimeString()}
        </Typography>
      )
    },
    {
      field: 'message',
      headerName: t('sms.columns.message'),
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.message.length > 50 ? `${params.row.message.substring(0, 50)}...` : params.row.message}
        </Typography>
      )
    },
    {
      field: 'totalCount',
      headerName: t('sms.columns.recipients'),
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'medium', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.totalCount}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: t('sms.columns.status'),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <StatusChip status={params.row.status} />
        </Box>
      )
    },
    {
      field: 'action',
      headerName: t('sms.columns.actions'),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <ActionMenu
            onEdit={() => handleView(params.row.id)}
            onDuplicate={() => handleDuplicate(params.row.id)}
            onDelete={() => handleDelete(params.row.id)}
            editLabel={t('actions.view')}
            useViewIcon={true}
            additionalActions={[
              {
                label: t('actions.resend'),
                icon: <RefreshIcon color="primary" />,
                onClick: () => handleResend(params.row.id)
              }
            ]}
          />
        </Box>
      ),
    },
  ];
  
  // Memoize stats calculations
  const stats = useMemo(() => ({
    totalMessages: history.length,
    sentCount: history.filter(m => m.status === 'sent').length,
    failedCount: history.filter(m => m.status === 'failed').length,
    totalCost: history.reduce((sum, msg) => sum + msg.cost, 0)
  }), [history]);

  // Handle card click for mobile
  const handleCardClick = (sms: SMSMessage) => {
    setSelectedMessage(sms);
    setViewDialogOpen(true);
  };

  // Handle card edit for mobile
  const handleCardEdit = (sms: SMSMessage) => {
    handleView(sms.id);
  };

  // Handle card duplicate for mobile
  const handleCardDuplicate = (sms: SMSMessage) => {
    handleDuplicate(sms.id);
  };

  // Handle card delete for mobile
  const handleCardDelete = (sms: SMSMessage) => {
    handleDelete(sms.id);
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => (
    <div hidden={value !== index}>
      {value === index && children}
    </div>
  );

  // Send Form Content component
  const SendFormContent = () => (
    <Grid container spacing={isMobile ? 2 : 3} sx={{ mt: isMobile ? 0 : 1 }}>
      {/* Left Column - Recipients */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 6, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> {t('sms.labels.recipients')}
            </Typography>

            {/* Search and Filter Row */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder={t('sms.search.recipients_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  endAdornment: searchTerm && (
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )
                }}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select 
                  value={recipientFilter} 
                  onChange={(e) => setRecipientFilter(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === 'all') return t('sms.recipient_types.all');
                    if (selected === 'individual') return t('sms.recipient_types.individual');
                    if (selected === 'course') return t('sms.recipient_types.course');
                    if (selected === 'lead_group') return t('sms.recipient_types.lead_group');
                    return t('sms.recipient_types.all');
                  }}
                >
                  <MenuItem value="all">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      {t('sms.recipient_types.all')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="individual">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      {t('sms.recipient_types.individual')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="course">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon fontSize="small" />
                      {t('sms.recipient_types.course')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="lead_group">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LeadIcon fontSize="small" />
                      {t('sms.recipient_types.lead_group')}
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Recipients Selection */}
            <Autocomplete
              multiple
              options={filteredRecipients}
              getOptionLabel={(option) => `${option.name}${option.count ? ` (${option.count})` : ''}`}
              value={selectedRecipients}
              onChange={(_, newValue) => setSelectedRecipients(newValue)}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="checkbox"
                      checked={selected}
                      style={{ marginRight: 8 }}
                      readOnly
                    />
                    {getRecipientIcon(option.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t(`sms.recipient_types.${option.type}`, option.type.replace('_', ' '))} {option.count ? `• ${option.count}${t('sms.labels.people_count')}` : ''}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    icon={getRecipientIcon(option.type)}
                    label={`${option.name}${option.count ? ` (${option.count})` : ''}`}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('sms.placeholders.select_recipients')}
                  variant="outlined"
                  helperText={t('sms.help.recipient_selection')}
                />
              )}
            />

            {/* Manual Phone Number Input */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('sms.labels.manual_phone_entry')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder={t('sms.placeholders.manual_phone')}
                  value={manualPhoneNumber}
                  onChange={(e) => setManualPhoneNumber(e.target.value)}
                  helperText={t('sms.placeholders.manual_phone_helper')}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddManualPhone}
                  disabled={!manualPhoneNumber.trim()}
                  sx={{ height: 40 }}
                >
                  {t('sms.labels.add_button')}
                </Button>
              </Box>
            </Box>

            {/* Selected Summary */}
            {selectedRecipients.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>{smsMetrics.totalRecipients}{t('sms.labels.recipients_selected')}</strong>
                </Typography>
                <Typography variant="caption">
                  {t('sms.labels.estimated_cost')}${smsMetrics.estimatedCost} ({smsMetrics.smsCount}{t('sms.labels.sms_count')} × {smsMetrics.totalRecipients} recipients)
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Right Column - Message */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 6, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon /> {t('sms.labels.message')}
            </Typography>

            {/* Templates */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('sms.templates.quick_templates')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {getMessageTemplates(t).map((template) => (
                  <Chip
                    key={template.id}
                    label={template.name}
                    size="small"
                    variant={selectedTemplate === template.id ? 'filled' : 'outlined'}
                    color={selectedTemplate === template.id ? 'primary' : 'default'}
                    onClick={() => handleTemplateSelect(template.id)}
                    icon={<TemplateIcon />}
                  />
                ))}
              </Box>
            </Box>

            {/* Message Input */}
            <TextField
              fullWidth
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('sms.placeholders.message')}
              helperText={`${message.length}/${smsMetrics.maxLength}${t('sms.labels.character_count')} • ${smsMetrics.smsCount}${t('sms.labels.sms_count')}`}
              sx={{ mb: 2 }}
            />

            {/* Character Progress */}
            <LinearProgress
              variant="determinate"
              value={(message.length / smsMetrics.maxLength) * 100}
              sx={{ 
                mb: 2, 
                height: 6, 
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: message.length > smsMetrics.maxLength ? 'error.main' : 'primary.main'
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? 10 : 3, // Bottom padding for mobile nav and desktop spacing
      px: isMobile ? 1 : 3,  // Add desktop padding like participants
      pt: isMobile ? 1 : 3,  // Add top padding like participants
      minHeight: isMobile ? 'auto' : '100vh',
      backgroundColor: isMobile ? '#f8f9fa' : 'background.default',
      overflow: isMobile ? 'hidden' : 'visible',
      '&::-webkit-scrollbar': isMobile ? { display: 'none' } : {},
      scrollbarWidth: isMobile ? 'none' : 'auto',
    }}>
      {/* Page Title - Desktop Only */}
      {!isMobile && (
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {t('navigation.sms_messaging')}
        </Typography>
      )}

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.total_messages')} 
            value={stats.totalMessages.toString()} 
            icon={<MessageIcon sx={{ fontSize: isMobile ? 24 : 40 }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.sent')} 
            value={stats.sentCount.toString()} 
            icon={<DeliveredIcon sx={{ fontSize: isMobile ? 24 : 40 }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.failed')} 
            value={stats.failedCount.toString()} 
            icon={<ErrorIcon sx={{ fontSize: isMobile ? 24 : 40 }} />} 
            color="error" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.total_cost')} 
            value={`$${stats.totalCost.toFixed(2)}`} 
            icon={<PriorityIcon sx={{ fontSize: isMobile ? 24 : 40 }} />} 
            color="info" 
          />
        </Grid>
      </Grid>

      {/* Main Content Container */}
      <Box sx={{ 
        p: isMobile ? 0 : 2, 
        backgroundColor: isMobile ? 'transparent' : 'background.paper', 
        borderRadius: isMobile ? 0 : 1.5, 
        boxShadow: isMobile ? 'none' : 3, 
        border: isMobile ? 'none' : '1px solid', 
        borderColor: isMobile ? 'transparent' : 'divider' 
      }}>
        {/* Desktop Data Grid */}
        {!isMobile && (
          <SharedDataGrid
          rows={filteredHistory}
          columns={columns}
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder={t('sms.search.placeholder')}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { value: '', label: t('common.all') },
            { value: 'sent', label: t('sms.status.sent') },
            { value: 'sending', label: t('sms.status.sending') },
            { value: 'failed', label: t('sms.status.failed') },
          ]}
          filterLabel={t('sms.labels.status')}
          enableSelection={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onCreateNew={() => setSendModalOpen(true)}
          createButtonText={t('sms.buttons.send_sms')}
          createButtonIcon={<SendIcon />}
          onBulkDelete={() => setBulkDeleteDialogOpen(true)}
          bulkDeleteText={t('actions.delete')}
          loading={historyLoading}
        />
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Filter Controls */}
            <Box sx={{ 
              mb: 1.5, 
              px: 1,
              display: 'flex', 
              gap: 1,
              flexDirection: 'column',
              alignItems: 'stretch'
            }}>
              {/* Bulk Delete Button (when items selected) */}
              {selectedRows.length > 0 && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    mb: 1
                  }}
                >
                  {t('actions.delete')} ({selectedRows.length})
                </Button>
              )}
              
              {/* Search Field */}
              <TextField
                placeholder={t('sms.search.placeholder')}
                variant="outlined"
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
              
              {/* Status Filter */}
              <FormControl 
                size="small" 
                sx={{ minWidth: '100%' }}
              >
                <InputLabel>{t('sms.labels.status')}</InputLabel>
                <Select
                  label={t('sms.labels.status')}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: 3
                  }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="sent">{t('sms.status.sent')}</MenuItem>
                  <MenuItem value="sending">{t('sms.status.sending')}</MenuItem>
                  <MenuItem value="failed">{t('sms.status.failed')}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Mobile Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 1 }}>
              {historyLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              {!historyLoading && filteredHistory.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('sms.no_messages')}
                  </Typography>
                </Box>
              )}
              {!historyLoading && filteredHistory.map((sms) => (
                <CompactCardShell
                  key={sms.id}
                  entityId={sms.id}
                  onCardClick={() => handleCardClick(sms)}
                  onEdit={() => handleCardEdit(sms)}
                  onDuplicate={() => handleCardDuplicate(sms)}
                  onDelete={() => handleCardDelete(sms)}
                  customActions={[
                    {
                      label: t('actions.resend'),
                      icon: <RefreshIcon color="primary" />,
                      onClick: () => handleResend(sms.id)
                    }
                  ]}
                >
                  <CompactSMSContent sms={sms} />
                </CompactCardShell>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Mobile FAB */}
      {isMobile && !historyLoading && (
        <Fab
          color="primary"
          onClick={() => setSendModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: FAB_BOTTOM_OFFSET, // Above bottom navigation
            right: 16,
            zIndex: FAB_Z_INDEX,
            boxShadow: 4,
          }}
        >
          <SendIcon />
        </Fab>
      )}

      {/* Send SMS Modal using CommonModalShell */}
      <CommonModalShell
        open={sendModalOpen}
        onClose={() => { setSendModalOpen(false); resetSendModal(); }}
        title={t('sms.dialogs.send_title')}
        forceMobile={false}
        maxWidth="lg"
        showActions={true}
        onCancel={() => { setSendModalOpen(false); resetSendModal(); }}
        onSave={handleSendSMS}
        cancelButtonText={t('actions.cancel')}
        saveButtonText={sending ? t('sms.buttons.sending') : t('sms.buttons.send_sms')}
        saveButtonDisabled={!message.trim() || selectedRecipients.length === 0 || sending}
      >
        <SendFormContent />
      </CommonModalShell>
      
      {/* Resend Confirmation Dialog */}
      <ConfirmationDialog
        open={resendDialogOpen}
        onClose={() => setResendDialogOpen(false)}
        onConfirm={confirmResend}
        title={t('sms.dialogs.resend_title')}
        description={t('sms.dialogs.resend_description')}
      />
      
      {/* View Dialog using CommonModalShell */}
      <CommonModalShell
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        title={t('sms.dialogs.view_title')}
        forceMobile={isMobile}
        maxWidth="sm"
        showActions={true}
        onCancel={() => setViewDialogOpen(false)}
        cancelButtonText={t('actions.close')}
        onSave={undefined}
      >
        {selectedMessage && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('sms.labels.sent')}: {selectedMessage.sentAt.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('sms.labels.status')}: <StatusChip status={selectedMessage.status} />
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              {t('sms.labels.message')}:
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedMessage.message}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {t('sms.labels.recipients')}: {selectedMessage.totalCount}
            </Typography>
          </Box>
        )}
      </CommonModalShell>

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('sms.labels.messages')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
    </Box>
  );
});

SimpleSMSNew.displayName = 'SimpleSMSNew';

export default SimpleSMSNew;