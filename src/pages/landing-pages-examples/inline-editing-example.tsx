import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Fade,
  ClickAwayListener,
  Popper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Editable Text Component
const EditableText = ({ 
  children, 
  variant = "body1", 
  onSave, 
  multiline = false,
  placeholder = "Click to edit...",
  sx = {}
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(children);
  const [originalValue, setOriginalValue] = useState(children);

  const handleEdit = () => {
    setOriginalValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(value);
  };

  const handleCancel = () => {
    setValue(originalValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ClickAwayListener onClickAway={handleCancel}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            multiline={multiline}
            rows={multiline ? 3 : 1}
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !multiline) {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: variant === 'h3' ? '3rem' : 
                         variant === 'h4' ? '2.125rem' :
                         variant === 'h5' ? '1.5rem' :
                         variant === 'h6' ? '1.25rem' : '1rem',
                fontWeight: variant.startsWith('h') ? 'bold' : 'normal'
              }
            }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" onClick={handleSave} startIcon={<SaveIcon />}>
              Save
            </Button>
            <Button size="small" onClick={handleCancel} startIcon={<CloseIcon />}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </ClickAwayListener>
    );
  }

  return (
    <Box
      onClick={handleEdit}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          borderRadius: 1,
        },
        '&:hover .edit-indicator': {
          opacity: 1
        },
        ...sx
      }}
    >
      <Typography variant={variant} sx={{ minHeight: '1.5em' }}>
        {value || placeholder}
      </Typography>
      <EditIcon 
        className="edit-indicator"
        sx={{ 
          position: 'absolute',
          top: -8,
          right: -8,
          fontSize: 16,
          opacity: 0,
          transition: 'opacity 0.2s',
          color: 'primary.main',
          backgroundColor: 'white',
          borderRadius: '50%',
          p: 0.5
        }} 
      />
    </Box>
  );
};

