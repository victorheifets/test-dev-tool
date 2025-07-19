import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CourseCard } from './CourseCard';
import { CompactCourseCard } from './CompactCourseCard';
import { Activity } from '../../types/activity';

interface ResponsiveDataViewProps {
  data: Activity[];
  columns: GridColDef[];
  dataGridProps: any;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  selectedRows: string[];
  onRowSelectionChange: (newSelection: string[]) => void;
  height?: number;
}

export const ResponsiveDataView: React.FC<ResponsiveDataViewProps> = ({
  data,
  columns,
  dataGridProps,
  onEdit,
  onDuplicate,
  onDelete,
  selectedRows,
  onRowSelectionChange,
  height = 500
}) => {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return (
      <Box sx={{ 
        px: 1,
        pb: 10 // Extra padding for bottom navigation
      }}>
        {data.map((course) => (
          <CompactCourseCard
            key={course.id}
            course={course}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ height: height, width: '100%' }}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25, 50]}
        sx={{ border: 'none' }}
        onRowSelectionModelChange={onRowSelectionChange}
        rowSelectionModel={selectedRows}
      />
    </Box>
  );
};