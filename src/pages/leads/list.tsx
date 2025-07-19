import React, { useState, useMemo } from 'react';
import { Box, Button, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, useMediaQuery, useTheme, Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Lead, LeadStatus } from '../../types/lead';
import { StatusChip } from '../../components/leads/StatusChip';
import { ActionMenu } from '../../components/leads/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LeadModal } from '../../components/leads/LeadModal';
import { StatCard } from '../../components/StatCard';
import { CompactLeadCard } from '../../components/mobile/CompactLeadCard';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';

// UI Constants
const MOBILE_ICON_SIZE = 24;
const DESKTOP_ICON_SIZE = 40;

export const LeadsList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Lead | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteLead } = useDelete();
  const { mutate: createLead } = useCreate();
  const { mutate: updateLead } = useUpdate();
  const invalidate = useInvalidate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<Lead>({
    resource: 'leads',
  });
  
  // Get leads from dataGridProps and apply client-side filtering
  const allLeads = dataGridProps.rows || [];
  
  // Apply client-side filtering with useMemo for performance
  const leads = useMemo(() => {
    return allLeads.filter(lead => {
      // Text search filter
      const matchesSearch = !searchText || 
        lead.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchText.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allLeads, searchText, statusFilter]);
  
  // Update dataGridProps with filtered data
  const filteredDataGridProps = {
    ...dataGridProps,
    rows: leads,
  };

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
          showSuccess(t('messages.lead_deleted'));
        },
        onError: (error) => {
          console.error('Delete error:', error);
          handleError(error, t('actions.delete') + ' ' + t('lead'));
        }
      });
    }
    setDialogOpen(false);
    setSelectedLeadId(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    console.log('Bulk deleting leads with IDs:', selectedRows);
    let deleteCount = 0;
    let errorCount = 0;

    for (const id of selectedRows) {
      try {
        await new Promise((resolve, reject) => {
          deleteLead({
            resource: 'leads',
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

  const handleSave = (lead: Omit<Lead, 'id'>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createLead({
        resource: 'leads',
        values: lead,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.lead_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'leads', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('Create error:', error);
          handleError(error, t('actions.create') + ' ' + t('lead'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateLead({
        resource: 'leads',
        id: modalInitialData.id,
        values: lead,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.lead_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'leads', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('Update error:', error);
          handleError(error, t('actions.edit') + ' ' + t('lead'));
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'first_name',
      headerName: t('common.first_name'),
      flex: 1,
    },
    {
      field: 'last_name',
      headerName: t('common.last_name'),
      flex: 1,
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
      field: 'source',
      headerName: t('forms.source'),
      flex: 1,
      renderCell: (params) => params.row.source.charAt(0).toUpperCase() + params.row.source.slice(1)
    },
    {
      field: 'status',
      headerName: t('course_fields.status'),
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { 
      field: 'created_at', 
      headerName: t('common.created_at'), 
      flex: 1,
      renderCell: (params) => new Date(params.row.created_at).toLocaleDateString()
    },
    {
      field: 'action',
      headerName: t('common.actions'),
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('leads')} 
            value={leads.length.toString()} 
            icon={<PersonAddIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('status_options.new')} 
            value={leads.filter(l => l.status === 'new').length.toString()} 
            icon={<EmailIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('status_options.qualified')} 
            value={leads.filter(l => l.status === 'qualified').length.toString()} 
            icon={<PhoneIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('status_options.converted')} 
            value={leads.filter(l => l.status === 'converted').length.toString()} 
            icon={<LanguageIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="secondary" 
          />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        {/* Desktop Controls */}
        {!isMobile && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleAddNew}>+ {t('actions.create')} {t('lead')}</Button>
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
                placeholder={t('search.placeholder_leads')}
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
                  <MenuItem value={LeadStatus.NEW}>{t('status_options.new')}</MenuItem>
                  <MenuItem value={LeadStatus.CONTACTED}>{t('status_options.contacted')}</MenuItem>
                  <MenuItem value={LeadStatus.QUALIFIED}>{t('status_options.qualified')}</MenuItem>
                  <MenuItem value={LeadStatus.CONVERTED}>{t('status_options.converted')}</MenuItem>
                  <MenuItem value={LeadStatus.LOST}>{t('status_options.lost')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <TextField
                placeholder={t('search.placeholder_leads')}
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '16px', // Prevent zoom on iOS
                  }
                }}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>{t('course_fields.status')}</InputLabel>
                <Select
                  label={t('course_fields.status')}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '16px',
                    }
                  }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value={LeadStatus.NEW}>{t('status_options.new')}</MenuItem>
                  <MenuItem value={LeadStatus.CONTACTED}>{t('status_options.contacted')}</MenuItem>
                  <MenuItem value={LeadStatus.QUALIFIED}>{t('status_options.qualified')}</MenuItem>
                  <MenuItem value={LeadStatus.CONVERTED}>{t('status_options.converted')}</MenuItem>
                  <MenuItem value={LeadStatus.LOST}>{t('status_options.lost')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* Desktop Table */}
        {!isMobile && (
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
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <Box>
            {leads.map((lead) => (
              <CompactLeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDeleteRequest}
              />
            ))}
          </Box>
        )}
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t('actions.delete') + ' ' + t('lead')}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('leads')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
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
        forceMobile={isMobile}
      />
      
      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNew}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
} 