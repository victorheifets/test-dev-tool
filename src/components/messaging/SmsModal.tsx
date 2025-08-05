import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  TextField, 
  Typography, 
  Alert,
  Autocomplete,
  Chip
} from '@mui/material';
import { CommonModalShell } from '../common/CommonModalShell';
import { useList } from '@refinedev/core';
import { sendSMSBatch, SMSRecipient } from '../../services/smsService';

interface SmsModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  forceMobile?: boolean;
}

export const SmsModal: React.FC<SmsModalProps> = ({
  open,
  onClose,
  onSave,
  forceMobile = false
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<SMSRecipient[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch participants for SMS recipients
  const { data: participants = [] } = useList({
    resource: 'participants',
    pagination: { pageSize: 100 }
  });

  // Convert participants to SMS recipients
  const availableRecipients: SMSRecipient[] = participants.map(participant => ({
    id: participant.id,
    phone: participant.phone || '',
    name: `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 'Unknown',
    type: 'participant' as const,
    display: `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 'Unknown'
  })).filter(recipient => recipient.phone); // Only include participants with phone numbers

  const handleSend = async () => {
    if (!message.trim() || selectedRecipients.length === 0) {
      setError('Please enter a message and select at least one recipient');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendSMSBatch(selectedRecipients, message);
      
      // Reset form
      setMessage('');
      setSelectedRecipients([]);
      
      // Call onSave callback and close modal
      onSave?.();
      onClose();
    } catch (err) {
      console.error('Failed to send SMS:', err);
      setError(err instanceof Error ? err.message : 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setMessage('');
      setSelectedRecipients([]);
      setError(null);
      onClose();
    }
  };

  return (
    <CommonModalShell
      open={open}
      onClose={handleClose}
      title={t('sms.send_sms_title', 'Send SMS Alert')}
      forceMobile={forceMobile}
      maxWidth="sm"
      showActions={true}
      onCancel={handleClose}
      onSave={handleSend}
      cancelButtonText={t('actions.cancel')}
      saveButtonText={sending ? t('sms.buttons.sending', 'Sending...') : t('sms.buttons.send_sms', 'Send SMS')}
      saveButtonDisabled={!message.trim() || selectedRecipients.length === 0 || sending}
    >
      <Box sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Recipients Selection */}
        <Autocomplete
          multiple
          options={availableRecipients}
          getOptionLabel={(option) => option.display}
          value={selectedRecipients}
          onChange={(_, newValue) => setSelectedRecipients(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.display}
                {...getTagProps({ index })}
                key={option.id}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('sms.labels.recipients', 'Recipients')}
              placeholder={availableRecipients.length === 0 
                ? t('sms.placeholders.no_participants', 'No participants with phone numbers')
                : t('sms.placeholders.select_recipients', 'Select recipients...')
              }
              fullWidth
              disabled={availableRecipients.length === 0}
            />
          )}
          sx={{ mb: 2 }}
          disabled={sending}
        />

        {availableRecipients.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('sms.messages.no_recipients', 'No participants with phone numbers found. Add participants with phone numbers to send SMS messages.')}
          </Alert>
        )}

        {/* Message Input */}
        <TextField
          label={t('sms.labels.message', 'Message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          fullWidth
          placeholder={t('sms.placeholders.message', 'Enter your SMS message...')}
          disabled={sending}
          inputProps={{ maxLength: 160 }}
          helperText={`${message.length}/160 characters`}
        />

        {selectedRecipients.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('sms.messages.will_send_to', 'This message will be sent to {{count}} recipient(s)', { count: selectedRecipients.length })}
          </Typography>
        )}
      </Box>
    </CommonModalShell>
  );
};