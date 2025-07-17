import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Stack,
  Tabs,
  Tab,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Computer as DesktopIcon,
  Fullscreen as FullscreenIcon,
  Edit as EditIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

// Sample content for preview
const sampleContent = {
  title: "Professional Swimming Classes",
  subtitle: "Learn to swim with certified instructors",
  description: "Join our comprehensive swimming program designed for all skill levels. From beginners to advanced swimmers, we provide personalized instruction in a safe and supportive environment.",
  instructor: {
    name: "Sarah Johnson",
    credentials: "Certified Swimming Instructor",
    experience: "10+ years experience"
  },
  pricing: {
    single: "$45/session",
    package: "$180/month (4 sessions)",
    trial: "$25 trial class"
  }
};

// Layout Option 1: Horizontal Split (40% Editor / 60% Preview)
const HorizontalSplitLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Editor Panel - 40% */}
      <Paper sx={{ 
        width: '40%', 
        p: 3, 
        borderRadius: 0,
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto'
      }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Landing Page
          </Typography>
          
          <Tabs value={0}>
            <Tab label="Content" />
            <Tab label="Form" />
            <Tab label="Style" />
          </Tabs>
          
          <Divider />
          
          <TextField
            label="Page Title"
            value={sampleContent.title}
            fullWidth
            variant="outlined"
          />
          
          <TextField
            label="Subtitle"
            value={sampleContent.subtitle}
            fullWidth
            variant="outlined"
          />
          
          <TextField
            label="Description"
            value={sampleContent.description}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
          
          <Typography variant="subtitle2">Instructor Details</Typography>
          
          <TextField
            label="Instructor Name"
            value={sampleContent.instructor.name}
            fullWidth
            variant="outlined"
          />
          
          <TextField
            label="Credentials"
            value={sampleContent.instructor.credentials}
            fullWidth
            variant="outlined"
          />
          
          <Typography variant="subtitle2">Pricing</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Single Session"
                value={sampleContent.pricing.single}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Monthly Package"
                value={sampleContent.pricing.package}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>
      
      {/* Preview Panel - 60% */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Preview Controls */}
        <Paper sx={{ 
          p: 2, 
          borderRadius: 0,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Live Preview</Typography>
            <IconButton 
              onClick={() => setIsMobile(!isMobile)}
              color={isMobile ? 'primary' : 'default'}
            >
              <PhoneIcon />
            </IconButton>
            <IconButton 
              onClick={() => setIsMobile(false)}
              color={!isMobile ? 'primary' : 'default'}
            >
              <DesktopIcon />
            </IconButton>
          </Stack>
          
          <Button variant="outlined" startIcon={<FullscreenIcon />}>
            Full Screen Preview
          </Button>
        </Paper>
        
        {/* Preview Content */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          bgcolor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <Paper sx={{ 
            width: isMobile ? 375 : '100%',
            maxWidth: isMobile ? 375 : 1200,
            minHeight: isMobile ? 667 : 800,
            overflow: 'hidden'
          }}>
            {/* Simulated Landing Page */}
            <Box sx={{ 
              height: 300, 
              background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
              display: 'flex',
              alignItems: 'center',
              p: 4,
              color: 'white'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {sampleContent.title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {sampleContent.subtitle}
                </Typography>
                <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#2196F3' }}>
                  Book Now
                </Button>
              </Box>
              
              <Paper sx={{ p: 3, ml: 4, minWidth: 300 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                  Quick Registration
                </Typography>
                <Stack spacing={2}>
                  <TextField placeholder="Your Name" size="small" fullWidth />
                  <TextField placeholder="Email" size="small" fullWidth />
                  <TextField placeholder="Phone" size="small" fullWidth />
                  <Button variant="contained" fullWidth>
                    Register Now
                  </Button>
                </Stack>
              </Paper>
            </Box>
            
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                About Our Program
              </Typography>
              <Typography sx={{ mb: 4, color: '#666', lineHeight: 1.6 }}>
                {sampleContent.description}
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Your Instructor
                  </Typography>
                  <Typography variant="h6">{sampleContent.instructor.name}</Typography>
                  <Typography color="text.secondary">{sampleContent.instructor.credentials}</Typography>
                  <Typography color="text.secondary">{sampleContent.instructor.experience}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Pricing
                  </Typography>
                  <Stack spacing={1}>
                    <Typography>Single Session: <strong>{sampleContent.pricing.single}</strong></Typography>
                    <Typography>Monthly Package: <strong>{sampleContent.pricing.package}</strong></Typography>
                    <Typography>Trial Class: <strong>{sampleContent.pricing.trial}</strong></Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

// Layout Option 2: Vertical Stack with Collapsible Editor
const VerticalStackLayout = () => {
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Controls */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0,
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button 
            variant={editorCollapsed ? "outlined" : "contained"}
            onClick={() => setEditorCollapsed(!editorCollapsed)}
            startIcon={<EditIcon />}
          >
            {editorCollapsed ? 'Show Editor' : 'Hide Editor'}
          </Button>
          
          <FormControlLabel
            control={
              <Switch 
                checked={isMobile}
                onChange={(e) => setIsMobile(e.target.checked)}
              />
            }
            label="Mobile View"
          />
        </Stack>
        
        <Button variant="outlined" startIcon={<FullscreenIcon />}>
          Full Screen Preview
        </Button>
      </Paper>
      
      {/* Editor Panel - Collapsible */}
      {!editorCollapsed && (
        <Paper sx={{ 
          maxHeight: '40%',
          overflowY: 'auto',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Grid container>
            <Grid item xs={4}>
              <Box sx={{ p: 3, borderRight: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Content</Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={sampleContent.title}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Subtitle"
                    value={sampleContent.subtitle}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box sx={{ p: 3, borderRight: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Instructor</Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    value={sampleContent.instructor.name}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Credentials"
                    value={sampleContent.instructor.credentials}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Pricing</Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Single Session"
                    value={sampleContent.pricing.single}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Monthly Package"
                    value={sampleContent.pricing.package}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Preview Panel */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        bgcolor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'auto'
      }}>
        <Paper sx={{ 
          width: isMobile ? 375 : '100%',
          maxWidth: isMobile ? 375 : 1200,
          minHeight: isMobile ? 667 : 600,
          overflow: 'hidden'
        }}>
          {/* Same landing page content as above */}
          <Box sx={{ 
            height: 200, 
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            display: 'flex',
            alignItems: 'center',
            p: 3,
            color: 'white'
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant={isMobile ? "h5" : "h3"} sx={{ fontWeight: 'bold', mb: 1 }}>
                {sampleContent.title}
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2 }}>
                {sampleContent.subtitle}
              </Typography>
              <Button variant="contained" sx={{ bgcolor: 'white', color: '#4CAF50' }}>
                Book Now
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Program Details
            </Typography>
            <Typography sx={{ mb: 3, color: '#666' }}>
              {sampleContent.description}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Instructor</Typography>
                <Typography>{sampleContent.instructor.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {sampleContent.instructor.credentials}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Pricing</Typography>
                <Typography>{sampleContent.pricing.single}</Typography>
                <Typography>{sampleContent.pricing.package}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

// Layout Option 3: Tabbed Interface
const TabbedLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Tab Navigation */}
      <Paper sx={{ borderRadius: 0, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Edit Content" />
            <Tab label="Live Preview" />
            <Tab label="Full Preview" />
          </Tabs>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch 
                  checked={isMobile}
                  onChange={(e) => setIsMobile(e.target.checked)}
                />
              }
              label="Mobile"
            />
            <Button variant="outlined" startIcon={<PreviewIcon />}>
              Quick Preview
            </Button>
          </Stack>
        </Box>
      </Paper>
      
      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Edit Tab */}
        {activeTab === 0 && (
          <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
            <Container maxWidth="md">
              <Typography variant="h5" sx={{ mb: 3 }}>
                Edit Landing Page Content
              </Typography>
              
              <Stack spacing={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Hero Section</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Main Title"
                        value={sampleContent.title}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Subtitle"
                        value={sampleContent.subtitle}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={sampleContent.description}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Instructor Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Instructor Name"
                        value={sampleContent.instructor.name}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Credentials"
                        value={sampleContent.instructor.credentials}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Pricing</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Single Session"
                        value={sampleContent.pricing.single}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Monthly Package"
                        value={sampleContent.pricing.package}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Trial Class"
                        value={sampleContent.pricing.trial}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Container>
          </Box>
        )}
        
        {/* Live Preview Tab */}
        {activeTab === 1 && (
          <Box sx={{ 
            height: '100%',
            p: 3, 
            bgcolor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto'
          }}>
            <Paper sx={{ 
              width: isMobile ? 375 : '90%',
              maxWidth: isMobile ? 375 : 1000,
              minHeight: isMobile ? 667 : 600,
              overflow: 'hidden'
            }}>
              {/* Landing page preview content */}
              <Box sx={{ 
                height: 250, 
                background: 'linear-gradient(135deg, #9C27B0, #E91E63)',
                display: 'flex',
                alignItems: 'center',
                p: 4,
                color: 'white'
              }}>
                <Box>
                  <Typography variant={isMobile ? "h5" : "h3"} sx={{ fontWeight: 'bold', mb: 2 }}>
                    {sampleContent.title}
                  </Typography>
                  <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 3 }}>
                    {sampleContent.subtitle}
                  </Typography>
                  <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#9C27B0' }}>
                    Get Started
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  What You'll Learn
                </Typography>
                <Typography sx={{ mb: 4, color: '#666', lineHeight: 1.6 }}>
                  {sampleContent.description}
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Meet Your Instructor
                    </Typography>
                    <Typography variant="h6">{sampleContent.instructor.name}</Typography>
                    <Typography color="text.secondary">{sampleContent.instructor.credentials}</Typography>
                    <Typography color="text.secondary">{sampleContent.instructor.experience}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Class Pricing
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>• {sampleContent.pricing.single}</Typography>
                      <Typography>• {sampleContent.pricing.package}</Typography>
                      <Typography>• {sampleContent.pricing.trial}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Full Preview Tab */}
        {activeTab === 2 && (
          <Box sx={{ height: '100%', bgcolor: '#000' }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              pt: 20 
            }}>
              Full Screen Preview Mode
            </Typography>
            <Typography sx={{ 
              color: '#ccc', 
              textAlign: 'center', 
              mt: 2 
            }}>
              This would show the landing page in full browser window
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const LivePreviewLayouts = () => {
  const [selectedLayout, setSelectedLayout] = useState(0);
  
  const layouts = [
    { name: "Horizontal Split", component: HorizontalSplitLayout, description: "40% editor, 60% live preview side by side" },
    { name: "Vertical Stack", component: VerticalStackLayout, description: "Collapsible editor on top, preview below" },
    { name: "Tabbed Interface", component: TabbedLayout, description: "Switch between edit and preview modes" }
  ];

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Live Preview Layout Examples
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {layouts.map((layout, index) => (
            <Button
              key={index}
              variant={selectedLayout === index ? "contained" : "outlined"}
              onClick={() => setSelectedLayout(index)}
              sx={{ minWidth: 150 }}
            >
              {layout.name}
            </Button>
          ))}
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          <strong>Current:</strong> {layouts[selectedLayout].description}
        </Typography>
      </Container>
      
      <Box sx={{ height: 'calc(100vh - 200px)', border: '2px solid #e0e0e0' }}>
        {React.createElement(layouts[selectedLayout].component)}
      </Box>
    </Box>
  );
};

export default LivePreviewLayouts; 