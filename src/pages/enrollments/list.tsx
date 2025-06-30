import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Enrollment } from '../../types/enrollment';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Enrollment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteEnrollment } = useDelete();
  const { mutate: createEnrollment } = useCreate();
  const { mutate: updateEnrollment } = useUpdate();

  // Use real API data via useDataGrid hook
  const { dataGridProps, search, filters } = useDataGrid<Enrollment>({
    resource: 'enrollments',
  });
  
  // Get enrollments from dataGridProps for stat calculations
  const enrollments = dataGridProps.rows || [];

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
          showSuccess('Enrollment deleted successfully!');
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, 'Delete Enrollment');
        }
      });
    }
    setDialogOpen(false);
    setSelectedEnrollmentId(null);
  };
  
  const handleAddNew = () => {
    console.log('Opening create modal');
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSave = (enrollment: Omit<Enrollment, 'id'>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createEnrollment({
        resource: 'enrollments',
        values: enrollment,
      }, {
        onSuccess: () => {
          showSuccess('Enrollment created successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, 'Create Enrollment');
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateEnrollment({
        resource: 'enrollments',
        id: modalInitialData.id,
        values: enrollment,
      }, {
        onSuccess: () => {
          showSuccess('Enrollment updated successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, 'Update Enrollment');
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'participant_name',
      headerName: 'Student',
      flex: 1,
    },
    {
      field: 'activity_name',
      headerName: 'Course',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'enrollment_date', 
      headerName: 'Enrollment Date', 
      flex: 1,
      renderCell: (params) => new Date(params.row.enrollment_date).toLocaleDateString()
    },
    { 
      field: 'completion_date', 
      headerName: 'Completion Date', 
      flex: 1,
      renderCell: (params) => params.row.completion_date ? new Date(params.row.completion_date).toLocaleDateString() : '-'
    },
    { 
      field: 'payment_status', 
      headerName: 'Payment Status', 
      flex: 1,
      renderCell: (params) => params.row.payment_status.charAt(0).toUpperCase() + params.row.payment_status.slice(1)
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
          <StatCard title="Total Enrollments" value={enrollments.length.toString()} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Enrolled" value={enrollments.filter(e => e.status === 'enrolled').length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Completed" value={enrollments.filter(e => e.status === 'completed').length.toString()} icon={<EventIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Paid" value={enrollments.filter(e => e.payment_status === 'paid').length.toString()} icon={<PaymentIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={handleAddNew}>+ Add Enrollment</Button>
        </Box>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                {...dataGridProps}
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
        title="Delete Enrollment"
        description="Are you sure you want to delete this enrollment? This action cannot be undone."
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