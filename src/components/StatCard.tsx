import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <Card 
      sx={{ 
        borderBottom: `5px solid ${color}`,
        borderRadius: '8px', 
        boxShadow: 3,
        height: '100%'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color: color, display: 'flex', mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" align="right">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}; 