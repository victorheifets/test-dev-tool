import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const Dashboard = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Welcome to Course Management System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Navigate to different sections using the sidebar to manage your courses, students, and more.
        </Typography>
      </Paper>
    </Box>
  );
}; 