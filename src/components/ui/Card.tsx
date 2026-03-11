'use client';

import React from 'react';
import { colors } from '@/lib/theme/colors';

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card = ({ title, extra, children, style: cs, onClick }: CardProps) => (
  <div style={{ background: colors.white, borderRadius: 8, border: `1px solid ${colors.border}`, ...cs }}>
    {(title || extra) && (
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span onClick={onClick} style={{ fontSize: 15, fontWeight: 600, color: colors.textHeading, cursor: onClick ? 'pointer' : 'inherit' }}>
          {title}
          {onClick && <span style={{ fontSize: 12, color: colors.textLight, fontWeight: 400, marginLeft: 6 }}>→</span>}
        </span>
        {extra}
      </div>
    )}
    <div style={{ padding: 20, ...(cs?.flexDirection === 'column' ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' } : {}) }}>{children}</div>
  </div>
);
