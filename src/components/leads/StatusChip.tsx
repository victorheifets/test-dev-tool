import { Chip } from '@mui/material';
import { LeadStatus } from '../../types/lead';
import { useTranslation } from 'react-i18next';

interface StatusChipProps {
  status: LeadStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (status: LeadStatus) => {
    const statusMap: Record<LeadStatus, { label: string; color: 'info' | 'primary' | 'success' | 'secondary' | 'error' | 'default' }> = {
      [LeadStatus.NEW]: { label: t('status_options.new'), color: 'info' },
      [LeadStatus.CONTACTED]: { label: t('status_options.contacted'), color: 'primary' },
      [LeadStatus.QUALIFIED]: { label: t('status_options.qualified'), color: 'success' },
      [LeadStatus.CONVERTED]: { label: t('status_options.converted'), color: 'secondary' },
      [LeadStatus.LOST]: { label: t('status_options.lost'), color: 'error' },
    };
    return statusMap[status] || { label: status, color: 'default' };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 