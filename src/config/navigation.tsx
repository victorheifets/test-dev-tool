import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import type { RefineProps } from '@refinedev/core';

export const resources: RefineProps['resources'] = [
  {
    name: 'dashboard',
    list: '/dashboard',
    meta: {
      label: 'Dashboard',
      icon: <DashboardIcon />,
    },
  },
  {
    name: 'section_apps_pages',
    meta: {
        label: 'APPS & PAGES',
    }
  },
  {
    name: 'courses',
    list: '/courses',
    meta: {
      label: 'Courses',
      icon: <SchoolIcon />,
    },
  },
  {
    name: 'participants',
    list: '/participants',
    meta: {
      label: 'Students',
      icon: <PeopleIcon />,
    },
  },
  {
    name: 'enrollments',
    list: '/enrollments',
    meta: {
      label: 'Enrollments',
      icon: <LibraryBooksIcon />,
    },
  },
  {
    name: 'leads',
    list: '/leads',
    meta: {
      label: 'Leads',
      icon: <PersonAddIcon />,
    },
  },
]; 