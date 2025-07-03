import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface StatusChipProps {
  isActive: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ isActive }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (isActive: boolean) => {
    return isActive 
      ? { label: t('common.active'), color: 'success' as const }
      : { label: t('status_options.inactive'), color: 'error' as const };
  };

  const { label, color } = getStatusDisplay(isActive);

  return <Chip label={label} color={color} size="small" />;
}; 