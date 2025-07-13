import React from 'react';
import { AuthPage } from '@refinedev/mui';
import { Box, Card, CardContent, Typography, Divider, Paper, Chip, Stack } from '@mui/material';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const CustomLoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Modern Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #7367F0, #9C88FF)',
              borderRadius: '50%',
              p: 2,
              mb: 2,
              boxShadow: '0 8px 24px rgba(115, 103, 240, 0.3)'
            }}>
              <SchoolIcon sx={{ 
                color: 'white', 
                fontSize: '2.5rem'
              }}/>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7367F0, #9C88FF)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Course Manager
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              textAlign="center"
              sx={{ fontWeight: 500 }}
            >
              Welcome back! Please sign in to continue
            </Typography>
          </Box>

          {/* Regular Email/Password Login */}
          <AuthPage
            type="login"
            title={false}
            formProps={{
              defaultValues: {
                email: "admin@example.com",
                password: "admin123",
              },
            }}
            renderContent={(content: React.ReactNode) => (
              <Box>
                {content}
                
                {/* Divider */}
                <Box sx={{ my: 3 }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </Box>

                {/* Google Sign-In */}
                <GoogleSignIn />

                {/* Professional Demo Accounts Section */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)',
                    border: '1px solid rgba(115, 103, 240, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ color: '#7367F0', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                      Demo Accounts
                    </Typography>
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        icon={<AdminPanelSettingsIcon />}
                        label="Admin" 
                        size="small" 
                        color="error"
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        admin@example.com / admin123
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        icon={<SupervisorAccountIcon />}
                        label="Manager" 
                        size="small" 
                        color="warning"
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        manager@example.com / manager123
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        icon={<PersonIcon />}
                        label="User" 
                        size="small" 
                        color="info"
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        user@example.com / user123
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    💡 For Google Sign-In: Use any of these email addresses with your Google account
                  </Typography>
                </Paper>
              </Box>
            )}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomLoginPage;