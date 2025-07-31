import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from "@mui/material";

interface StatCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const paletteColor = theme.palette[color as keyof typeof theme.palette];
  const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.primary.main;
  
  const isRTL = theme.direction === 'rtl';

  return (
    <Card 
      className="stat-card"
      sx={{ 
        borderBottom: `3px solid ${mainColor}`,
        borderRadius: 2, 
        boxShadow: theme.palette.mode === 'light' 
          ? '0 2px 8px 0 rgba(0,0,0,0.15)' 
          : '0 2px 4px 0 rgba(0,0,0,0.1)',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
      }}
    >
      <CardContent sx={{ 
        p: isMobile ? 1.5 : 2, 
        '&:last-child': { pb: isMobile ? 1.5 : 2 } 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: isMobile ? 0.5 : 1,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <Box sx={{ 
            color: mainColor, 
            display: 'flex', 
            mr: isMobile ? 0 : 1.5,
            mb: isMobile ? 0.5 : 0
          }}>
            {icon}
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontSize: isMobile ? '0.85rem' : '1.1rem', 
              fontWeight: 500,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          component="div" 
          fontWeight="bold" 
          sx={{ 
            fontSize: isMobile ? '1.4rem' : '1.8rem',
            textAlign: isMobile ? 'center' : (isRTL ? 'left' : 'right'),
            lineHeight: 1
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}; 