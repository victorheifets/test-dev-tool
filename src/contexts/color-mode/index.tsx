import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import stylisRTLPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { lightTheme, darkTheme } from "../../config/theme";

type ThemeContextType = {
  mode: string;
  setMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export const ThemeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  const cacheRtl = createCache({
    key: i18n.language === "he" ? "muirtl" : "muiltr",
    stylisPlugins: i18n.language === "he" ? [prefixer, stylisRTLPlugin] : [prefixer],
  });

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  useEffect(() => {
    document.dir = i18n.language === "he" ? "rtl" : "ltr";
  }, [i18n.language]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const MuiTheme = createTheme({
    ...(mode === "light" ? lightTheme : darkTheme),
    direction: i18n.language === "he" ? "rtl" : "ltr",
  });

  return (
    <ThemeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={MuiTheme}>{children}</ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};