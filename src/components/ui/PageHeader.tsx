'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export interface PageHeaderProps {
  title: React.ReactNode;
  bc?: string;
  extra?: React.ReactNode;
}

export const PageHeader = ({ title, bc, extra }: PageHeaderProps) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: C.txH, lineHeight: '32px' }}>{title}</h1>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {extra}
      {bc && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.txL }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          {bc.split(' > ').map((b, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <span style={{ color: C.txX }}>›</span>}
              <span style={{ color: i === arr.length - 1 ? C.txS : C.txL }}>{b}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const PH = PageHeader;
