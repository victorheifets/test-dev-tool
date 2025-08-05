import React, { useState, useMemo } from 'react';
import { Box, Button, Typography, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Fab, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Participant, ParticipantCreate } from '../../types/participant';
import { StatusChip } from '../../components/participants/StatusChip';
import { ActionMenu } from '../../components/participants/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { ParticipantModal } from '../../components/participants/ParticipantModal';
import { StatCard } from '../../components/StatCard';
import { ResponsiveDataView } from '../../components/mobile/ResponsiveDataView';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
import { CompactParticipantCard } from '../../components/mobile/CompactParticipantCard';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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

export const ParticipantsList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Participant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
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
  
  // Apply client-side filtering with memoization
  const participants = useMemo(() => {
    return allParticipants.filter(participant => {
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
  }, [allParticipants, searchText, statusFilter]);
  
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
        successNotification: false,
        errorNotification: false,
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

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    console.log('Bulk deleting participants with IDs:', selectedRows);
    let deleteCount = 0;
    let errorCount = 0;

    for (const id of selectedRows) {
      try {
        await new Promise((resolve, reject) => {
          deleteParticipant({
            resource: 'participants',
            id,
            successNotification: false,
            errorNotification: false,
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
        resource: 'participants',
        invalidates: ['list']
      });
      showSuccess(t('messages.data_refreshed', 'Data refreshed'));
    } catch (error) {
      console.error('Refresh error:', error);
      handleError(error, t('common.refresh'));
    }
  };

  const handleSave = (participant: ParticipantCreate) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createParticipant({
        resource: 'participants',
        values: participant,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.participant_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          // Let auto-refresh handle it
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
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.participant_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          // Let auto-refresh handle it
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

  const renderContent = () => (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0, // Add bottom padding on mobile for bottom navigation
      px: isMobile ? MOBILE_SIDE_PADDING : 0, // Add side padding on mobile
      minHeight: isMobile ? 'auto' : '100vh', // Remove minHeight on mobile
      backgroundColor: 'background.default',
      overflow: isMobile ? 'hidden' : 'visible', // Force hide scrollbar on mobile
      '&::-webkit-scrollbar': isMobile ? { display: 'none' } : {}, // Hide webkit scrollbars on mobile
      scrollbarWidth: isMobile ? 'none' : 'auto', // Hide Firefox scrollbars on mobile
    }}>
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('students')} value={allParticipants.length.toString()} icon={<PeopleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="primary" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('common.active')} value={allParticipants.filter(p => p.status === 'active').length.toString()} icon={<VerifiedUserIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="success" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('status_options.inactive')} value={allParticipants.filter(p => p.status === 'inactive').length.toString()} icon={<EmailIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="error" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('enrollments')} value={allParticipants.reduce((sum, p) => sum + (p.enrollments_count || 0), 0).toString()} icon={<PhoneIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} color="info" />
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
                + {t('actions.create')} {t('student')}
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
                placeholder={t('search.placeholder_students')}
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
                  <MenuItem value="active">{t('common.active')}</MenuItem>
                  <MenuItem value="inactive">{t('status_options.inactive')}</MenuItem>
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
              placeholder={t('search.placeholder_students')}
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
                <MenuItem value="active">{t('common.active')}</MenuItem>
                <MenuItem value="inactive">{t('status_options.inactive')}</MenuItem>
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
              {participants.map((participant) => (
                <CompactParticipantCard
                  key={participant.id}
                  participant={participant}
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
        title={t('actions.delete') + ' ' + t('student')}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('students')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Participant modal error:', error, errorInfo);
        handleError(error, 'Participant Modal');
        setIsModalOpen(false); // Close modal on error
      }}>
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
      </ErrorBoundary>
      
      {/* Floating Action Button for Create Participant - Mobile Only */}
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