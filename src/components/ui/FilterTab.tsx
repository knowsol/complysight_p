'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export interface FilterTabProps {
  options?: string[];
  value: string;
  onChange: (value: string) => void;
}

export const FilterTab = ({ options = ['전체', '사용', '미사용'], value, onChange }: FilterTabProps) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {options.map((v) => (
      <button
        key={v}
        onClick={() => onChange(v)}
        style={{ padding: '4px 12px', fontSize: 15, fontWeight: value === v ? 600 : 400, border: `1px solid ${value === v ? C.sec : C.brd}`, borderRadius: 5, background: value === v ? C.sec : '#fff', color: value === v ? '#fff' : C.txS, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
      >
        {v}
      </button>
    ))}
  </div>
);
