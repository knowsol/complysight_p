'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FInput } from '@/components/ui/Input';
import { C } from '@/lib/theme/colors';
import { fInput, LABEL_STYLE } from '@/lib/theme/styles';

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  withSeconds?: boolean;
  style?: React.CSSProperties;
}

interface ColScrollProps {
  label: string;
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
}

export const TimePicker = ({ value = '', onChange, placeholder = 'HH:MM', disabled, readOnly, withSeconds = false, style: sx }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [dropLeft, setDropLeft] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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

  const inputStyle: React.CSSProperties = {
    ...fInput,
    paddingRight: 36,
    cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
    background: disabled || readOnly ? C.bgDis : '#fff',
    color: value ? C.txt : C.txL,
    ...sx,
  };

  const ColScroll = ({ label, items, selected, onSelect }: ColScrollProps) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{ ...LABEL_STYLE }}>{label}</div>
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
        <FInput readOnly value={value || ''} placeholder={placeholder} onClick={() => { if (!disabled && !readOnly) setOpen((o) => !o); }} disabled={disabled} style={inputStyle} />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={C.txL} strokeWidth="1.2" />
            <path d="M8 4.5v4l2.5 2" stroke={C.txL} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {open && (
        <div style={{ position: 'absolute', ...(dropUp ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }), ...(dropLeft ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }), zIndex: 1200, background: '#fff', border: `1px solid ${C.brd}`, borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.12)', padding: '12px 8px', minWidth: withSeconds ? 220 : 160, userSelect: 'none' }}>
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
            <button onClick={setNow} style={{ fontSize: 12, color: C.sec, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              현재 시각
            </button>
            <button onClick={() => setOpen(false)} style={{ fontSize: 12, color: '#fff', background: C.sec, border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
