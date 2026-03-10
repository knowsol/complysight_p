'use client';

import { useEffect, useState } from 'react';
import { C } from '@/lib/theme/colors';
import type { CSSProperties, ReactNode } from 'react';

export interface DataTableColumn<T extends Record<string, unknown>> {
  t: ReactNode;
  k: keyof T & string;
  align?: 'left' | 'center' | 'right';
  w?: number | string;
  mw?: number | string;
  r?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  cols: DataTableColumn<T>[];
  data: T[];
  onRow?: (row: T) => void;
  pageSize?: number;
  noPaging?: boolean;
  secTitle?: string;
  secCount?: number;
  secButtons?: ReactNode;
  rowStyle?: (row: T) => CSSProperties;
}

const TH = (sx: CSSProperties = {}): CSSProperties => ({
  padding: '9px 12px',
  borderBottom: `1px solid ${C.brdD}`,
  fontSize: 14,
  color: C.txL,
  fontWeight: 400,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  textAlign: 'center' as const,
  ...sx,
});

const TD = (sx: CSSProperties = {}): CSSProperties => ({
  padding: '11px 12px',
  borderBottom: `1px solid ${C.brd}`,
  fontSize: 14,
  color: C.txt,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  ...sx,
});

function ArrowIcon({ d }: { d: string }) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DataTable<T extends Record<string, unknown>>({ cols, data, onRow, pageSize = 10, noPaging, secTitle, secCount, secButtons, rowStyle }: DataTableProps<T>) {
  const [pg, setPg] = useState(1);
  const total = data.length;
  const maxPg = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPg(1);
  }, [data.length]);

  const rows = noPaging ? data : data.slice((pg - 1) * pageSize, pg * pageSize);
  const pBtn = (icon: ReactNode, disabled: boolean, onClick: () => void) => (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, color: disabled ? C.txX : C.txS, padding: 0 }}>
      {icon}
    </button>
  );
  const pNum = (n: number) => (
    <button key={n} onClick={() => setPg(n)} style={{ minWidth: 28, height: 28, padding: '0 6px', background: pg === n ? C.sec : 'none', border: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 15, fontWeight: pg === n ? 600 : 400, color: pg === n ? C.white : C.txS, fontFamily: 'inherit' }}>
      {n}
    </button>
  );

  const pages = () => {
    const ps: ReactNode[] = [];
    let s = Math.max(1, pg - 2);
    let e = Math.min(maxPg, pg + 2);
    if (e - s < 4) {
      s = Math.max(1, e - 4);
      e = Math.min(maxPg, s + 4);
    }
    for (let i = s; i <= e; i += 1) ps.push(pNum(i));
    return ps;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {secTitle && <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{secTitle}</span>}
          {secCount != null && <span style={{ fontSize: 12, color: C.txL }}>{secCount}건</span>}
        </div>
        {secButtons && <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{secButtons}</div>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', width: 'max-content', borderCollapse: 'collapse', borderBottom: `1px solid ${C.brd}` }}>
          <thead style={{ borderTop: `1px solid ${C.txH}` }}>
            <tr>
              {cols.map((c, i) => (
                <th key={i} style={{ ...TH({ textAlign: c.align || 'center', background: C.white, ...(c.w ? { width: c.w } : {}), ...(c.mw ? { minWidth: c.mw } : {}) }) }}>
                  {c.t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} style={{ padding: '56px 0', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 44, lineHeight: 1 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.txH, marginTop: 2 }}>검색 결과가 없습니다</div>
                    <div style={{ fontSize: 13, color: C.txL }}>다른 검색어나 필터 조건을 사용해 보세요.</div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, ri) => (
                <tr
                  key={ri}
                  onClick={() => onRow?.(r)}
                  style={{ cursor: onRow ? 'pointer' : 'default', ...(rowStyle ? rowStyle(r) : {}) }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(69,124,225,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  {cols.map((c, ci) => (
                    <td key={ci} style={{ ...TD({ textAlign: c.align || 'center', lineHeight: '24px', ...(c.w ? { width: c.w } : {}), ...(c.mw ? { minWidth: c.mw } : {}) }) }}>
                      {c.r ? c.r(r[c.k], r) : ((r[c.k] ?? '—') as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!noPaging && total > pageSize && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(1))}
              {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(pg - 1))}
            </div>
            <div style={{ display: 'flex', gap: 2 }}>{pages()}</div>
            <div style={{ display: 'flex', gap: 2 }}>
              {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(pg + 1))}
              {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(maxPg))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
