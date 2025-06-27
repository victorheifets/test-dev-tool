import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';

import type { RefineProps } from '@refinedev/core';

export const resources: RefineProps['resources'] = [
  {
    name: 'dashboard',
    list: '/dashboard',
    meta: {
      label: 'Dashboards',
      icon: <DashboardIcon />,
    },
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
    name: 'enrollments',
    list: '/enrollments',
    meta: {
      label: 'Enrollments',
      icon: <LibraryBooksIcon />,
    },
  },
  {
    name: 'students',
    list: '/students',
    meta: {
      label: 'Students',
      icon: <PeopleIcon />,
    },
  },
  {
    name: 'blog_posts',
    list: '/blog-posts',
    create: '/blog-posts/create',
    edit: '/blog-posts/edit/:id',
    show: '/blog-posts/show/:id',
    meta: {
      label: 'Blog Posts',
      canDelete: true,
    },
  },
  {
    name: 'categories',
    list: '/categories',
    create: '/categories/create',
    edit: '/categories/edit/:id',
    show: '/categories/show/:id',
    meta: {
      label: 'Categories',
      canDelete: true,
    },
  },
]; 