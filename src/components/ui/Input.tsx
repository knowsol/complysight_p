'use client';

import React from 'react';
import { colors } from '@/lib/theme/colors';
import { fInput, fSelect, fTextarea } from '@/lib/theme/styles';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: React.CSSProperties;
}

export type FInputProps = FormInputProps;

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type FSelectProps = FormSelectProps;

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: React.CSSProperties;
}

export type FTextareaProps = FormTextareaProps;

export interface ReadOnlySelectProps {
  readOnly?: boolean;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
}

export type RoSelectProps = ReadOnlySelectProps;

const _chevron = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=")';

export const FormInput = ({ style, ...props }: FormInputProps) => (
  <input
    style={{ ...fInput, ...style }}
    onFocus={(e) => {
      e.target.style.borderColor = colors.secondary;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = colors.border;
    }}
    {...props}
  />
);

export const FormSelect = ({ style, children, ...props }: FormSelectProps) => (
  <select
    style={{ ...fSelect, ...style }}
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

export const FormTextarea = ({ style, ...props }: FormTextareaProps) => (
  <textarea
    style={{ ...fTextarea, ...style }}
    onFocus={(e) => {
      e.target.style.borderColor = colors.secondary;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = colors.border;
    }}
    {...props}
  />
);

export const ReadOnlySelect = ({ readOnly, value, onChange, style, children, placeholder }: ReadOnlySelectProps) => {
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
      style: { ...fInput, background: '#F9FAFC', color: colors.text, cursor: 'default' },
    });
  }

  return React.createElement('select', { style: { ...style, backgroundImage: _chevron }, value, onChange }, children);
};

export const FInput = FormInput;
export const FSelect = FormSelect;
export const FTextarea = FormTextarea;
export const RoSelect = ReadOnlySelect;
