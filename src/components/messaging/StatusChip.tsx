import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type SmsStatus = 'sent' | 'sending' | 'failed' | 'pending';

interface StatusChipProps {
  status: SmsStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (status: SmsStatus) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'default' as const },
      sending: { label: 'Sending', color: 'info' as const },
      sent: { label: 'Sent', color: 'success' as const },
      failed: { label: 'Failed', color: 'error' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 