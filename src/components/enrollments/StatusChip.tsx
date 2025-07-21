import { Chip } from '@mui/material';
import { EnrollmentStatus } from '../../types/enrollment';
import { useTranslation } from 'react-i18next';

interface StatusChipProps {
  status: EnrollmentStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusDisplay = (status: EnrollmentStatus) => {
    const statusMap = {
      pending: { label: t('status_options.pending'), color: 'warning' as const },
      enrolled: { label: t('enrollment_status.enrolled'), color: 'success' as const },
      active: { label: t('enrollment_status.active'), color: 'primary' as const },
      confirmed: { label: t('status_options.confirmed'), color: 'info' as const },
      completed: { label: t('status_options.completed'), color: 'success' as const },
      cancelled: { label: t('status_options.cancelled'), color: 'error' as const },
      waitlisted: { label: t('status_options.waitlisted'), color: 'secondary' as const },
      no_show: { label: t('status_options.no_show'), color: 'error' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 