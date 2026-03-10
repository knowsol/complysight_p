'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'success' | 'outline' | 'outlineDanger' | 'ghost';
export type ButtonSize = 'md' | 'sm' | 'xs';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  primary?: boolean;
  danger?: boolean;
  success?: boolean;
  outline?: boolean;
  outlineDanger?: boolean;
  ghost?: boolean;
  sm?: boolean;
  xs?: boolean;
  small?: boolean;
}

export type BtnProps = ButtonProps;

export interface SimpleButtonProps {
  onClick?: () => void;
}

export interface SecBtnOProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface SecBtnPProps {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const getButtonSize = ({ size, xs, sm, small }: Pick<ButtonProps, 'size' | 'xs' | 'sm' | 'small'>): ButtonSize => {
  if (size) return size;
  if (xs) return 'xs';
  if (sm || small) return 'sm';
  return 'md';
};

const getButtonVariant = ({ variant, primary, danger, success, outline, outlineDanger, ghost }: Pick<ButtonProps, 'variant' | 'primary' | 'danger' | 'success' | 'outline' | 'outlineDanger' | 'ghost'>): ButtonVariant => {
  if (variant) return variant;
  if (primary) return 'primary';
  if (success) return 'success';
  if (danger) return 'danger';
  if (outlineDanger) return 'outlineDanger';
  if (outline) return 'outline';
  if (ghost) return 'ghost';
  return 'default';
};

const VARIANT_STYLES: Record<ButtonVariant, { style: React.CSSProperties; hoverBackground: string }> = {
  default: {
    style: { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0' },
    hoverBackground: '#f1f5f9',
  },
  primary: {
    style: { background: C.sec, color: '#fff' },
    hoverBackground: '#3a6cc8',
  },
  success: {
    style: { background: C.green, color: '#fff' },
    hoverBackground: '#14813c',
  },
  danger: {
    style: { background: '#E24949', color: '#fff' },
    hoverBackground: '#c93d3d',
  },
  outline: {
    style: { background: '#fff', color: C.sec, border: '1px solid rgb(215,215,215)' },
    hoverBackground: '#eef3ff',
  },
  outlineDanger: {
    style: { background: '#fff', color: '#E24949', border: '1px solid #E24949' },
    hoverBackground: '#fff1f1',
  },
  ghost: {
    style: { background: 'transparent', color: C.pri, border: `1px solid ${C.pri}` },
    hoverBackground: '#eef3ff',
  },
};

export const Button = ({ children, variant, size, primary, danger, success, outline, outlineDanger, ghost, sm, xs, small, style: customStyle, disabled, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }: ButtonProps) => {
  const resolvedSize = getButtonSize({ size, xs, sm, small });
  const resolvedVariant = getButtonVariant({ variant, primary, danger, success, outline, outlineDanger, ghost });
  const variantStyle = VARIANT_STYLES[resolvedVariant];
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    borderRadius: 4,
    lineHeight: 1,
    fontFamily: 'inherit',
    fontWeight: 600,
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.45 : 1,
    ...(resolvedSize === 'md' ? { padding: '10px 20px', fontSize: 13 } : resolvedSize === 'sm' ? { padding: '7px 14px', fontSize: 12 } : { padding: '5px 10px', fontSize: 12 }),
    ...variantStyle.style,
    ...customStyle,
  };

  return (
    <button
      disabled={disabled}
      {...props}
      style={base}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = variantStyle.hoverBackground;
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = String(variantStyle.style.background ?? 'transparent');
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.background = variantStyle.hoverBackground;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = String(variantStyle.style.background ?? 'transparent');
        onBlur?.(e);
      }}
    >
      {children}
    </button>
  );
};

export const Btn = Button;

export const SearchBtn = ({ onClick }: SimpleButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: '#fff',
      border: `1px solid ${C.sec}`,
      color: C.sec,
      borderRadius: 4,
      padding: '0 20px',
      fontSize: 15,
      fontWeight: 500,
      height: '100%',
      minHeight: 36,
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.sec;
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fff';
      e.currentTarget.style.color = C.sec;
    }}
  >
    검색
  </button>
);

export const RefreshBtn = ({ onClick }: SimpleButtonProps) => (
  <button
    onClick={onClick}
    title="초기화"
    style={{
      width: 40,
      height: '100%',
      minHeight: 36,
      border: `1px solid ${C.pri}`,
      borderRadius: 4,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.priL;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fff';
    }}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

export const SecBtnO = ({ children, onClick }: SecBtnOProps) => (
  <Button onClick={onClick} variant="outline">
    {children}
  </Button>
);

export const SecBtnP = ({ children, onClick, style: sx }: SecBtnPProps) => (
  <Button onClick={onClick} variant="primary" style={sx}>
    {children}
  </Button>
);
