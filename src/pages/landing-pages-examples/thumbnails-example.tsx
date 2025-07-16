import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  Rating
} from '@mui/material';
import { Star, Pool, FitnessCenter, SelfImprovement } from '@mui/icons-material';

// Example templates data
const templates = [
  {
    id: 1,
    name: "Hero + Form Layout",
    category: "Swimming",
    description: "Lead form in hero section for high conversion",
    color: "#2196F3"
  },
  {
    id: 2,
    name: "Sidebar Form Layout", 
    category: "Fitness",
    description: "Professional content with sticky form sidebar",
    color: "#4CAF50"
  },
  {
    id: 3,
    name: "Bottom Form Layout",
    category: "Yoga",
    description: "Content-rich design with form at bottom",
    color: "#9C27B0"
  }
];

// Add after the existing templates array
const verticalTemplates = [
  {
    id: 4,
    name: "Mobile-First Hero",
    category: "Swimming", 
    description: "Optimized for mobile viewing and conversion",
    color: "#2196F3",
    orientation: "portrait"
  },
  {
    id: 5,
    name: "Story-Driven",
    category: "Fitness",
    description: "Vertical storytelling with testimonials",
    color: "#4CAF50", 
    orientation: "portrait"
  },
  {
    id: 6,
    name: "Compact Form",
    category: "Yoga",
    description: "Minimalist design with prominent signup",
    color: "#9C27B0",
    orientation: "portrait"
  }
];

