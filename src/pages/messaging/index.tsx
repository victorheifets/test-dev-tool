import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Tooltip,
  CircularProgress,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  ListItemButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Message as MessageIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Preview as PreviewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useApiUrl, useCustomMutation, useList } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../../components/StatCard';

interface MessageRecord {
  id: string;
  content: string;
  sender_name: string;
  message_type: 'individual' | 'group' | 'course_bulk';
  target_name: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  created_at: string;
}

interface Participant {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Course {
  id: string;
  name: string;
  participant_count: number;
}

interface SMSStats {
  sent_this_month: number;
  remaining_this_month: number;
  monthly_limit: number;
  delivery_rate: number;
  total_sent: number;
  failed_this_month: number;
}

const MessagingPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiUrl = useApiUrl();
  const [activeTab, setActiveTab] = useState(0);
  const [recipientType, setRecipientType] = useState<'individual' | 'group' | 'course'>('individual');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [previewModal, setPreviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // API calls
  const { mutate: sendMessage, isLoading: isSending } = useCustomMutation();
  
  const { data: participants, isLoading: participantsLoading } = useList<Participant>({
    resource: 'participants',
    pagination: { mode: 'off' },
    filters: [{ field: 'phone_number', operator: 'nnull', value: null }],
  });

  const { data: courses, isLoading: coursesLoading } = useList<Course>({
    resource: 'courses',
    pagination: { mode: 'off' },
  });

  const { data: messageHistory, isLoading: historyLoading, refetch: refetchHistory } = useList<MessageRecord>({
    resource: 'messages',
    pagination: { current: 1, pageSize: 50 },
    sorters: [{ field: 'created_at', order: 'desc' }],
  });

  // Mock SMS stats - replace with real API call
  const smsStats: SMSStats = {
    sent_this_month: 245,
    remaining_this_month: 755,
    monthly_limit: 1000,
    delivery_rate: 98.5,
    total_sent: 3420,
    failed_this_month: 12,
  };

  const characterCount = messageContent.length;
  const maxCharacters = 160;
  const smsCount = Math.ceil(characterCount / maxCharacters);

  const handleSendMessage = () => {
    if (!messageContent || selectedRecipients.length === 0) return;

    const messageData = {
      content: messageContent,
      message_type: recipientType,
      recipients: selectedRecipients,
    };

    sendMessage(
      {
        url: `${apiUrl}/messages/send`,
        method: 'post',
        values: messageData,
      },
      {
        onSuccess: () => {
          setMessageContent('');
          setSelectedRecipients([]);
          setPreviewModal(false);
          refetchHistory();
        },
      }
    );
  };

  const getFilteredRecipients = () => {
    const data = participants?.data || [];
    if (!searchTerm) return data;
    return data.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone_number.includes(searchTerm)
    );
  };

  const getRecipientOptions = () => {
    switch (recipientType) {
      case 'individual':
        return getFilteredRecipients();
      case 'course':
        return courses?.data?.map(c => ({
          id: c.id,
          name: `${c.name} (${c.participant_count || 0} participants)`,
          phone_number: '',
          email: '',
          first_name: '',
          last_name: ''
        })) || [];
      default:
        return [];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <SendIcon sx={{ color: 'info.main', fontSize: 16 }} />;
      case 'delivered':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <PersonIcon sx={{ fontSize: 16 }} />;
      case 'group':
        return <GroupIcon sx={{ fontSize: 16 }} />;
      case 'course_bulk':
        return <SchoolIcon sx={{ fontSize: 16 }} />;
      default:
        return <MessageIcon sx={{ fontSize: 16 }} />;
    }
  };

  const handleRecipientTypeChange = (event: SelectChangeEvent) => {
    setRecipientType(event.target.value as 'individual' | 'group' | 'course');
    setSelectedRecipients([]);
    setSearchTerm('');
  };

