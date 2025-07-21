import React, { useMemo } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

interface SharedDataGridProps<T = any> {
  // Data props
  rows: T[];
  columns: GridColDef[];
  
  // Search and filter props
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  filterLabel?: string;
  
  // Selection props
  enableSelection?: boolean;
  selectedRows?: GridRowSelectionModel;
  onSelectionChange?: (selection: GridRowSelectionModel) => void;
  
  // Action props
  onCreateNew?: () => void;
  createButtonText?: string;
  createButtonIcon?: React.ReactNode;
  
  onBulkDelete?: () => void;
  bulkDeleteText?: string;
  
  // DataGrid props
  height?: number;
  pageSizeOptions?: number[];
  disableRowSelectionOnClick?: boolean;
  
  // Loading state
  loading?: boolean;
  
  // Custom toolbar components
  customToolbarLeft?: React.ReactNode;
  customToolbarRight?: React.ReactNode;
}

export const SharedDataGrid = <T extends { id: string }>({
  rows,
  columns,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  filterValue = '',
  onFilterChange,
  filterOptions = [],
  filterLabel,
  enableSelection = false,
  selectedRows = [],
  onSelectionChange,
  onCreateNew,
  createButtonText,
  createButtonIcon,
  onBulkDelete,
  bulkDeleteText,
  height = 500,
  pageSizeOptions = [5, 10, 25, 50],
  disableRowSelectionOnClick = true,
  loading = false,
  customToolbarLeft,
  customToolbarRight,
}: SharedDataGridProps<T>) => {
  const { t } = useTranslation();

  const hasSearch = Boolean(onSearchChange);
  const hasFilter = Boolean(onFilterChange && filterOptions.length > 0);
  const hasSelection = enableSelection && selectedRows.length > 0;

  const dataGridProps = useMemo(() => ({
    rows,
    columns,
    loading,
    checkboxSelection: enableSelection,
    disableRowSelectionOnClick,
    pageSizeOptions,
    rowSelectionModel: selectedRows,
    onRowSelectionModelChange: onSelectionChange,
    sx: { border: 'none' },
  }), [
    rows, 
    columns, 
    loading, 
    enableSelection, 
    disableRowSelectionOnClick, 
    pageSizeOptions, 
    selectedRows, 
    onSelectionChange
  ]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar */}
      {(hasSearch || hasFilter || onCreateNew || customToolbarLeft || customToolbarRight) && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Left side - Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {customToolbarLeft}
            
            {onCreateNew && (
              <Button 
                variant="contained" 
                onClick={onCreateNew}
                startIcon={createButtonIcon}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: 140,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {createButtonText || `+ ${t('actions.create')}`}
              </Button>
            )}
            
            {hasSelection && onBulkDelete && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={onBulkDelete}
                sx={{ textTransform: 'none' }}
              >
                {bulkDeleteText || `${t('actions.delete')} (${selectedRows.length})`}
              </Button>
            )}
          </Box>

          {/* Right side - Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
            {customToolbarRight}
            
            {hasSearch && (
              <TextField
                placeholder={searchPlaceholder || t('search.placeholder')}
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: 200,
                  maxWidth: 300,
                  flexShrink: 1
                }}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            )}
            
            {hasFilter && (
              <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
                <InputLabel>{filterLabel || t('common.filter')}</InputLabel>
                <Select
                  label={filterLabel || t('common.filter')}
                  value={filterValue}
                  onChange={(e) => onFilterChange?.(e.target.value)}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  {filterOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      )}

      {/* DataGrid */}
      <Box sx={{ height, width: '100%' }}>
        <DataGrid {...dataGridProps} />
      </Box>
    </Box>
  );
};