import { Card, CardContent, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<SvgIconComponent>;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
            <Typography color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ 
            color: `${color}.main`, 
            backgroundColor: `${color}.light`, 
            borderRadius: '50%', 
            padding: 1.5, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 