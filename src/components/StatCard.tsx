import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";

interface StatCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const theme = useTheme();
  
  const paletteColor = theme.palette[color as keyof typeof theme.palette];
  const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.primary.main;

  return (
    <Card 
      sx={{ 
        borderBottom: `3px solid ${mainColor}`,
        borderRadius: 2, 
        boxShadow: theme.palette.mode === 'light' 
          ? '0 2px 8px 0 rgba(0,0,0,0.15)' 
          : '0 2px 4px 0 rgba(0,0,0,0.1)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ color: mainColor, display: 'flex', mr: 1.5 }}>
            {icon}
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" component="div" align="right" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}; 