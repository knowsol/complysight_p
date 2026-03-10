'use client';

import Box from '@mui/material/Box';
import type { CSSProperties, ReactNode } from 'react';

interface PageSidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  gap?: number;
  sidebarWidth?: number;
  stickyTop?: number;
  style?: CSSProperties;
}

export function PageSidebarLayout({
  sidebar,
  children,
  gap = 14,
  sidebarWidth = 240,
  stickyTop = 0,
  style,
}: PageSidebarLayoutProps) {
  return (
    <Box
      style={style}
      sx={{
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)`,
        gridTemplateRows: 'minmax(0, 1fr)',
        gap: `${gap}px`,
        flex: 1,
        minHeight: 0,
        alignItems: 'stretch',
      }}
    >
      <Box sx={{ minHeight: 0 }}>
        <Box sx={{ position: 'sticky', top: stickyTop, height: '100%', minHeight: 0 }}>
          {sidebar}
        </Box>
      </Box>
      <Box sx={{ minWidth: 0, minHeight: 0 }}>{children}</Box>
    </Box>
  );
}
