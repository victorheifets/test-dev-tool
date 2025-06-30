import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDelete, useCreate, useUpdate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Lead } from '../../types/lead';
import { StatusChip } from '../../components/leads/StatusChip';
import { ActionMenu } from '../../components/leads/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LeadModal } from '../../components/leads/LeadModal';
import { StatCard } from '../../components/StatCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';

export const LeadsList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Lead | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteLead } = useDelete();
  const { mutate: createLead } = useCreate();
  const { mutate: updateLead } = useUpdate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Lead>({
    resource: 'leads',
  });
  
  // Get leads from dataGridProps for stat calculations
  const leads = dataGridProps.rows || [];

  const handleEdit = (id: string) => {
    const leadToEdit = leads.find(l => l.id === id);
    if (leadToEdit) {
      setModalMode('edit');
      setModalInitialData(leadToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const leadToDuplicate = leads.find(l => l.id === id);
    if (leadToDuplicate) {
      setModalMode('duplicate');
      setModalInitialData(leadToDuplicate);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedLeadId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLeadId) {
      console.log('Deleting lead with ID:', selectedLeadId);
      deleteLead({
        resource: 'leads',
        id: selectedLeadId,
      }, {
        onSuccess: () => {
          showSuccess('Lead deleted successfully!');
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, 'Delete Lead');
        }
      });
    }
    setDialogOpen(false);
    setSelectedLeadId(null);
  };
  
  const handleAddNew = () => {
    console.log('Opening create modal');
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSave = (lead: Omit<Lead, 'id'>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createLead({
        resource: 'leads',
        values: lead,
      }, {
        onSuccess: () => {
          showSuccess('Lead created successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, 'Create Lead');
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateLead({
        resource: 'leads',
        id: modalInitialData.id,
        values: lead,
      }, {
        onSuccess: () => {
          showSuccess('Lead updated successfully!');
          setIsModalOpen(false);
          setModalInitialData(null);
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, 'Update Lead');
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
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
      field: 'source',
      headerName: 'Source',
      flex: 1,
      renderCell: (params) => params.row.source.charAt(0).toUpperCase() + params.row.source.slice(1)
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
          <StatCard title="Total Leads" value={leads.length.toString()} icon={<PersonAddIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="New" value={leads.filter(l => l.status === 'new').length.toString()} icon={<EmailIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Qualified" value={leads.filter(l => l.status === 'qualified').length.toString()} icon={<PhoneIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Converted" value={leads.filter(l => l.status === 'converted').length.toString()} icon={<LanguageIcon sx={{ fontSize: 40 }} />} color="secondary" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={handleAddNew}>+ Add Lead</Button>
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
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
      />
      <LeadModal 
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
} 