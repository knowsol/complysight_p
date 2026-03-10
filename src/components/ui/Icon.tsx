'use client';

import React from 'react';

export interface IconProps {
  n: string;
  s?: number;
  c?: string;
}

export type IcProps = IconProps;

const ICON_PATHS: Record<string, string> = {
  dash: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  db: 'M12 2C6.5 2 3 3.3 3 5v14c0 1.7 3.5 3 9 3s9-1.3 9-3V5c0-1.7-3.5-3-9-3zM3 12c0 1.7 3.5 3 9 3s9-1.3 9-3',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z',
  check: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01 9 11.01',
  alert: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  cal: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  menu: 'M3 12h18M3 6h18M3 18h18',
  out: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  down: 'M6 9l6 6 6-6',
  right: 'M9 18l6-6-6-6',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8',
  server: 'M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01',
  comp: 'M4 6h16M4 12h16M4 18h7',
  palette: 'M12 2a10 10 0 100 20 10 10 0 000-20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  layers: 'M2 12l10-8 10 8M4 10v10h16V10',
};

export const Icon = ({ n, s = 16, c = 'currentColor' }: IconProps) => {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[n] || ICON_PATHS.info} />
    </svg>
  );
};

export const Ic = Icon;
