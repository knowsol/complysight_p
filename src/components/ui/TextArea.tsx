'use client';

import { C } from '@/lib/theme/colors';
import { fieldInputStyle } from '@/components/ui/FormField';
import type { CSSProperties, TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: CSSProperties;
}

export const textAreaStyle: CSSProperties = {
  ...fieldInputStyle,
  minHeight: 72,
  resize: 'vertical',
  fontFamily: 'inherit',
};

export function TextArea({ style, ...props }: TextAreaProps) {
  return (
    <textarea
      style={{ ...textAreaStyle, ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = C.sec;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.brd;
      }}
      {...props}
    />
  );
}
