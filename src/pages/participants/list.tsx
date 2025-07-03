import React, { useState } from 'react';
import { Box, Button, Typography, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
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
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Participant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteParticipant } = useDelete();
  const { mutate: createParticipant } = useCreate();
  const { mutate: updateParticipant } = useUpdate();
  const invalidate = useInvalidate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Participant>({
    resource: 'participants',
  });
  
  // Get participants from dataGridProps and apply client-side filtering
  const allParticipants = dataGridProps.rows || [];
  
  // Apply client-side filtering
  const participants = allParticipants.filter(participant => {
    // Text search filter
    const matchesSearch = !searchText || 
      participant.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.phone?.toLowerCase().includes(searchText.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && participant.is_active) ||
      (statusFilter === 'inactive' && !participant.is_active);
    
    return matchesSearch && matchesStatus;
  });
  
  // Update dataGridProps with filtered data
  const filteredDataGridProps = {
    ...dataGridProps,
    rows: participants,
  };

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
          showSuccess(t('messages.student_deleted'));
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, t('actions.delete') + ' ' + t('student'));
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
          showSuccess(t('messages.participant_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          window.location.reload();
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, t('actions.create') + ' ' + t('participant'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateParticipant({
        resource: 'participants',
        id: modalInitialData.id,
        values: participant,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.participant_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          window.location.reload();
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, t('actions.edit') + ' ' + t('participant'));
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('common.name'),
      flex: 1,
      renderCell: (params) => `${params.row.first_name || ''} ${params.row.last_name || ''}`.trim(),
    },
    {
      field: 'email',
      headerName: t('common.email'),
      flex: 1,
    },
    {
      field: 'phone',
      headerName: t('common.phone'),
      flex: 1,
    },
    {
      field: 'is_active',
      headerName: t('course_fields.status'),
      flex: 1,
      renderCell: (params) => <StatusChip isActive={params.row.is_active} />,
    },
    { 
      field: 'created_at', 
      headerName: t('common.created_at'), 
      flex: 1,
      renderCell: (params) => new Date(params.row.created_at).toLocaleDateString()
    },
    { 
      field: 'enrollments_count', 
      headerName: t('enrollments'), 
      flex: 1,
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
          <StatCard title={t('students')} value={allParticipants.length.toString()} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('common.active')} value={allParticipants.filter(p => p.status === 'active').length.toString()} icon={<VerifiedUserIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('status_options.inactive')} value={allParticipants.filter(p => p.status === 'inactive').length.toString()} icon={<EmailIcon sx={{ fontSize: 40 }} />} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('enrollments')} value={allParticipants.reduce((sum, p) => sum + (p.enrollments_count || 0), 0).toString()} icon={<PhoneIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handleAddNew}>+ {t('actions.create')} {t('student')}</Button>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder={t('search.placeholder_students')}
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
                  <MenuItem value="active">{t('common.active')}</MenuItem>
                  <MenuItem value="inactive">{t('status_options.inactive')}</MenuItem>
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
        title={t('actions.delete') + ' ' + t('student')}
        description={t('messages.confirm_delete')}
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