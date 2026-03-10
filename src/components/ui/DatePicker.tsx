'use client';

import Box from '@mui/material/Box';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

import { fieldInputStyle } from '@/components/ui/FormField';
import { C } from '@/lib/theme/colors';

const nativeFieldSx = {
  '&:focus': {
    borderColor: C.sec,
    outline: 'none',
  },
  '&:disabled': {
    backgroundColor: C.bgDis,
    color: C.txL,
    cursor: 'not-allowed',
  },
};

const buildFieldStyle = (style?: CSSProperties, disabled?: boolean, readOnly?: boolean): CSSProperties => ({
  ...fieldInputStyle,
  color: '#333333',
  background: disabled || readOnly ? C.bgDis : '#fff',
  cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
  ...style,
});

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
}

export function DatePicker({ value = '', onChange, placeholder = 'YYYY-MM-DD', disabled, readOnly, style }: DatePickerProps) {
  return (
    <Box
      component="input"
      type="date"
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      style={buildFieldStyle(style, disabled, readOnly)}
      sx={nativeFieldSx}
    />
  );
}

export interface DateRangePickerProps {
  from?: string;
  to?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  disabled?: boolean;
}

export function DateRangePicker({ from = '', to = '', onFromChange, onToChange, disabled }: DateRangePickerProps) {
  const handleFromChange = (v: string) => {
    onFromChange(v);
    if (to && v > to) onToChange(v);
  };
  const handleToChange = (v: string) => {
    onToChange(v);
    if (from && v < from) onFromChange(v);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <DatePicker value={from} onChange={handleFromChange} placeholder="시작일" disabled={disabled} style={{ width: 130 }} />
      <Box component="span" sx={{ color: C.txL, fontSize: 15, flexShrink: 0 }}>~</Box>
      <DatePicker value={to} onChange={handleToChange} placeholder="종료일" disabled={disabled} style={{ width: 130 }} />
    </Box>
  );
}

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  withSeconds?: boolean;
  style?: CSSProperties;
}

export function TimePicker({ value = '', onChange, placeholder = 'HH:MM', disabled, readOnly, withSeconds = false, style }: TimePickerProps) {
  return (
    <Box
      component="input"
      type="time"
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      step={withSeconds ? 1 : undefined}
      style={buildFieldStyle(style, disabled, readOnly)}
      sx={nativeFieldSx}
    />
  );
}

export interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function DateTimePicker({ value = '', onChange, disabled, readOnly }: DateTimePickerProps) {
  const [date, setDate] = useState(() => (value ? value.slice(0, 10) : ''));
  const [time, setTime] = useState(() => (value ? value.slice(11, 16) : ''));

  useEffect(() => {
    setDate(value ? value.slice(0, 10) : '');
    setTime(value ? value.slice(11, 16) : '');
  }, [value]);

  const update = (d: string, t: string) => {
    setDate(d);
    setTime(t);
    if (d && t) onChange?.(`${d} ${t}`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Box sx={{ flex: 3 }}>
        <DatePicker value={date} onChange={(d) => update(d, time)} disabled={disabled} readOnly={readOnly} />
      </Box>
      <Box sx={{ flex: 2 }}>
        <TimePicker value={time} onChange={(t) => update(date, t)} disabled={disabled} readOnly={readOnly} />
      </Box>
    </Box>
  );
}
