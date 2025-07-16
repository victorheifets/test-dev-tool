import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Chip,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router';

import ThumbnailExamples from './thumbnails-example';
import LivePreviewLayouts from './live-preview-layouts';
import CrudTableExample from './crud-table-example';
import FullscreenPreviewExample from './fullscreen-preview';
import InlineEditingExample from './inline-editing-example';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`examples-tabpanel-${index}`}
      aria-labelledby={`examples-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const LandingPagesExamples = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              Landing Page Builder Examples
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
              Professional quality examples for swimming course providers
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Chip label="250×150px Thumbnails" color="primary" variant="outlined" />
              <Chip label="Live Preview" color="secondary" variant="outlined" />
              <Chip label="CRUD Management" color="success" variant="outlined" />
              <Chip label="TipTap Integration" color="info" variant="outlined" />
            </Stack>
            
            <Alert severity="info" sx={{ textAlign: 'left', maxWidth: 800, mx: 'auto' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Key Features Demonstrated:</strong>
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Professional proportional thumbnails (not tiny previews)</li>
                <li>Real-time live preview with mobile/desktop toggle</li>
                <li>Template-based system (templates stay unchanged, instances are editable)</li>
                <li>Simple, reliable editing (avoiding complex features that create support tickets)</li>
                <li>CRUD table for managing landing pages</li>
                <li>Full-screen preview with TipTap-like simple editing</li>
              </ul>
            </Alert>
            
            {/* Tab Navigation */}
          </Paper>

          {/* Tab Navigation */}
          <Paper>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: '1px solid #e0e0e0' }}
            >
              <Tab 
                label="Thumbnail Examples" 
                id="examples-tab-0"
                aria-controls="examples-tabpanel-0"
              />
              <Tab 
                label="Live Preview Layouts" 
                id="examples-tab-1"
                aria-controls="examples-tabpanel-1"
              />
              <Tab 
                label="CRUD Table" 
                id="examples-tab-2"
                aria-controls="examples-tabpanel-2"
              />
              <Tab 
                label="Full Screen Preview" 
                id="examples-tab-3"
                aria-controls="examples-tabpanel-3"
              />
              <Tab 
                label="Inline Editing" 
                id="examples-tab-4"
                aria-controls="examples-tabpanel-4"
              />
            </Tabs>
          </Paper>
        </Stack>
      </Container>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ bgcolor: 'white', minHeight: '80vh' }}>
          <ThumbnailExamples />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ bgcolor: 'white', minHeight: '80vh' }}>
          <LivePreviewLayouts />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box sx={{ bgcolor: 'white', minHeight: '80vh' }}>
          <CrudTableExample />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Box sx={{ bgcolor: 'white', minHeight: '80vh' }}>
          <FullscreenPreviewExample />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Box sx={{ bgcolor: 'white', minHeight: '80vh' }}>
          <InlineEditingExample />
        </Box>
      </TabPanel>
    </Box>
  );
}; 