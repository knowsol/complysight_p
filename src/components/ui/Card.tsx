'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card = ({ title, extra, children, style: cs, onClick }: CardProps) => (
  <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, ...cs }}>
    {(title || extra) && (
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span onClick={onClick} style={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: onClick ? 'pointer' : 'inherit' }}>
          {title}
          {onClick && <span style={{ fontSize: 12, color: C.txL, fontWeight: 400, marginLeft: 6 }}>→</span>}
        </span>
        {extra}
      </div>
    )}
    <div style={{ padding: 20, ...(cs?.flexDirection === 'column' ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' } : {}) }}>{children}</div>
  </div>
);
