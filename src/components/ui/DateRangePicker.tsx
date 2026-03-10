'use client';

import React from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { C } from '@/lib/theme/colors';

export interface DateRangePickerProps {
  from?: string;
  to?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  disabled?: boolean;
}

export const DateRangePicker = ({ from = '', to = '', onFromChange, onToChange, disabled }: DateRangePickerProps) => {
  const handleFromChange = (v: string) => {
    onFromChange(v);
    if (to && v > to) onToChange(v);
  };

  const handleToChange = (v: string) => {
    onToChange(v);
    if (from && v < from) onFromChange(v);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DatePicker value={from} onChange={handleFromChange} placeholder="시작일" disabled={disabled} style={{ width: 130 }} />
      <span style={{ color: C.txL, fontSize: 15, flexShrink: 0 }}>~</span>
      <DatePicker value={to} onChange={handleToChange} placeholder="종료일" disabled={disabled} style={{ width: 130 }} />
    </div>
  );
};
