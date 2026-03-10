'use client';

import { C } from '@/lib/theme/colors';
import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  width?: number;
  children?: ReactNode;
}

export function Modal({ open, onClose, title, width = 580, children }: ModalProps) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }} />
      <div style={{ position: 'relative', background: C.white, borderRadius: 8, width, maxWidth: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,.2)', animation: 'modalIn .2s ease' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
          <div
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txL, fontSize: 18 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '';
            }}
          >
            ✕
          </div>
        </div>
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}
