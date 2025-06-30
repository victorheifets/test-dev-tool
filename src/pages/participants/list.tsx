import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Participant } from '../../types/participant';
import { StatusChip } from '../../components/participants/StatusChip';
import { ActionMenu } from '../../components/participants/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ParticipantModal } from '../../components/participants/ParticipantModal';
import { StatCard } from '../../components/StatCard';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export const ParticipantsList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Participant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteParticipant } = useDelete();
  const { mutate: createParticipant } = useCreate();
  const { mutate: updateParticipant } = useUpdate();

  // Use real API data via useDataGrid hook
  const { dataGridProps, search, filters } = useDataGrid<Participant>({
    resource: 'participants',
  });
  
  // Get participants from dataGridProps for stat calculations
  const participants = dataGridProps.rows || [];

  const handleEdit = (id: string) => {
    const participantToEdit = participants.find(p => p.id === id);
    if (participantToEdit) {
      setModalMode('edit');
      setModalInitialData(participantToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const participantToDuplicate = participants.find(p => p.id === id);
    if (participantToDuplicate) {
      setModalMode('duplicate');
      setModalInitialData(participantToDuplicate);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedParticipantId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedParticipantId) {
      console.log('Deleting participant with ID:', selectedParticipantId);
      deleteParticipant({
        resource: 'participants',
        id: selectedParticipantId,
      }, {
        onSuccess: () => {
          showSuccess('Student deleted successfully!');
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, 'Delete Student');
        }
      });
    }
    setDialogOpen(false);
    setSelectedParticipantId(null);
  };
  
  const handleAddNew = () => {
    console.log('Opening create modal');
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSave = (participant: Omit<Participant, 'id'>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createParticipant({
        resource: 'participants',
        values: participant,
      }, {
        onSuccess: () => {
          showSuccess('Participant created successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, 'Create Participant');
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateParticipant({
        resource: 'participants',
        id: modalInitialData.id,
        values: participant,
      }, {
        onSuccess: () => {
          showSuccess('Participant updated successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, 'Update Participant');
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      flex: 1,
      renderCell: (params) => new Date(params.row.created_at).toLocaleDateString()
    },
    { 
      field: 'enrollments_count', 
      headerName: 'Enrollments', 
      flex: 1,
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
          <StatCard title="Total Students" value={participants.length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active" value={participants.filter(p => p.status === 'active').length.toString()} icon={<VerifiedUserIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Inactive" value={participants.filter(p => p.status === 'inactive').length.toString()} icon={<EmailIcon sx={{ fontSize: 40 }} />} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Enrollments" value={participants.reduce((sum, p) => sum + (p.enrollments_count || 0), 0).toString()} icon={<PhoneIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={handleAddNew}>+ Add Student</Button>
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
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
      />
      <ParticipantModal 
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