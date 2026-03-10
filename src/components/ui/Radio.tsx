'use client';

import React from 'react';
import { C } from '@/lib/theme/colors';

export interface RadioProps {
  options?: [string, string][];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export const Radio = ({ options = [['Y', '사용'], ['N', '미사용']], value, onChange, disabled }: RadioProps) => (
  <div style={{ display: 'flex', gap: 16 }}>
    {options.map(([v, l]) => (
      <label
        key={v}
        onClick={() => !disabled && onChange(v)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: disabled ? C.txL : C.txH, cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' }}
      >
        <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${value === v ? C.sec : C.brdD}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {value === v && <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.sec }} />}
        </div>
        {l}
      </label>
    ))}
  </div>
);
