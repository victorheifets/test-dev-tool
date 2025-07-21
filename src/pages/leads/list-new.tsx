import React, { useState, useMemo } from 'react';
import { Box, Button, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Fab, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { Lead, LeadStatus, LeadCreate } from '../../types/lead';
import { StatusChip } from '../../components/leads/StatusChip';
import { ActionMenu } from '../../components/leads/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { LeadModal } from '../../components/leads/LeadModal';
import { StatCard } from '../../components/StatCard';
import { SharedDataGrid } from '../../components/common/SharedDataGrid';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { CompactLeadContent } from '../../components/mobile/content/CompactLeadContent';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';

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
const PULL_TO_REFRESH_THRESHOLD = 80;

export const LeadsListNew = () => {
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

  // Event handlers
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
      deleteLead({
        resource: 'leads',
        id: selectedLeadId,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.lead_deleted'));
        },
        onError: (error) => {
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

  const handleSave = (leadData: LeadCreate) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createLead({
        resource: 'leads',
        values: leadData,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.lead_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'leads', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.create') + ' ' + t('lead'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateLead({
        resource: 'leads',
        id: modalInitialData.id,
        values: leadData,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.lead_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'leads', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.edit') + ' ' + t('lead'));
        }
      });
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    try {
      await invalidate({
        resource: 'leads',
        invalidates: ['list']
      });
      showSuccess(t('messages.data_refreshed', 'Data refreshed'));
    } catch (error) {
      console.error('Refresh error:', error);
      handleError(error, t('common.refresh'));
    }
  };

  // DataGrid columns for desktop (matching original exactly)
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
    { value: LeadStatus.NEW, label: t('lead_status.new') },
    { value: LeadStatus.CONTACTED, label: t('lead_status.contacted') },
    { value: LeadStatus.QUALIFIED, label: t('lead_status.qualified') },
    { value: LeadStatus.CONVERTED, label: t('lead_status.converted') },
    { value: LeadStatus.LOST, label: t('lead_status.lost') },
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
      {/* Statistics Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
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
            title={t('lead_status.new')} 
            value={leads.filter(l => l.status === LeadStatus.NEW).length.toString()} 
            icon={<LanguageIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('lead_status.qualified')} 
            value={leads.filter(l => l.status === LeadStatus.QUALIFIED).length.toString()} 
            icon={<EmailIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="warning" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('lead_status.converted')} 
            value={leads.filter(l => l.status === LeadStatus.CONVERTED).length.toString()} 
            icon={<PhoneIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
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
              placeholder={t('search.placeholder_leads')}
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
                <MenuItem value={LeadStatus.NEW}>{t('lead_status.new')}</MenuItem>
                <MenuItem value={LeadStatus.CONTACTED}>{t('lead_status.contacted')}</MenuItem>
                <MenuItem value={LeadStatus.QUALIFIED}>{t('lead_status.qualified')}</MenuItem>
                <MenuItem value={LeadStatus.CONVERTED}>{t('lead_status.converted')}</MenuItem>
                <MenuItem value={LeadStatus.LOST}>{t('lead_status.lost')}</MenuItem>
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
              rows={leads}
              columns={columns}
              searchValue={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder={t('search.placeholder_leads')}
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={statusFilterOptions}
              filterLabel={t('course_fields.status')}
              enableSelection={true}
              selectedRows={selectedRows}
              onSelectionChange={(selection) => setSelectedRows(selection as string[])}
              onCreateNew={handleAddNew}
              createButtonText={`+ ${t('actions.create')} ${t('lead')}`}
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
              {leads.map((lead) => (
                <CompactCardShell
                  key={lead.id}
                  entityId={lead.id}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteRequest}
                  enableSwipeGestures={true}
                >
                  <CompactLeadContent lead={lead} />
                </CompactCardShell>
              ))}
            </Box>
          )}
        </ErrorBoundary>
      </Box>
      
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`${t('actions.delete')} ${t('lead')}`}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('leads')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Lead modal error:', error, errorInfo);
        handleError(error, 'Lead Modal');
        setIsModalOpen(false); // Close modal on error
      }}>
        <LeadModal 
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

  // Wrap with pull-to-refresh on mobile, or return content directly on desktop
  const content = isMobile ? (
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

  return (
    <>
      {content}
      {/* Floating Action Button for Create Lead - Mobile Only */}
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
    </>
  );
};