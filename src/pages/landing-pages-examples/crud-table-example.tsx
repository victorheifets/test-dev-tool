import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Rating,
  Menu,
  Divider,
  Alert
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridRenderCellParams
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

// Sample landing pages data
const sampleLandingPages = [
  {
    id: 1,
    name: "Swimming Classes - Beginner",
    template: "Hero + Form Layout",
    status: "published",
    created: "2024-01-15",
    lastModified: "2024-01-20",
    views: 245,
    leads: 12,
    conversion: 4.9,
    url: "swimming-beginner-2024",
    author: "Sarah Johnson",
    category: "Swimming"
  },
  {
    id: 2,
    name: "Advanced Swimming Techniques",
    template: "Sidebar Form Layout",
    status: "draft",
    created: "2024-01-18",
    lastModified: "2024-01-22",
    views: 0,
    leads: 0,
    conversion: 0,
    url: "",
    author: "Sarah Johnson",
    category: "Swimming"
  },
  {
    id: 3,
    name: "Kids Swimming Summer Camp",
    template: "Bottom Form Layout",
    status: "published",
    created: "2024-01-10",
    lastModified: "2024-01-15",
    views: 892,
    leads: 67,
    conversion: 7.5,
    url: "kids-summer-camp-2024",
    author: "Mike Chen",
    category: "Kids Programs"
  },
  {
    id: 4,
    name: "Private Swimming Lessons",
    template: "Hero + Form Layout",
    status: "paused",
    created: "2024-01-05",
    lastModified: "2024-01-12",
    views: 156,
    leads: 8,
    conversion: 5.1,
    url: "private-lessons-2024",
    author: "Sarah Johnson",
    category: "Private Lessons"
  },
  {
    id: 5,
    name: "Water Aerobics for Seniors",
    template: "Sidebar Form Layout",
    status: "published",
    created: "2024-01-20",
    lastModified: "2024-01-23",
    views: 78,
    leads: 3,
    conversion: 3.8,
    url: "water-aerobics-seniors",
    author: "Lisa Williams",
    category: "Special Programs"
  }
];

const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getStatusColor(status) as any}
      size="small"
      variant={status === 'published' ? 'filled' : 'outlined'}
    />
  );
};

const ActionMenu = ({ row, onEdit, onDelete, onClone, onPreview }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { onEdit(row); handleClose(); }}>
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onPreview(row); handleClose(); }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 16 }} />
          Preview
        </MenuItem>
        <MenuItem onClick={() => { onClone(row); handleClose(); }}>
          <CopyIcon sx={{ mr: 1, fontSize: 16 }} />
          Clone
        </MenuItem>
        <Divider />
        <MenuItem disabled={row.status !== 'published'}>
          <ShareIcon sx={{ mr: 1, fontSize: 16 }} />
          Share
        </MenuItem>
        <MenuItem disabled={row.status !== 'published'}>
          <LaunchIcon sx={{ mr: 1, fontSize: 16 }} />
          Open Live Page
        </MenuItem>
        <MenuItem disabled={row.status !== 'published'}>
          <AnalyticsIcon sx={{ mr: 1, fontSize: 16 }} />
          Analytics
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onDelete(row); handleClose(); }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export const CrudTableExample = () => {
  const [data, setData] = useState(sampleLandingPages);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // CRUD Operations
  const handleEdit = (row: any) => {
    console.log('Edit landing page:', row);
    // Navigate to editor with landing page data
  };

  const handleDelete = (row: any) => {
    setItemToDelete(row);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter(item => item.id !== itemToDelete.id));
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleClone = (row: any) => {
    const clonedItem = {
      ...row,
      id: Math.max(...data.map(d => d.id)) + 1,
      name: `${row.name} (Copy)`,
      status: 'draft',
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      leads: 0,
      conversion: 0,
      url: ""
    };
    setData([...data, clonedItem]);
  };

  const handlePreview = (row: any) => {
    console.log('Preview landing page:', row);
    // Open preview modal or navigate to preview
  };

  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  const handleBulkDelete = () => {
    setData(data.filter(item => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  };

  const handleBulkStatusChange = (status: string) => {
    setData(data.map(item => 
      selectedRows.includes(item.id) ? { ...item, status } : item
    ));
    setSelectedRows([]);
  };

  // Filter data
  const filteredData = data.filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Landing Page Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.template}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip status={params.value} />
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" variant="outlined" />
      )
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {params.value.split(' ')[0]}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'performance',
      headerName: 'Performance',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack spacing={0.5}>
          <Typography variant="caption">
            {params.row.views} views • {params.row.leads} leads
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {params.row.conversion}% conv.
            </Typography>
            <Rating 
              value={params.row.conversion / 2} 
              max={5} 
              size="small" 
              readOnly 
              precision={0.1}
            />
          </Box>
        </Stack>
      )
    },
    {
      field: 'lastModified',
      headerName: 'Last Modified',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<PreviewIcon />}
          label="Preview"
          onClick={() => handlePreview(params.row)}
        />,
        <ActionMenu
          key="menu"
          row={params.row}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClone={handleClone}
          onPreview={handlePreview}
        />
      ]
    }
  ];

  const categories = [...new Set(data.map(item => item.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Landing Pages Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create New Landing Page
          </Button>
        </Box>

        {/* Filters and Actions */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }} />

            {selectedRows.length > 0 && (
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                  {selectedRows.length} selected
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => handleBulkStatusChange('published')}
                  disabled={selectedRows.length === 0}
                >
                  Publish
                </Button>
                <Button 
                  size="small" 
                  onClick={() => handleBulkStatusChange('paused')}
                  disabled={selectedRows.length === 0}
                >
                  Pause
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={handleBulkDelete}
                  disabled={selectedRows.length === 0}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="h4" color="primary">{data.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Pages</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main">
                {data.filter(p => p.status === 'published').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Published</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="warning.main">
                {data.filter(p => p.status === 'draft').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Drafts</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="info.main">
                {data.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Views</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="secondary.main">
                {data.reduce((sum, p) => sum + p.leads, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Leads</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Data Grid */}
        <Paper>
          <DataGrid
            rows={filteredData}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection as number[]);
            }}
            rowSelectionModel={selectedRows}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef'
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: '#f8f9fa'
              }
            }}
          />
        </Paper>

        {/* Create New Landing Page Dialog */}
        <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Landing Page</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Alert severity="info">
                You can create a new landing page from scratch or start with an existing template.
              </Alert>
              
              <TextField
                label="Landing Page Name"
                placeholder="e.g., Summer Swimming Classes 2024"
                fullWidth
                variant="outlined"
              />
              
              <FormControl fullWidth>
                <InputLabel>Select Template</InputLabel>
                <Select label="Select Template">
                  <MenuItem value="hero-form">Hero + Form Layout</MenuItem>
                  <MenuItem value="sidebar-form">Sidebar Form Layout</MenuItem>
                  <MenuItem value="bottom-form">Bottom Form Layout</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="swimming">Swimming</MenuItem>
                  <MenuItem value="fitness">Fitness</MenuItem>
                  <MenuItem value="kids">Kids Programs</MenuItem>
                  <MenuItem value="private">Private Lessons</MenuItem>
                  <MenuItem value="special">Special Programs</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Description (Optional)"
                placeholder="Brief description of this landing page..."
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setShowCreateDialog(false)}>
              Create Landing Page
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Landing Page</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default CrudTableExample; 