import { Chip } from '@mui/material';
import { ParticipantStatus } from '../../types/participant';

interface StatusChipProps {
  status: ParticipantStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusDisplay = (status: ParticipantStatus) => {
    const statusMap = {
      active: { label: 'Active', color: 'success' as const },
      inactive: { label: 'Inactive', color: 'error' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 