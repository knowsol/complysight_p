'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';

export interface ConfirmModalProps {
  open: boolean;
  title: React.ReactNode;
  msg: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okLabel?: React.ReactNode;
  danger?: boolean;
}

export interface UnsavedConfirmProps {
  open: boolean;
  onDiscard?: () => void;
  onSave?: () => void;
}

export const ConfirmModal = ({ open, title, msg, onOk, onCancel, okLabel = '확인', danger = true }: ConfirmModalProps) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 360, boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: danger ? '#ef4444' : C.txH }}>{title}</div>
        <div style={{ fontSize: 15, color: C.txS, marginBottom: 24, lineHeight: 1.7 }}>{msg}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>취소</Button>
          <Button danger={danger} primary={!danger} onClick={onOk}>
            {okLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UnsavedConfirm = ({ open, onDiscard, onSave }: UnsavedConfirmProps) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 10, padding: '28px 28px 22px', width: 360, boxShadow: '0 20px 60px rgba(0,0,0,.2)', textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>수정 사항을 저장하겠습니까?</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>저장하지 않으면 변경 내용이 사라집니다.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={onDiscard}>저장 안함</Button>
          <Button primary onClick={onSave}>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};
