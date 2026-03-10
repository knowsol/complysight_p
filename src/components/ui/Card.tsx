'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { CSSProperties, ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export const Card = ({ title, extra, children, style, onClick }: CardProps) => (
  <Paper elevation={0} style={style} sx={{ borderRadius: 1, border: `1px solid ${C.brd}`, overflow: 'hidden' }}>
    {(title || extra) && (
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Typography onClick={onClick} sx={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: onClick ? 'pointer' : 'inherit' }}>
          {title}
          {onClick && <Box component="span" sx={{ fontSize: 12, color: C.txL, fontWeight: 400, ml: 0.75 }}>→</Box>}
        </Typography>
        {extra}
      </Box>
    )}
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Paper>
);