// Editable Section Component
const EditableSection = ({ children, onStyleChange, onDelete, backgroundColor = 'white', sectionName = '' }: any) => {
  const [showControls, setShowControls] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStyleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const colorOptions = [
    { name: 'White', value: 'white' },
    { name: 'Light Blue', value: '#f8f9fa' },
    { name: 'Blue Gradient', value: 'linear-gradient(135deg, #2196F3, #21CBF3)' },
    { name: 'Green Gradient', value: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { name: 'Purple Gradient', value: 'linear-gradient(135deg, #9C27B0, #E91E63)' }
  ];

  return (
    <Box
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      sx={{
        position: 'relative',
        background: backgroundColor,
        '&:hover': {
          outline: '2px dashed #1976d2',
          outlineOffset: '4px'
        }
      }}
    >
      {children}
      
      <Fade in={showControls}>
        <Box sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10
        }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Change Background">
              <IconButton 
                size="small" 
                onClick={handleStyleClick}
                sx={{ 
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <PaletteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {onDelete && (
              <Tooltip title={`Delete ${sectionName} Section`}>
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(sectionName)}
                  sx={{ 
                    backgroundColor: 'white',
                    boxShadow: 2,
                    color: '#f44336',
                    '&:hover': { backgroundColor: '#ffebee' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Fade>

      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-end">
        <Paper sx={{ p: 2, mt: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Background Style
          </Typography>
          <Stack spacing={1}>
            {colorOptions.map((color) => (
              <Button
                key={color.value}
                variant="outlined"
                size="small"
                onClick={() => {
                  onStyleChange?.(color.value);
                  setAnchorEl(null);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  background: color.value,
                  color: color.value.includes('gradient') ? 'white' : 'black'
                }}
              >
                {color.name}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Popper>
    </Box>
  );
};

export default function InlineEditingExample() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [isMobile, setIsMobile] = useState(false);
  
  const [landingData, setLandingData] = useState({
    title: "Professional Swimming Classes",
    subtitle: "Learn to swim with certified instructors",
    description: "Our comprehensive swimming program is designed for all skill levels. Whether you're a complete beginner or looking to refine your technique, our certified instructors provide personalized attention in a safe and supportive environment.",
    instructorName: "Sarah Johnson",
    instructorCredentials: "Certified Swimming Instructor",
    contactTitle: "Ready to Start Swimming?",
    pricingTitle: "Class Pricing", 
    aboutTitle: "About Our Program",
    instructorTitle: "Meet Your Instructor",
    pricing: {
      trial: "$25",
      single: "$45",
      package: "$180"
    },
    buttons: {
      cta: "Start Your Journey",
      register: "Register Now",
      contact: "Send Message & Get Started",
      choosePlan: "Choose Plan"
    },
    form: {
      title: "Quick Registration",
      namePlaceholder: "Full Name",
      emailPlaceholder: "Email Address", 
      phonePlaceholder: "Phone Number",
      messagePlaceholder: "Tell us about your swimming goals..."
    }
  });

  const [sectionStyles, setSectionStyles] = useState({
    hero: 'linear-gradient(135deg, #2196F3, #21CBF3)',
    about: 'white',
    instructor: '#f8f9fa',
    pricing: 'white',
    contact: '#f8f9fa'
  });

  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    about: true,
    instructor: true,
    pricing: true,
    contact: true
  });

  const updateField = (field: string, value: string) => {
    setLandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePricing = (field: string, value: string) => {
    setLandingData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const updateButton = (field: string, value: string) => {
    setLandingData(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [field]: value
      }
    }));
  };

  const updateForm = (field: string, value: string) => {
    setLandingData(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value
      }
    }));
  };

  const updateSectionStyle = (section: string, style: string) => {
    setSectionStyles(prev => ({
      ...prev,
      [section]: style
    }));
  };

  const toggleSection = (section: string) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4">
          Inline Editing Example
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Click on any text to edit it directly. Hover over sections to change their style.
          The preview is scaled to 40% so you can see everything without scrolling.
        </Typography>

        {/* Control Panel */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip 
              icon={<EditIcon />} 
              label="Click text to edit" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<PaletteIcon />} 
              label="Hover sections for styling" 
              color="secondary" 
              variant="outlined" 
            />
            <Chip 
              icon={<DeleteIcon />} 
              label="Delete sections" 
              color="error" 
              variant="outlined" 
            />
            
            <Box sx={{ mx: 2, height: 24, borderLeft: '1px solid #ddd' }} />
            
            <Stack direction="row" spacing={1} alignItems="center">
              <ComputerIcon color={!isMobile ? "primary" : "disabled"} />
              <Switch
                checked={isMobile}
                onChange={(e) => setIsMobile(e.target.checked)}
                size="small"
              />
              <SmartphoneIcon color={isMobile ? "primary" : "disabled"} />
            </Stack>
            
            <Button variant="contained" size="small">
              Save Landing Page
            </Button>
          </Stack>
        </Paper>

        {/* Section Management Panel */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Section Management
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(visibleSections).map(([section, isVisible]) => (
              <Chip
                key={section}
                label={section.charAt(0).toUpperCase() + section.slice(1)}
                color={isVisible ? "success" : "default"}
                variant={isVisible ? "filled" : "outlined"}
                onClick={() => toggleSection(section)}
                onDelete={isVisible ? () => toggleSection(section) : undefined}
                deleteIcon={isVisible ? <DeleteIcon /> : undefined}
                sx={{ 
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { 
                    backgroundColor: isVisible ? 'success.dark' : 'primary.light' 
                  }
                }}
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Click to toggle sections on/off. Deleted sections can be restored here.
          </Typography>
        </Paper>

        {/* Landing Page Preview */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Paper sx={{ 
            overflow: 'hidden',
            transform: 'scale(0.4)',
            transformOrigin: 'top center',
            width: isMobile ? '100%' : '250%', // Adjust for mobile vs desktop
            maxWidth: isMobile ? '375px' : 'none', // Mobile width
            height: 'auto',
            direction: isRTL ? 'rtl' : 'ltr'
          }}>
          {/* Hero Section */}
          {visibleSections.hero && (
            <EditableSection 
              backgroundColor={sectionStyles.hero}
              onStyleChange={(style: string) => updateSectionStyle('hero', style)}
              onDelete={toggleSection}
              sectionName="hero"
            >
            <Box sx={{ 
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              p: 6,
              color: 'white'
            }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Box sx={{ flex: 1 }}>
                    <EditableText
                      variant="h3"
                      onSave={(value: string) => updateField('title', value)}
                      sx={{ mb: 2, fontWeight: 'bold' }}
                    >
                      {landingData.title}
                    </EditableText>
                    
                    <EditableText
                      variant="h6"
                      onSave={(value: string) => updateField('subtitle', value)}
                      sx={{ mb: 3, opacity: 0.9 }}
                    >
                      {landingData.subtitle}
                    </EditableText>
                    
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#2196F3',
                        px: 4,
                        py: 1.5,
                        fontSize: '18px'
                      }}
                    >
                      <EditableText
                        variant="button"
                        onSave={(value: string) => updateButton('cta', value)}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {landingData.buttons.cta}
                      </EditableText>
                    </Button>
                  </Box>
                  
                  <Paper sx={{ 
                    p: 3, 
                    minWidth: 300,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <EditableText
                      variant="h6"
                      onSave={(value: string) => updateForm('title', value)}
                      sx={{ mb: 2, color: '#333' }}
                    >
                      {landingData.form.title}
                    </EditableText>
                    <Stack spacing={2}>
                      <TextField placeholder={landingData.form.namePlaceholder} size="small" fullWidth />
                      <TextField placeholder={landingData.form.emailPlaceholder} size="small" fullWidth />
                      <TextField placeholder={landingData.form.phonePlaceholder} size="small" fullWidth />
                      <Button variant="contained" fullWidth size="large">
                        <EditableText
                          variant="button"
                          onSave={(value: string) => updateButton('register', value)}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {landingData.buttons.register}
                        </EditableText>
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              </Container>
            </Box>
            </EditableSection>
          )}
          
          {/* About Section */}
          {visibleSections.about && (
            <EditableSection 
              backgroundColor={sectionStyles.about}
              onStyleChange={(style: string) => updateSectionStyle('about', style)}
              onDelete={toggleSection}
              sectionName="about"
            >
              <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                  <EditableText
                    variant="h3"
                    onSave={(value: string) => updateField('aboutTitle', value)}
                    sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
                  >
                    {landingData.aboutTitle}
                  </EditableText>
                  
                  <EditableText
                    variant="h6"
                    multiline
                    onSave={(value: string) => updateField('description', value)}
                    sx={{ 
                      textAlign: 'center', 
                      maxWidth: 800, 
                      mx: 'auto', 
                      lineHeight: 1.8,
                      fontWeight: 'normal'
                    }}
                  >
                    {landingData.description}
                  </EditableText>
                </Container>
              </Box>
            </EditableSection>
          )}
          
          {/* Instructor Section */}
          {visibleSections.instructor && (
            <EditableSection 
              backgroundColor={sectionStyles.instructor}
              onStyleChange={(style: string) => updateSectionStyle('instructor', style)}
              onDelete={toggleSection}
              sectionName="instructor"
            >
              <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <EditableText
                        variant="h3"
                        onSave={(value: string) => updateField('instructorTitle', value)}
                        sx={{ mb: 3, fontWeight: 'bold' }}
                      >
                        {landingData.instructorTitle}
                      </EditableText>
                      
                      <Stack direction={isMobile ? "column" : "row"} spacing={3} sx={{ mb: 3 }} alignItems="center">
                        <Avatar sx={{ width: 80, height: 80, bgcolor: '#2196F3' }}>
                          {landingData.instructorName.charAt(0)}
                        </Avatar>
                        <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                          <EditableText
                            variant="h5"
                            onSave={(value: string) => updateField('instructorName', value)}
                            sx={{ fontWeight: 'bold' }}
                          >
                            {landingData.instructorName}
                          </EditableText>
                          
                          <EditableText
                            variant="body1"
                            onSave={(value: string) => updateField('instructorCredentials', value)}
                            sx={{ color: 'text.secondary', mb: 1 }}
                          >
                            {landingData.instructorCredentials}
                          </EditableText>
                        </Box>
                      </Stack>
                      
                      <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent={isMobile ? "center" : "flex-start"}>
                        <Chip label="10+ Years Experience" color="primary" />
                        <Chip label="Certified Instructor" color="secondary" />
                        <Chip label="All Skill Levels" color="info" />
                      </Stack>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </EditableSection>
          )}
          
          {/* Pricing Section */}
          {visibleSections.pricing && (
            <EditableSection 
              backgroundColor={sectionStyles.pricing}
              onStyleChange={(style: string) => updateSectionStyle('pricing', style)}
              onDelete={toggleSection}
              sectionName="pricing"
            >
              <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                  <EditableText
                    variant="h3"
                    onSave={(value: string) => updateField('pricingTitle', value)}
                    sx={{ mb: 6, textAlign: 'center', fontWeight: 'bold' }}
                  >
                    {landingData.pricingTitle}
                  </EditableText>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 4,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'center' : 'stretch'
                  }}>
                    {[
                      { key: 'trial', title: 'Trial Class', features: ['30-minute session', 'Equipment included'] },
                      { key: 'single', title: 'Single Session', features: ['60-minute session', 'Personal attention'] },
                      { key: 'package', title: 'Monthly Package', features: ['4 sessions per month', 'Best value'] }
                    ].map((plan) => (
                      <Paper key={plan.key} sx={{ p: 3, textAlign: 'center', minWidth: isMobile ? 280 : 200, maxWidth: 300 }}>
                        <EditableText
                          variant="h6"
                          onSave={(value: string) => updateField(`pricing${plan.key}Title`, value)}
                          sx={{ mb: 2, fontWeight: 'bold' }}
                        >
                          {plan.title}
                        </EditableText>
                        
                        <EditableText
                          variant="h3"
                          onSave={(value: string) => updatePricing(plan.key, value)}
                          sx={{ mb: 3, fontWeight: 'bold', color: '#2196F3' }}
                        >
                          {landingData.pricing[plan.key as keyof typeof landingData.pricing]}
                        </EditableText>
                        
                        <Stack spacing={1} sx={{ mb: 3 }}>
                          {plan.features.map((feature, idx) => (
                            <Typography key={idx} variant="body2">
                              ✓ {feature}
                            </Typography>
                          ))}
                        </Stack>
                        
                        <Button variant="outlined" fullWidth>
                          <EditableText
                            variant="button"
                            onSave={(value: string) => updateButton('choosePlan', value)}
                            sx={{ fontWeight: 'bold' }}
                          >
                            {landingData.buttons.choosePlan}
                          </EditableText>
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Container>
              </Box>
            </EditableSection>
          )}
          
          {/* Contact Section */}
          {visibleSections.contact && (
            <EditableSection 
              backgroundColor={sectionStyles.contact}
              onStyleChange={(style: string) => updateSectionStyle('contact', style)}
              onDelete={toggleSection}
              sectionName="contact"
            >
              <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                  <EditableText
                    variant="h3"
                    onSave={(value: string) => updateField('contactTitle', value)}
                    sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
                  >
                    {landingData.contactTitle}
                  </EditableText>
                  
                  <Paper sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 3, 
                      mb: 3,
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <TextField label={landingData.form.namePlaceholder} fullWidth />
                      <TextField label={landingData.form.emailPlaceholder} fullWidth />
                    </Box>
                    <TextField 
                      label="Message (Optional)" 
                      placeholder={landingData.form.messagePlaceholder}
                      fullWidth 
                      multiline 
                      rows={3} 
                      sx={{ mb: 3 }}
                    />
                    <Button variant="contained" size="large" fullWidth sx={{ py: 2 }}>
                      <EditableText
                        variant="button"
                        onSave={(value: string) => updateButton('contact', value)}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {landingData.buttons.contact}
                      </EditableText>
                    </Button>
                  </Paper>
                </Container>
              </Box>
            </EditableSection>
          )}
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
} 