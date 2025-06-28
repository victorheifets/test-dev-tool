import React, { useState, useMemo, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, Typography, SelectChangeEvent, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarProps } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Course, mockCourses } from '../data/mockCourses';
import { StatusChip } from '../components/courses/StatusChip';
import { ActionMenu } from '../components/courses/ActionMenu';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { StatCard } from '../components/StatCard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';

export const Dashboard = () => {
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
       <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Providers" value="12" icon={<BusinessIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Courses" value="24" icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value="$3.45k" icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Students" value="284" icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <Box sx={{ height: 500, width: '100%' }}>
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