  const handleRecipientToggle = (recipientId: string) => {
    const currentIndex = selectedRecipients.indexOf(recipientId);
    const newSelected = [...selectedRecipients];

    if (currentIndex === -1) {
      newSelected.push(recipientId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedRecipients(newSelected);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* SMS Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('messaging.stats.sent_this_month', 'Sent This Month')}
            value={smsStats.sent_this_month.toLocaleString()}
            icon={<SendIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('messaging.stats.remaining_sms', 'Remaining SMS')}
            value={`${smsStats.remaining_this_month.toLocaleString()}`}
            icon={<MessageIcon sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('messaging.stats.delivery_rate', 'Delivery Rate')}
            value={`${smsStats.delivery_rate}%`}
            icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('messaging.stats.failed_this_month', 'Failed This Month')}
            value={smsStats.failed_this_month.toString()}
            icon={<ErrorIcon sx={{ fontSize: 40 }} />}
            color="error"
          />
        </Grid>
      </Grid>

      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab 
            icon={<SendIcon />} 
            label={t('messaging.send_message', 'Send Message')} 
            iconPosition="start"
          />
          <Tab 
            icon={<HistoryIcon />} 
            label={t('messaging.message_history', 'Message History')} 
            iconPosition="start"
          />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewModal(true)}
                  disabled={!messageContent || selectedRecipients.length === 0}
                >
                  {t('messaging.preview_send', 'Preview & Send')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setMessageContent('');
                    setSelectedRecipients([]);
                    setSearchTerm('');
                  }}
                >
                  {t('actions.clear', 'Clear')}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>{t('messaging.recipient_type', 'Recipient Type')}</InputLabel>
                  <Select
                    value={recipientType}
                    label={t('messaging.recipient_type', 'Recipient Type')}
                    onChange={handleRecipientTypeChange}
                  >
                    <MenuItem value="individual">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                        {t('messaging.individual', 'Individual')}
                      </Box>
                    </MenuItem>
                    <MenuItem value="course">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16 }} />
                        {t('messaging.course_participants', 'Course')}
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                {selectedRecipients.length > 0 && (
                  <Chip 
                    label={`${selectedRecipients.length} selected`}
                    color="primary"
                    variant="filled"
                  />
                )}
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Recipients Selection */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {t('messaging.select_recipients', 'Select Recipients')}
                    </Typography>
                    
                    {recipientType === 'individual' && (
                      <TextField
                        fullWidth
                        placeholder={t('messaging.search_recipients', 'Search by name, email, or phone')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                        size="small"
                      />
                    )}

                    <Box sx={{ 
                      height: 300, 
                      overflow: 'auto',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}>
                      <List dense>
                        {getRecipientOptions().length === 0 ? (
                          <ListItem>
                            <ListItemText 
                              primary={
                                <Typography variant="body2" color="text.secondary" align="center">
                                  {participantsLoading || coursesLoading 
                                    ? t('common.loading', 'Loading...') 
                                    : t('messaging.no_recipients', 'No recipients found')}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ) : (
                          getRecipientOptions().map((recipient) => (
                            <ListItemButton
                              key={recipient.id}
                              onClick={() => handleRecipientToggle(recipient.id)}
                              disabled={participantsLoading || coursesLoading}
                              selected={selectedRecipients.indexOf(recipient.id) !== -1}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  bgcolor: selectedRecipients.indexOf(recipient.id) !== -1 
                                    ? 'primary.main' 
                                    : 'grey.400',
                                  width: 32,
                                  height: 32
                                }}>
                                  {getMessageTypeIcon(recipientType)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" fontWeight={500}>
                                    {recipient.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    {recipientType === 'individual' 
                                      ? `${recipient.phone_number} • ${recipient.email}`
                                      : t('messaging.course_participants', 'Course participants')}
                                  </Typography>
                                }
                              />
                              <Checkbox
                                checked={selectedRecipients.indexOf(recipient.id) !== -1}
                                tabIndex={-1}
                                size="small"
                              />
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Message Content */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {t('messaging.compose_message', 'Compose Message')}
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      label={`${t('messaging.message_content', 'Message')} (${characterCount}/${maxCharacters})`}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder={t('messaging.enter_message', 'Enter your message here...')}
                      inputProps={{ maxLength: 1600 }}
                      helperText={smsCount > 1 ? `${smsCount} SMS messages` : `${smsCount} SMS message`}
                    />

                    {selectedRecipients.length > 0 && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          {recipientType === 'individual' && 
                            `Sending to ${selectedRecipients.length} participant(s)`}
                          {recipientType === 'course' && 
                            `Sending to all participants in ${selectedRecipients.length} course(s)`}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ height: 400 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('messaging.message', 'Message')}</TableCell>
                    <TableCell>{t('messaging.type', 'Type')}</TableCell>
                    <TableCell>{t('messaging.target', 'Target')}</TableCell>
                    <TableCell>{t('messaging.status', 'Status')}</TableCell>
                    <TableCell>{t('messaging.recipients', 'Recipients')}</TableCell>
                    <TableCell>{t('messaging.sent_at', 'Sent At')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : messageHistory?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="textSecondary" variant="body2">
                          {t('messaging.no_messages', 'No messages found')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    messageHistory?.data?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Tooltip title={record.content}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 150, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap' 
                              }}
                            >
                              {record.content}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getMessageTypeIcon(record.message_type)}
                            <Typography variant="body2">
                              {record.message_type.replace('_', ' ')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{record.target_name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(record.status)}
                            <Typography variant="body2">{record.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip label={`${record.recipient_count} total`} size="small" color="primary" />
                            {record.sent_count > 0 && (
                              <Chip label={`${record.sent_count} sent`} size="small" color="success" />
                            )}
                            {record.failed_count > 0 && (
                              <Chip label={`${record.failed_count} failed`} size="small" color="error" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(record.created_at).toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      {/* Preview Modal */}
      <Dialog open={previewModal} onClose={() => setPreviewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('messaging.preview_message')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('messaging.message_details')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        {t('messaging.recipient_type')}:
                      </Typography>
                      <Typography variant="body1">{recipientType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        {t('messaging.recipients')}:
                      </Typography>
                      <Typography variant="body1">{selectedRecipients.length} {t('messaging.selected')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        {t('messaging.character_count')}:
                      </Typography>
                      <Typography variant="body1">{characterCount}/{maxCharacters}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        {t('messaging.sms_count')}:
                      </Typography>
                      <Typography variant="body1">{smsCount} message{smsCount > 1 ? 's' : ''}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('messaging.message_preview')}
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'grey.100', 
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      minHeight: 100
                    }}
                  >
                    {messageContent}
                  </Paper>
                </CardContent>
              </Card>
            </Grid>

            {smsCount > 1 && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  {t('messaging.multiple_sms_cost_warning', { count: smsCount })}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewModal(false)}>
            {t('actions.cancel')}
          </Button>
          <Button
            variant="contained"
            startIcon={isSending ? <CircularProgress size={16} /> : <SendIcon />}
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {t('messaging.send_message')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagingPage;