import { Refine, useMenu, CanAccess, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
  AuthPage,
} from "@refinedev/mui";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { useRouterContext } from '@refinedev/core';
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import React from "react";
import { Header } from "./components/header";
import { ThemeContextProvider } from "./contexts/color-mode";
import { useResources } from "./config/navigation";
import { useTranslation } from "react-i18next";
import { GlobalStyleOverrides } from "./styles/globalOverrides";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Dashboard } from "./pages/dashboard";
import { CourseList } from './pages/courses/list';
import { ParticipantsList } from './pages/participants/list';
import { EnrollmentsList } from './pages/enrollments/list';
import { LeadsList } from './pages/leads/list';
import SimpleSMS from './pages/messaging/SimpleSMS';
import { LandingPagesExamples } from './pages/landing-pages-examples';
import RegistrationForm from './pages/registration-form';
import PublicRegistrationForm from './pages/registration-form/public';
import CustomLoginPage from './pages/login';
import { MobileBottomNavigation } from './components/mobile/BottomNavigation';

const Title = ({ collapsed }: { collapsed: boolean }) => {
  const { t } = useTranslation();
  return (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 2, 
      justifyContent: collapsed ? 'center' : 'flex-start',
    }}
  >
    <SchoolIcon sx={{ 
      color: '#7367F0', 
      fontSize: collapsed ? '2rem' : '1.75rem',
      filter: 'drop-shadow(0 2px 4px rgba(115, 103, 240, 0.3))'
    }}/>
    {!collapsed && (
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7367F0, #9C88FF)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(115, 103, 240, 0.2)',
          letterSpacing: '0.5px',
        }}
      >
        {t('app.title')}
      </Typography>
    )}
  </Box>
  );
};

const AppContent = () => {
  const resources = useResources();
  const notificationProvider = useNotificationProvider();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <DevtoolsProvider>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerBindings}
        notificationProvider={notificationProvider}
        resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "0clU31-Z7xK5Z-gREWHp",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CustomLoginPage />}
                      >
                        <ThemedLayoutV2 
                          Header={() => <Header sticky={false} />}
                          Sider={isMobile ? () => null : (props) => <ThemedSiderV2 {...props} Title={Title} />}
                        >
                          <Box sx={{ pb: isMobile ? 12 : 0 }}>
                            <Outlet />
                          </Box>
                          {isMobile && <MobileBottomNavigation />}
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="dashboard" />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/participants" element={<ParticipantsList />} />
                    <Route path="/enrollments" element={<EnrollmentsList />} />
                    <Route path="/leads" element={<LeadsList />} />
                    <Route path="/sms" element={<SimpleSMS />} />
                    <Route path="/landing-pages-examples" element={<LandingPagesExamples />} />
                    <Route path="/registration" element={<RegistrationForm />} />
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<CustomLoginPage />} />
                  </Route>
                  <Route path="/public/registration/:formId" element={<PublicRegistrationForm />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <GlobalStyleOverrides />
          <RefineSnackbarProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </RefineSnackbarProvider>
        </ThemeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
