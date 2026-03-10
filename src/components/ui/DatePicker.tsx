'use client';

import { useEffect, useRef, useState } from 'react';
import { C } from '@/lib/theme/colors';
import { FormInput, fieldInputStyle } from '@/components/ui/FormField';
import type { CSSProperties, ChangeEvent } from 'react';

const calNavBtn: CSSProperties = {
  width: 24,
  height: 24,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  fontSize: 13,
  color: C.txS,
  fontFamily: 'inherit',
  transition: 'background .15s',
};

const calDayBtn: CSSProperties = {
  width: '100%',
  aspectRatio: '1',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 4,
  fontSize: 13,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background .15s',
};

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
}

export function DatePicker({ value = '', onChange, placeholder = 'YYYY-MM-DD', disabled, readOnly, style: sx }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (value ? +value.slice(0, 4) : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? +value.slice(5, 7) - 1 : new Date().getMonth()));
  const [yearMode, setYearMode] = useState(false);
  const [directInput, setDirectInput] = useState('');
  const [dropUp, setDropUp] = useState(false);
  const [dropLeft, setDropLeft] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const calWidth = 240;
    const calHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    setDropUp(spaceBelow < calHeight && spaceAbove > spaceBelow);
    setDropLeft(spaceRight < calWidth);
  }, [open]);

  const openCal = () => {
    if (disabled || readOnly) return;
    const now = new Date();
    const isValidDate = value && /^\d{4}-\d{2}-\d{2}/.test(value);
    if (isValidDate) {
      setViewYear(+value.slice(0, 4));
      setViewMonth(+value.slice(5, 7) - 1);
    } else {
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
    }
    setYearMode(false);
    setDirectInput(isValidDate ? value : '');
    setOpen(true);
  };

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const select = (d: number) => {
    const v = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange?.(v);
    setOpen(false);
  };

  const handleDirectInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length >= 5) formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    if (raw.length >= 7) formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6)}`;
    setDirectInput(formatted);
  };

  const applyDirectInput = () => {
    const raw = directInput.replace(/-/g, '');
    if (raw.length === 8) {
      const y = +raw.slice(0, 4);
      const m = +raw.slice(4, 6);
      const d = +raw.slice(6, 8);
      const date = new Date(y, m - 1, d);
      if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
        const v = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        onChange?.(v);
        setViewYear(y);
        setViewMonth(m - 1);
        setOpen(false);
      }
    }
  };

  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const yearStart = viewYear - (viewYear % 10);
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i);

  const inputStyle = {
    ...fieldInputStyle,
    paddingRight: 36,
    cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
    background: disabled || readOnly ? C.bgDis : '#fff',
    color: value ? C.txt : C.txL,
    ...sx,
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: sx?.width ?? '100%' }}>
      <div style={{ position: 'relative' }}>
        <FormInput readOnly value={value || ''} placeholder={placeholder} onClick={openCal} disabled={disabled} style={inputStyle} />
        <span
          onClick={openCal}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: disabled || readOnly ? 'default' : 'pointer', display: 'flex', alignItems: 'center', pointerEvents: disabled || readOnly ? 'none' : 'auto' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke={C.txL} strokeWidth="1.2" />
            <path d="M1.5 6.5h13" stroke={C.txL} strokeWidth="1.2" />
            <path d="M5 1v3M11 1v3" stroke={C.txL} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            ...(dropUp ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }),
            ...(dropLeft ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
            zIndex: 1200,
            background: '#fff',
            border: `1px solid ${C.brd}`,
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            padding: 12,
            minWidth: 240,
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            {!yearMode ? (
              <>
                <button
                  onClick={() => {
                    if (viewMonth === 0) {
                      setViewMonth(11);
                      setViewYear((y) => y - 1);
                    } else setViewMonth((m) => m - 1);
                  }}
                  style={{ ...calNavBtn }}
                >
                  &lt;
                </button>
                <span
                  onClick={() => setYearMode(true)}
                  style={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: 'pointer', padding: '2px 8px', borderRadius: 4, transition: 'background .15s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  {viewYear}년 {MONTHS[viewMonth]}
                </span>
                <button
                  onClick={() => {
                    if (viewMonth === 11) {
                      setViewMonth(0);
                      setViewYear((y) => y + 1);
                    } else setViewMonth((m) => m + 1);
                  }}
                  style={{ ...calNavBtn }}
                >
                  &gt;
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setViewYear((y) => y - 10)} style={{ ...calNavBtn }}>
                  &lt;
                </button>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>
                  {yearStart} - {yearStart + 11}
                </span>
                <button onClick={() => setViewYear((y) => y + 10)} style={{ ...calNavBtn }}>
                  &gt;
                </button>
              </>
            )}
          </div>

          {yearMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setViewYear(y);
                    setYearMode(false);
                  }}
                  style={{ ...calDayBtn, background: y === viewYear ? C.sec : 'none', color: y === viewYear ? '#fff' : C.txt, fontWeight: y === viewYear ? 600 : 400, borderRadius: 6 }}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                {DAYS.map((d, i) => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: i === 0 ? '#E24949' : i === 6 ? '#457CE1' : C.txL, padding: '2px 0' }}>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array(Math.max(0, firstDay(viewYear, viewMonth) || 0))
                  .fill(null)
                  .map((_, i) => (
                    <div key={`e${i}`} />
                  ))}
                {Array(Math.max(1, daysInMonth(viewYear, viewMonth) || 28))
                  .fill(null)
                  .map((_, i) => {
                    const d = i + 1;
                    const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isSelected = ds === value;
                    const isToday = ds === todayStr;
                    const dow = (firstDay(viewYear, viewMonth) + i) % 7;
                    return (
                      <button
                        key={d}
                        onClick={() => select(d)}
                        style={{
                          ...calDayBtn,
                          background: isSelected ? C.sec : 'none',
                          color: isSelected ? '#fff' : dow === 0 ? '#E24949' : dow === 6 ? '#457CE1' : C.txt,
                          fontWeight: isSelected || isToday ? 600 : 400,
                          outline: isToday && !isSelected ? `2px solid ${C.sec}` : 'none',
                          outlineOffset: -2,
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
              </div>
            </>
          )}

          <div style={{ borderTop: `1px solid ${C.brd}`, marginTop: 8, paddingTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FormInput
              value={directInput}
              onChange={handleDirectInput}
              onKeyDown={(e) => e.key === 'Enter' && applyDirectInput()}
              onBlur={applyDirectInput}
              placeholder="YYYY-MM-DD"
              style={{ flex: 1, padding: '4px 8px', fontSize: 14, border: `1px solid ${C.brd}`, borderRadius: 4, outline: 'none', fontFamily: 'inherit', color: C.txt, boxSizing: 'border-box' }}
            />
            <button
              onClick={() => {
                onChange?.(todayStr);
                setDirectInput(todayStr);
                setOpen(false);
              }}
              style={{ fontSize: 12, color: C.sec, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, flexShrink: 0 }}
            >
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DatePicker value={from} onChange={handleFromChange} placeholder="시작일" disabled={disabled} style={{ width: 130 }} />
      <span style={{ color: C.txL, fontSize: 15, flexShrink: 0 }}>~</span>
      <DatePicker value={to} onChange={handleToChange} placeholder="종료일" disabled={disabled} style={{ width: 130 }} />
    </div>
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

export function TimePicker({ value = '', onChange, placeholder = 'HH:MM', disabled, readOnly, withSeconds = false, style: sx }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [dropLeft, setDropLeft] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parse = (v: string) => {
    if (!v) return { h: 0, m: 0, s: 0 };
    const p = v.split(':');
    return { h: +p[0] || 0, m: +p[1] || 0, s: +p[2] || 0 };
  };
  const fmt = (h: number, m: number, s: number) => (withSeconds ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);

  const { h: selH, m: selM, s: selS } = parse(value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const calWidth = 220;
    const calHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    setDropUp(spaceBelow < calHeight && spaceAbove > spaceBelow);
    setDropLeft(spaceRight < calWidth);
  }, [open]);

  const inputStyle = {
    ...fieldInputStyle,
    paddingRight: 36,
    cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
    background: disabled || readOnly ? C.bgDis : '#fff',
    color: value ? C.txt : C.txL,
    ...sx,
  };

  const ColScroll = ({ label, items, selected, onSelect }: { label: string; items: number[]; selected: number; onSelect: (value: number) => void }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.txS, marginBottom: 4, display: 'flex', alignItems: 'center', lineHeight: 1.4, minHeight: 18 }}>{label}</div>
      <div style={{ height: 180, overflowY: 'auto', width: '100%', scrollbarWidth: 'thin', scrollbarColor: `${C.brd} transparent` }}>
        {items.map((v) => (
          <div
            key={v}
            onClick={() => onSelect(v)}
            style={{ padding: '6px 0', textAlign: 'center', cursor: 'pointer', fontSize: 15, fontFamily: 'inherit', borderRadius: 4, background: v === selected ? C.sec : 'none', color: v === selected ? '#fff' : C.txt, fontWeight: v === selected ? 600 : 400, transition: 'background .1s' }}
            onMouseEnter={(e) => {
              if (v !== selected) e.currentTarget.style.background = C.secL;
            }}
            onMouseLeave={(e) => {
              if (v !== selected) e.currentTarget.style.background = 'none';
            }}
          >
            {String(v).padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const now = new Date();
  const setNow = () => {
    onChange?.(fmt(now.getHours(), now.getMinutes(), withSeconds ? now.getSeconds() : 0));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: sx?.width ?? '100%' }}>
      <div style={{ position: 'relative' }}>
        <FormInput readOnly value={value || ''} placeholder={placeholder} onClick={() => !disabled && !readOnly && setOpen((o) => !o)} disabled={disabled} style={inputStyle} />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={C.txL} strokeWidth="1.2" />
            <path d="M8 4.5v4l2.5 2" stroke={C.txL} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            ...(dropUp ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }),
            ...(dropLeft ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
            zIndex: 1200,
            background: '#fff',
            border: `1px solid ${C.brd}`,
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            padding: '12px 8px',
            minWidth: withSeconds ? 220 : 160,
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', borderBottom: `1px solid ${C.brd}`, paddingBottom: 8, marginBottom: 8 }}>
            <ColScroll label="시" items={hours} selected={selH} onSelect={(h) => onChange?.(fmt(h, selM, selS))} />
            <div style={{ width: 1, background: C.brd, alignSelf: 'stretch', margin: '20px 0 0' }} />
            <ColScroll label="분" items={minutes} selected={selM} onSelect={(m) => onChange?.(fmt(selH, m, selS))} />
            {withSeconds && (
              <>
                <div style={{ width: 1, background: C.brd, alignSelf: 'stretch', margin: '20px 0 0' }} />
                <ColScroll label="초" items={seconds} selected={selS} onSelect={(s) => onChange?.(fmt(selH, selM, s))} />
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <button style={{ fontSize: 12, color: C.sec, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }} onClick={setNow}>
              현재 시각
            </button>
            <button style={{ fontSize: 12, color: '#fff', background: C.sec, border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }} onClick={() => setOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
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

  const update = (d: string, t: string) => {
    if (d && t) onChange?.(`${d} ${t}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div style={{ flex: 3 }}>
        <DatePicker
          value={date}
          onChange={(d) => {
            setDate(d);
            update(d, time);
          }}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
      <div style={{ flex: 2 }}>
        <TimePicker
          value={time}
          onChange={(t) => {
            setTime(t);
            update(date, t);
          }}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
