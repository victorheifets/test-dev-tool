import { Chip } from '@mui/material';
import { ActivityStatus } from '../../types/activity';
import { useTranslation } from 'react-i18next';

interface StatusChipProps {
  status: ActivityStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (status: ActivityStatus) => {
    const statusMap = {
      draft: { label: t('course_status.draft'), color: 'default' as const },
      published: { label: t('course_status.published'), color: 'success' as const },
      ongoing: { label: t('course_status.ongoing'), color: 'info' as const },
      completed: { label: t('course_status.completed'), color: 'primary' as const },
      cancelled: { label: t('course_status.cancelled'), color: 'error' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 