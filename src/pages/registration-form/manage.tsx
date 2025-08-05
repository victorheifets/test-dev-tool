import React, { useState, useMemo } from 'react';
import { Box, Button, Grid, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Fab, InputAdornment, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PublishIcon from '@mui/icons-material/Publish';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDelete, useCreate, useUpdate, useInvalidate } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { RegistrationForm, RegistrationFormCreate } from '../../types/registration-form';
import { ActionMenu } from '../../components/leads/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { RegistrationFormModal } from '../../components/registrationForm/RegistrationFormModal';
import { StatCard } from '../../components/StatCard';
import { SharedDataGrid } from '../../components/common/SharedDataGrid';
import { CompactCardShell } from '../../components/mobile/CompactCardShell';
import { CompactRegistrationFormContent } from '../../components/mobile/content/CompactRegistrationFormContent';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

// UI Constants (matching leads pattern)
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

export const RegistrationFormsList = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<RegistrationForm | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: deleteForm } = useDelete();
  const { mutate: createForm } = useCreate();
  const { mutate: updateForm } = useUpdate();
  const invalidate = useInvalidate();

  // Use real API data via useDataGrid hook
  const { dataGridProps } = useDataGrid<RegistrationForm>({
    resource: 'registration-forms',
  });
  
  // Debug logging
  // console.log('[RegistrationFormsList] dataGridProps.rows:', dataGridProps.rows);
  
  // Get forms from dataGridProps and apply client-side filtering
  const allForms = dataGridProps.rows || [];
  
  // Apply client-side filtering with useMemo for performance
  const forms = useMemo(() => {
    return allForms.filter(form => {
      // Text search filter
      const matchesSearch = !searchText || 
        form.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        form.id?.toLowerCase().includes(searchText.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && form.is_active) ||
        (statusFilter === 'inactive' && !form.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [allForms, searchText, statusFilter]);

  // Event handlers
  const handleEdit = (id: string) => {
    const formToEdit = forms.find(f => f.id === id);
    if (formToEdit) {
      setModalMode('edit');
      setModalInitialData(formToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const formToDuplicate = forms.find(f => f.id === id);
    if (formToDuplicate) {
      setModalMode('duplicate');
      setModalInitialData(formToDuplicate);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedFormId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('[RegistrationFormsList] confirmDelete called for ID:', selectedFormId);
    if (selectedFormId) {
      deleteForm({
        resource: 'registration-forms',
        id: selectedFormId,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: () => {
          showSuccess(t('messages.registration_form_deleted'));
          // Invalidate cache to refresh the table
          invalidate({ resource: 'registration-forms', invalidates: ['list'] });
        },
        onError: (error) => {
          handleError(error, t('actions.delete') + ' ' + t('registrationForm.form'));
        }
      });
    }
    setDialogOpen(false);
    setSelectedFormId(null);
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
          deleteForm({
            resource: 'registration-forms',
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
    
    // Invalidate cache to refresh the table after bulk delete
    if (deleteCount > 0) {
      invalidate({ resource: 'registration-forms', invalidates: ['list'] });
    }
  };
  
  const handleAddNew = () => {
    setModalMode('create');
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSave = (formData: RegistrationFormCreate) => {
    console.log('[RegistrationFormsList] handleSave called with:', formData, 'mode:', modalMode);
    if (modalMode === 'create' || modalMode === 'duplicate') {
      createForm({
        resource: 'registration-forms',
        values: formData,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: (data) => {
          console.log('[RegistrationFormsList] Create success:', data);
          showSuccess(t('messages.registration_form_created'));
          setIsModalOpen(false);
          setModalInitialData(null);
          invalidate({ resource: 'registration-forms', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('[RegistrationFormsList] Create error:', error);
          handleError(error, t('actions.create') + ' ' + t('registrationForm.form'));
        }
      });
    } else if (modalMode === 'edit' && modalInitialData) {
      updateForm({
        resource: 'registration-forms',
        id: modalInitialData.id,
        values: formData,
        successNotification: false,
        errorNotification: false,
      }, {
        onSuccess: (data) => {
          console.log('[RegistrationFormsList] Update success:', data);
          showSuccess(t('messages.registration_form_updated'));
          setIsModalOpen(false);
          setModalInitialData(null);
          // Force refresh the data
          invalidate({ resource: 'registration-forms', invalidates: ['list'] });
        },
        onError: (error) => {
          console.error('[RegistrationFormsList] Update error:', error);
          handleError(error, t('actions.edit') + ' ' + t('registrationForm.form'));
        }
      });
    }
  };

  const handleCopyUrl = (formUrl: string) => {
    if (formUrl) {
      // Build full URL with domain (auto-detects current origin)
      const fullUrl = formUrl.startsWith('http') ? formUrl : `${window.location.origin}${formUrl}`;
      navigator.clipboard.writeText(fullUrl);
      showSuccess(t('messages.url_copied'));
    }
  };

  const handlePreviewForm = (formUrl: string) => {
    if (formUrl) {
      // Build full URL with domain for preview
      const fullUrl = formUrl.startsWith('http') ? formUrl : `${window.location.origin}${formUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  // DataGrid columns for desktop
  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: t('registrationForm.title'),
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          {params.row.title}
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: t('registrationForm.description'),
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ 
          maxWidth: 200, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {params.row.description}
        </Box>
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={params.row.is_active ? <CheckCircleIcon /> : <PauseCircleIcon />}
          label={params.row.is_active ? t('registrationForm.published') : t('registrationForm.draft')}
          color={params.row.is_active ? 'success' : 'warning'}
          size="small"
          variant={params.row.is_active ? 'filled' : 'outlined'}
        />
      ),
    },
    { 
      field: 'published_at', 
      headerName: t('registrationForm.publishedAt'), 
      flex: 1,
      renderCell: (params) => params.row.published_at 
        ? new Date(params.row.published_at).toLocaleDateString()
        : '-'
    },
    {
      field: 'form_url',
      headerName: t('registrationForm.publicUrl'),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => handleCopyUrl(params.row.form_url)}
            title={t('actions.copy_url')}
          >
            <LinkIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handlePreviewForm(params.row.form_url)}
            title={t('actions.preview')}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ),
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
    { value: 'active', label: t('common.active') },
    { value: 'inactive', label: t('common.inactive') },
  ];

  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? MOBILE_BOTTOM_PADDING : 0,
      px: isMobile ? MOBILE_SIDE_PADDING : 0,
      minHeight: isMobile ? 'auto' : '100vh',
      backgroundColor: 'background.default',
      overflow: 'visible',
    }}>
      {/* Statistics Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('registrationForm.forms')} 
            value={forms.length.toString()} 
            icon={<AssignmentIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('registrationForm.published')} 
            value={forms.filter(f => f.is_active).length.toString()} 
            icon={<CheckCircleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('registrationForm.drafts')} 
            value={forms.filter(f => !f.is_active).length.toString()} 
            icon={<PauseCircleIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="warning" 
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title={t('registrationForm.totalForms')} 
            value={forms.length.toString()} 
            icon={<PublishIcon sx={{ fontSize: isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE }} />} 
            color="info" 
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
              placeholder={t('search.placeholder_registration_forms')}
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
                <MenuItem value="inactive">{t('common.inactive')}</MenuItem>
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
              rows={forms}
              columns={columns}
              searchValue={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder={t('search.placeholder_registration_forms')}
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={statusFilterOptions}
              filterLabel={t('course_fields.status')}
              enableSelection={true}
              selectedRows={selectedRows}
              onSelectionChange={(selection) => setSelectedRows(selection as string[])}
              onCreateNew={handleAddNew}
              createButtonText={`+ ${t('actions.create')} ${t('registrationForm.form')}`}
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
              {forms.map((form) => (
                <CompactCardShell
                  key={form.id}
                  entityId={form.id}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteRequest}
                  enableSwipeGestures={true}
                >
                  <CompactRegistrationFormContent 
                    form={form} 
                    onCopyUrl={handleCopyUrl}
                    onPreviewForm={handlePreviewForm}
                  />
                </CompactCardShell>
              ))}
            </Box>
          )}
        </ErrorBoundary>
      </Box>
      
      {/* Floating Action Button for Create Form - Mobile Only */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={handleAddNew}
          sx={{
            position: 'fixed',
            bottom: FAB_BOTTOM_OFFSET,
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
        title={`${t('actions.delete')} ${t('registrationForm.form')}`}
        description={t('messages.confirm_delete')}
      />
      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`${t('actions.bulk_delete')} ${selectedRows.length} ${t('registrationForm.forms')}`}
        description={t('messages.confirm_bulk_delete', { count: selectedRows.length })}
      />
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Registration form modal error:', error, errorInfo);
        handleError(error, 'Registration Form Modal');
        setIsModalOpen(false); // Close modal on error
      }}>
        <RegistrationFormModal 
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalInitialData(null);
          }}
          forceMobile={isMobile}
          onSave={handleSave}
          initialData={modalInitialData}
          mode={modalMode}
        />
      </ErrorBoundary>
    </Box>
  );
};