import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Autocomplete,
  Alert,

  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate } from '@refinedev/core';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { StatCard } from '../../components/StatCard';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { StatusChip } from '../../components/messaging/StatusChip';
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
  CheckCircle as DeliveredIcon,
  Error as ErrorIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

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

// Mock data
const mockRecipients: Recipient[] = [
  { id: '1', name: 'John Doe', phone: '+1-555-0123', type: 'individual' },
  { id: '2', name: 'Sarah Wilson', phone: '+1-555-0124', type: 'individual' },
  { id: '3', name: 'Mike Johnson', phone: '+1-555-0125', type: 'individual' },
  { id: '4', name: 'Emma Brown', phone: '+1-555-0126', type: 'individual' },
  { id: '5', name: 'React Course Students', phone: 'course-123', type: 'course', count: 45 },
  { id: '6', name: 'Vue.js Course Students', phone: 'course-456', type: 'course', count: 32 },
  { id: '7', name: 'Python Basics', phone: 'course-789', type: 'course', count: 28 },
  { id: '8', name: 'New Leads', phone: 'leads-new', type: 'lead_group', count: 23 },
  { id: '9', name: 'Qualified Leads', phone: 'leads-qualified', type: 'lead_group', count: 15 },
  { id: '10', name: 'Hot Leads', phone: 'leads-hot', type: 'lead_group', count: 8 },
];

const messageTemplates = [
  { id: 'welcome', name: 'Welcome', content: 'Welcome to our course! We\'re excited to have you join us.' },
  { id: 'reminder', name: 'Class Reminder', content: 'Reminder: Your class starts tomorrow at [TIME]. Please don\'t forget!' },
  { id: 'cancellation', name: 'Cancellation', content: 'Unfortunately, today\'s class has been cancelled. We\'ll reschedule soon.' },
  { id: 'promotion', name: 'Promotion', content: '🎉 Special offer! Get 20% off your next enrollment. Limited time only!' },
  { id: 'completion', name: 'Completion', content: 'Congratulations! You\'ve successfully completed the course.' },
  { id: 'follow_up', name: 'Follow Up', content: 'How are you finding the course so far? We\'d love your feedback!' },
];

const mockHistory: SMSMessage[] = [
  {
    id: '1',
    message: 'Welcome to our React course! Class starts tomorrow at 9 AM.',
    recipients: ['course-123'],
    sentAt: new Date('2025-07-14T10:00:00'),
    status: 'sent',
    totalCount: 45,
    deliveredCount: 43,
    failedCount: 2,
    cost: 2.70,
    recipient_type: 'course',
  },
  {
    id: '2',
    message: 'Special offer: 20% off next enrollment!',
    recipients: ['leads-new', 'leads-qualified'],
    sentAt: new Date('2025-07-13T15:30:00'),
    status: 'sent',
    totalCount: 38,
    deliveredCount: 35,
    failedCount: 3,
    cost: 2.28,
    recipient_type: 'lead_group',
  },
  {
    id: '3',
    message: 'Class reminder: Python basics class starts in 30 minutes.',
    recipients: ['course-789'],
    sentAt: new Date('2025-07-12T09:30:00'),
    status: 'failed',
    totalCount: 28,
    deliveredCount: 0,
    failedCount: 28,
    cost: 0,
    recipient_type: 'course',
  },
];

