import React, { useState, useMemo, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, Typography, SelectChangeEvent, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Course, mockCourses } from '../../data/mockCourses';
import { StatusChip } from '../../components/courses/StatusChip';
import { ActionMenu } from '../../components/courses/ActionMenu';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const CourseList = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    const filtered = mockCourses
      .filter(course => course.name.toLowerCase().includes(search.toLowerCase()))
      .filter(course => status === 'All' || course.status === status);
    setFilteredCourses(filtered);
  }, [search, status]);

  const handleEdit = (id: number) => {
    alert(`Edit course ${id}`);
  };

  const handleDuplicate = (id: number) => {
    alert(`Duplicate course ${id}`);
  };

  const handleDeleteRequest = (id: number) => {
    setSelectedCourseId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourseId) {
      const updatedCourses = filteredCourses.filter((course) => course.id !== selectedCourseId);
      setFilteredCourses(updatedCourses);
    }
    setDialogOpen(false);
    setSelectedCourseId(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'CLASS NAME',
      flex: 1,
      renderCell: (params) => (
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{params.row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{params.row.subtext}</Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { field: 'instructor', headerName: 'INSTRUCTOR', flex: 1 },
    { field: 'location', headerName: 'LOCATION', flex: 1 },
    { field: 'startDate', headerName: 'START DATE', flex: 1 },
    { field: 'endDate', headerName: 'END DATE', flex: 1 },
    { field: 'capacity', headerName: 'CAPACITY', flex: 1 },
    {
      field: 'action',
      headerName: 'ACTION',
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
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={() => alert('Add new class')}>+ Add Class</Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Class"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small" sx={{ minWidth: 120 }}>
                    <MenuItem value="All">Status</MenuItem>
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                </Select>
            </Box>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.paper', borderRadius: 1 }}>
          <DataGrid
              rows={filteredCourses}
              columns={columns}
              checkboxSelection
              initialState={{
                  pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                  },
              }}
              pageSizeOptions={[3, 5, 10]}
              disableRowSelectionOnClick
              sx={{ border: 'none' }}
          />
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
      />
    </Box>
  );
}; 