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
import { useDelete, useCreate, useUpdate, useList, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { dataProvider } from '../../providers/dataProvider';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { StatCard } from '../../components/StatCard';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { StatusChip } from '../../components/messaging/StatusChip';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CommonModalShell } from '../../components/common/CommonModalShell';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
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

// UI Constants - Match participants page exactly
const MOBILE_BOTTOM_PADDING = 10;
const MOBILE_SIDE_PADDING = 1;
const MOBILE_ICON_SIZE = 24;
const DESKTOP_ICON_SIZE = 40;
const MOBILE_SEARCH_BORDER_RADIUS = 3;
const DESKTOP_BORDER_RADIUS = 1.5;
const FAB_BOTTOM_OFFSET = 90;
const FAB_RIGHT_OFFSET = 16;
const FAB_Z_INDEX = 1000;
const DATA_GRID_HEIGHT = 500;

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

// Separate SMS form component to isolate from parent re-renders
const SMSForm: React.FC<{
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  recipientFilter: string;
  setRecipientFilter: (value: string) => void;
  filteredRecipients: Recipient[];
  selectedRecipients: Recipient[];
  setSelectedRecipients: (value: Recipient[]) => void;
  manualPhoneNumber: string;
  setManualPhoneNumber: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  selectedTemplate: string;
  handleAddManualPhone: () => void;
  handleTemplateSelect: (id: string) => void;
  getRecipientIcon: (type: string) => JSX.Element;
  isMobile: boolean;
}> = React.memo(({
  searchTerm,
  setSearchTerm,
  recipientFilter, 
  setRecipientFilter,
  filteredRecipients,
  selectedRecipients,
  setSelectedRecipients,
  manualPhoneNumber,
  setManualPhoneNumber,
  message,
  setMessage,
  selectedTemplate,
  handleAddManualPhone,
  handleTemplateSelect,
  getRecipientIcon,
  isMobile
}) => {
  const { t } = useTranslation();

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleFilterChange = React.useCallback((e: any) => {
    setRecipientFilter(e.target.value);
  }, [setRecipientFilter]);

  const handlePhoneChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualPhoneNumber(e.target.value);
  }, [setManualPhoneNumber]);

  const handleMessageChangeLocal = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, [setMessage]);

  const handleRecipientsChange = React.useCallback((_, newValue: Recipient[]) => {
    setSelectedRecipients(newValue);
  }, [setSelectedRecipients]);

  const clearSearch = React.useCallback(() => {
    setSearchTerm('');
  }, [setSearchTerm]);

  if (isMobile) {
    // Mobile Layout - Simple stacked form
    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Recipients Section - Mobile */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon /> Recipients
            </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select 
              value={recipientFilter} 
              onChange={handleFilterChange}
              displayEmpty
            >
              <MenuItem value="all">All Recipients</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="course">Course</MenuItem>
              <MenuItem value="lead_group">Lead Group</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            options={filteredRecipients}
            getOptionLabel={(option) => option.name}
            value={selectedRecipients}
            onChange={handleRecipientsChange}
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
                  <Typography variant="body2">{option.name}</Typography>
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select recipients..."
                variant="outlined"
              />
            )}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Manual Phone Entry
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="+972XXXXXXXXX"
                value={manualPhoneNumber}
                onChange={handlePhoneChange}
                autoComplete="off"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddManualPhone}
                disabled={!manualPhoneNumber.trim()}
                sx={{ minWidth: 60, whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {selectedRecipients.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0)} recipients selected</strong>
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Message Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EditIcon /> Message
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Quick Templates
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
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={handleMessageChangeLocal}
            placeholder="Type your message here..."
            helperText={`${message.length}/160 chars • ${Math.ceil(message.length / 160)} SMS`}
            sx={{ mb: 2 }}
            autoComplete="off"
          />

          <LinearProgress
            variant="determinate"
            value={(message.length / 160) * 100}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                backgroundColor: message.length > 160 ? 'error.main' : 'primary.main'
              }
            }}
          />
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop Layout - Two column grid
  return (
    <Grid container spacing={3}>
      {/* Left Column - Recipients */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 6, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Recipients
            </Typography>

            {/* Search and Filter Row */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  endAdornment: searchTerm && (
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )
                }}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select 
                  value={recipientFilter} 
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="all">All Recipients</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="course">Course</MenuItem>
                  <MenuItem value="lead_group">Lead Group</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Recipients Selection */}
            <Autocomplete
              multiple
              options={filteredRecipients}
              getOptionLabel={(option) => `${option.name}${option.count ? ` (${option.count})` : ''}`}
              value={selectedRecipients}
              onChange={handleRecipientsChange}
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
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.type} {option.count ? `• ${option.count} people` : ''}
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
                  placeholder="Select recipients..."
                  variant="outlined"
                  helperText="Search for individuals, courses, or lead groups"
                />
              )}
            />

            {/* Manual Phone Number Input */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Manual Phone Entry
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="+972XXXXXXXXX"
                  value={manualPhoneNumber}
                  onChange={handlePhoneChange}
                  helperText="Enter phone in international format"
                  sx={{ flex: 1 }}
                  autoComplete="off"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddManualPhone}
                  disabled={!manualPhoneNumber.trim()}
                  sx={{ height: 40 }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Selected Summary */}
            {selectedRecipients.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>{selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0)} recipients selected</strong>
                </Typography>
                <Typography variant="caption">
                  Estimated cost: ${((Math.ceil(message.length / 160) * selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0) * 0.06).toFixed(2))} 
                  ({Math.ceil(message.length / 160)} SMS × {selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0)} recipients)
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
              <EditIcon /> Message
            </Typography>

            {/* Templates */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Templates
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
              onChange={handleMessageChangeLocal}
              placeholder="Type your message here..."
              helperText={`${message.length}/160 characters • ${Math.ceil(message.length / 160)} SMS`}
              sx={{ mb: 2 }}
              autoComplete="off"
            />

            {/* Character Progress */}
            <LinearProgress
              variant="determinate"
              value={(message.length / 160) * 100}
              sx={{ 
                mb: 2, 
                height: 6, 
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: message.length > 160 ? 'error.main' : 'primary.main'
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
});

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
  const invalidate = useInvalidate();

  // Stable change handlers to prevent re-renders and focus loss
  const handleSearchTermChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setSearchTerm(e.target.value);
  }, []);

  const handleRecipientFilterChange = React.useCallback((e: any) => {
    e.persist();
    setRecipientFilter(e.target.value);
  }, []);

  const handleManualPhoneChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setManualPhoneNumber(e.target.value);
  }, []);

  const handleMessageChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setMessage(e.target.value);
  }, []);

  const handleSearchTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e: any) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleSelectedRecipientsChange = useCallback((_, newValue: Recipient[]) => {
    setSelectedRecipients(newValue);
  }, []);

  const handleClearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);
  
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
  
  // Note: smsMetrics calculation moved inline to prevent re-renders and focus loss
  
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
  
  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = getMessageTemplates(t).find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  }, [t]);
  
  const handleAddManualPhone = useCallback(() => {
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
  }, [manualPhoneNumber, selectedRecipients]);
  
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
  
  const getRecipientIcon = useCallback((type: string) => {
    switch (type) {
      case 'individual': return <PersonIcon fontSize="small" />;
      case 'course': return <SchoolIcon fontSize="small" />;
      case 'lead_group': return <LeadIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  }, []);
  
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


  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0, // Add bottom padding on mobile for bottom navigation
      px: isMobile ? MOBILE_SIDE_PADDING : 0, // Add side padding on mobile
      minHeight: isMobile ? 'auto' : '100vh', // Remove minHeight on mobile
      backgroundColor: 'background.default',
      overflow: 'visible', // Use natural document scrolling
    }}>
      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.total_messages')} 
            value={stats.totalMessages.toString()} 
            icon={<MessageIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.sent')} 
            value={stats.sentCount.toString()} 
            icon={<DeliveredIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.failed')} 
            value={stats.failedCount.toString()} 
            icon={<ErrorIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="error" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('sms.stats.total_cost')} 
            value={`$${stats.totalCost.toFixed(2)}`} 
            icon={<PriorityIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
          />
        </Grid>
      </Grid>

      <Box sx={{ 
        p: isMobile ? 0 : 2, 
        backgroundColor: isMobile ? 'transparent' : 'background.paper', 
        borderRadius: isMobile ? 0 : DESKTOP_BORDER_RADIUS, 
        boxShadow: isMobile ? 'none' : 3, 
        border: isMobile ? 'none' : '1px solid', 
        borderColor: isMobile ? 'transparent' : 'divider' 
      }}>
        {/* Desktop Layout */}
        {!isMobile && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              <Button 
                variant="contained" 
                onClick={() => setSendModalOpen(true)}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: 140,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                + {t('sms.buttons.send_sms')}
              </Button>
              {selectedRows.length > 0 && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  sx={{ textTransform: 'none' }}
                >
                  {t('actions.delete')} ({selectedRows.length})
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
              <TextField
                placeholder={t('sms.search.placeholder')}
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: 200,
                  maxWidth: 300,
                  flexShrink: 1
                }}
                value={searchText}
                onChange={handleSearchTextChange}
              />
              <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
                <InputLabel>{t('sms.labels.status')}</InputLabel>
                <Select
                  label={t('sms.labels.status')}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="sent">{t('sms.status.sent')}</MenuItem>
                  <MenuItem value="sending">{t('sms.status.sending')}</MenuItem>
                  <MenuItem value="failed">{t('sms.status.failed')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        <ErrorBoundary onError={(error, errorInfo) => {
          console.error('Data view error:', error, errorInfo);
          handleError(error, 'Data View');
        }}>
          {/* Desktop Data Grid */}
          {!isMobile && (
            <Box sx={{ height: DATA_GRID_HEIGHT, width: '100%' }}>
              <DataGrid
                rows={filteredHistory}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                sx={{ border: 'none' }}
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel as string[]);
                }}
                rowSelectionModel={selectedRows}
                loading={historyLoading}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25 },
                  },
                }}
              />
            </Box>
          )}

          {/* Mobile Card List */}
          {isMobile && (
            <Box sx={{ 
              px: 1,
              pb: 10 // Extra padding for bottom navigation
            }}>
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
          )}
        </ErrorBoundary>

        {/* Mobile Layout - Search and Filter */}
        {isMobile && (
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
              onChange={handleSearchTextChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS
                }
              }}
            />
            
            {/* Status Filter */}
            <FormControl 
              size="small" 
              sx={{ minWidth: isMobile ? '100%' : 140 }}
            >
              <InputLabel>{t('sms.labels.status')}</InputLabel>
              <Select
                label={t('sms.labels.status')}
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS
                }}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="sent">{t('sms.status.sent')}</MenuItem>
                <MenuItem value="sending">{t('sms.status.sending')}</MenuItem>
                <MenuItem value="failed">{t('sms.status.failed')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      
      {/* Send SMS Modal using CommonModalShell */}
      <CommonModalShell
        open={sendModalOpen}
        onClose={() => { setSendModalOpen(false); resetSendModal(); }}
        title={t('sms.dialogs.send_title')}
        forceMobile={isMobile}
        maxWidth={isMobile ? "sm" : "lg"}
        showActions={true}
        onCancel={() => { setSendModalOpen(false); resetSendModal(); }}
        onSave={handleSendSMS}
        cancelButtonText={t('actions.cancel')}
        saveButtonText={sending ? t('sms.buttons.sending') : t('sms.buttons.send_sms')}
        saveButtonDisabled={!message.trim() || selectedRecipients.length === 0 || sending}
      >
        <SMSForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          recipientFilter={recipientFilter}
          setRecipientFilter={setRecipientFilter}
          filteredRecipients={filteredRecipients}
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
          manualPhoneNumber={manualPhoneNumber}
          setManualPhoneNumber={setManualPhoneNumber}
          message={message}
          setMessage={setMessage}
          selectedTemplate={selectedTemplate}
          handleAddManualPhone={handleAddManualPhone}
          handleTemplateSelect={handleTemplateSelect}
          getRecipientIcon={getRecipientIcon}
          isMobile={isMobile}
        />
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
              Sent: {selectedMessage.sentAt.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status: <StatusChip status={selectedMessage.status} />
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Message:
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedMessage.message}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Recipients: {selectedMessage.totalCount}
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
      
      {/* Floating Action Button for Create SMS - Mobile Only - OUTSIDE all containers */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setSendModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: FAB_BOTTOM_OFFSET,
            right: FAB_RIGHT_OFFSET,
            zIndex: FAB_Z_INDEX,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <SendIcon />
        </Fab>
      )}
    </Box>
  );
});

SimpleSMSNew.displayName = 'SimpleSMSNew';

export default SimpleSMSNew;