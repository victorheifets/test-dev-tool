import { Chip } from '@mui/material';
import { LeadStatus } from '../../types/lead';
import { useTranslation } from 'react-i18next';

interface StatusChipProps {
  status: LeadStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (status: LeadStatus) => {
    const statusMap = {
      new: { label: t('status_options.new'), color: 'info' as const },
      contacted: { label: t('status_options.contacted'), color: 'primary' as const },
      qualified: { label: t('status_options.qualified'), color: 'success' as const },
      converted: { label: t('status_options.converted'), color: 'secondary' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 