'use client';

import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { CSSProperties, ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface BtnProps {
  children?: ReactNode;
  primary?: boolean;
  danger?: boolean;
  success?: boolean;
  outline?: boolean;
  outlineDanger?: boolean;
  ghost?: boolean;
  sm?: boolean;
  xs?: boolean;
  small?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export interface SimpleButtonProps {
  onClick?: () => void;
}

export interface SecBtnOProps {
  children?: ReactNode;
  onClick?: () => void;
}

export interface SecBtnPProps {
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export const Btn = ({ children, primary, danger, success, outline, outlineDanger, ghost, sm, xs, small, onClick, style, disabled }: BtnProps) => {
  const size = xs ? 'small' : sm || small ? 'small' : 'medium';
  const variant = primary || success || danger ? 'contained' : 'outlined';
  const sx = primary
    ? { bgcolor: C.sec, color: '#fff', borderColor: C.sec, '&:hover': { bgcolor: '#3a6cc8', borderColor: '#3a6cc8' } }
    : success
      ? { bgcolor: C.green, color: '#fff', borderColor: C.green, '&:hover': { bgcolor: '#14813c', borderColor: '#14813c' } }
      : danger
        ? { bgcolor: C.red, color: '#fff', borderColor: C.red, '&:hover': { bgcolor: '#c93d3d', borderColor: '#c93d3d' } }
        : outlineDanger
          ? { bgcolor: '#fff', color: C.red, borderColor: C.red, '&:hover': { bgcolor: '#fff1f1', borderColor: C.red } }
          : ghost
            ? { bgcolor: 'transparent', color: C.pri, borderColor: C.pri, '&:hover': { bgcolor: C.priL, borderColor: C.pri } }
            : outline
              ? { bgcolor: '#fff', color: C.sec, borderColor: C.brdD, '&:hover': { bgcolor: '#eef3ff', borderColor: C.brdD } }
              : { bgcolor: '#fff', color: '#64748b', borderColor: '#e2e8f0', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#e2e8f0' } };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      style={style}
      sx={{
        minWidth: 0,
        px: size === 'medium' ? 2.5 : xs ? 1.25 : 1.75,
        py: size === 'medium' ? 1.2 : xs ? 0.65 : 0.85,
        lineHeight: 1,
        fontSize: size === 'medium' ? 13 : 12,
        fontWeight: 600,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export const SearchBtn = ({ onClick }: SimpleButtonProps) => (
  <Button
    onClick={onClick}
    variant="outlined"
    sx={{
      minHeight: 36,
      px: 2.5,
      color: C.sec,
      borderColor: C.sec,
      whiteSpace: 'nowrap',
      '&:hover': {
        bgcolor: C.sec,
        color: '#fff',
        borderColor: C.sec,
      },
    }}
  >
    검색
  </Button>
);

export const RefreshBtn = ({ onClick }: SimpleButtonProps) => (
  <IconButton
    onClick={onClick}
    title="초기화"
    sx={{
      width: 40,
      height: 36,
      border: `1px solid ${C.pri}`,
      borderRadius: 1,
      color: C.pri,
      '&:hover': { bgcolor: C.priL },
    }}
  >
    <RefreshRoundedIcon fontSize="small" />
  </IconButton>
);

export const SecBtnO = ({ children, onClick }: SecBtnOProps) => (
  <Btn onClick={onClick} outline>
    {children}
  </Btn>
);

export const SecBtnP = ({ children, onClick, style }: SecBtnPProps) => (
  <Btn onClick={onClick} primary style={style}>
    {children}
  </Btn>
);
