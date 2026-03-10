'use client';

import Switch from '@mui/material/Switch';

import { C } from '@/lib/theme/colors';

export interface ToggleProps {
  on: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Toggle = ({ on, onClick, disabled }: ToggleProps) => (
  <Switch
    checked={on}
    onChange={() => onClick?.()}
    disabled={disabled}
    size="small"
    sx={{
      width: 44,
      height: 24,
      p: 0,
      '& .MuiSwitch-switchBase': {
        p: '3px',
        '&.Mui-checked': {
          transform: 'translateX(20px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            bgcolor: C.sec,
            opacity: 1,
          },
        },
      },
      '& .MuiSwitch-thumb': {
        width: 18,
        height: 18,
      },
      '& .MuiSwitch-track': {
        borderRadius: 12,
        bgcolor: C.brdD,
        opacity: 1,
      },
    }}
  />
);
