'use client';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface PageHeaderProps {
  title: ReactNode;
  bc?: string;
  extra?: ReactNode;
}

export const PH = ({ title, bc, extra }: PageHeaderProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography component="h1" sx={{ m: 0, fontSize: 24, fontWeight: 600, color: C.txH, lineHeight: '32px' }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {extra}
      {bc && (
        <Breadcrumbs separator="›" sx={{ fontSize: 12, color: C.txL }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: C.txL }}>
            <HomeRoundedIcon sx={{ fontSize: 14 }} />
          </Box>
          {bc.split(' > ').map((b, i, arr) => (
            <Typography key={i} sx={{ fontSize: 12, color: i === arr.length - 1 ? C.txS : C.txL }}>
              {b}
            </Typography>
          ))}
        </Breadcrumbs>
      )}
    </Box>
  </Box>
);