// Approach 1: Realistic Mini Website
const RealisticThumbnail = ({ template }: { template: any }) => (
  <Card 
    sx={{ 
      width: 250, 
      height: 150, 
      cursor: 'pointer',
      overflow: 'hidden',
      border: '2px solid transparent',
      '&:hover': { 
        border: '2px solid #1976d2',
        transform: 'scale(1.02)'
      },
      transition: 'all 0.2s'
    }}
  >
    <Box sx={{ 
      transform: 'scale(0.25)', 
      transformOrigin: 'top left',
      width: '1000px',
      height: '600px'
    }}>
      {/* Mini Hero Section */}
      <Box sx={{ 
        height: 200, 
        background: `linear-gradient(135deg, ${template.color}40, ${template.color}80)`,
        display: 'flex',
        alignItems: 'center',
        px: 4
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            {template.category} Classes
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Professional training with certified instructors
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: template.color }}>
            Join Now
          </Button>
        </Box>
        {template.id === 1 && (
          <Paper sx={{ p: 3, ml: 4, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Registration</Typography>
            <Stack spacing={2}>
              <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              <Button variant="contained" fullWidth>Register</Button>
            </Stack>
          </Paper>
        )}
      </Box>
      
      {/* Content sections */}
      <Box sx={{ p: 4, bgcolor: 'white' }}>
        <Grid container spacing={4}>
          <Grid item xs={template.id === 2 ? 8 : 12}>
            <Typography variant="h4" sx={{ mb: 2 }}>About Our Program</Typography>
            <Typography sx={{ mb: 3, color: '#666' }}>
              Experience professional {template.category.toLowerCase()} training designed for all skill levels.
            </Typography>
            <Grid container spacing={2}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={4} key={i}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ bgcolor: template.color, mx: 'auto', mb: 1 }}>
                      {template.category === 'Swimming' ? <Pool /> : 
                       template.category === 'Fitness' ? <FitnessCenter /> : <SelfImprovement />}
                    </Avatar>
                    <Typography variant="h6">Feature {i}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Professional training feature description
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {template.id === 2 && (
            <Grid item xs={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Contact Form</Typography>
                <Stack spacing={2}>
                  <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                  <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                  <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                  <Button variant="contained" fullWidth>Submit</Button>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        {template.id === 3 && (
          <Paper sx={{ p: 4, mt: 4, bgcolor: '#f8f9fa' }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              Ready to Start?
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={8}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ height: 40, flex: 1, bgcolor: 'white', borderRadius: 1 }} />
                  <Box sx={{ height: 40, flex: 1, bgcolor: 'white', borderRadius: 1 }} />
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" fullWidth size="large">
                  Get Started
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Box>
  </Card>
);

// Approach 2: Wireframe Style
const WireframeThumbnail = ({ template }: { template: any }) => (
  <Card 
    sx={{ 
      width: 250, 
      height: 150, 
      cursor: 'pointer',
      border: '2px solid #e0e0e0',
      '&:hover': { 
        border: '2px solid #1976d2',
        boxShadow: 3
      },
      transition: 'all 0.2s'
    }}
  >
    <CardContent sx={{ p: 1, height: '100%' }}>
      <Stack spacing={1} sx={{ height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          height: template.id === 1 ? 60 : 30, 
          bgcolor: `${template.color}20`, 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          px: 1
        }}>
          <Box sx={{ 
            width: template.id === 1 ? '60%' : '100%', 
            height: 8, 
            bgcolor: template.color, 
            borderRadius: 0.5 
          }} />
          {template.id === 1 && (
            <Box sx={{ 
              width: 60, 
              height: 40, 
              bgcolor: 'white', 
              border: `1px solid ${template.color}`,
              borderRadius: 1,
              ml: 1
            }} />
          )}
        </Box>
        
        {/* Content Area */}
        <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
          <Box sx={{ 
            flex: template.id === 2 ? 3 : 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}>
            <Box sx={{ height: 6, bgcolor: '#ddd', borderRadius: 0.5 }} />
            <Box sx={{ height: 4, bgcolor: '#eee', borderRadius: 0.5, width: '80%' }} />
            <Box sx={{ height: 4, bgcolor: '#eee', borderRadius: 0.5, width: '60%' }} />
            <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={4} key={i}>
                  <Box sx={{ 
                    height: 20, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: 0.5,
                    border: `1px solid ${template.color}40`
                  }} />
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {template.id === 2 && (
            <Box sx={{ 
              width: 60,
              bgcolor: '#f8f9fa',
              border: `1px dashed ${template.color}`,
              borderRadius: 1,
              p: 0.5
            }}>
              <Typography variant="caption" sx={{ color: template.color, fontSize: 8 }}>
                FORM
              </Typography>
            </Box>
          )}
        </Box>
        
        {template.id === 3 && (
          <Box sx={{ 
            height: 20, 
            bgcolor: `${template.color}20`, 
            borderRadius: 1,
            border: `1px dashed ${template.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" sx={{ color: template.color, fontSize: 8 }}>
              CONTACT FORM
            </Typography>
          </Box>
        )}
        
        {/* Template Name */}
        <Typography variant="caption" sx={{ 
          color: template.color, 
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 10
        }}>
          {template.name}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

// Approach 3: Layout Diagram
const DiagramThumbnail = ({ template }: { template: any }) => (
  <Card 
    sx={{ 
      width: 250, 
      height: 150, 
      cursor: 'pointer',
      border: '2px solid transparent',
      '&:hover': { 
        border: '2px solid #1976d2',
        bgcolor: '#f8f9fa'
      },
      transition: 'all 0.2s'
    }}
  >
    <CardContent sx={{ p: 2, height: '100%' }}>
      <Stack spacing={1} sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip 
            label={template.category}
            size="small"
            sx={{ 
              bgcolor: template.color,
              color: 'white',
              fontSize: 10
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 11 }}>
            {template.name}
          </Typography>
        </Stack>
        
        <Box sx={{ flex: 1, position: 'relative', border: '1px solid #ddd', borderRadius: 1 }}>
          {/* Layout visualization based on template type */}
          {template.id === 1 && (
            <Box sx={{ p: 1, height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                height: '100%',
                alignItems: 'center'
              }}>
                <Box sx={{ 
                  flex: 1, 
                  height: '80%', 
                  bgcolor: `${template.color}20`,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="caption" sx={{ fontSize: 8, color: template.color }}>
                    HERO
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 40, 
                  height: '60%', 
                  bgcolor: '#fff',
                  border: `2px solid ${template.color}`,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="caption" sx={{ fontSize: 7, color: template.color }}>
                    FORM
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {template.id === 2 && (
            <Box sx={{ p: 1, height: '100%', display: 'flex', gap: 1 }}>
              <Box sx={{ 
                flex: 1, 
                bgcolor: `${template.color}10`,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                p: 0.5
              }}>
                <Box sx={{ height: 8, bgcolor: template.color, borderRadius: 0.5 }} />
                <Box sx={{ height: 4, bgcolor: '#ddd', borderRadius: 0.5 }} />
                <Box sx={{ height: 4, bgcolor: '#ddd', borderRadius: 0.5 }} />
              </Box>
              <Box sx={{ 
                width: 30, 
                bgcolor: '#fff',
                border: `1px solid ${template.color}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontSize: 7, color: template.color, transform: 'rotate(-90deg)' }}>
                  FORM
                </Typography>
              </Box>
            </Box>
          )}
          
          {template.id === 3 && (
            <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ 
                flex: 1, 
                bgcolor: `${template.color}10`,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                p: 0.5
              }}>
                <Box sx={{ height: 6, bgcolor: template.color, borderRadius: 0.5 }} />
                <Box sx={{ height: 3, bgcolor: '#ddd', borderRadius: 0.5 }} />
                <Box sx={{ height: 3, bgcolor: '#ddd', borderRadius: 0.5, width: '70%' }} />
              </Box>
              <Box sx={{ 
                height: 20, 
                bgcolor: '#fff',
                border: `1px dashed ${template.color}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontSize: 7, color: template.color }}>
                  CONTACT FORM
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        
        <Typography variant="caption" sx={{ 
          color: '#666', 
          fontSize: 9,
          textAlign: 'center'
        }}>
          {template.description}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

// Approach 1: Realistic Mini Website - Add vertical version
const RealisticVerticalThumbnail = ({ template }: { template: any }) => (
  <Card 
    sx={{ 
      width: 150, 
      height: 250, 
      cursor: 'pointer',
      overflow: 'hidden',
      border: '2px solid transparent',
      '&:hover': { 
        border: '2px solid #1976d2',
        transform: 'scale(1.02)'
      },
      transition: 'all 0.2s'
    }}
  >
    <Box sx={{ 
      transform: 'scale(0.15)', 
      transformOrigin: 'top left',
      width: '1000px',
      height: '1600px'
    }}>
      {/* Mobile-optimized Hero Section */}
      <Box sx={{ 
        height: 400, 
        background: `linear-gradient(180deg, ${template.color}40, ${template.color}80)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          {template.category}
        </Typography>
        <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
          Professional Training
        </Typography>
        
        {/* Inline Form for Mobile-First */}
        {template.id === 4 && (
          <Paper sx={{ p: 3, mt: 3, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Sign Up</Typography>
            <Stack spacing={2}>
              <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              <Box sx={{ height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              <Button variant="contained" fullWidth size="large">Join Now</Button>
            </Stack>
          </Paper>
        )}
      </Box>
      
      {/* Story/Testimonial Section */}
      <Box sx={{ p: 4, bgcolor: 'white' }}>
        {template.id === 5 && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: template.color, mx: 'auto', mb: 2 }}>
              T
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2 }}>
              "Life-changing experience!"
            </Typography>
            <Typography variant="body1" color="text.secondary">
              "I went from complete beginner to confident swimmer in just 8 weeks."
            </Typography>
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              - Sarah M., Happy Student
            </Typography>
          </Box>
        )}
        
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Why Choose Us?
        </Typography>
        
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: template.color, width: 40, height: 40 }}>
                {i}
              </Avatar>
              <Box>
                <Typography variant="h6">Feature {i}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional training feature
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      
      {/* Pricing Section */}
      <Box sx={{ p: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Simple Pricing
        </Typography>
        
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ color: template.color, fontWeight: 'bold' }}>
            $45
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Per Session
          </Typography>
          <Button variant="contained" fullWidth size="large">
            Book Now
          </Button>
        </Paper>
      </Box>
      
      {/* Compact Form Section */}
      {template.id === 6 && (
        <Box sx={{ p: 4, bgcolor: template.color, color: 'white' }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
            Start Today
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ height: 30, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
            <Box sx={{ height: 30, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ bgcolor: 'white', color: template.color }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  </Card>
);

export default function ThumbnailExamples() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Landing Page Thumbnail Examples
      </Typography>
      
      <Stack spacing={6}>
        {/* Approach 1: Realistic Mini Website - Horizontal */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Approach 1A: Realistic Mini Website - Landscape (250×150px)
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Traditional wide format - shows full layout structure.
          </Typography>
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item key={template.id}>
                <RealisticThumbnail template={template} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Approach 1B: Realistic Mini Website - Vertical */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Approach 1B: Realistic Mini Website - Portrait (150×250px)
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Mobile-first vertical format - shows mobile user experience.
          </Typography>
          <Grid container spacing={3}>
            {verticalTemplates.map((template) => (
              <Grid item key={template.id}>
                <RealisticVerticalThumbnail template={template} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Approach 2: Wireframe Style */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Approach 2: Wireframe Style (Both Orientations)
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Clean wireframe showing content structure and form placement.
          </Typography>
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item key={template.id}>
                <WireframeThumbnail template={template} />
              </Grid>
            ))}
            {verticalTemplates.map((template) => (
              <Grid item key={template.id}>
                <WireframeVerticalThumbnail template={template} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Approach 3: Layout Diagram */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Approach 3: Layout Diagram
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Schematic diagram showing layout structure with labels.
          </Typography>
          <Grid container spacing={3}>
            {[...templates, ...verticalTemplates].map((template) => (
              <Grid item key={template.id}>
                <DiagramThumbnail template={template} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}

// Add the missing WireframeVerticalThumbnail component
const WireframeVerticalThumbnail = ({ template }: { template: any }) => (
  <Card 
    sx={{ 
      width: 150, 
      height: 250, 
      cursor: 'pointer',
      border: '2px solid #e0e0e0',
      '&:hover': { 
        border: '2px solid #1976d2',
        boxShadow: 3
      },
      transition: 'all 0.2s'
    }}
  >
    <CardContent sx={{ p: 1, height: '100%' }}>
      <Stack spacing={1} sx={{ height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          height: 40, 
          bgcolor: `${template.color}20`, 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="caption" sx={{ color: template.color, fontSize: 8 }}>
            HERO
          </Typography>
        </Box>
        
        {/* Story/Testimonial */}
        {template.id === 5 && (
          <Box sx={{ 
            height: 30, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" sx={{ fontSize: 7 }}>
              TESTIMONIAL
            </Typography>
          </Box>
        )}
        
        {/* Content Area */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={0.5}>
            <Box sx={{ height: 6, bgcolor: '#ddd', borderRadius: 0.5 }} />
            <Box sx={{ height: 4, bgcolor: '#eee', borderRadius: 0.5, width: '80%' }} />
            <Box sx={{ height: 4, bgcolor: '#eee', borderRadius: 0.5, width: '60%' }} />
          </Stack>
        </Box>
        
        {/* Form Section */}
        <Box sx={{ 
          height: 40, 
          bgcolor: `${template.color}20`, 
          borderRadius: 1,
          border: `1px dashed ${template.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="caption" sx={{ color: template.color, fontSize: 8 }}>
            FORM
          </Typography>
        </Box>
        
        {/* Template Name */}
        <Typography variant="caption" sx={{ 
          color: template.color, 
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 9
        }}>
          {template.name}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
); 