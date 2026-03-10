'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export interface BtnProps {
  children?: React.ReactNode;
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
  style?: React.CSSProperties;
  disabled?: boolean;
}

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

export const Btn = ({ children, primary, danger, success, outline, outlineDanger, ghost, sm, xs, small, onClick, style: cs, disabled }: BtnProps) => {
  const size = xs ? 'xs' : sm || small ? 'sm' : 'md';
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
    ...(size === 'md' ? { padding: '10px 20px', fontSize: 13 } : size === 'sm' ? { padding: '7px 14px', fontSize: 12 } : { padding: '5px 10px', fontSize: 12 }),
    ...cs,
  };

  if (primary) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: C.sec, color: '#fff' }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#3a6cc8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.sec;
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#3a6cc8';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = C.sec;
        }}
      >
        {children}
      </button>
    );
  }
  if (success) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: C.green, color: '#fff' }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#148132';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.green;
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#14813c';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = C.green;
        }}
      >
        {children}
      </button>
    );
  }
  if (danger) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: '#E24949', color: '#fff' }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#c93d3d';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#E24949';
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#c93d3d';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = '#E24949';
        }}
      >
        {children}
      </button>
    );
  }
  if (outline) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: '#fff', color: C.sec, border: '1px solid rgb(215,215,215)' }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#eef3ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#eef3ff';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        {children}
      </button>
    );
  }
  if (outlineDanger) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: '#fff', color: '#E24949', border: '1px solid #E24949' }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#fff1f1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#fff1f1';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        {children}
      </button>
    );
  }
  if (ghost) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: 'none', color: C.pri, border: `1px solid ${C.pri}` }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#eef3ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.background = '#eef3ff';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = 'none';
        }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, background: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = '#f1f5f9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.background = '#f1f5f9';
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = '#fff';
      }}
    >
      {children}
    </button>
  );
};

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
  <Btn onClick={onClick} outline>
    {children}
  </Btn>
);

export const SecBtnP = ({ children, onClick, style: sx }: SecBtnPProps) => (
  <Btn onClick={onClick} primary style={sx}>
    {children}
  </Btn>
);
