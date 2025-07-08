import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  DragIndicator,
  Add,
  Delete,
  Edit,
  Visibility,
  ColorLens,
  Image,
  TextFields,
  ViewModule,
  Settings,
  ExpandMore,
} from '@mui/icons-material';

// This shows what a more advanced editor would look like
const AdvancedEditor = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [sections, setSections] = useState([
    { id: 1, type: 'hero', title: 'Hero Section', enabled: true },
    { id: 2, type: 'features', title: 'Course Features', enabled: true },
    { id: 3, type: 'instructor', title: 'About Instructor', enabled: true },
    { id: 4, type: 'testimonials', title: 'Student Reviews', enabled: false },
    { id: 5, type: 'pricing', title: 'Pricing & Enrollment', enabled: true },
    { id: 6, type: 'contact', title: 'Contact Information', enabled: true },
  ]);

  const [colors, setColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#ffffff',
    text: '#333333',
  });

  const ContentTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Page Content</Typography>
      
      {/* Rich Text Editor Simulation */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Hero Section - Main Headline
          </Typography>
          
          {/* Toolbar simulation */}
          <Paper variant="outlined" sx={{ p: 1, mb: 2, display: 'flex', gap: 1 }}>
            <IconButton size="small"><TextFields /></IconButton>
            <IconButton size="small"><ColorLens /></IconButton>
            <IconButton size="small"><Image /></IconButton>
            <Typography variant="caption" sx={{ alignSelf: 'center', ml: 1 }}>
              Rich Text Formatting
            </Typography>
          </Paper>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter your course headline here..."
            defaultValue="Advanced Web Development with React"
            helperText="Use rich formatting: bold, italic, colors, bullet points"
          />
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Hero Image
          </Typography>
          <Box sx={{ 
            border: '2px dashed #ccc', 
            borderRadius: 2, 
            p: 4, 
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main' }
          }}>
            <Image sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1">
              Click to upload course image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports JPG, PNG up to 5MB
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Features List Editor */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Course Features & Benefits
          </Typography>
          
          <List>
            {['Build 5 real-world projects', 'Learn React, TypeScript, Node.js', 'Get job placement assistance'].map((feature, index) => (
              <ListItem key={index} sx={{ border: '1px solid #eee', mb: 1, borderRadius: 1 }}>
                <DragIndicator sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
                <ListItemText primary={feature} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small">
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" size="small">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Button startIcon={<Add />} variant="outlined" sx={{ mt: 2 }}>
            Add Feature
          </Button>
        </CardContent>
      </Card>
    </Box>
  );

  const LayoutTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Page Layout</Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Page Sections - Drag to Reorder
      </Typography>
      
      {sections.map((section) => (
        <Card 
          key={section.id} 
          variant="outlined" 
          sx={{ 
            mb: 2, 
            cursor: 'grab',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DragIndicator sx={{ mr: 2, color: 'text.secondary' }} />
                <ViewModule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1">{section.title}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch 
                  checked={section.enabled}
                  onChange={(e) => {
                    setSections(sections.map(s => 
                      s.id === section.id ? {...s, enabled: e.target.checked} : s
                    ));
                  }}
                  size="small"
                />
                <IconButton size="small">
                  <Settings />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Button startIcon={<Add />} variant="outlined">
        Add Section
      </Button>
    </Box>
  );

  const StyleTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Design & Colors</Typography>
      
      {/* Template Selection */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Template Style</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {['Professional', 'Creative', 'Minimal', 'Bold'].map((template) => (
              <Grid item xs={6} key={template}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    border: template === 'Professional' ? '2px solid' : '1px solid #eee',
                    borderColor: template === 'Professional' ? 'primary.main' : '#eee'
                  }}
                >
                  <Box sx={{ height: 60, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption" sx={{ textAlign: 'center', display: 'block' }}>
                    {template}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Color Customization */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Color Scheme</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(colors).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: value, 
                      borderRadius: 1,
                      border: '1px solid #ddd',
                      cursor: 'pointer'
                    }} 
                  />
                  <Box>
                    <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                      {key}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Typography */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Typography</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Header Font</InputLabel>
            <Select defaultValue="roboto">
              <MenuItem value="roboto">Roboto</MenuItem>
              <MenuItem value="montserrat">Montserrat</MenuItem>
              <MenuItem value="openSans">Open Sans</MenuItem>
              <MenuItem value="poppins">Poppins</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Body Font</InputLabel>
            <Select defaultValue="roboto">
              <MenuItem value="roboto">Roboto</MenuItem>
              <MenuItem value="openSans">Open Sans</MenuItem>
              <MenuItem value="lato">Lato</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const FormsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Lead Capture Forms</Typography>
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Form Fields
          </Typography>
          
          <List>
            {[
              { name: 'First Name', required: true },
              { name: 'Last Name', required: true },
              { name: 'Email', required: true },
              { name: 'Phone', required: false },
              { name: 'Company', required: false },
            ].map((field, index) => (
              <ListItem key={index} sx={{ border: '1px solid #eee', mb: 1, borderRadius: 1 }}>
                <DragIndicator sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
                <ListItemText 
                  primary={field.name}
                  secondary={field.required ? 'Required' : 'Optional'}
                />
                <ListItemSecondaryAction>
                  <Switch checked={field.required} size="small" />
                  <IconButton edge="end" size="small">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Button startIcon={<Add />} variant="outlined" sx={{ mt: 2 }}>
            Add Field
          </Button>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Form Settings
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Send welcome email to leads"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Redirect to thank you page"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <TextField
            fullWidth
            label="Success Message"
            defaultValue="Thank you! We'll contact you soon."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Button Text"
            defaultValue="Enroll Now - Start Learning Today!"
          />
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Landing Page Editor
      </Typography>
      
      <Grid container spacing={3}>
        {/* Editor Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Content" />
              <Tab label="Layout" />
              <Tab label="Style" />
              <Tab label="Forms" />
            </Tabs>
            
            <Box sx={{ p: 3, height: 'calc(100% - 48px)', overflow: 'auto' }}>
              {selectedTab === 0 && <ContentTab />}
              {selectedTab === 1 && <LayoutTab />}
              {selectedTab === 2 && <StyleTab />}
              {selectedTab === 3 && <FormsTab />}
            </Box>
          </Paper>
        </Grid>

        {/* Preview Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Live Preview</Typography>
              <Box>
                <IconButton size="small">
                  <Visibility />
                </IconButton>
                <Button variant="contained" size="small" sx={{ ml: 1 }}>
                  Publish
                </Button>
              </Box>
            </Box>
            
            {/* Preview content would go here */}
            <Box sx={{ 
              border: '1px solid #ddd', 
              borderRadius: 2, 
              height: '90%', 
              bgcolor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h6" color="text.secondary">
                Live Preview of Landing Page
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdvancedEditor;