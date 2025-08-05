import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import Language from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../contexts/color-mode";
import { Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";

type IUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ThemeContext);
  const { i18n, t } = useTranslation();
  
  // Get logout text from translation system
  const getLogoutText = () => {
    return t('header.logout');
  };
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();
  
  // Check if mobile to hide hamburger menu
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Separate state for language and user menus
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleUserClose = () => {
    setUserAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleUserClose();
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <AppBar position={sticky ? "sticky" : "relative"} sx={{ boxShadow: 'none', backgroundColor: 'background.paper' }}>
      <Toolbar>
        {!isMobile && <HamburgerMenu />}
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            color="inherit"
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleLanguageClick}
            sx={(theme) => ({
              mx: 0.5,
              '& .MuiSvgIcon-root': {
                transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'
              }
            })}
          >
            <Language />
          </IconButton>
          <Menu
            id="language-menu"
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageClose}
          >
            <MenuItem onClick={() => changeLanguage("en")}>
              🇺🇸 {i18n.t("common.english")}
            </MenuItem>
            <MenuItem onClick={() => changeLanguage("he")}>
              🇮🇱 {i18n.t("common.hebrew")}
            </MenuItem>
          </Menu>
          <IconButton color="inherit" onClick={setMode} sx={{ mx: 0.5 }}>
            {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
          
          {/* User Avatar with Menu */}
          <IconButton 
            onClick={handleUserClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            <Avatar 
              src={user?.avatar} 
              alt={user?.name}
              sx={{ 
                width: 32, 
                height: 32,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            />
          </IconButton>
          
          {/* User Menu */}
          <Menu
            id="user-menu"
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleUserClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <Avatar src={user?.avatar} alt={user?.name} />
              <Box>
                <Typography variant="subtitle2" noWrap>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || 'No email'}
                </Typography>
                {user?.role && (
                  <Typography variant="caption" color="primary" noWrap sx={{ display: 'block' }}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Typography>
                )}
              </Box>
            </MenuItem>
            
            <Divider />
            
            {/* Profile Option */}
            <MenuItem onClick={handleUserClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              {t('header.profile')}
            </MenuItem>
            
            {/* Logout Option */}
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {getLogoutText()}
            </MenuItem>
          </Menu>

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={logoutDialogOpen}
            onClose={handleLogoutCancel}
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
          >
            <DialogTitle id="logout-dialog-title">
              {t('header.confirm_logout')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="logout-dialog-description">
                {t('header.logout_confirmation')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLogoutCancel} color="primary">
                {t('buttons.cancel')}
              </Button>
              <Button onClick={handleLogoutConfirm} color="primary" variant="contained" autoFocus>
                {getLogoutText()}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};