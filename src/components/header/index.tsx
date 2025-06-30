import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import Language from "@mui/icons-material/Language";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../contexts/color-mode";
import { Menu, MenuItem } from "@mui/material";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ThemeContext);
  const { i18n } = useTranslation();
  const { data: user } = useGetIdentity<IUser>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <AppBar position={sticky ? "sticky" : "relative"} sx={{ boxShadow: 'none', backgroundColor: 'background.paper' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <HamburgerMenu />
          <IconButton
            color="inherit"
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ mx: 0.5 }}
          >
            <Language />
          </IconButton>
          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => changeLanguage("en")}>
              🇺🇸 English
            </MenuItem>
            <MenuItem onClick={() => changeLanguage("he")}>
              🇮🇱 Hebrew
            </MenuItem>
          </Menu>
          <IconButton color="inherit" onClick={setMode} sx={{ mx: 0.5 }}>
            {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
          <Avatar src={user?.avatar} alt={user?.name} sx={{ ml: 1 }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};