import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, MenuItem, Select, Typography, Grid, FormControl, InputLabel, Fab, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate, useInvalidate, useList } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Enrollment, EnrollmentCreate, EnrollmentStatus } from '../../types/enrollment';
import { StatusChip } from '../../components/enrollments/StatusChip';
import { ActionMenu } from '../../components/enrollments/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { EnrollmentModal } from '../../components/enrollments/EnrollmentModal';
import { StatCard } from '../../components/StatCard';
import { SharedDataGrid } from '../../components/common/SharedDataGrid';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { CompactEnrollmentContent } from '../../components/mobile/content/CompactEnrollmentContent';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';

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

export const EnrollmentsList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Enrollment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteEnrollment } = useDelete();
  const { mutate: createEnrollment } = useCreate();
  const { mutate: updateEnrollment } = useUpdate();
  const invalidate = useInvalidate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Enrollment>({
    resource: 'enrollments',
  });
  
  // Fetch participants and activities to join with enrollments
  const { data: participantsData } = useList({
    resource: 'participants',
  });
  
  const { data: activitiesData } = useList({
    resource: 'activities',
  });
  
  // Get enrollments from dataGridProps and apply client-side filtering
  const allEnrollments = dataGridProps.rows || [];
  const participants = participantsData?.data || [];
  const activities = activitiesData?.data || [];
  
  // Enrich enrollments with participant and activity data, then apply filtering
  const enrollments = useMemo(() => {
    // First, enrich enrollments with participant and activity names
    const enrichedEnrollments = allEnrollments.map(enrollment => {
      const participant = participants.find(p => p.id === enrollment.participant_id);
      const activity = activities.find(a => a.id === enrollment.activity_id);
      
      return {
        ...enrollment,
        participant_name: participant ? `${participant.first_name} ${participant.last_name}` : 'Unknown Participant',
        participant_email: participant?.email || '',
        activity_name: activity?.name || 'Unknown Activity',
      };
    });
    
    // Then apply filtering
    return enrichedEnrollments.filter(enrollment => {
      // Text search filter - now includes participant names and activity names
      const matchesSearch = !searchText || 
        enrollment.participant_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.participant_email?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.activity_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.participant_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.activity_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.payment_info?.payment_status?.toLowerCase().includes(searchText.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allEnrollments, participants, activities, searchText, statusFilter]);

  // Event handlers
  const handleEdit = (id: string) => {
    const enrollmentToEdit = enrollments.find(e => e.id === id);
    if (enrollmentToEdit) {
      setModalMode('edit');
      setModalInitialData(enrollmentToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const enrollmentToDuplicate = enrollments.find(e => e.id === id);
    if (enrollmentToDuplicate) {
      setModalMode('duplicate');
      setModalInitialData(enrollmentToDuplicate);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedEnrollmentId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEnrollmentId) {
      deleteEnrollment({
        resource: 'enrollments',
        id: selectedEnrollmentId,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_deleted'));
        },
        onError: (error) => {
          handleError(error, t('actions.delete') + ' ' + t('enrollment'));
        }
      });
    }
    setDialogOpen(false);
    setSelectedEnrollmentId(null);
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
          deleteEnrollment({
            resource: 'enrollments',
            id,
            successNotification: false,
            errorNotification: false,
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

  const handleSave = (enrollmentData: EnrollmentCreate) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createEnrollment({
        resource: 'enrollments',
        values: enrollmentData,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'enrollments', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.create') + ' ' + t('enrollment'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateEnrollment({
        resource: 'enrollments',
        id: modalInitialData.id,
        values: enrollmentData,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'enrollments', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.edit') + ' ' + t('enrollment'));
        }
      });
    }
  };


  // DataGrid columns for desktop
  const columns: GridColDef[] = [
    {
      field: 'participant_name',
      headerName: t('participant'),
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Box sx={{ fontWeight: 'medium' }}>{params.row.participant_name}</Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{params.row.participant_email}</Box>
        </Box>
      ),
    },
    {
      field: 'activity_name',
      headerName: t('course'),
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('course_fields.status'),
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'enrollment_date', 
      headerName: t('forms.enrollment_date'), 
      flex: 1,
      renderCell: (params) => new Date(params.row.enrollment_date).toLocaleDateString()
    },
    { 
      field: 'payment_info', 
      headerName: t('forms.payment_status'), 
      flex: 1,
      renderCell: (params) => params.row.payment_info?.payment_status?.charAt(0).toUpperCase() + params.row.payment_info?.payment_status?.slice(1) || 'N/A'
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
    { value: EnrollmentStatus.ENROLLED, label: t('enrollment_status.enrolled') },
    { value: EnrollmentStatus.ACTIVE, label: t('enrollment_status.active') },
    { value: EnrollmentStatus.COMPLETED, label: t('enrollment_status.completed') },
    { value: EnrollmentStatus.CANCELLED, label: t('enrollment_status.cancelled') },
  ];

  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0, // Add bottom padding on mobile for bottom navigation
      px: isMobile ? MOBILE_SIDE_PADDING : 0, // Add side padding on mobile
      minHeight: isMobile ? 'auto' : '100vh', // Remove minHeight on mobile
      backgroundColor: isMobile ? 'background.default' : 'background.default',
      overflow: 'visible', // Use natural document scrolling
    }}>
      {/* Statistics Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('enrollments')} 
            value={enrollments.length.toString()} 
            icon={<SchoolIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('enrollment_status.active')} 
            value={enrollments.filter(e => e.status === EnrollmentStatus.ACTIVE).length.toString()} 
            icon={<PeopleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('enrollment_status.completed')} 
            value={enrollments.filter(e => e.status === EnrollmentStatus.COMPLETED).length.toString()} 
            icon={<EventIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('forms.payment_status')} 
            value={enrollments.filter(e => e.payment_info?.payment_status === 'paid').length.toString()} 
            icon={<PaymentIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="warning" 
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
              placeholder={t('search.placeholder_enrollments')}
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
                <MenuItem value={EnrollmentStatus.ENROLLED}>{t('enrollment_status.enrolled')}</MenuItem>
                <MenuItem value={EnrollmentStatus.ACTIVE}>{t('enrollment_status.active')}</MenuItem>
                <MenuItem value={EnrollmentStatus.COMPLETED}>{t('enrollment_status.completed')}</MenuItem>
                <MenuItem value={EnrollmentStatus.CANCELLED}>{t('enrollment_status.cancelled')}</MenuItem>
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
              rows={enrollments}
              columns={columns}
              searchValue={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder={t('search.placeholder_enrollments')}
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={statusFilterOptions}
              filterLabel={t('course_fields.status')}
              enableSelection={true}
              selectedRows={selectedRows}
              onSelectionChange={(selection) => setSelectedRows(selection as string[])}
              onCreateNew={handleAddNew}
              createButtonText={`+ ${t('actions.create')} ${t('enrollments').slice(0, -1)}`}
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
              {enrollments.map((enrollment) => (
                <CompactCardShell
                  key={enrollment.id}
                  entityId={enrollment.id}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteRequest}
                  enableSwipeGestures={true}
                >
                  <CompactEnrollmentContent enrollment={enrollment} />
                </CompactCardShell>
              ))}
            </Box>
          )}
        </ErrorBoundary>
      </Box>
      
      {/* Floating Action Button for Create Enrollment - Mobile Only */}
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
        title={`${t('actions.delete')} ${t('enrollments').slice(0, -1)}`}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('enrollments')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Enrollment modal error:', error, errorInfo);
        handleError(error, 'Enrollment Modal');
        setIsModalOpen(false); // Close modal on error
      }}>
        <EnrollmentModal 
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