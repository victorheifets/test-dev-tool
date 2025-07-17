import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WebIcon from '@mui/icons-material/Web';
import MessageIcon from '@mui/icons-material/Message';
import { useTranslation } from 'react-i18next';

import type { RefineProps } from '@refinedev/core';

export const useResources = (): RefineProps['resources'] => {
  const { t } = useTranslation();
  
  return [
    {
      name: 'dashboard',
      list: '/dashboard',
      meta: {
        label: t('navigation.dashboard'),
        icon: <DashboardIcon />,
      },
    },
    {
      name: 'section_apps_pages',
      meta: {
          label: t('navigation.apps_pages'),
      }
    },
    {
      name: 'courses',
      list: '/courses',
      meta: {
        label: t('navigation.courses'),
        icon: <SchoolIcon />,
      },
    },
    {
      name: 'participants',
      list: '/participants',
      meta: {
        label: t('navigation.participants'),
        icon: <PeopleIcon />,
      },
    },
    {
      name: 'enrollments',
      list: '/enrollments',
      meta: {
        label: t('navigation.enrollments'),
        icon: <LibraryBooksIcon />,
      },
    },
    {
      name: 'leads',
      list: '/leads',
      meta: {
        label: t('navigation.leads'),
        icon: <PersonAddIcon />,
      },
    },
    {
      name: 'section_marketing',
      meta: {
          label: t('navigation.marketing'),
      }
    },
    {
      name: 'simple-sms',
      list: '/simple-sms',
      meta: {
        label: 'SMS Messaging',
        icon: <MessageIcon />,
      },
    },
    {
      name: 'landing-pages-examples',
      list: '/landing-pages-examples',
      meta: {
        label: 'Landing Page Examples',
        icon: <WebIcon />,
      },
    },
  ];
}; 