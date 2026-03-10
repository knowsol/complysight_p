'use client';

import { C } from '@/lib/theme/colors';
import type { ReactNode } from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

function ArrowIcon({ d }: { d: string }) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pb = (icon: ReactNode, disabled: boolean, onClick: () => void) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        background: 'none',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        color: disabled ? C.txX : C.txS,
        padding: 0,
      }}
    >
      {icon}
    </button>
  );

  const ps: number[] = [];
  let s = Math.max(1, page - 2);
  let e = Math.min(totalPages, page + 2);
  if (e - s < 4) {
    s = Math.max(1, e - 4);
    e = Math.min(totalPages, s + 4);
  }
  for (let i = s; i <= e; i += 1) ps.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(1))}
          {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(page - 1))}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {ps.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                minWidth: 28,
                height: 28,
                padding: '0 6px',
                background: page === n ? C.sec : 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 4,
                fontSize: 15,
                fontWeight: page === n ? 600 : 400,
                color: page === n ? '#fff' : C.txS,
                fontFamily: 'inherit',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(page + 1))}
          {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(totalPages))}
        </div>
      </div>
    </div>
  );
}
