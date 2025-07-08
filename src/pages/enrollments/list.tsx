import React, { useState } from 'react';
import { Box, Button, Typography, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Enrollment, EnrollmentCreate, EnrollmentStatus } from '../../types/enrollment';
import { StatusChip } from '../../components/enrollments/StatusChip';
import { ActionMenu } from '../../components/enrollments/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { EnrollmentModal } from '../../components/enrollments/EnrollmentModal';
import { StatCard } from '../../components/StatCard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';

export const EnrollmentsList = () => {
  const { t } = useTranslation();
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
  
  // Apply client-side filtering
  const enrollments = allEnrollments.filter(enrollment => {
    // Text search filter
    const matchesSearch = !searchText || 
      enrollment.participant_id?.toLowerCase().includes(searchText.toLowerCase()) ||
      enrollment.activity_id?.toLowerCase().includes(searchText.toLowerCase()) ||
      enrollment.payment_info?.payment_status?.toLowerCase().includes(searchText.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
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

  const handleSave = (enrollment: EnrollmentCreate) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createEnrollment({
        resource: 'enrollments',
        values: enrollment,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'enrollments', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, t('actions.create') + ' ' + t('enrollment'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateEnrollment({
        resource: 'enrollments',
        id: modalInitialData.id,
        values: enrollment,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.enrollment_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'enrollments', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, t('actions.edit') + ' ' + t('enrollment'));
        }
      });
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
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={() => handleEdit(params.row.id)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <ActionMenu
            onEdit={() => handleEdit(params.row.id)}
            onDuplicate={() => handleDuplicate(params.row.id)}
            onDelete={() => handleDeleteRequest(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('enrollments')} value={enrollments.length.toString()} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('status_options.enrolled')} value={enrollments.filter(e => e.status === 'enrolled').length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('course_status.completed')} value={enrollments.filter(e => e.status === 'completed').length.toString()} icon={<EventIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('status_options.paid')} value={enrollments.filter(e => e.payment_status === 'paid').length.toString()} icon={<PaymentIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleAddNew}>+ {t('actions.create')} {t('enrollment')}</Button>
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
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder={t('search.placeholder_enrollments')}
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
        <Box sx={{ height: 500, width: '100%' }}>
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
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t('actions.delete') + ' ' + t('enrollment')}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('enrollments')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <EnrollmentModal 
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialData(null);
        }}
        initialData={modalInitialData}
        mode={modalMode}
        onSave={handleSave}
      />
    </Box>
  );
}; 