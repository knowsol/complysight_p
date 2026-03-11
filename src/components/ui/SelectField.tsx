'use client';

import { colors } from '@/lib/theme/colors';
import { fieldInputStyle } from '@/components/ui/FormField';
import React from 'react';
import type { CSSProperties, ChangeEventHandler, ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  style?: CSSProperties;
  children?: ReactNode;
}

export interface ReadOnlySelectProps {
  readOnly?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  style?: CSSProperties;
  children?: ReactNode;
  placeholder?: string;
}

const chevron =
  'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=")';

export const selectFieldStyle: CSSProperties = {
  ...fieldInputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage: chevron,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 32,
  cursor: 'pointer',
};

export function SelectField({ style, children, ...props }: SelectFieldProps) {
  return (
    <select
      style={{ ...selectFieldStyle, ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = colors.secondary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = colors.border;
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function ReadOnlySelect({ readOnly, value, onChange, style, children, placeholder }: ReadOnlySelectProps) {
  if (readOnly) {
    let label = String(value || placeholder || '');
    const extract = (ch: ReactNode) => {
      if (!ch) return;
      if (Array.isArray(ch)) {
        ch.forEach(extract);
        return;
      }
      if (typeof ch === 'object' && 'props' in ch && ch.props) {
        const option = ch as React.ReactElement<{ value?: unknown; children?: ReactNode }>;
        if (option.props.value !== undefined && String(option.props.value) === String(value)) {
          if (typeof option.props.children === 'string') label = option.props.children;
        }
        if (option.props.children) extract(option.props.children);
      }
    };
    try {
      extract(children);
    } catch (_e: unknown) {}

    return <input readOnly value={label} style={{ ...fieldInputStyle, background: '#F9FAFC', color: colors.text, cursor: 'default' }} />;
  }

  return React.createElement('select', { style: { ...style, backgroundImage: chevron }, value, onChange }, children);
}
