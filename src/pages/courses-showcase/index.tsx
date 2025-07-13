import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  alpha,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Badge,
  Fade,
  Grow,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  AccessTime,
  People,
  Star,
  TrendingUp,
  School,
  MenuBook,
  WorkspacePremium,
  CalendarMonth,
  Language,
  ShoppingCart,
  FavoriteBorder,
  Share,
  PlayCircleOutline,
} from '@mui/icons-material';

// Enhanced theme with gradients and modern styling
const enhancedTheme = createTheme({
  palette: {
    primary: {
      main: '#7367F0',
      light: '#9C94FF',
      dark: '#5A52D5',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF9F9F',
      dark: '#E53E3E',
    },
    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(115, 103, 240, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});

// Mock course data with enhanced properties
const courses = [
  {
    id: 1,
    title: 'Advanced React Development',
    instructor: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    students: 2847,
    duration: '42 hours',
    level: 'Advanced',
    category: 'Web Development',
    bestseller: true,
    new: false,
    discount: 30,
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    instructor: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=250&fit=crop',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    students: 3421,
    duration: '36 hours',
    level: 'All Levels',
    category: 'Design',
    bestseller: true,
    new: false,
    discount: 20,
  },
  {
    id: 3,
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Michael Park',
    avatar: 'https://i.pravatar.cc/150?img=3',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    price: 0,
    originalPrice: 0,
    rating: 4.7,
    students: 1923,
    duration: '28 hours',
    level: 'Beginner',
    category: 'Data Science',
    bestseller: false,
    new: true,
    discount: 0,
    free: true,
  },
  {
    id: 4,
    title: 'Full Stack Development Bootcamp',
    instructor: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=4',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.6,
    students: 4123,
    duration: '65 hours',
    level: 'Intermediate',
    category: 'Web Development',
    bestseller: false,
    new: false,
    discount: 25,
  },
  {
    id: 5,
    title: 'Digital Marketing Strategy',
    instructor: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.5,
    students: 1567,
    duration: '24 hours',
    level: 'All Levels',
    category: 'Marketing',
    bestseller: false,
    new: true,
    discount: 22,
  },
  {
    id: 6,
    title: 'Blockchain Development',
    instructor: 'Lisa Chang',
    avatar: 'https://i.pravatar.cc/150?img=6',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.9,
    students: 892,
    duration: '45 hours',
    level: 'Advanced',
    category: 'Blockchain',
    bestseller: false,
    new: true,
    discount: 28,
  },
];

const categories = [
  { name: 'All Courses', icon: <MenuBook />, count: 156 },
  { name: 'Web Development', icon: <Language />, count: 42 },
  { name: 'Design', icon: <WorkspacePremium />, count: 38 },
  { name: 'Data Science', icon: <TrendingUp />, count: 29 },
  { name: 'Marketing', icon: <People />, count: 21 },
  { name: 'Blockchain', icon: <School />, count: 16 },
];

const CoursesShowcase: React.FC = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState('All Courses');
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <ThemeProvider theme={enhancedTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Enhanced Navigation Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Toolbar sx={{ height: 80, px: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <School sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                EduPlatform
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Button color="inherit" sx={{ color: 'text.primary' }}>Explore</Button>
              <Button color="inherit" sx={{ color: 'text.primary' }}>My Learning</Button>
              <IconButton>
                <Badge badgeContent={2} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Hero Section with Gradient Background */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            py: 8,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box textAlign="center">
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Learn Without Limits
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary', fontWeight: 400 }}>
                  Discover 156+ courses taught by industry experts
                </Typography>
                
                {/* Enhanced Search Bar */}
                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                  <TextField
                    fullWidth
                    placeholder="Search for courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            }}
                          >
                            Search
                          </Button>
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                        '& fieldset': { border: 'none' },
                        height: 64,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Category Pills */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Browse Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Grow in key={category.name} timeout={500}>
                  <Chip
                    icon={category.icon}
                    label={`${category.name} (${category.count})`}
                    onClick={() => setSelectedCategory(category.name)}
                    sx={{
                      px: 2,
                      py: 3,
                      fontSize: '1rem',
                      borderRadius: 3,
                      background: selectedCategory === category.name
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                        : theme.palette.background.paper,
                      color: selectedCategory === category.name ? 'white' : 'text.primary',
                      border: selectedCategory === category.name ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      boxShadow: selectedCategory === category.name
                        ? '0 8px 20px rgba(115, 103, 240, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(115, 103, 240, 0.3)',
                      },
                    }}
                  />
                </Grow>
              ))}
            </Box>
          </Box>

          {/* Course Grid */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Featured Courses
              </Typography>
              <Button
                startIcon={<FilterList />}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  color: 'text.primary',
                }}
              >
                Filter
              </Button>
            </Box>

            <Grid container spacing={4}>
              {courses.map((course, index) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Grow in timeout={500 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'visible',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {/* Badges */}
                      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, display: 'flex', gap: 1 }}>
                        {course.bestseller && (
                          <Chip
                            label="Bestseller"
                            size="small"
                            sx={{
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {course.new && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              bgcolor: 'success.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {course.free && (
                          <Chip
                            label="Free"
                            size="small"
                            sx={{
                              bgcolor: 'info.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      {/* Discount Badge */}
                      {course.discount > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                            bgcolor: 'error.main',
                            color: 'white',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            fontWeight: 700,
                          }}
                        >
                          -{course.discount}%
                        </Box>
                      )}

                      {/* Course Image with Overlay */}
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={course.image}
                          alt={course.title}
                          sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            '&:hover': {
                              bgcolor: theme.palette.background.paper,
                              transform: 'translate(-50%, -50%) scale(1.1)',
                            },
                          }}
                        >
                          <PlayCircleOutline sx={{ fontSize: 48, color: 'primary.main' }} />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        {/* Category & Level */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            label={course.category}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            label={course.level}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: alpha(theme.palette.divider, 0.3) }}
                          />
                        </Box>

                        {/* Course Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 56,
                          }}
                        >
                          {course.title}
                        </Typography>

                        {/* Instructor */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Avatar src={course.avatar} sx={{ width: 24, height: 24 }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>

                        {/* Rating and Students */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Rating value={course.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" fontWeight={600}>
                              {course.rating}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            ({course.students.toLocaleString()} students)
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.duration}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Price and Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            {course.free ? (
                              <Typography variant="h5" fontWeight={700} color="success.main">
                                Free
                              </Typography>
                            ) : (
                              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h5" fontWeight={700}>
                                  ${course.price}
                                </Typography>
                                {course.originalPrice > course.price && (
                                  <Typography
                                    variant="body2"
                                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                  >
                                    ${course.originalPrice}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small">
                              <FavoriteBorder />
                            </IconButton>
                            <IconButton size="small">
                              <Share />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CoursesShowcase;