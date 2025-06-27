import { Box, Grid, Typography } from "@mui/material";
import { StatCard } from "../components/StatCard";
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';

export const Dashboard = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Providers" value="12" icon={<BusinessIcon sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Courses" value="24" icon={<SchoolIcon sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value="$3.45k" icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Students" value="284" icon={<PeopleIcon sx={{ fontSize: 40 }} />} />
        </Grid>
      </Grid>
    </Box>
  );
}; 