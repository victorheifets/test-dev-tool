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
import AllInboxIcon from '@mui/icons-material/AllInbox';

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
    <AllInboxIcon sx={{ color: 'primary.main', fontSize: collapsed ? '2rem' : '1.75rem' }}/>
    {!collapsed && (
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Materialize
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
                notificationProvider={useNotificationProvider}
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
