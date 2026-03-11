'use client';

import { useEffect, useState } from 'react';
import { colors } from '@/lib/theme/colors';
import type { CSSProperties, ReactNode } from 'react';

export interface DataTableColumn<T extends Record<string, unknown>> {
  title: ReactNode;
  fieldKey: keyof T & string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  minWidth?: number | string;
  renderCell?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  cols: DataTableColumn<T>[];
  data: T[];
  onRow?: (row: T) => void;
  pageSize?: number;
  noPaging?: boolean;
  sectionTitle?: string;
  sectionCount?: number;
  sectionButtons?: ReactNode;
  rowStyle?: (row: T) => CSSProperties;
}

const TH = (sx: CSSProperties = {}): CSSProperties => ({
  padding: '9px 12px',
  borderBottom: `1px solid ${colors.borderDark}`,
  fontSize: 14,
  color: colors.textLight,
  fontWeight: 400,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  textAlign: 'center' as const,
  ...sx,
});

const TD = (sx: CSSProperties = {}): CSSProperties => ({
  padding: '11px 12px',
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 14,
  color: colors.text,
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

export function DataTable<T extends Record<string, unknown>>({ cols, data, onRow, pageSize = 10, noPaging, sectionTitle, sectionCount, sectionButtons, rowStyle }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const total = data.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const rows = noPaging ? data : data.slice((page - 1) * pageSize, page * pageSize);
  const paginationButton = (icon: ReactNode, disabled: boolean, onClick: () => void) => (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, color: disabled ? colors.textMuted : colors.textSecondary, padding: 0 }}>
      {icon}
    </button>
  );
  const pageNumberButton = (n: number) => (
    <button key={n} onClick={() => setPage(n)} style={{ minWidth: 28, height: 28, padding: '0 6px', background: page === n ? colors.secondary : 'none', border: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 15, fontWeight: page === n ? 600 : 400, color: page === n ? colors.white : colors.textSecondary, fontFamily: 'inherit' }}>
      {n}
    </button>
  );

  const pages = () => {
    const pageButtons: ReactNode[] = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(maxPage, page + 2);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
      end = Math.min(maxPage, start + 4);
    }
    for (let i = start; i <= end; i += 1) pageButtons.push(pageNumberButton(i));
    return pageButtons;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, borderBottom: `1px solid ${colors.borderDark}`, marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {sectionTitle && <span style={{ fontSize: 18, fontWeight: 600, color: colors.textHeading }}>{sectionTitle}</span>}
          {sectionCount != null && <span style={{ fontSize: 12, color: colors.textLight }}>{sectionCount}건</span>}
        </div>
        {sectionButtons && <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{sectionButtons}</div>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', width: 'max-content', borderCollapse: 'collapse', borderBottom: `1px solid ${colors.border}` }}>
          <thead style={{ borderTop: `1px solid ${colors.textHeading}` }}>
            <tr>
              {cols.map((col, i) => (
                <th key={i} style={{ ...TH({ textAlign: col.align || 'center', background: colors.white, ...(col.width ? { width: col.width } : {}), ...(col.minWidth ? { minWidth: col.minWidth } : {}) }) }}>
                  {col.title}
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
                    <div style={{ fontSize: 15, fontWeight: 600, color: colors.textHeading, marginTop: 2 }}>검색 결과가 없습니다</div>
                    <div style={{ fontSize: 13, color: colors.textLight }}>다른 검색어나 필터 조건을 사용해 보세요.</div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRow?.(row)}
                  style={{ cursor: onRow ? 'pointer' : 'default', ...(rowStyle ? rowStyle(row) : {}) }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(69,124,225,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  {cols.map((col, colIndex) => (
                    <td key={colIndex} style={{ ...TD({ textAlign: col.align || 'center', lineHeight: '24px', ...(col.width ? { width: col.width } : {}), ...(col.minWidth ? { minWidth: col.minWidth } : {}) }) }}>
                      {col.renderCell ? col.renderCell(row[col.fieldKey], row) : ((row[col.fieldKey] ?? '—') as ReactNode)}
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
              {paginationButton(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(1))}
              {paginationButton(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(page - 1))}
            </div>
            <div style={{ display: 'flex', gap: 2 }}>{pages()}</div>
            <div style={{ display: 'flex', gap: 2 }}>
              {paginationButton(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === maxPage, () => setPage(page + 1))}
              {paginationButton(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === maxPage, () => setPage(maxPage))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
