'use client';

import { colors } from '@/lib/theme/colors';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

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
  border: `1px solid ${colors.border}`,
  borderRadius: 4,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
  color: colors.text,
  fontFamily: 'inherit',
  transition: 'border-color .15s',
  minHeight: 36,
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1.4,
  minHeight: 18,
};

export function FormField({ label, required, children, half, style: sx }: FormFieldProps) {
  return (
    <div
      style={{
        marginBottom: 14,
        display: half ? 'inline-flex' : 'flex',
        flexDirection: 'column',
        width: half ? 'calc(50% - 6px)' : '100%',
        marginRight: half ? 12 : 0,
        verticalAlign: 'top',
        ...sx,
      }}
    >
      <label style={{ ...labelStyle, gap: 3 }}>
        {label}
        {required && <span style={{ color: colors.red, fontSize: 12 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export function FormInput({ style, ...props }: FormInputProps) {
  return (
    <input
      style={{ ...fieldInputStyle, ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = colors.secondary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = colors.border;
      }}
      {...props}
    />
  );
}
