import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Select, Typography, Grid, FormControl, InputLabel } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Activity } from '../../types/activity';
import { StatusChip } from '../../components/courses/StatusChip';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { CourseModal } from '../../components/courses/CourseModal';
import { StatCard } from '../../components/StatCard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';

export const CourseList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Activity | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteActivity } = useDelete();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Activity>({
    resource: 'courses', // This maps to 'activities' in our data provider
  });
  
  // Get activities from dataGridProps and apply client-side filtering
  const allActivities = dataGridProps.rows || [];
  
  // Apply client-side filtering
  const activities = allActivities.filter(activity => {
    // Text search filter
    const matchesSearch = !searchText || 
      activity.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      activity.category?.toLowerCase().includes(searchText.toLowerCase()) ||
      activity.trainer?.toLowerCase().includes(searchText.toLowerCase()) ||
      activity.location?.toLowerCase().includes(searchText.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || activity.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Update dataGridProps with filtered data
  const filteredDataGridProps = {
    ...dataGridProps,
    rows: activities,
  };

  const handleEdit = (id: string) => {
    const activityToEdit = activities.find(a => a.id === id);
    if (activityToEdit) {
      setModalMode('edit');
      setModalInitialData(activityToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const activityToDuplicate = activities.find(a => a.id === id);
    if (activityToDuplicate) {
      setModalMode('duplicate');
      setModalInitialData(activityToDuplicate);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedActivityId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedActivityId) {
      console.log('Deleting course with ID:', selectedActivityId);
      deleteActivity({
        resource: 'courses',
        id: selectedActivityId,
      }, {
        onSuccess: () => {
          showSuccess('Course deleted successfully!');
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, 'Delete Course');
        }
      });
    }
    setDialogOpen(false);
    setSelectedActivityId(null);
  };
  
  const handleAddNew = () => {
    console.log('Opening create modal');
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Course Name',
      flex: 1,
      renderCell: (params) => (
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{params.row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{params.row.category}</Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'trainer_id', 
      headerName: 'Trainer', 
      flex: 1,
      renderCell: (params) => params.row.trainer_id || 'Not Assigned'
    },
    { field: 'location', headerName: 'Location', flex: 1 },
    { 
      field: 'start_date', 
      headerName: 'Start Date', 
      flex: 1,
      renderCell: (params) => new Date(params.row.start_date).toLocaleDateString()
    },
    { 
      field: 'end_date', 
      headerName: 'End Date', 
      flex: 1,
      renderCell: (params) => new Date(params.row.end_date).toLocaleDateString()
    },
    { 
      field: 'capacity', 
      headerName: 'Capacity', 
      flex: 1,
      renderCell: (params) => `${params.row.enrollments_count || 0} / ${params.row.capacity || 0}`
    },
    { 
      field: 'pricing', 
      headerName: 'Price', 
      flex: 1,
      renderCell: (params) => {
        const price = params.row.pricing?.amount || params.row.price || 0;
        const currency = params.row.pricing?.currency || 'USD';
        return `${price} ${currency}`;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <ActionMenu
          onEdit={() => handleEdit(params.row.id)}
          onDuplicate={() => handleDuplicate(params.row.id)}
          onDelete={() => handleDeleteRequest(params.row.id)}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Courses" value={allActivities.length.toString()} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Published" value={allActivities.filter(a => a.status === 'published').length.toString()} icon={<BusinessIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Ongoing" value={allActivities.filter(a => a.status === 'ongoing').length.toString()} icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Draft" value={allActivities.filter(a => a.status === 'draft').length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handleAddNew}>+ Add Course</Button>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search courses..."
                variant="outlined"
                size="small"
                sx={{ minWidth: 250 }}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue=""
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
        </Box>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                {...filteredDataGridProps}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                sx={{ border: 'none' }}
            />
        </Box>
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
      />
      <CourseModal 
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialData(null);
        }}
        initialData={modalInitialData}
        mode={modalMode}
      />
    </Box>
  );
}; 