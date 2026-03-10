'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { Ic } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  color?: string;
  icon: string;
  onClick?: () => void;
}

export const Stat = ({ label, value, color, icon, onClick }: StatProps) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: '20px 24px',
      flex: 1,
      minWidth: 140,
      cursor: onClick ? 'pointer' : 'default',
      borderRadius: 1,
      border: `1px solid ${C.brd}`,
      transition: 'box-shadow .2s ease',
      '&:hover': onClick ? { boxShadow: '0 2px 12px rgba(0,0,0,.1)' } : undefined,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography sx={{ fontSize: 12, color: C.txL, mb: 1, fontWeight: 500 }}>{label}</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: color || C.txH }}>{value}</Typography>
      </Box>
      <Box sx={{ width: 46, height: 46, borderRadius: 2.5, background: `${color || C.pri}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ic n={icon} s={22} c={color || C.pri} />
      </Box>
    </Box>
  </Paper>
);
