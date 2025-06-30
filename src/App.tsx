import { GitHubBanner, Refine, useMenu, CanAccess } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/mui";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Box,
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
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import React from "react";
import { Header } from "./components/header";
import { ThemeContextProvider } from "./contexts/color-mode";
import { resources } from "./config/navigation";
import { Dashboard } from "./pages/dashboard";
import { CourseList } from './pages/courses/list';
import { ParticipantsList } from './pages/participants/list';
import { EnrollmentsList } from './pages/enrollments/list';
import { LeadsList } from './pages/leads/list';

const Title = ({ collapsed }: { collapsed: boolean }) => (
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
        Course Master
      </Typography>
    )}
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                routerProvider={routerBindings}
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
                      <ThemedLayoutV2 
                        Header={() => <Header sticky={false} />}
                        Sider={(props) => <ThemedSiderV2 {...props} Title={Title} />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
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
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsProvider />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ThemeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
