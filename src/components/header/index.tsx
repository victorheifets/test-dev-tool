import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../contexts/color-mode";
import { FormControl, MenuItem, Select } from "@mui/material";

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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <AppBar 
      position={sticky ? "sticky" : "relative"} 
      sx={{ 
        boxShadow: 'none',
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <HamburgerMenu />
          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
          >
            <FormControl sx={{ minWidth: 80 }}>
              <Select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                variant="standard"
                disableUnderline
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="he">Hebrew</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
              >
                {user?.name && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <Avatar src={user?.avatar} alt={user?.name} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};