const SimpleSMS: React.FC = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SMSMessage | null>(null);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [messageToResend, setMessageToResend] = useState<SMSMessage | null>(null);
  const [history, setHistory] = useState<SMSMessage[]>(mockHistory);
  
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
  
  const maxLength = 160;
  const smsCount = Math.ceil(message.length / maxLength);
  const totalRecipients = selectedRecipients.reduce((sum, r) => sum + (r.count || 1), 0);
  const estimatedCost = (smsCount * totalRecipients * 0.06).toFixed(2);
  
  // Apply filtering
  const filteredHistory = history.filter(msg => {
    const matchesSearch = !searchText || 
      msg.message.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.recipient_type.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || msg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const filteredRecipients = mockRecipients.filter(r => {
    const matchesType = recipientFilter === 'all' || r.type === recipientFilter;
    const matchesSearch = !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  
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
  
  const confirmResend = () => {
    if (messageToResend) {
      setMessage(messageToResend.message);
      // In a real app, you would resolve recipient IDs back to recipient objects
      // For now, we'll just show the modal
      setSendModalOpen(true);
    }
    setResendDialogOpen(false);
    setMessageToResend(null);
  };
  
  const handleDuplicate = (id: string) => {
    const messageToDuplicate = history.find(m => m.id === id);
    if (messageToDuplicate) {
      setMessage(messageToDuplicate.message);
      // In a real app, you would resolve recipient IDs back to recipient objects
      // For now, we'll just show the modal
      setSendModalOpen(true);
    }
  };

  
  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };
  
  const handleSendSMS = async () => {
    if (!message.trim() || selectedRecipients.length === 0) return;
    
    setSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMessage: SMSMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      recipients: selectedRecipients.map(r => r.id),
      sentAt: new Date(),
      status: 'sending',
      totalCount: totalRecipients,
      deliveredCount: 0,
      failedCount: 0,
      cost: parseFloat(estimatedCost),
      recipient_type: selectedRecipients.length === 1 ? selectedRecipients[0].type : 'mixed',
    };
    
    setHistory([newMessage, ...history]);
    resetSendModal();
    setSending(false);
    setSendModalOpen(false);
    showSuccess('SMS sent successfully');
    
    // Simulate status update
    setTimeout(() => {
      setHistory(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'sent', deliveredCount: Math.floor(totalRecipients * 0.95), failedCount: Math.floor(totalRecipients * 0.05) }
          : msg
      ));
    }, 5000);
  };
  
  const resetSendModal = () => {
    setMessage('');
    setSelectedRecipients([]);
    setSelectedTemplate('');
    setRecipientFilter('all');
    setSearchTerm('');
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
      headerName: 'Date & Time',
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.sentAt.toLocaleDateString()} {params.row.sentAt.toLocaleTimeString()}
        </Typography>
      )
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.message.length > 50 ? `${params.row.message.substring(0, 50)}...` : params.row.message}
        </Typography>
      )
    },
    {
      field: 'totalCount',
      headerName: 'Recipients',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'medium', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.totalCount}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <StatusChip status={params.row.status} />
        </Box>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <ActionMenu
            onEdit={() => handleView(params.row.id)}
            onDuplicate={() => handleDuplicate(params.row.id)}
            editLabel="View"
            useViewIcon={true}
          />
        </Box>
      ),
    },
  ];
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Messages" 
            value={history.length.toString()} 
            icon={<MessageIcon sx={{ fontSize: 40 }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Sent" 
            value={history.filter(m => m.status === 'sent').length.toString()} 
            icon={<DeliveredIcon sx={{ fontSize: 40 }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Failed" 
            value={history.filter(m => m.status === 'failed').length.toString()} 
            icon={<ErrorIcon sx={{ fontSize: 40 }} />} 
            color="error" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Cost" 
            value={`$${history.reduce((sum, msg) => sum + msg.cost, 0).toFixed(2)}`} 
            icon={<PriorityIcon sx={{ fontSize: 40 }} />} 
            color="info" 
          />
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<SendIcon />} onClick={() => setSendModalOpen(true)}>
              Send SMS
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search messages..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="sending">Sending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>

              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredHistory}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{ border: 'none' }}
          />
        </Box>
      </Box>
      
      {/* Send SMS Modal */}
      <Dialog open={sendModalOpen} onClose={() => { setSendModalOpen(false); resetSendModal(); }} maxWidth="lg" fullWidth>
        <DialogTitle>Send SMS Message</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
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
                      placeholder="Search by name, phone, or course..."
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
                          if (selected === 'all') return 'All Types';
                          if (selected === 'individual') return 'Individuals';
                          if (selected === 'course') return 'Courses';
                          if (selected === 'lead_group') return 'Lead Groups';
                          return 'All Types';
                        }}
                      >
                        <MenuItem value="all">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            All Types
                          </Box>
                        </MenuItem>
                        <MenuItem value="individual">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            Individuals
                          </Box>
                        </MenuItem>
                        <MenuItem value="course">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" />
                            Courses
                          </Box>
                        </MenuItem>
                        <MenuItem value="lead_group">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LeadIcon fontSize="small" />
                            Lead Groups
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
                              {option.type.replace('_', ' ')} {option.count ? `• ${option.count} people` : ''}
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
                        placeholder="Click to select recipients..."
                        variant="outlined"
                        helperText="Search for individuals, courses, or lead groups. Use checkboxes to select multiple."
                      />
                    )}
                  />

                  {/* Selected Summary */}
                  {selectedRecipients.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>{totalRecipients} recipients selected</strong>
                      </Typography>
                      <Typography variant="caption">
                        Estimated cost: ${estimatedCost} ({smsCount} SMS × {totalRecipients} recipients)
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
                      {messageTemplates.map((template) => (
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
                    placeholder="Type your message here..."
                    helperText={`${message.length}/${maxLength} characters • ${smsCount} SMS`}
                    sx={{ mb: 2 }}
                  />

                  {/* Character Progress */}
                  <LinearProgress
                    variant="determinate"
                    value={(message.length / maxLength) * 100}
                    sx={{ 
                      mb: 2, 
                      height: 6, 
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: message.length > maxLength ? 'error.main' : 'primary.main'
                      }
                    }}
                  />


                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSendModalOpen(false); resetSendModal(); }}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendSMS}
            disabled={!message.trim() || selectedRecipients.length === 0 || sending}
          >
            {sending ? 'Sending...' : 'Send SMS'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Resend Confirmation Dialog */}
      <ConfirmationDialog
        open={resendDialogOpen}
        onClose={() => setResendDialogOpen(false)}
        onConfirm={confirmResend}
        title="Resend Message"
        description="Are you sure you want to resend this message?"
      />
      
      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>SMS Message Details</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimpleSMS;