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
  Avatar,
  Chip,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  School,
  Star,
  AccessTime,
  Language,
  CheckCircle,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

// This component demonstrates what the final landing page will look like
// Both the editor view and the public view

const LandingPageDemo = () => {
  const [isEditorMode, setIsEditorMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Sample course data that would come from the course management system
  const courseData = {
    title: "Advanced Web Development with React",
    subtitle: "Master modern web development with hands-on projects",
    instructor: "Sarah Johnson",
    instructorAvatar: "/api/placeholder/100/100",
    rating: 4.8,
    students: 2847,
    duration: "12 weeks",
    language: "English",
    price: "$299",
    originalPrice: "$399",
    features: [
      "24/7 Support",
      "Certificate of Completion",
      "Lifetime Access",
      "Mobile Learning",
      "Live Sessions"
    ],
    highlights: [
      "Build 5 real-world projects",
      "Learn React, TypeScript, Node.js",
      "Get job placement assistance",
      "Access to exclusive community"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would submit to the existing lead API
    console.log('Submitting lead:', formData);
    alert('Thank you! We will contact you soon.');
  };

  const PublicView = () => (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
              {courseData.title}
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, color: '#666', lineHeight: 1.4 }}>
              {courseData.subtitle}
            </Typography>
            
            {/* Course Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Chip 
                icon={<Star />} 
                label={`${courseData.rating} (${courseData.students} students)`}
                color="primary" 
              />
              <Chip 
                icon={<AccessTime />} 
                label={courseData.duration}
                variant="outlined" 
              />
              <Chip 
                icon={<Language />} 
                label={courseData.language}
                variant="outlined" 
              />
            </Box>

            {/* Instructor */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar src={courseData.instructorAvatar} sx={{ mr: 2, width: 56, height: 56 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Instructor: {courseData.instructor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Senior Full-Stack Developer
                </Typography>
              </Box>
            </Box>

            {/* Highlights */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              What You'll Learn:
            </Typography>
            {courseData.highlights.map((highlight, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{highlight}</Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Lead Capture Form */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
                Get Started Today!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                Join thousands of students already learning
              </Typography>

              {/* Pricing */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {courseData.price}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  {courseData.originalPrice}
                </Typography>
                <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                  Limited Time Offer!
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  margin="normal"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 3, 
                    py: 2, 
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Enroll Now - Start Learning Today!
                </Button>
              </form>

              {/* Trust Indicators */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                {courseData.features.map((feature, index) => (
                  <Chip 
                    key={index}
                    label={feature} 
                    size="small" 
                    sx={{ m: 0.5 }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: '#ffffff', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Questions? Get in Touch
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Phone sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Call Us</Typography>
              <Typography>+1 (555) 123-4567</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Email sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Email Us</Typography>
              <Typography>info@example.com</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Visit Us</Typography>
              <Typography>123 Learning St, Education City</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );

  const EditorView = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Landing Page Editor
        </Typography>
        
        <Grid container spacing={4}>
          {/* Template Selection */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Template: Professional</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Clean, modern design perfect for professional courses
              </Typography>
              <Button variant="outlined" size="small">
                Change Template
              </Button>
            </Card>
          </Grid>

          {/* Content Editor */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>Content Settings</Typography>
            
            <TextField
              fullWidth
              label="Course Title"
              value={courseData.title}
              margin="normal"
              helperText="This will be the main headline"
            />
            
            <TextField
              fullWidth
              label="Course Subtitle"
              value={courseData.subtitle}
              margin="normal"
              multiline
              rows={2}
            />
            
            <TextField
              fullWidth
              label="Course Price"
              value={courseData.price}
              margin="normal"
              type="number"
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Lead Capture Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              All leads will be automatically saved to your CRM system
            </Typography>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Require phone number"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send welcome email"
            />
            
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" sx={{ mr: 2 }}>
                Save Changes
              </Button>
              <Button variant="outlined">
                Preview Landing Page
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );

  return (
    <Box>
      {/* Mode Toggle */}
      <Box sx={{ 
        position: 'fixed', 
        top: 20, 
        right: 20, 
        zIndex: 1000,
        bgcolor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: 3
      }}>
        <FormControlLabel
          control={
            <Switch 
              checked={isEditorMode}
              onChange={(e) => setIsEditorMode(e.target.checked)}
            />
          }
          label={isEditorMode ? "Editor View" : "Public View"}
        />
      </Box>

      {isEditorMode ? <EditorView /> : <PublicView />}
    </Box>
  );
};

export default LandingPageDemo;