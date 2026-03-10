'use client';

import React from 'react';
import { Btn } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE } from '@/lib/theme/styles';

export interface FormRowProps {
  label: React.ReactNode;
  required?: boolean;
  children?: React.ReactNode;
  half?: boolean;
  style?: React.CSSProperties;
}

export interface SecTitleProps {
  label: React.ReactNode;
  count?: number;
  primary?: boolean;
  buttons?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface PanelFooterProps {
  onCancel?: () => void;
  onSave?: () => void;
  saveLabel?: React.ReactNode;
  extraLeft?: React.ReactNode;
}

export interface PanelDeleteBtnProps {
  onClick?: () => void;
}

export const FormRow = ({ label, required, children, half, style: sx }: FormRowProps) => (
  <div style={{ marginBottom: 14, display: half ? 'inline-flex' : 'flex', flexDirection: 'column', width: half ? 'calc(50% - 6px)' : '100%', marginRight: half ? 12 : 0, verticalAlign: 'top', ...sx }}>
    <label style={{ ...LABEL_STYLE, gap: 3 }}>
      {label}
      {required && <span style={{ color: C.red, fontSize: 12 }}>*</span>}
    </label>
    {children}
  </div>
);

export const SecTitle = ({ label, count, buttons }: SecTitleProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
    <div style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: '#111111', paddingBottom: 5, borderBottom: `2px solid ${C.pri}`, minWidth: 60 }}>
      {label}
      {count != null && (
        <span style={{ fontSize: 12, color: C.txL, fontWeight: 400, marginLeft: 6 }}>총 {count}건</span>
      )}
    </div>
    {buttons && <div style={{ display: 'flex', gap: 4 }}>{buttons}</div>}
  </div>
);

export const PanelDeleteBtn = ({ onClick }: PanelDeleteBtnProps) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, marginTop: -6 }}>
    <Btn sm outlineDanger onClick={onClick}>
      삭제
    </Btn>
  </div>
);

export const PanelFooter = ({ onCancel, onSave, saveLabel = '저장', extraLeft }: PanelFooterProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 8, borderTop: `1px solid ${C.brd}` }}>
    <div>{extraLeft}</div>
    <div style={{ display: 'flex', gap: 8 }}>
      <Btn onClick={onCancel}>취소</Btn>
      <Btn primary onClick={onSave}>
        {saveLabel}
      </Btn>
    </div>
  </div>
);
