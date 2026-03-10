'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  children?: ReactNode;
  half?: boolean;
  style?: CSSProperties;
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  style?: CSSProperties;
}

export const fieldInputStyle: CSSProperties = {
  width: '100%',
  padding: '6px 12px',
  border: `1px solid ${C.brd}`,
  borderRadius: 4,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
  color: C.txt,
  fontFamily: 'inherit',
  transition: 'border-color .15s',
  minHeight: 36,
};

export function FormField({ label, required, children, half, style }: FormFieldProps) {
  return (
    <Box
      style={style}
      sx={{
        mb: 1.75,
        display: half ? 'inline-flex' : 'flex',
        flexDirection: 'column',
        width: half ? 'calc(50% - 6px)' : '100%',
        mr: half ? 1.5 : 0,
        verticalAlign: 'top',
      }}
    >
      <Typography component="label" sx={{ fontSize: 11, fontWeight: 600, color: C.txS, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.375, lineHeight: 1.4, minHeight: 18 }}>
        {label}
        {required && <Box component="span" sx={{ color: C.red, fontSize: 12 }}>*</Box>}
      </Typography>
      {children}
    </Box>
  );
}

export function FormInput({ style, ...props }: FormInputProps) {
  return (
    <Box
      component="input"
      {...props}
      style={{ ...fieldInputStyle, ...style }}
      sx={{
        '&:focus': {
          borderColor: C.sec,
          outline: 'none',
        },
      }}
    />
  );
}
