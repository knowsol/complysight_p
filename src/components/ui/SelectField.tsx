'use client';

import Box from '@mui/material/Box';
import React from 'react';
import type { CSSProperties, ChangeEventHandler, ReactNode, SelectHTMLAttributes } from 'react';

import { fieldInputStyle } from '@/components/ui/FormField';
import { C } from '@/lib/theme/colors';

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

const focusSx = {
  '&:focus': {
    borderColor: C.sec,
    outline: 'none',
  },
};

export function SelectField({ style, children, ...props }: SelectFieldProps) {
  return (
    <Box component="select" {...props} style={{ ...selectFieldStyle, ...style }} sx={focusSx}>
      {children}
    </Box>
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
      if (React.isValidElement(ch)) {
        const props = ch.props as { value?: unknown; children?: ReactNode };
        if (props.value !== undefined && String(props.value) === String(value) && typeof props.children === 'string') {
          label = props.children;
        }
        if (props.children) extract(props.children);
      }
    };

    try {
      extract(children);
    } catch (_e: unknown) {}

    return <Box component="input" readOnly value={label} style={{ ...fieldInputStyle, background: '#F9FAFC', color: C.txt, cursor: 'default', ...style }} />;
  }

  return (
    <Box component="select" value={value} onChange={onChange as ChangeEventHandler<HTMLSelectElement>} style={{ ...selectFieldStyle, ...style }} sx={focusSx}>
      {children}
    </Box>
  );
}
