import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, MenuItem, Select, Typography, Grid, FormControl, InputLabel, Fab, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
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
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
import { CompactEnrollmentCard } from '../../components/mobile/CompactEnrollmentCard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';

// UI Constants
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
const PULL_TO_REFRESH_THRESHOLD = 80;

export const EnrollmentsList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint(); // Use responsive detection
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
  
  // Get enrollments from dataGridProps and apply client-side filtering
  const allEnrollments = dataGridProps.rows || [];
  
  // Apply client-side filtering with memoization
  const enrollments = useMemo(() => {
    return allEnrollments.filter(enrollment => {
      // Text search filter
      const matchesSearch = !searchText || 
        enrollment.participant_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        enrollment.activity_id?.toLowerCase().includes(searchText.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allEnrollments, searchText, statusFilter]);
  
  // Update dataGridProps with filtered data
  const filteredDataGridProps = {
    ...dataGridProps,
    rows: enrollments,
  };

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
      console.log('Deleting enrollment with ID:', selectedEnrollmentId);
      deleteEnrollment({
        resource: 'enrollments',
        id: selectedEnrollmentId,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_deleted'));
        },
        onError: (error) => {
          console.error('Delete error:', error);
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
    
    console.log('Bulk deleting enrollments with IDs:', selectedRows);
    let deleteCount = 0;
    let errorCount = 0;

    for (const id of selectedRows) {
      try {
        await new Promise((resolve, reject) => {
          deleteEnrollment({
            resource: 'enrollments',
            id,
          }, {
            onSuccess: () => {
              deleteCount++;
              resolve(void 0);
            },
            onError: (error) => {
              console.error(`Delete error for ID ${id}:`, error);
              errorCount++;
              reject(error);
            }
          });
        });
      } catch (error) {
        // Error already logged above
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
    console.log('Opening create modal');
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    try {
      await invalidate({
        resource: 'enrollments',
        invalidates: ['list']
      });
      showSuccess(t('messages.data_refreshed', 'Data refreshed'));
    } catch (error) {
      console.error('Refresh error:', error);
      handleError(error, t('common.refresh'));
    }
  };


  const columns: GridColDef[] = [
    {
      field: 'participant_id',
      headerName: t('forms.participant_id'),
      flex: 1,
    },
    {
      field: 'activity_id',
      headerName: t('forms.activity_id'),
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
      field: 'completion_percentage', 
      headerName: t('forms.progress'), 
      flex: 1,
      renderCell: (params) => `${params.row.completion_percentage || 0}%`
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
        <ActionMenu
          onEdit={() => handleEdit(params.row.id)}
          onDuplicate={() => handleDuplicate(params.row.id)}
          onDelete={() => handleDeleteRequest(params.row.id)}
        />
      ),
    },
  ];

  const renderContent = () => (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0, // Add bottom padding on mobile for bottom navigation
      px: isMobile ? MOBILE_SIDE_PADDING : 0, // Add side padding on mobile
      minHeight: isMobile ? 'auto' : '100vh', // Remove minHeight on mobile
      backgroundColor: isMobile ? '#f8f9fa' : 'background.default',
      overflow: isMobile ? 'hidden' : 'visible', // Force hide scrollbar on mobile
      '&::-webkit-scrollbar': isMobile ? { display: 'none' } : {}, // Hide webkit scrollbars on mobile
      scrollbarWidth: isMobile ? 'none' : 'auto', // Hide Firefox scrollbars on mobile
    }}>
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('enrollments')} value={allEnrollments.length.toString()} icon={<SchoolIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="primary" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('enrollment_status.confirmed')} value={allEnrollments.filter(e => e.status === 'confirmed').length.toString()} icon={<PeopleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="success" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('enrollment_status.completed')} value={allEnrollments.filter(e => e.status === 'completed').length.toString()} icon={<EventIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="info" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('enrollment_status.pending')} value={allEnrollments.filter(e => e.status === 'pending').length.toString()} icon={<PaymentIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="warning" />
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
        {/* Desktop Layout */}
        {!isMobile && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              <Button 
                variant="contained" 
                onClick={handleAddNew}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: 140,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                + {t('actions.create')} {t('enrollment')}
              </Button>
              {selectedRows.length > 0 && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleBulkDelete}
                  sx={{ textTransform: 'none' }}
                >
                  {t('actions.delete')} ({selectedRows.length})
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
              <TextField
                placeholder={t('search.placeholder_enrollments')}
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: 200,
                  maxWidth: 300,
                  flexShrink: 1
                }}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
                <InputLabel>{t('course_fields.status')}</InputLabel>
                <Select
                  label={t('course_fields.status')}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value={EnrollmentStatus.PENDING}>{t('enrollment_status.pending')}</MenuItem>
                  <MenuItem value={EnrollmentStatus.CONFIRMED}>{t('enrollment_status.confirmed')}</MenuItem>
                  <MenuItem value={EnrollmentStatus.COMPLETED}>{t('enrollment_status.completed')}</MenuItem>
                  <MenuItem value={EnrollmentStatus.CANCELLED}>{t('enrollment_status.cancelled')}</MenuItem>
                  <MenuItem value={EnrollmentStatus.WAITLISTED}>{t('enrollment_status.waitlisted')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

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
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS
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
                  borderRadius: isMobile ? MOBILE_SEARCH_BORDER_RADIUS : DESKTOP_BORDER_RADIUS
                }}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value={EnrollmentStatus.PENDING}>{t('enrollment_status.pending')}</MenuItem>
                <MenuItem value={EnrollmentStatus.CONFIRMED}>{t('enrollment_status.confirmed')}</MenuItem>
                <MenuItem value={EnrollmentStatus.COMPLETED}>{t('enrollment_status.completed')}</MenuItem>
                <MenuItem value={EnrollmentStatus.CANCELLED}>{t('enrollment_status.cancelled')}</MenuItem>
                <MenuItem value={EnrollmentStatus.WAITLISTED}>{t('enrollment_status.waitlisted')}</MenuItem>
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
            <Box sx={{ height: DATA_GRID_HEIGHT, width: '100%' }}>
              <DataGrid
                {...filteredDataGridProps}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                sx={{ border: 'none' }}
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel as string[]);
                }}
                rowSelectionModel={selectedRows}
              />
            </Box>
          )}

          {/* Mobile Card List */}
          {isMobile && (
            <Box sx={{ 
              px: 1,
              pb: 10 // Extra padding for bottom navigation
            }}>
              {enrollments.map((enrollment) => (
                <CompactEnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </Box>
          )}
        </ErrorBoundary>
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`${t('actions.delete')} ${t('enrollment')}`}
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
          onSave={async (enrollmentData) => {
            console.log('Saving enrollment:', enrollmentData);
            
            if (modalMode === 'create' || modalMode === 'duplicate') {
              createEnrollment({
                resource: 'enrollments',
                values: enrollmentData,
              }, {
                onSuccess: () => {
                  setIsModalOpen(false);
                  setModalInitialData(null);
                  // Just close modal - let auto-refresh handle it
                },
                onError: (error) => {
                  console.error('Create error:', error);
                  handleError(error, t('actions.create') + ' ' + t('enrollment'));
                }
              });
            } else if (modalMode === 'edit' && modalInitialData?.id) {
              updateEnrollment({
                resource: 'enrollments',
                id: modalInitialData.id,
                values: enrollmentData,
              }, {
                onSuccess: () => {
                  setIsModalOpen(false);
                  setModalInitialData(null);
                  // Just close modal - let auto-refresh handle it
                },
                onError: (error) => {
                  console.error('Update error:', error);
                  handleError(error, t('actions.edit') + ' ' + t('enrollment'));
                }
              });
            }
          }}
          initialData={modalInitialData}
          mode={modalMode}
        />
      </ErrorBoundary>
      
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
      
    </Box>
  );

  // Wrap with pull-to-refresh on mobile, or return content directly on desktop
  return isMobile ? (
    <PullToRefresh 
      onRefresh={handleRefresh}
      enabled={true}
      threshold={PULL_TO_REFRESH_THRESHOLD}
    >
      {renderContent()}
    </PullToRefresh>
  ) : (
    renderContent()
  );
}; 