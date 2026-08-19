import React, { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Palette, ThemeName, palettes } from './theme';

type ThemeValue = {
  theme: Palette;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
};

const ThemeCtx = createContext<ThemeValue | null>(null);

export function ThemeProvider({
  children,
  initial = 'light',
}: PropsWithChildren<{ initial?: ThemeName }>) {
  const [themeName, setTheme] = useState<ThemeName>(initial);
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({ theme: palettes[themeName], themeName, setTheme, toggleTheme }),
    [themeName, toggleTheme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
}
