'use client';

import React, { useState } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';

export interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const DateTimePicker = ({ value = '', onChange, disabled, readOnly }: DateTimePickerProps) => {
  const [date, setDate] = useState(() => (value ? value.slice(0, 10) : ''));
  const [time, setTime] = useState(() => (value ? value.slice(11, 16) : ''));
  const update = (d: string, t: string) => {
    if (d && t) onChange?.(`${d} ${t}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div style={{ flex: 3 }}>
        <DatePicker value={date} onChange={(d) => { setDate(d); update(d, time); }} disabled={disabled} readOnly={readOnly} />
      </div>
      <div style={{ flex: 2 }}>
        <TimePicker value={time} onChange={(t) => { setTime(t); update(date, t); }} disabled={disabled} readOnly={readOnly} />
      </div>
    </div>
  );
};
