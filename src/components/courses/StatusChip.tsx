import { Chip } from '@mui/material';
import { Course } from '../../data/mockCourses';

interface StatusChipProps {
  status: Course['status'];
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const color = {
    Published: 'success',
    Ongoing: 'info',
    Draft: 'default',
  } as const;

  return <Chip label={status} color={color[status]} size="small" />;
}; 