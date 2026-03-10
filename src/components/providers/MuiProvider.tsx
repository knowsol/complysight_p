'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { createMuiTheme } from '@/lib/theme/mui-theme';

export function MuiProvider({ children }: { children: ReactNode }) {
  const { site } = useAuth();
  const theme = useMemo(() => createMuiTheme(site), [site]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
