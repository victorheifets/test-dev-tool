import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, MenuItem, Select, Typography, Grid, FormControl, InputLabel, Fab, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Activity, ActivityStatus } from '../../types/activity';
import { ActivityCreate } from '../../types/generated';
import { StatusChip } from '../../components/courses/StatusChip';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { CourseModal } from '../../components/courses/CourseModal';
import { StatCard } from '../../components/StatCard';
import { SharedDataGrid } from '../../components/common/SharedDataGrid';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { CompactCourseContent } from '../../components/mobile/content/CompactCourseContent';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';

// UI Constants (matching original)
const MOBILE_BOTTOM_PADDING = 10;
const MOBILE_SIDE_PADDING = 1;
const MOBILE_ICON_SIZE = 24;
const DESKTOP_ICON_SIZE = 40;
const MOBILE_SEARCH_BORDER_RADIUS = 3;
const DESKTOP_BORDER_RADIUS = 1.5;
const FAB_BOTTOM_OFFSET = 90;
const FAB_RIGHT_OFFSET = 16;
const FAB_Z_INDEX = 1000;
const DATA_GRID_HEIGHT = 500;

export const CourseList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Activity | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteActivity } = useDelete();
  const { mutate: createActivity } = useCreate();
  const { mutate: updateActivity } = useUpdate();
  const invalidate = useInvalidate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Activity>({
    resource: 'courses',
  });
  
  // Get activities from dataGridProps and apply client-side filtering
  const allActivities = dataGridProps.rows || [];
  
  // Apply client-side filtering with useMemo for performance
  const activities = useMemo(() => {
    return allActivities.filter(activity => {
      // Text search filter
      const matchesSearch = !searchText || 
        activity.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.activity_type?.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.location?.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.trainer_id?.toLowerCase().includes(searchText.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || activity.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allActivities, searchText, statusFilter]);

  // Event handlers
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
      deleteActivity({
        resource: 'courses',
        id: selectedActivityId,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.course_deleted'));
        },
        onError: (error) => {
          handleError(error, t('actions.delete') + ' ' + t('course'));
        }
      });
    }
    setDialogOpen(false);
    setSelectedActivityId(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    let deleteCount = 0;
    let errorCount = 0;

    for (const id of selectedRows) {
      try {
        await new Promise((resolve, reject) => {
          deleteActivity({
            resource: 'courses',
            id,
          }, {
            onSuccess: () => {
              deleteCount++;
              resolve(void 0);
            },
            onError: (error) => {
              errorCount++;
              reject(error);
            }
          });
        });
      } catch (error) {
        // Error already logged
      }
    }

    if (deleteCount > 0) {
      showSuccess(t('messages.bulk_delete_success', { count: deleteCount }));
    }
    if (errorCount > 0) {
      handleError(new Error(`${errorCount} items failed to delete`), t('actions.bulk_delete'));
    }

    setBulkDeleteDialogOpen(false);
    setSelectedRows([]);
  };
  
  const handleAddNew = () => {
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSave = (activityData: ActivityCreate) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createActivity({
        resource: 'courses',
        values: activityData,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.course_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'courses', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.create') + ' ' + t('course'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateActivity({
        resource: 'courses',
        id: modalInitialData.id,
        values: activityData,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.course_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'courses', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.edit') + ' ' + t('course'));
        }
      });
    }
  };


  // DataGrid columns for desktop (matching original exactly)
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
        const price = params.row.price || 0;
        const currency = params.row.currency || 'USD';
        return `${price} ${currency}`;
      }
    },
    {
      field: 'action',
      headerName: t('common.actions'),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => handleEdit(params.row.id)} color="primary" title={t('actions.edit')}>
            <EditIcon />
          </IconButton>
          <ActionMenu
            onDuplicate={() => handleDuplicate(params.row.id)}
            onDelete={() => handleDeleteRequest(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  // Filter options for SharedDataGrid
  const statusFilterOptions = [
    { value: ActivityStatus.DRAFT, label: t('course_status.draft') },
    { value: ActivityStatus.PUBLISHED, label: t('course_status.published') },
    { value: ActivityStatus.ONGOING, label: t('course_status.ongoing') },
    { value: ActivityStatus.COMPLETED, label: t('course_status.completed') },
    { value: ActivityStatus.CANCELLED, label: t('course_status.cancelled') },
  ];

  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0, // Add bottom padding on mobile for bottom navigation
      px: isMobile ? MOBILE_SIDE_PADDING : 0, // Add side padding on mobile
      minHeight: isMobile ? 'auto' : '100vh', // Remove minHeight on mobile
      backgroundColor: 'background.default',
      overflow: 'visible', // Use natural document scrolling
    }}>
      {/* Statistics Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('courses')} 
            value={allActivities.length.toString()} 
            icon={<SchoolIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('course_status.published')} 
            value={allActivities.filter(a => a.status === ActivityStatus.PUBLISHED).length.toString()} 
            icon={<PeopleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('course_status.ongoing')} 
            value={allActivities.filter(a => a.status === ActivityStatus.ONGOING).length.toString()} 
            icon={<BusinessIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="warning" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('revenue')} 
            value={allActivities.reduce((sum, a) => sum + ((a.price || 0) * (a.enrollments_count || 0)), 0).toString()} 
            icon={<MonetizationOnIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
          />
        </Grid>
      </Grid>

      <Box sx={{ 
        p: isMobile ? 0 : 2, 
        backgroundColor: isMobile ? 'transparent' : 'background.paper', 
        borderRadius: isMobile ? 0 : DESKTOP_BORDER_RADIUS, 
        boxShadow: isMobile ? 'none' : 3, 
        border: isMobile ? 'none' : '1px solid', 
        borderColor: isMobile ? 'transparent' : 'divider' 
      }}>

        {/* Mobile Layout - Search and Filter */}
        {isMobile && (
          <Box sx={{ 
            mb: 1.5, 
            px: 1,
            display: 'flex', 
            gap: 1,
            flexDirection: 'column',
            alignItems: 'stretch'
          }}>
            {/* Bulk Delete Button (when items selected) */}
            {selectedRows.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleBulkDelete}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  mb: 1
                }}
              >
                {t('actions.delete')} ({selectedRows.length})
              </Button>
            )}
          
            {/* Search Field */}
            <TextField
              placeholder={t('search.placeholder_courses')}
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS,
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
            
            {/* Status Filter */}
            <FormControl 
              size="small" 
              sx={{ minWidth: isMobile ? '100%' : 140 }}
            >
              <InputLabel>{t('course_fields.status')}</InputLabel>
              <Select
                label={t('course_fields.status')}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS,
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value={ActivityStatus.DRAFT}>{t('course_status.draft')}</MenuItem>
                <MenuItem value={ActivityStatus.PUBLISHED}>{t('course_status.published')}</MenuItem>
                <MenuItem value={ActivityStatus.ONGOING}>{t('course_status.ongoing')}</MenuItem>
                <MenuItem value={ActivityStatus.COMPLETED}>{t('course_status.completed')}</MenuItem>
                <MenuItem value={ActivityStatus.CANCELLED}>{t('course_status.cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        
        <ErrorBoundary onError={(error, errorInfo) => {
          console.error('Data view error:', error, errorInfo);
          handleError(error, 'Data View');
        }}>
          {/* Desktop Data Grid */}
          {!isMobile && (
            <SharedDataGrid
              rows={activities}
              columns={columns}
              searchValue={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder={t('search.placeholder_courses')}
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={statusFilterOptions}
              filterLabel={t('course_fields.status')}
              enableSelection={true}
              selectedRows={selectedRows}
              onSelectionChange={(selection) => setSelectedRows(selection as string[])}
              onCreateNew={handleAddNew}
              createButtonText={`+ ${t('actions.create')} ${t('course')}`}
              onBulkDelete={handleBulkDelete}
              bulkDeleteText={`${t('actions.delete')} (${selectedRows.length})`}
              height={DATA_GRID_HEIGHT}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick={true}
            />
          )}

          {/* Mobile Layout - Cards */}
          {isMobile && (
            <Box sx={{ 
              px: 1,
              pb: 10 // Extra padding for bottom navigation
            }}>
              {activities.map((activity) => (
                <CompactCardShell
                  key={activity.id}
                  entityId={activity.id}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteRequest}
                  enableSwipeGestures={true}
                >
                  <CompactCourseContent activity={activity} />
                </CompactCardShell>
              ))}
            </Box>
          )}
        </ErrorBoundary>
      </Box>
      
      {/* Floating Action Button for Create Course - Mobile Only */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={handleAddNew}
          sx={{
            position: 'fixed',
            bottom: FAB_BOTTOM_OFFSET, // Above bottom navigation
            right: FAB_RIGHT_OFFSET,
            zIndex: FAB_Z_INDEX,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <AddIcon />
        </Fab>
      )}
      
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`${t('actions.delete')} ${t('course')}`}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('courses')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Course modal error:', error, errorInfo);
        handleError(error, 'Course Modal');
        setIsModalOpen(false); // Close modal on error
      }}>
        <CourseModal 
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalInitialData(null);
          }}
          forceMobile={isMobile} // Use responsive detection
          onSave={handleSave}
          initialData={modalInitialData}
          mode={modalMode}
        />
      </ErrorBoundary>
    </Box>
  );
};