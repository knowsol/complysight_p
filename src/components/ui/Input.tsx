'use client';

import Box from '@mui/material/Box';
import React from 'react';

import { C } from '@/lib/theme/colors';
import { fInput, fSelect, fTextarea } from '@/lib/theme/styles';

export interface FInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: React.CSSProperties;
}

export interface FSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface FTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: React.CSSProperties;
}

export interface RoSelectProps {
  readOnly?: boolean;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
}

const fieldFocusSx = {
  '&:focus': {
    borderColor: C.sec,
    outline: 'none',
  },
};

export const FInput = ({ style, ...props }: FInputProps) => (
  <Box component="input" {...props} style={{ ...fInput, ...style }} sx={fieldFocusSx} />
);

export const FSelect = ({ style, children, ...props }: FSelectProps) => (
  <Box component="select" {...props} style={{ ...fSelect, ...style }} sx={fieldFocusSx}>
    {children}
  </Box>
);

export const FTextarea = ({ style, ...props }: FTextareaProps) => (
  <Box component="textarea" {...props} style={{ ...fTextarea, ...style }} sx={fieldFocusSx} />
);

export const RoSelect = ({ readOnly, value, onChange, style, children, placeholder }: RoSelectProps) => {
  if (readOnly) {
    let label = String(value || placeholder || '');

    const extract = (ch: React.ReactNode) => {
      if (!ch) return;
      if (Array.isArray(ch)) {
        ch.forEach(extract);
        return;
      }
      if (React.isValidElement(ch)) {
        const props = ch.props as { value?: unknown; children?: React.ReactNode };
        if (props.value !== undefined && String(props.value) === String(value) && typeof props.children === 'string') {
          label = props.children;
        }
        if (props.children) extract(props.children);
      }
    };

    try {
      extract(children);
    } catch (_e: unknown) {}

    return <Box component="input" readOnly value={label} style={{ ...fInput, background: '#F9FAFC', color: C.txt, cursor: 'default', ...style }} />;
  }

  return (
    <Box component="select" value={value} onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>} style={{ ...fSelect, ...style }} sx={fieldFocusSx}>
      {children}
    </Box>
  );
};
