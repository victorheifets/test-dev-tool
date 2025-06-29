import { Chip } from '@mui/material';
import { ActivityStatus } from '../../types/activity';

interface StatusChipProps {
  status: ActivityStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusDisplay = (status: ActivityStatus) => {
    const statusMap = {
      draft: { label: 'Draft', color: 'default' as const },
      published: { label: 'Published', color: 'success' as const },
      ongoing: { label: 'Ongoing', color: 'info' as const },
      completed: { label: 'Completed', color: 'primary' as const },
      cancelled: { label: 'Cancelled', color: 'error' as const },
      archived: { label: 'Archived', color: 'secondary' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 