import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, MenuItem, Select, Typography, Grid, FormControl, InputLabel } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
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
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Activity | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteActivity } = useDelete();
  const { mutate: createActivity } = useCreate();
  const { mutate: updateActivity } = useUpdate();
  const invalidate = useInvalidate();

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
          showSuccess(t('messages.success'));
          // Just close dialog - let auto-refresh handle it
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, t('actions.delete') + ' ' + t('course'));
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
      headerName: t('course_fields.name'),
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.name}
        </Typography>
      )
    },
    {
      field: 'activity_type',
      headerName: t('forms.type'),
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', textTransform: 'capitalize', display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.row.activity_type || t('course')}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: t('course_fields.status'),
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'trainer_id', 
      headerName: t('instructor'), 
      flex: 1,
      renderCell: (params) => params.row.trainer_id || t('common.not_assigned')
    },
    { field: 'location', headerName: t('course_fields.location'), flex: 1 },
    { 
      field: 'start_date', 
      headerName: t('course_fields.start_date'), 
      flex: 1,
      renderCell: (params) => new Date(params.row.start_date).toLocaleDateString()
    },
    { 
      field: 'end_date', 
      headerName: t('course_fields.end_date'), 
      flex: 1,
      renderCell: (params) => new Date(params.row.end_date).toLocaleDateString()
    },
    { 
      field: 'capacity', 
      headerName: t('course_fields.capacity'), 
      flex: 1,
      renderCell: (params) => `${params.row.enrollments_count || 0} / ${params.row.capacity || 0}`
    },
    { 
      field: 'pricing', 
      headerName: t('course_fields.price'), 
      flex: 1,
      renderCell: (params) => {
        const price = params.row.pricing?.amount || params.row.price || 0;
        const currency = params.row.pricing?.currency || 'USD';
        return `${price} ${currency}`;
      }
    },
    {
      field: 'action',
      headerName: t('common.actions'),
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
          <StatCard title={t('courses')} value={allActivities.length.toString()} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('course_status.published')} value={allActivities.filter(a => a.status === 'published').length.toString()} icon={<BusinessIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('course_status.ongoing')} value={allActivities.filter(a => a.status === 'ongoing').length.toString()} icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('course_status.draft')} value={allActivities.filter(a => a.status === 'draft').length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handleAddNew}>+ {t('actions.create')} {t('course')}</Button>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder={t('search.placeholder_courses')}
                variant="outlined"
                size="small"
                sx={{ minWidth: 250 }}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t('course_fields.status')}</InputLabel>
                <Select
                  label={t('course_fields.status')}
                  defaultValue=""
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="active">{t('common.active')}</MenuItem>
                  <MenuItem value="completed">{t('course_status.completed')}</MenuItem>
                  <MenuItem value="cancelled">{t('course_status.cancelled')}</MenuItem>
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
        title={`${t('actions.delete')} ${t('course')}`}
        description={t('messages.confirm_delete')}
      />
      <CourseModal 
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialData(null);
        }}
        onSave={async (activityData) => {
          console.log('Saving activity:', activityData);
          
          if (modalMode === 'create' || modalMode === 'duplicate') {
            createActivity({
              resource: 'courses',
              values: activityData,
            }, {
              onSuccess: () => {
                showSuccess(t('messages.course_created'));
                setIsModalOpen(false);
                setModalInitialData(null);
                // Just close modal - let auto-refresh handle it
              },
              onError: (error) => {
                console.error('Create error:', error);
                handleError(error, t('actions.create') + ' ' + t('course'));
              }
            });
          } else if (modalMode === 'edit' && modalInitialData?.id) {
            updateActivity({
              resource: 'courses',
              id: modalInitialData.id,
              values: activityData,
            }, {
              onSuccess: () => {
                showSuccess(t('messages.course_updated'));
                setIsModalOpen(false);
                setModalInitialData(null);
                // Just close modal - let auto-refresh handle it
              },
              onError: (error) => {
                console.error('Update error:', error);
                handleError(error, t('actions.edit') + ' ' + t('course'));
              }
            });
          }
        }}
        initialData={modalInitialData}
        mode={modalMode}
      />
    </Box>
  );
}; 