'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { CSSProperties, ReactNode } from 'react';

import { Btn } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE } from '@/lib/theme/styles';

export interface FormRowProps {
  label: ReactNode;
  required?: boolean;
  children?: ReactNode;
  half?: boolean;
  style?: CSSProperties;
}

export interface SecTitleProps {
  label: ReactNode;
  count?: number;
  primary?: boolean;
  buttons?: ReactNode;
  style?: CSSProperties;
}

export interface PanelFooterProps {
  onCancel?: () => void;
  onSave?: () => void;
  saveLabel?: ReactNode;
  extraLeft?: ReactNode;
}

export interface PanelDeleteBtnProps {
  onClick?: () => void;
}

export const FormRow = ({ label, required, children, half, style }: FormRowProps) => (
  <Box style={style} sx={{ mb: 1.75, display: half ? 'inline-flex' : 'flex', flexDirection: 'column', width: half ? 'calc(50% - 6px)' : '100%', mr: half ? 1.5 : 0, verticalAlign: 'top' }}>
    <Box component="label" style={LABEL_STYLE}>
      {label}
      {required && <Box component="span" sx={{ color: C.red, fontSize: 12, ml: 0.375 }}>*</Box>}
    </Box>
    {children}
  </Box>
);

export const SecTitle = ({ label, count, buttons, style }: SecTitleProps) => (
  <Box style={style} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 1.75 }}>
    <Typography sx={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: '#111111', pb: 0.625, borderBottom: `2px solid ${C.pri}`, minWidth: 60 }}>
      {label}
      {count != null && <Box component="span" sx={{ fontSize: 12, color: C.txL, fontWeight: 400, ml: 0.75 }}>총 {count}건</Box>}
    </Typography>
    {buttons && <Box sx={{ display: 'flex', gap: 0.5 }}>{buttons}</Box>}
  </Box>
);

export const PanelDeleteBtn = ({ onClick }: PanelDeleteBtnProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: -0.75 }}>
    <Btn sm outlineDanger onClick={onClick}>
      삭제
    </Btn>
  </Box>
);

export const PanelFooter = ({ onCancel, onSave, saveLabel = '저장', extraLeft }: PanelFooterProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, mt: 1, borderTop: `1px solid ${C.brd}` }}>
    <Box>{extraLeft}</Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Btn onClick={onCancel}>취소</Btn>
      <Btn primary onClick={onSave}>
        {saveLabel}
      </Btn>
    </Box>
  </Box>
);
