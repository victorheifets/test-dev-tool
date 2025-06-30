import { Chip } from '@mui/material';
import { EnrollmentStatus } from '../../types/enrollment';

interface StatusChipProps {
  status: EnrollmentStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusDisplay = (status: EnrollmentStatus) => {
    const statusMap = {
      enrolled: { label: 'Enrolled', color: 'info' as const },
      completed: { label: 'Completed', color: 'success' as const },
      cancelled: { label: 'Cancelled', color: 'error' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 