'use client';

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

const _chevron = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=")';

export const FInput = ({ style, ...props }: FInputProps) => (
  <input
    style={{ ...fInput, ...style }}
    onFocus={(e) => {
      e.target.style.borderColor = C.sec;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = C.brd;
    }}
    {...props}
  />
);

export const FSelect = ({ style, children, ...props }: FSelectProps) => (
  <select
    style={{ ...fSelect, ...style }}
    onFocus={(e) => {
      e.target.style.borderColor = C.sec;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = C.brd;
    }}
    {...props}
  >
    {children}
  </select>
);

export const FTextarea = ({ style, ...props }: FTextareaProps) => (
  <textarea
    style={{ ...fTextarea, ...style }}
    onFocus={(e) => {
      e.target.style.borderColor = C.sec;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = C.brd;
    }}
    {...props}
  />
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

    return React.createElement('input', {
      readOnly: true,
      value: label,
      style: { ...fInput, background: '#F9FAFC', color: C.txt, cursor: 'default' },
    });
  }

  return React.createElement('select', { style: { ...style, backgroundImage: _chevron }, value, onChange }, children);
};
