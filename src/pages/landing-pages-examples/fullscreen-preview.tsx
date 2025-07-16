import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  IconButton,
  AppBar,
  Toolbar,
  Stack,
  Chip,
  Paper,
  TextField,
  Grid,
  Avatar,
  Rating,
  FormControlLabel,
  Switch,
  Slide,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  Phone as PhoneIcon,
  Computer as DesktopIcon,
  Share as ShareIcon,
  Launch as LaunchIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// TipTap-like Simple Rich Text Editor Component
const SimpleRichTextEditor = ({ value, onChange, placeholder }: any) => {
  const [content, setContent] = useState(value || '');
  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
      <TextField
        multiline
        fullWidth
        variant="standard"
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: '16px',
            lineHeight: 1.6,
            '& textarea': {
              resize: 'none'
            }
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            minHeight: 100
          }
        }}
      />
      
      {/* Simple formatting toolbar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mt: 1, 
        pt: 1, 
        borderTop: '1px solid #e0e0e0' 
      }}>
        <Typography variant="caption" color="text.secondary">
          Simple text editor • Use line breaks for paragraphs
        </Typography>
      </Box>
    </Paper>
  );
};

const LandingPagePreview = ({ isMobile, content }: any) => {
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      overflow: 'auto',
      bgcolor: 'white'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        minHeight: isMobile ? 300 : 400, 
        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
        display: 'flex',
        alignItems: 'center',
        p: isMobile ? 2 : 6,
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography 
                variant={isMobile ? "h4" : "h2"} 
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                {content?.title || "Professional Swimming Classes"}
              </Typography>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ mb: 3, opacity: 0.9 }}
              >
                {content?.subtitle || "Learn to swim with certified instructors"}
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#2196F3',
                  px: 4,
                  py: 1.5,
                  fontSize: '18px',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Start Your Journey
              </Button>
            </Grid>
            
            {!isMobile && (
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                    Quick Registration
                  </Typography>
                  <Stack spacing={2}>
                    <TextField 
                      placeholder="Full Name" 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                    />
                    <TextField 
                      placeholder="Email Address" 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                    />
                    <TextField 
                      placeholder="Phone Number" 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                    />
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Register Now
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* About Section */}
      <Box sx={{ py: isMobile ? 4 : 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
          >
            About Our Program
          </Typography>
          
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            sx={{ 
              mb: 6, 
              textAlign: 'center', 
              color: '#666',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {content?.description || `Our comprehensive swimming program is designed for all skill levels. 
            Whether you're a complete beginner or looking to refine your technique, our certified 
            instructors provide personalized attention in a safe and supportive environment.`}
          </Typography>
          
          <Grid container spacing={4}>
            {[
              { title: "Expert Instructors", icon: "👨‍🏫", desc: "Certified professionals with years of experience" },
              { title: "Safe Environment", icon: "🏊‍♀️", desc: "Clean, modern facilities with safety protocols" },
              { title: "All Skill Levels", icon: "🎯", desc: "From beginners to advanced swimmers" },
              { title: "Flexible Scheduling", icon: "📅", desc: "Morning, afternoon, and evening classes" }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography sx={{ fontSize: 48, mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Instructor Section */}
      <Box sx={{ py: isMobile ? 4 : 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                sx={{ mb: 3, fontWeight: 'bold' }}
              >
                Meet Your Instructor
              </Typography>
              
              <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#2196F3' }}>
                  {(content?.instructor?.name || "Sarah Johnson").charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {content?.instructor?.name || "Sarah Johnson"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {content?.instructor?.credentials || "Certified Swimming Instructor"}
                  </Typography>
                  <Rating value={5} readOnly size="small" />
                </Box>
              </Stack>
              
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {content?.instructor?.bio || `With over 10 years of experience teaching swimming, 
                Sarah has helped hundreds of students overcome their fear of water and develop 
                strong swimming skills. Her patient and encouraging approach makes learning 
                enjoyable for students of all ages.`}
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Chip label="10+ Years Experience" color="primary" />
                <Chip label="200+ Students Taught" color="secondary" />
                <Chip label="Safety Certified" color="success" />
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: 300,
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" color="text.secondary">
                  Instructor Photo/Video
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Pricing Section */}
      <Box sx={{ py: isMobile ? 4 : 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ mb: 6, textAlign: 'center', fontWeight: 'bold' }}
          >
            Class Pricing
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Trial Class",
                price: content?.pricing?.trial || "$25",
                features: ["30-minute session", "Equipment included", "No commitment"],
                popular: false
              },
              {
                title: "Single Session",
                price: content?.pricing?.single || "$45",
                features: ["60-minute session", "Personal attention", "Progress tracking"],
                popular: false
              },
              {
                title: "Monthly Package",
                price: content?.pricing?.package || "$180",
                features: ["4 sessions per month", "Best value", "Priority booking", "Progress reports"],
                popular: true
              }
            ].map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    position: 'relative',
                    height: '100%',
                    border: plan.popular ? '2px solid #2196F3' : '1px solid #e0e0e0',
                    transform: plan.popular ? 'scale(1.05)' : 'none'
                  }}
                >
                  {plan.popular && (
                    <Chip 
                      label="Most Popular" 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: -12, 
                        left: '50%', 
                        transform: 'translateX(-50%)' 
                      }} 
                    />
                  )}
                  
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {plan.title}
                  </Typography>
                  
                  <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#2196F3' }}>
                    {plan.price}
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    {plan.features.map((feature, idx) => (
                      <Typography key={idx} variant="body2">
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Stack>
                  
                  <Button 
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                  >
                    Choose Plan
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Contact Section */}
      <Box sx={{ py: isMobile ? 4 : 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
          >
            Ready to Start Swimming?
          </Typography>
          
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Preferred Class Time"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message (Optional)"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Tell us about your swimming goals or any questions you have..."
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Send Message & Get Started
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ py: 3, bgcolor: '#2196F3', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            © 2024 Swimming Academy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export const FullscreenPreviewExample = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    title: "Professional Swimming Classes",
    subtitle: "Learn to swim with certified instructors",
    description: "Our comprehensive swimming program is designed for all skill levels. Whether you're a complete beginner or looking to refine your technique, our certified instructors provide personalized attention in a safe and supportive environment.",
    instructor: {
      name: "Sarah Johnson",
      credentials: "Certified Swimming Instructor",
      bio: "With over 10 years of experience teaching swimming, Sarah has helped hundreds of students overcome their fear of water and develop strong swimming skills."
    },
    pricing: {
      trial: "$25",
      single: "$45",
      package: "$180"
    }
  });

  const [editingContent, setEditingContent] = useState(content);

  const handleSaveChanges = () => {
    setContent(editingContent);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4">
          Full Screen Preview Examples
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          This demonstrates different full-screen preview modes with simple TipTap-like editing capabilities.
        </Typography>

        {/* Preview Triggers */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview Options
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<FullscreenIcon />}
              onClick={() => setShowPreview(true)}
            >
              Full Screen Preview
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Content
            </Button>
          </Stack>
        </Paper>

        {/* Simple Content Editor */}
        {isEditing && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Landing Page Content
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="Page Title"
                value={editingContent.title}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  title: e.target.value
                })}
                fullWidth
              />
              
              <TextField
                label="Subtitle"
                value={editingContent.subtitle}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  subtitle: e.target.value
                })}
                fullWidth
              />
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <SimpleRichTextEditor
                  value={editingContent.description}
                  onChange={(value: string) => setEditingContent({
                    ...editingContent,
                    description: value
                  })}
                  placeholder="Enter the main description of your program..."
                />
              </Box>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Instructor Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Instructor Name"
                    value={editingContent.instructor.name}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      instructor: {
                        ...editingContent.instructor,
                        name: e.target.value
                      }
                    })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Credentials"
                    value={editingContent.instructor.credentials}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      instructor: {
                        ...editingContent.instructor,
                        credentials: e.target.value
                      }
                    })}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Pricing
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Trial Class Price"
                    value={editingContent.pricing.trial}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      pricing: {
                        ...editingContent.pricing,
                        trial: e.target.value
                      }
                    })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Single Session Price"
                    value={editingContent.pricing.single}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      pricing: {
                        ...editingContent.pricing,
                        single: e.target.value
                      }
                    })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Monthly Package Price"
                    value={editingContent.pricing.package}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      pricing: {
                        ...editingContent.pricing,
                        package: e.target.value
                      }
                    })}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingContent(content);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Current Content Preview */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Current Content Summary
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Title:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{content.title}</Typography>
              
              <Typography variant="subtitle2">Subtitle:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{content.subtitle}</Typography>
              
              <Typography variant="subtitle2">Instructor:</Typography>
              <Typography variant="body2">{content.instructor.name}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Pricing:</Typography>
              <Typography variant="body2">Trial: {content.pricing.trial}</Typography>
              <Typography variant="body2">Single: {content.pricing.single}</Typography>
              <Typography variant="body2">Package: {content.pricing.package}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Stack>

      {/* Full Screen Preview Dialog */}
      <Dialog
        fullScreen
        open={showPreview}
        onClose={() => setShowPreview(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowPreview(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Landing Page Preview
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={isMobile}
                    onChange={(e) => setIsMobile(e.target.checked)}
                    color="default"
                  />
                }
                label={isMobile ? "Mobile" : "Desktop"}
                sx={{ color: 'white', mr: 2 }}
              />
              
              <IconButton color="inherit">
                <ShareIcon />
              </IconButton>
              
              <IconButton color="inherit">
                <LaunchIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center',
          bgcolor: isMobile ? '#f5f5f5' : 'white',
          p: isMobile ? 2 : 0
        }}>
          <Box sx={{ 
            width: isMobile ? 375 : '100%',
            maxWidth: isMobile ? 375 : 'none',
            height: isMobile ? 667 : '100%',
            overflow: 'auto',
            boxShadow: isMobile ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
            borderRadius: isMobile ? 2 : 0
          }}>
            <LandingPagePreview isMobile={isMobile} content={content} />
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default FullscreenPreviewExample; 