import { Chip } from '@mui/material';
import { LeadStatus } from '../../types/lead';

interface StatusChipProps {
  status: LeadStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusDisplay = (status: LeadStatus) => {
    const statusMap = {
      new: { label: 'New', color: 'info' as const },
      contacted: { label: 'Contacted', color: 'primary' as const },
      qualified: { label: 'Qualified', color: 'success' as const },
      converted: { label: 'Converted', color: 'secondary' as const },
    };
    return statusMap[status] || { label: status, color: 'default' as const };
  };

  const { label, color } = getStatusDisplay(status);

  return <Chip label={label} color={color} size="small" />;
}; 